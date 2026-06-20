# Artello Integration Architecture

How the art-print fulfillment integration wires up: the Artello API model, what it
actually returns, how that maps to our SQL, and how an order flows from checkout to shipped.

> Scope: print-on-demand fulfillment via **Artello** + payments via **Square**. We hold no
> inventory and (goal) host no images ourselves — Artello prints/ships and serves the preview
> images from its own S3. Postgres is a denormalized mirror that the app reads at runtime; a
> nightly job is the only thing that talks to Artello during normal operation.

---

## 1. Mental model: Artello is print-on-demand, not a storefront

Artello does not hold a catalog you "sell from." You define what is *printable*, then send
orders that reference those definitions. Four primitives build on each other:

```
Uploads        →  Product Sets        →  Orders            →  Webhooks
(upload image)    (printable configs)    (fulfillment call)   (status + tracking)
image.url         arteloProductId        order id             OrderStatusChange
```

| Primitive | Endpoint | What it gives you |
|-----------|----------|-------------------|
| **Uploads** | `POST /open/uploads/files/create` (`imageUrl`) | Artello pulls the image into its S3 and renders previews |
| **Product Sets** | `POST /open/product-sets/save`, `GET /open/product-sets/get`, `.../get-by-id` | A named bundle of *product options*; each option becomes a sellable variant with its own id |
| **Orders** | `POST /open/orders/create`, `.../get-by-id`, `.../cancel` | Submits a paid order for print + ship; returns an Artello order id |
| **Webhooks** | `POST /open/webhooks/save` (topic `OrderStatusChange`) | Artello calls *our* endpoint on Processing / Shipped / Cancelled |

**Base URL:** `https://www.artelo.io/api` · **Auth:** `Authorization: Bearer <API_KEY>`
(`EXTERNAL_API_ARTELLO_API_KEY`, sandbox toggle `EXTERNAL_API_USE_SANDBOX`).

Client wrapper: `Services/ArtelloService.java` (Spring `RestClient`).

---

## 2. What a Product Set actually returns

This is the heart of the integration and the part where the **real payload differs from the
published API docs**. Everything below was verified against a real saved product set
(`Images/01-Souls_Fragility/LindseyAyres_SoulsFragility.json`).

### Top-level shape

```jsonc
{
  "id": "…",
  "name": "Souls Fragility",
  "createdAt": "…",
  "updatedAt": "…",
  "products": [ /* 204 product options for this one artwork */ ]
}
```

→ DTO: `Model/DTO/ArtelloProductSet.java` (`name`, `id`, `createdAt`, `updatedAt`,
`List<ArtelloProductInfo> products`).

### A product option (one variant)

```jsonc
{
  "id": "e373d9e2-…",          // the arteloProductId — what an order references
  "catalogProductId": "IndividualArtPrint",
  "size": "x8x10",
  "orientation": "Vertical",
  "paperType": "ArchivalMatteFineArt",
  "paperStyle": "FineArt",
  "frameColor": "Unframed",
  "frameStyle": "Unframed",
  "includeFramingService": false,
  "includeHangingPins": false,
  "includeMats": false,
  "unitCost": 5.19,            // Artello's cost to us (not retail)
  "designs": [ /* always exactly 1 */ ]
}
```

→ DTO: `Model/ArtelloProductInfo.java`.

### A design (image placement) — **NOTE: shape differs from the docs**

```jsonc
{
  "id": "477d071a-…",          // per-variant design id (unique per product option)
  "image": {
    "url": "https://artelo-…/files/…/….jpg",      // full-res source (same for all variants)
    "previews": {                                  // plain URL strings, keyed by size
      "lg": "https://artelo-…/previews/….preview.lg.jpg",
      "sm": "https://artelo-…/previews/….preview.sm.jpg",
      "xs": "https://artelo-…/previews/….preview.xs.jpg"
    }
  },
  "height": 3109.6191,         // FLAT geometry — not wrapped in an "overrides" object
  "width": 2472,
  "x": -36,
  "y": -54.809525,             // fractional — must be stored as DECIMAL/BigDecimal
  "rotation": 0,
  "order": 0
}
```

→ DTO: `Model/ArtelloDesign.java` (with nested static `ArtelloImage`,
`previews` typed as `Map<String, String>`).

**Discrepancies vs the published docs (`artelloAPIRef.md`):**

| Docs say | Reality (saved payload) |
|----------|-------------------------|
| `imageId` + `sourceImage.url` | `image.url` + `image.previews.{lg,sm,xs}` (no `imageId`) |
| geometry nested in `overrides` | geometry **flat** on the design (`height/width/x/y/rotation`) |
| `previews` not described | plain URL strings, **not** objects (`Map<String,String>`) |
| `fitOptions` present | absent in this payload |

### What we proved about cardinality (204 variants of one artwork)

| Fact | Count | Consequence |
|------|------:|-------------|
| Designs per variant | **1, always** | Design is **not** a one-to-many table — embed it |
| Distinct `image.url` | **1** | The image is an **Artwork-level** fact (shared by all variants) |
| Distinct preview sets | **1** each | Previews are Artwork-level too — store once, not ×204 |
| Distinct design `id`s | **204** | Design id is **per-variant** |
| Distinct geometries | **3** | Crop/fit **varies per variant** (tracks print size) → per-variant |

