# Customer Privacy & PII Handling

How we protect customer personal information (PII) and stay aligned with privacy law across our
sales regions — without giving up the personal, artist-to-customer touch.

> Guiding principle: **you cannot leak what you do not have.** We treat PII as a liability to be
> *minimized*, not an asset to be *collected*. The architecture is built so that a full breach of
> our database exposes order numbers and variant IDs — and nothing about a human being.

> ⚖️ This document describes engineering decisions, not legal advice. A published privacy policy
> and Data Processing Agreements (DPAs) with Square and Artello are still required separately.

---

## 1. The three layers people conflate

| Layer | Mechanism | Status |
|-------|-----------|--------|
| **In transit** | TLS / HTTPS on every hop (browser ↔ us, us ↔ Square, us ↔ Artello, and the DB connection) | ✅ In place via TLS; no hand-rolled crypto needed |
| **At rest** | disk + field-level encryption | ✅ Made *moot* — we store no customer PII (§3) |
| **Retention** | how long data is kept | ✅ Effectively zero — PII is transient (§4) |

TLS *is* in-transit encryption. The only commonly-missed hop is the database connection — if
Postgres ever runs on a separate host, enforce `sslmode=require` on the JDBC URL.

---

## 2. Who actually holds the PII (and why that's correct)

Square and Artello **must** store the customer's name, email, and address regardless of what we
do — Square for payments/chargebacks/tax, Artello because it physically ships the box. They are
the legal data controllers/processors with dedicated security and compliance teams.

Our only real decision is whether to add a **third** copy in our own database. We don't. That
copy would be the one *we* would have to encrypt, secure, audit, and answer for in a breach.
Avoiding it is the single highest-leverage privacy decision in the system.

---

## 3. What we store vs. what we deliberately don't

`PRINT_ORDERS` contains **only non-PII reference data**:

| Stored | Not stored (by design) |
|--------|------------------------|
| `order_reference` (`LAA-YYYYMMDD-NNNN`) | customer name |
| `square_payment_id` | customer email |
| `artello_order_id` | shipping address |
| variant/artwork FKs, totals, status, tracking | phone, any direct identifier |

The reference IDs are *pointers* into Square/Artello, usable only with our authenticated API
keys — useless to an attacker who dumps the table.

---

## 4. The event-driven flow that keeps PII transient

We need the customer's email at exactly two moments. Both are handled without ever writing it
to disk. Sending is decoupled with Spring events so email never blocks or rolls back checkout.

```
CHECKOUT (we have the email in-hand from the form)
  OrderService.processCheckout
    → payment + fulfillment
    → publishEvent(OrderPaidEvent{ email, name, … })   // primitives, not entities
        └─ @Async @TransactionalEventListener(AFTER_COMMIT)
             EmailService.handleOrderPaid → confirmation email → email out of scope

SHIPPED (days later; we no longer have the email)
  Artello "Shipped" webhook → OrderService.handleArtelloStatusChange
    → publishEvent(OrderShippedEvent{ squarePaymentId, tracking, … })  // NO email
        └─ @Async @TransactionalEventListener(AFTER_COMMIT)
             EmailService.handleOrderShipped
               → squarePaymentService.getBuyerEmail(squarePaymentId)   // transient re-fetch
               → tracking email → email out of scope
```

### Why `@Async @TransactionalEventListener(AFTER_COMMIT)`

- **AFTER_COMMIT**: the email only fires once the order is durably committed. If we sent inline
  and SMTP threw, Spring would roll back the transaction — *erasing the record of a paid order*.
- **@Async**: the customer gets an instant success screen; SMTP latency/outages happen on a
  background thread and never affect the order.
- Listener exceptions are caught and logged, never propagated — a mail hiccup can't corrupt
  order state.

### Why "transient" is real, not GC hope

The re-fetched email is a **method-scoped local variable**. The instant the listener returns,
the reference is unreachable — its lifetime is bounded by *scope*, not by when GC happens to
run. It is never assigned to a field, an entity, or a log line.

---

## 5. The personal touch: the Reply-To relay

Privacy-safe does not mean impersonal. Order emails are **sent from** a branded address but
**reply to** Lindsey's real inbox:

```
From:     orders@lindseyayresart.com  ("Lindsey Ayres Art")
Reply-To: lindsey@lindseyayresart.com
```

When a customer replies — a question, or "I love it!" — it lands in Lindsey's personal inbox
with the full order context in the thread. Human-to-human contact, zero ticketing system, zero
stored PII. Templates are written in her voice and personalized with name + tracking at send
time. Addresses are configurable (`app.mail.orders-from`, `…-from-name`, `app.mail.reply-to`).

---

## 6. Logging hygiene

- Recipient email addresses are **never** logged — order emails log the subject only.
- Failures reference the `order_reference`, never the customer.
- Keep PII out of exception messages and stack traces.

---

## 7. Regulatory alignment (by minimization, not paperwork)

The same design satisfies the core obligations everywhere we sell:

| Region / law | Principle satisfied |
|--------------|--------------------|
| 🇺🇸 USA — CCPA/CPRA (California) | Data minimization; little to "disclose," "sell," or delete |
| 🇨🇦 Canada — PIPEDA | Limiting collection & retention to what the transaction requires |
| 🇲🇽 Mexico — LFPDPPP | Purpose limitation; minimal data held by the responsible party |
| 🇪🇺 EU — GDPR | Data minimization (Art. 5), storage limitation, easy erasure |

Because the durable record is reference IDs only, a **"right to erasure"** request is largely
satisfied by deletion happening upstream at Square/Artello (the controllers), with nothing of
substance to purge on our side.

---

## 8. If we are ever forced to store PII (the right way)

Should a future requirement demand storing PII locally, do **not** simply overwrite columns with
`'REDACTED'`. Use **crypto-shredding**:

1. Encrypt each order's PII with a per-order data key (AES-256-GCM).
2. Keep keys in a secrets manager / KMS — **never** in Postgres.
3. To "erase," discard the key. The ciphertext becomes permanently unreadable, even in backups.

This delivers encryption-at-rest and a clean, backup-proof GDPR erasure in one mechanism. It is
explicitly the fallback, not the default — the default remains storing nothing.

---

## 9. Open items to verify before go-live

1. **Confirm `SquarePaymentService.getBuyerEmail(...)` actually returns the buyer email.** The
   current implementation uses Square's **deprecated V1 transactions** API and passes the
   `paymentId` as an `orderId` — both are suspect. The robust modern path is
   `squareClient.payments().get(paymentId).getBuyerEmailAddress()`, since we already set
   `buyerEmailAddress` on payment creation. **Validate against a live sandbox payment** before
   relying on the shipped-email path. (We already learned not to trust vendor assumptions when
   Artello's docs misrepresented the design payload.)
2. **Artello is *not* used as the email source.** `ArtelloOrderResponse` exposes no customer
   email, so Square is the sole transient source. If we ever want Artello as primary (it already
   holds the address for shipping), the response DTO + `getOrderById` mapping must be extended
   and verified first.
3. **Confirm retention windows** at Square/Artello so the upstream-erasure assumption in §7 holds.
4. **Mail sending identity (ops, not code):** the SMTP account in `SPRING_MAIL_USERNAME` must be
   authorized to send **as** `orders@lindseyayresart.com`. Create that mailbox / send-as alias
   with the domain provider (or use a transactional provider like SES/SendGrid with domain
   verification — SPF/DKIM/DMARC) so the relay isn't flagged as spoofing.
```
