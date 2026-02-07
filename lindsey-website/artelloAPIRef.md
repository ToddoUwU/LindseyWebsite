# Artelo API Reference

## Base URL
```
https://www.artelo.io/api
```

## Authentication

All requests require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

---

## Orders

### Get Orders
Retrieve a list of orders.

```bash
curl -G 'https://www.artelo.io/api/open/orders/get?limit=10' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Number of orders to return |

---

### Get Order by ID
Retrieve a specific order by its ID.

```bash
curl -G 'https://www.artelo.io/api/open/orders/get-by-id?orderId=d310e238-1cef-49c8-bb63-2e93a06badb4' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| orderId | string (UUID) | The order's unique identifier |

---

### Create Order
Create a new order for fulfillment.

```bash
curl -X POST 'https://www.artelo.io/api/open/orders/create' \
  -H 'Authorization: Bearer your-token' \
  -H 'Content-Type: application/json' \
  -d '{...}'
```

**Request Body:**
```json
{
  "channelName": "Walmart",
  "companyName": "Custom Company LLC",
  "branding": {
    "insertId": "e7c7b7d7-d8d5-4f9a-a3a5-b8a8c3d3c2c1",
    "stickerId": "e7c7b7d7-d8d5-4f9a-a3a5-b8a8c3d3c2c1",
    "insertPlacement": "PerOrder",
    "stickerPlacement": "PerOrder"
  },
  "createdAt": "2024-09-30T13:56:29.057Z",
  "currency": "USD",
  "customerAddress": {
    "city": "Miami",
    "country": "US",
    "email": "john@doe.com",
    "company": "Acme Co.",
    "name": "John Doe",
    "state": "Florida",
    "street1": "No 1 rosbridge street",
    "zipcode": "90110"
  },
  "items": [
    {
      "arteloProductId": "9019ec20-a391-4ae9-aa86-1ac2a2edd076",
      "orderItemId": "test-id",
      "productInfo": {
        "catalogProductId": "IndividualArtPrint",
        "frameColor": "BlackMetal",
        "includeFramingService": false,
        "includeHangingPins": false,
        "includeMats": false,
        "orientation": "Horizontal",
        "paperType": "ArchivalMatteFineArt",
        "size": "x10x10",
        "designs": [
          {
            "fitOptions": {},
            "imageId": "image-id",
            "overrides": {
              "height": 400,
              "rotation": 30,
              "width": 400,
              "x": 0,
              "y": 0
            },
            "sourceImage": {
              "url": "https://sample.com/x.png"
            }
          }
        ]
      },
      "quantity": 1,
      "unitPrice": 10
    }
  ],
  "orderId": "sample-id",
  "isTestOrder": false,
  "total": 10
}
```

**Order Fields:**
| Field | Type | Description |
|-------|------|-------------|
| channelName | string | Sales channel name (e.g., "Walmart", "Etsy") |
| companyName | string | Your company name |
| branding | object | Custom branding options |
| branding.insertId | string (UUID) | ID of insert to include |
| branding.stickerId | string (UUID) | ID of sticker to include |
| branding.insertPlacement | string | "PerOrder" or "PerItem" |
| branding.stickerPlacement | string | "PerOrder" or "PerItem" |
| createdAt | string (ISO 8601) | Order creation timestamp |
| currency | string | Currency code (e.g., "USD") |
| customerAddress | object | Shipping address |
| items | array | Order line items |
| orderId | string | Your external order ID |
| isTestOrder | boolean | Set true for test orders |
| total | number | Order total |

**Customer Address Fields:**
| Field | Type | Description |
|-------|------|-------------|
| city | string | City |
| country | string | Country code (e.g., "US") |
| email | string | Customer email |
| company | string | Company name (optional) |
| name | string | Customer full name |
| state | string | State/province |
| street1 | string | Street address |
| zipcode | string | Postal code |

**Item Fields:**
| Field | Type | Description |
|-------|------|-------------|
| arteloProductId | string (UUID) | Artelo product ID (from product sets) |
| orderItemId | string | Your external item ID |
| productInfo | object | Product configuration |
| quantity | integer | Quantity to order |
| unitPrice | number | Price per unit |