This split — *image/previews at the Artwork level, design-id + geometry at the variant level* —
is the core data-modeling decision and drives the SQL below.

---

## 3. The Asymmetric API: what you receive ≠ what you send

Artello uses one shape when it **returns** product sets and a different shape when it
**accepts** an order. This is the single biggest gotcha in the integration.

```
INBOUND  (product-sets/get)          OUTBOUND (orders/create — per docs)
─────────────────────────            ──────────────────────────────────
design.image.url                     item.productInfo.designs[].sourceImage.url
design.image.previews.{lg,sm,xs}     (not sent)
design.height/width/x/y/rotation     item.productInfo.designs[].overrides{height,width,x,y,rotation}
design.id                            (the order item carries arteloProductId, not design id)
```

So `ArtelloDesign` (inbound DTO) is **not** reused for order creation. When checkout is built,
a separate `ArtelloCreateOrderRequest` DTO re-nests our stored `ArtelloGeometry` back into the
`overrides` wrapper Artello wants. See §7.

> ⚠️ The outbound shape above is taken from the docs, which we already know are unreliable for
> the inbound shape. **Validate `/orders/create` with a real `isTestOrder: true` call before
> trusting it.**

---

## 4. SQL data model

Two tables carry the integration; one is reused, one is purpose-built. No new tables were added
for this work — only columns.

### `ARTWORKS` (reused)

The existing image columns double as the display source. The nightly sync overwrites them with
Artello preview URLs **when available**, otherwise they keep their local `/images/...` fallback.

| Column | Source | Notes |
|--------|--------|-------|
| `small_image_url` | Artello `previews.xs` ?? local | Non-destructive (see §5) |
| `medium_image_url` | Artello `previews.sm` ?? local | |
| `large_image_url` | Artello `previews.lg` ?? local | |
| `artello_product_set_id` | discovered on first sync | Links artwork → Artello product set |

Size mapping: `xs → small`, `sm → medium`, `lg → large`.

### `ARTELLO_PRINT_VARIANTS` (purpose-built)

One row per Artello product option. `ManyToOne` → `ARTWORKS`.

| Column | From product option | Type |
|--------|--------------------|------|
| `artello_variant_id` (unique) | `id` (arteloProductId) | VARCHAR(36) |
| `catalog_product_id` | `catalogProductId` | VARCHAR |
| `size`, `orientation` | `size`, `orientation` | VARCHAR |
| `paper_type`, `paper_style` | `paperType`, `paperStyle` | VARCHAR |
| `frame_style`, `frame_color` | `frameStyle`, `frameColor` | VARCHAR |
| `include_framing_service` / `_hanging_pins` / `_mats` | `include*` | BOOLEAN |
| `unit_cost` | `unitCost` (Artello's cost) | DECIMAL(10,2) |
| `shipping_estimate` | computed (`ShippingRateCalculator`) | DECIMAL(10,2) |
| `retail_price` | computed (§6) | DECIMAL(10,2) |
| **`artello_design_id`** | `designs[0].id` | VARCHAR(50) |
| **`geo_height/width/x/y`** | `designs[0].{height,width,x,y}` | **DECIMAL(12,4)** |
| **`geo_rotation`** | `designs[0].rotation` | INTEGER |
| `is_available` | derived (see §5) | BOOLEAN |

The `geo_*` columns map to the `@Embeddable` `Model/ArtelloGeometry.java`
(`@Embedded` on `ArtelloPrintVariant`). **They are `BigDecimal`, not `int`** — Artello sends
fractional values (`y = -54.809525`); truncating would slowly drift print alignment and cause
misprints.

### `PRINT_ORDERS`

Customer-facing order record (`Model/PrintOrder.java`). Holds `order_reference`
(`LAA-YYYYMMDD-NNNN`), FK to artwork + variant, `total_amount`, `status`, `square_payment_id`,
`artello_order_id`, tracking fields, and `error_message` for the manual-review path (§7).

### Entity / DTO map

| Java type | Kind | Role |
|-----------|------|------|
| `Artwork` | `@Entity` | Gallery row; holds preview/image URLs + `artello_product_set_id` |
| `ArtelloPrintVariant` | `@Entity` | One sellable Artello product option |
| `ArtelloGeometry` | `@Embeddable` | The `geo_*` columns (BigDecimal geometry) |
| `PrintOrder` | `@Entity` | Customer order lifecycle |
| `ArtelloProductSet` | DTO (inbound) | Parses `product-sets/get` |
| `ArtelloProductInfo` | DTO (inbound) | One product option in the set |
| `ArtelloDesign` (+ `ArtelloImage`) | DTO (inbound) | Flat design + preview URLs |
| `ArtelloCreateOrderRequest` | DTO (outbound) | **TODO** — re-nests geometry for `/orders/create` |
| `ArtelloWebhookPayload` | DTO (inbound) | Status-change callback |

---

## 5. The nightly sync (`ProductSetSyncService`)

Runs daily at 03:00 (`@Scheduled(cron = "0 0 3 * * *")`). This is the *only* component that
calls Artello during normal operation — everything the app serves comes from Postgres
afterward, so there are no per-request Artello lookups.

```
syncAllProductSets()                    // 03:00 daily, iterates every Artwork
  └─ self.syncProductSet(artworkId)     // REQUIRES_NEW tx per artwork (one failure ≠ all fail)
       ├─ resolve product set:
       │     artello_product_set_id present → getProductSetById
       │     else                           → getProductSetByNameLimit1(title)  // discovery
       │     (on discovery, persist the id back to the Artwork)
       └─ performVariantSync(artwork, productSet)
             ├─ applySharedPreviews(...)            // image URLs → ARTWORKS (non-destructive)
             ├─ for each product option: syncVariant(...)   // upsert variant row
             └─ deactivate local variants no longer in the Artello response
```

### Non-destructive preview rule

`applySharedPreviews` only writes an image column **when Artello actually supplies that value**:

```
small_image_url  = previews.xs ?? (leave existing local value)
medium_image_url = previews.sm ?? (leave existing local value)
large_image_url  = previews.lg ?? (leave existing local value)
```

Why it matters: most artworks are **not yet uploaded to Artello**. Blindly overwriting would
null out the working local `/images/...` URLs. Instead, gallery display keeps falling back to
local files, and each artwork flips to Artello's S3 previews automatically on the first nightly
run after it's uploaded. Self-healing, no manual step. (Throwaway test uploads re-sync nightly,
so replacing them needs no special handling.)

