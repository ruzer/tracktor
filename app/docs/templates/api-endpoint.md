# [Resource Name] API

The [Resource Name] API provides endpoints for managing [resource description] in Tracktor. This includes [list main operations like creating, reading, updating, and deleting].

## Overview

[Resource name] management allows you to:

- **[Operation 1]** - Brief description
- **[Operation 2]** - Brief description
- **[Operation 3]** - Brief description
- **[Operation 4]** - Brief description

All [resource name] endpoints require [authentication](./authentication.md) via the `X-User-PIN` header.

## Endpoints Overview

| Method   | Endpoint              | Description           |
| -------- | --------------------- | --------------------- |
| `GET`    | `/api/[resource]`     | List all [resources]  |
| `POST`   | `/api/[resource]`     | Create new [resource] |
| `GET`    | `/api/[resource]/:id` | Get [resource] by ID  |
| `PUT`    | `/api/[resource]/:id` | Update [resource]     |
| `DELETE` | `/api/[resource]/:id` | Delete [resource]     |

## [Resource] Schema

### Request Schema

| Field      | Type    | Required | Description                      |
| ---------- | ------- | -------- | -------------------------------- |
| `[field1]` | String  | Yes      | [Description of field1]          |
| `[field2]` | String  | Yes      | [Description of field2]          |
| `[field3]` | Integer | Yes      | [Description of field3]          |
| `[field4]` | String  | Yes      | [Description of field4]          |
| `[field5]` | String  | No       | [Description of optional field5] |
| `[field6]` | Integer | No       | [Description of optional field6] |

### Response Schema

| Field       | Type    | Description                       |
| ----------- | ------- | --------------------------------- |
| `id`        | Integer | Unique [resource] identifier      |
| `[field1]`  | String  | [Description of field1]           |
| `[field2]`  | String  | [Description of field2]           |
| `[field3]`  | Integer | [Description of field3]           |
| `[field4]`  | String  | [Description of field4]           |
| `[field5]`  | String  | [Description of optional field5]  |
| `[field6]`  | Integer | [Description of optional field6]  |
| `createdAt` | String  | ISO 8601 timestamp of creation    |
| `updatedAt` | String  | ISO 8601 timestamp of last update |

### Validation Rules

- **[field1]**: [Validation rules and constraints]
- **[field2]**: [Validation rules and constraints]
- **[field3]**: [Validation rules and constraints]
- **[field4]**: [Validation rules and constraints]

## Detailed Endpoints

### List [Resources]

Retrieve a list of all [resources].

```http
GET /api/[resource]
```

#### Query Parameters

| Parameter | Type   | Description                                   |
| --------- | ------ | --------------------------------------------- |
| `limit`   | Number | Maximum number of results (default: 50)       |
| `offset`  | Number | Number of results to skip (default: 0)        |
| `sort`    | String | Sort field (default: 'createdAt')             |
| `order`   | String | Sort order: 'asc' or 'desc' (default: 'desc') |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "[field1]": "[example value]",
      "[field2]": "[example value]",
      "[field3]": 123,
      "[field4]": "[example value]",
      "[field5]": "[example value]",
      "[field6]": 456,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### Create [Resource]

Create a new [resource].

```http
POST /api/[resource]
```

#### Request Body

```json
{
  "[field1]": "[example value]",
  "[field2]": "[example value]",
  "[field3]": 123,
  "[field4]": "[example value]",
  "[field5]": "[optional example value]",
  "[field6]": 456
}
```

#### Response

**Success (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "[field1]": "[example value]",
    "[field2]": "[example value]",
    "[field3]": 123,
    "[field4]": "[example value]",
    "[field5]": "[example value]",
    "[field6]": 456,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "[Resource] created successfully"
}
```

### Get [Resource] by ID

Retrieve a specific [resource] by its ID.

```http
GET /api/[resource]/:id
```

#### Path Parameters

| Parameter | Type   | Description   |
| --------- | ------ | ------------- |
| `id`      | Number | [Resource] ID |

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "[field1]": "[example value]",
    "[field2]": "[example value]",
    "[field3]": 123,
    "[field4]": "[example value]",
    "[field5]": "[example value]",
    "[field6]": 456,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update [Resource]

Update an existing [resource].

```http
PUT /api/[resource]/:id
```

#### Path Parameters

| Parameter | Type   | Description   |
| --------- | ------ | ------------- |
| `id`      | Number | [Resource] ID |

#### Request Body

```json
{
  "[field1]": "[updated value]",
  "[field6]": 789
}
```

_Note: Only include fields you want to update._

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "[field1]": "[updated value]",
    "[field2]": "[example value]",
    "[field3]": 123,
    "[field4]": "[example value]",
    "[field5]": "[example value]",
    "[field6]": 789,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  },
  "message": "[Resource] updated successfully"
}
```

### Delete [Resource]

Delete a [resource].

```http
DELETE /api/[resource]/:id
```

#### Path Parameters

| Parameter | Type   | Description   |
| --------- | ------ | ------------- |
| `id`      | Number | [Resource] ID |

#### Response

**Success (204 No Content):**

```json
{
  "success": true,
  "message": "[Resource] deleted successfully"
}
```

## Error Responses

### Common Error Codes