**Product Info Fields:**
| Field | Type | Description |
|-------|------|-------------|
| catalogProductId | string | Product type (e.g., "IndividualArtPrint") |
| frameColor | string | Frame color (e.g., "BlackMetal") |
| includeFramingService | boolean | Include framing |
| includeHangingPins | boolean | Include hanging hardware |
| includeMats | boolean | Include matting |
| orientation | string | "Horizontal" or "Vertical" |
| paperType | string | Paper type (e.g., "ArchivalMatteFineArt") |
| size | string | Print size (e.g., "x10x10") |
| designs | array | Design configurations |

---

### Cancel Order
Cancel an existing order.

```bash
curl -X DELETE 'https://www.artelo.io/api/open/orders/cancel?id=d310e238-1cef-49c8-bb63-2e93a06badb4' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The order's unique identifier |

---

## Product Sets

### Get Product Sets
Retrieve a list of product sets.

```bash
curl -G 'https://www.artelo.io/api/open/product-sets/get?limit=10' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Number of product sets to return |

---

### Get Product Set by ID
Retrieve a specific product set by its ID.

```bash
curl -G 'https://www.artelo.io/api/open/product-sets/get-by-id?id=116f6ad0-da58-4a2a-8240-0f6dda97ae9f' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The product set's unique identifier |

---

### Save Product Set
Create or update a product set.

```bash
curl -X POST 'https://www.artelo.io/api/open/product-sets/save' \
  -H 'Authorization: Bearer your-token' \
  -H 'Content-Type: application/json' \
  -d '{...}'
```

**Request Body:**
```json
{
  "name": "Vision",
  "productOptions": [
    {
      "catalogProductId": "IndividualArtPrint",
      "designs": [
        {
          "fitOptions": {},
          "imageId": "image-id",
          "overrides": {
            "height": 400,
            "rotation": 30,
            "width": 400,
            "x": 0,
            "y": 0
          },
          "sourceImage": {
            "url": "https://sample.com/x.png"
          }
        }
      ],
      "frameColor": "BlackMetal",
      "orientation": "Vertical",
      "paperType": "GlossyPoster",
      "size": "x10x10"
    }
  ]
}
```

**Product Set Fields:**
| Field | Type | Description |
|-------|------|-------------|
| name | string | Product set name |
| productOptions | array | Array of product configurations |

**Product Option Fields:**
| Field | Type | Description |
|-------|------|-------------|
| catalogProductId | string | Product type |
| designs | array | Design configurations |
| frameColor | string | Frame color |
| orientation | string | "Horizontal" or "Vertical" |
| paperType | string | Paper type |
| size | string | Print size |

**Design Fields:**
| Field | Type | Description |
|-------|------|-------------|
| fitOptions | object | Fit/crop options |
| imageId | string | Reference to uploaded image |
| overrides | object | Position/size overrides |
| overrides.height | number | Height in pixels |
| overrides.width | number | Width in pixels |
| overrides.rotation | number | Rotation in degrees |
| overrides.x | number | X offset |
| overrides.y | number | Y offset |
| sourceImage | object | Source image info |
| sourceImage.url | string | Image URL |

---

### Delete Product Set
Delete a product set.

```bash
curl -X DELETE 'https://www.artelo.io/api/open/product-sets/delete?id=116f6ad0-da58-4a2a-8240-0f6dda97ae9f' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The product set's unique identifier |

---

## Uploads

### Get File by ID
Retrieve an uploaded file by its ID.

```bash
curl -G 'https://www.artelo.io/api/open/uploads/files/get-by-id?id=4b69054c-a51b-4c11-93ca-ae08950cef4c' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The file's unique identifier |

---

### Get Upload Counts by Status
Get counts of uploads grouped by status.

```bash
curl -G 'https://www.artelo.io/api/open/uploads/get-counts-by-status' \
  -H 'Authorization: Bearer your-token'
```

---

### Get Subfolders
Retrieve folders within the uploads directory.

```bash
curl -G 'https://www.artelo.io/api/open/uploads/folders/get-subfolders?limit=10' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Number of folders to return |