### `syncVariant` upsert

Looks up by `artello_variant_id`, creating or updating. Populates **all** `NOT NULL` columns
(config + pricing) and calls `applyDesign(...)` to set `artello_design_id` + the embedded
`ArtelloGeometry` from `designs[0]`. Variants present locally but missing from the Artello
response are marked `is_available = false` (not deleted — preserves order history references).

### Two-tier consequence

- **Gallery display** works for *all* artworks today (Artello previews or local fallback).
- **Purchasing** only exists for artworks that have a product set (→ variant rows). The handful
  already in Artello are enough to build/test checkout while the rest show local images.

---

## 6. Pricing

`getFinalRetail(unitCost, shipping)` in `ProductSetSyncService`:

```
COGS    = unitCost + shipping
adjusted = COGS / 0.97          // absorb ~3% Square processing fee
retail   = adjusted / 0.60      // apply 40% margin
```

`unit_cost` and `shipping_estimate` are stored alongside `retail_price` so margins are auditable
without recomputation.

---

## 7. The order / checkout flow (`OrderService.processCheckout`)

Payment-first, with a deliberate manual-review fallback if Artello fails after a successful
charge.

```
1. validate variant (exists + is_available)
2. PrintOrder(status = PENDING) saved        // record exists before money moves
3. Square payment (squareNonce → Payment)
      fail → status = CANCELLED + error_message → throw
4. success → status = PAID (+ square_payment_id), saved
5. artelloService.createOrder(...)           // ONLY after PAID
      ok    → status = SUBMITTED (+ artello_order_id)
      throw → stays PAID + error_message      // CRITICAL: paid but unfulfilled → manual review
6. return OrderConfirmation
```

Order reference: `LAA-YYYYMMDD-NNNN` (`generateOrderReference`).

### Fulfillment callback (`handleArtelloStatusChange`)

Artello → our webhook (`OrderStatusChange`), matched by `artello_order_id`:

- `SHIPPED` → status `SHIPPED` + tracking number / URL / carrier (→ TODO: tracking email)
- `CANCELLED` → status `CANCELLED`

### The outbound-order TODO

`createOrder` currently serializes the legacy flat `FulfillmentRequest`, which does **not** match
Artello's `/orders/create` body. Before going live, build `ArtelloCreateOrderRequest` that
assembles:

- `items[]` → `arteloProductId` (= `artello_variant_id`) + `productInfo`
  (catalogProductId, size, paper, frame, orientation) + `designs[]`
- each design → re-nest our stored `ArtelloGeometry` into `overrides{height,width,x,y,rotation}`
  + `sourceImage.url`
- `customerAddress`, `currency`, `total`, `orderId`, `isTestOrder`

Then validate end-to-end with `isTestOrder: true` (the docs are not authoritative — see §3).

---

## 8. Open items / watch-outs

1. **Validate `/orders/create` shape with a live test order** before trusting the docs.
2. **`ArtelloCreateOrderRequest`** outbound DTO + geometry re-nesting (§7) — checkout phase.
3. **`geo_rotation` is `INTEGER`.** Every sampled value was `0`; if Artello ever sends a
   fractional rotation it would truncate (unlike the `x/y/w/h` decimals). Promote to DECIMAL if
   that ever appears.
4. **Preview size mapping** (`xs→small, sm→medium, lg→large`) is a one-liner to flip if the
   frontend's thumbnail tier wants `sm` instead of `xs`.
5. **Multi-image products** would break the "1 design per variant" assumption. Only then does a
   separate `ArtelloDesign` one-to-many table become justified — not before.
```