| Status Code | Error Code       | Description               |
| ----------- | ---------------- | ------------------------- |
| 400         | VALIDATION_ERROR | Invalid request data      |
| 401         | UNAUTHORIZED     | Missing or invalid PIN    |
| 404         | NOT_FOUND        | [Resource] not found      |
| 409         | CONFLICT         | [Resource] already exists |
| 500         | INTERNAL_ERROR   | Server error              |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "[field_name]",
      "issue": "[specific validation error]"
    }
  }
}
```

### Validation Errors

<PlaceholderBlock 
  id="[resource]-validation-errors"
  type="api-example" 
  message="Document specific validation errors for [resource] endpoints"
  priority="medium"
  location="/developer-guide/api/[resource].md"
  instructions="List all possible validation errors with examples and solutions for each field"
/>

## Code Examples

<PlaceholderBlock 
  id="[resource]-api-examples"
  type="api-example" 
  message="Add comprehensive code examples for [resource] API endpoints"
  priority="high"
  location="/developer-guide/api/[resource].md"
  instructions="Include examples in multiple languages (JavaScript, Python, cURL) showing real request/response scenarios"
/>

### JavaScript/Node.js

```javascript
// Set up API client
const API_BASE = "http://localhost:3000/api";
const PIN = "your-pin";

const headers = {
  "Content-Type": "application/json",
  "X-User-PIN": PIN,
};

// Get all [resources]
async function get[Resources]() {
  const response = await fetch(`${API_BASE}/[resource]`, { headers });
  const data = await response.json();
  return data;
}

// Create a new [resource]
async function create[Resource]([resourceData]) {
  const response = await fetch(`${API_BASE}/[resource]`, {
    method: 'POST',
    headers,
    body: JSON.stringify([resourceData])
  });
  const data = await response.json();
  return data;
}

// Update a [resource]
async function update[Resource](id, updates) {
  const response = await fetch(`${API_BASE}/[resource]/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates)
  });
  const data = await response.json();
  return data;
}

// Delete a [resource]
async function delete[Resource](id) {
  const response = await fetch(`${API_BASE}/[resource]/${id}`, {
    method: 'DELETE',
    headers
  });
  const data = await response.json();
  return data;
}
```

### Python

```python
import requests

API_BASE = 'http://localhost:3000/api'
PIN = 'your-pin'

headers = {
    'Content-Type': 'application/json',
    'X-User-PIN': PIN
}

# Get all [resources]
def get_[resources]():
    response = requests.get(f'{API_BASE}/[resource]', headers=headers)
    return response.json()

# Create a new [resource]
def create_[resource]([resource_data]):
    response = requests.post(f'{API_BASE}/[resource]',
                           headers=headers,
                           json=[resource_data])
    return response.json()

# Update a [resource]
def update_[resource](id, updates):
    response = requests.put(f'{API_BASE}/[resource]/{id}',
                          headers=headers,
                          json=updates)
    return response.json()

# Delete a [resource]
def delete_[resource](id):
    response = requests.delete(f'{API_BASE}/[resource]/{id}', headers=headers)
    return response.json()
```

### cURL Examples

```bash
# Get all [resources]
curl -H "X-User-PIN: your-pin" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/[resource]

# Create a new [resource]
curl -X POST \
     -H "X-User-PIN: your-pin" \
     -H "Content-Type: application/json" \
     -d '{
       "[field1]": "[example value]",
       "[field2]": "[example value]",
       "[field3]": 123,
       "[field4]": "[example value]"
     }' \
     http://localhost:3000/api/[resource]

# Update a [resource]
curl -X PUT \
     -H "X-User-PIN: your-pin" \
     -H "Content-Type: application/json" \
     -d '{"[field6]": 789}' \
     http://localhost:3000/api/[resource]/1

# Delete a [resource]
curl -X DELETE \
     -H "X-User-PIN: your-pin" \
     http://localhost:3000/api/[resource]/1
```

## Integration Examples

### Common Workflows

#### Workflow 1: [Common Use Case]

[Step-by-step example of a common integration pattern]

#### Workflow 2: [Another Use Case]

[Step-by-step example of another integration pattern]

### Error Handling

```javascript
async function safe[Resource]Operation() {
  try {
    const result = await create[Resource]({
      [field1]: "[value]",
      [field2]: "[value]",
      [field3]: 123,
      [field4]: "[value]"
    });

    if (result.success) {
      console.log('[Resource] created:', result.data);
    } else {
      console.error('Error:', result.error.message);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}
```

## Rate Limiting

<PlaceholderBlock 
  id="[resource]-rate-limiting"
  type="api-example" 
  message="Document rate limiting for [resource] endpoints if applicable"
  priority="low"
  location="/developer-guide/api/[resource].md"
  instructions="Check if rate limiting is implemented for this resource and document the limits and headers"
/>

## Webhooks

<PlaceholderBlock 
  id="[resource]-webhooks"
  type="feature-description" 
  message="Document webhook support for [resource] events if available"
  priority="low"
  location="/developer-guide/api/[resource].md"
  instructions="Document any webhook events triggered by [resource] operations and their payloads"
/>

## Complete Reference

For the complete [resource] API specification:

- **[OpenAPI Specification](/api-specs/openapi.yaml)** - Complete technical specification
- **[Interactive Documentation](./swagger-ui.md)** - Test endpoints in your browser

See the [main API documentation](./index.md) for detailed examples and integration patterns.

## Related Resources

- **[Vehicles API](./vehicles.md)** - Vehicle management endpoints
- **[Fuel Logs API](./fuel-logs.md)** - Fuel tracking endpoints
- **[Authentication Guide](./authentication.md)** - Required for all endpoints
- **[Error Handling Guide](./index.md#error-responses)** - General error handling patterns

---

**Template Usage Notes:**

1. Replace all `[placeholder text]` with actual content for your resource
2. Update the schema tables with actual field names and types
3. Replace example values with realistic data for your resource
4. Add or remove endpoints based on what your resource actually supports
5. Update validation rules to match your actual implementation
6. Add resource-specific error codes and examples
7. Test all code examples to ensure they work correctly
8. Remove sections that don't apply to your resource (webhooks, rate limiting, etc.)
9. Ensure all links point to correct documentation pages
10. Follow consistent naming conventions throughout the document