---

### Get Subfiles
Retrieve files within a folder.

```bash
curl -G 'https://www.artelo.io/api/open/uploads/folders/get-subfiles?limit=10' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Number of files to return |

---

### Create File (Upload Image)
Upload a new image file via URL.

```bash
curl -X POST 'https://www.artelo.io/api/open/uploads/files/create' \
  -H 'Authorization: Bearer your-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "imageUrl": "https://example.com/test.png",
    "name": "image1"
  }'
```

**Request Body:**
| Field | Type | Description |
|-------|------|-------------|
| imageUrl | string | URL of the image to upload |
| name | string | Display name for the file |

---

### Create Folder
Create a new folder for organizing uploads.

```bash
curl -X POST 'https://www.artelo.io/api/open/uploads/folders/create' \
  -H 'Authorization: Bearer your-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Folder 1"
  }'
```

**Request Body:**
| Field | Type | Description |
|-------|------|-------------|
| name | string | Folder name |

---

### Delete File
Delete an uploaded file.

```bash
curl -X DELETE 'https://www.artelo.io/api/open/uploads/files/delete?id=25ed6c73-2b32-456b-9031-93546cc7412a' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The file's unique identifier |

---

### Delete Folder
Delete a folder.

```bash
curl -X DELETE 'https://www.artelo.io/api/open/uploads/folders/delete?id=25ed6c73-2b32-456b-9031-93546cc7412a' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The folder's unique identifier |

---

## Webhooks

### Get Webhooks
Retrieve configured webhooks.

```bash
curl -G 'https://www.artelo.io/api/open/webhooks/get' \
  -H 'Authorization: Bearer your-token'
```

---

### Save Webhook
Create or update a webhook.

```bash
curl -X POST 'https://www.artelo.io/api/open/webhooks/save' \
  -H 'Authorization: Bearer your-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "filters": {
      "statuses": [
        "Shipped"
      ]
    },
    "topic": "OrderStatusChange",
    "url": "https://api.example.com/artelo-webhook"
  }'
```

**Request Body:**
| Field | Type | Description |
|-------|------|-------------|
| filters | object | Filter criteria |
| filters.statuses | array | Order statuses to trigger on |
| topic | string | Webhook topic (e.g., "OrderStatusChange") |
| url | string | Your webhook endpoint URL |

**Webhook Topics:**
| Topic | Description |
|-------|-------------|
| OrderStatusChange | Triggered when order status changes |

**Order Statuses:**
| Status | Description |
|--------|-------------|
| Shipped | Order has been shipped |
| Processing | Order is being processed |
| Cancelled | Order was cancelled |

---

### Delete Webhook
Delete a webhook.

```bash
curl -X DELETE 'https://www.artelo.io/api/open/webhooks/delete?id=f6b7a6cc-8e73-4e0f-b613-28895b0f1137' \
  -H 'Authorization: Bearer your-token'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The webhook's unique identifier |

---

## Enums & Reference Values

### Catalog Product IDs
| Value | Description |
|-------|-------------|
| IndividualArtPrint | Single art print |

### Frame Colors
| Value | Description |
|-------|-------------|
| BlackMetal | Black metal frame |

### Paper Types
| Value | Description |
|-------|-------------|
| ArchivalMatteFineArt | Archival matte fine art paper |
| GlossyPoster | Glossy poster paper |

### Orientations
| Value | Description |
|-------|-------------|
| Horizontal | Landscape orientation |
| Vertical | Portrait orientation |

### Branding Placement
| Value | Description |
|-------|-------------|
| PerOrder | One per order |
| PerItem | One per item |

---

## Environment Configuration

In `.env.dev` / `.env.prod`:
```
EXTERNAL_API_ARTELLO_API_KEY=your_api_key_here
EXTERNAL_API_USE_SANDBOX=true  # Set to false for production
```

---

## Project Integration

**Service Class:** `backend/src/main/java/.../Services/ArtelloService.java`
**Config Class:** `backend/src/main/java/.../Config/ExternalApiConfig.java`
