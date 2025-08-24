# API Documentation

Complete API reference and interactive documentation for Tracktor's REST API.

## Quick Start

- **[Interactive API Documentation](./swagger-ui.md)** - Test endpoints directly in your browser
- **[OpenAPI Specification](/api-specs/openapi.yaml)** - Complete API specification
- **[Authentication Guide](./authentication.md)** - Learn about PIN-based authentication

## API Overview

Tracktor provides a comprehensive REST API for managing vehicles and related data:

### Core Endpoints

- **[Authentication](./authentication.md)** - PIN-based authentication system
- **[Vehicles API](./vehicles.md)** - Vehicle management endpoints
- **[Fuel Logs API](./fuel-logs.md)** - Fuel tracking endpoints
- **[Maintenance Logs API](./maintenance-logs.md)** - Maintenance tracking endpoints
- **[Insurance API](./insurance.md)** - Insurance management endpoints
- **[PUCC API](./pucc.md)** - Pollution certificate endpoints

### Interactive Documentation

- **[Swagger UI](./swagger-ui.md)** - Interactive API testing interface

## Base URL and Versioning

### Default Configuration

- **Base URL:** `http://localhost:3000/api`
- **API Version:** v1 (implicit in current implementation)
- **Content Type:** `application/json`

### Production Deployment

When deployed, replace `localhost:3000` with your domain:

```
https://your-domain.com/api
```

## Authentication

All API endpoints (except PIN setup) require PIN-based authentication via the `X-User-PIN` header:

```bash
curl -H "X-User-PIN: your-pin" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/vehicles
```

For detailed authentication information, see the [Authentication Guide](./authentication.md).

## Response Format

### Success Responses

All successful API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "make": "Toyota",
    "model": "Camry"
  },
  "message": "Operation completed successfully"
}
```

### Error Responses

Error responses include detailed information for debugging:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "licensePlate",
      "issue": "License plate is required"
    }
  }
}
```

### HTTP Status Codes

- **200 OK** - Successful GET, PUT requests
- **201 Created** - Successful POST requests
- **204 No Content** - Successful DELETE requests
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Missing or invalid PIN
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

## Rate Limiting

<PlaceholderBlock 
  id="api-rate-limiting-docs"
  type="api-example" 
  message="Document rate limiting implementation if available"
  priority="low"
  location="/developer-guide/api/index.md"
  instructions="Check if rate limiting is implemented in the API and document the limits, headers, and error responses"
/>

## API Endpoints Summary

### Authentication Endpoints

- `POST /api/pin` - Set user PIN
- `POST /api/pin/verify` - Verify PIN
- `GET /api/pin/status` - Check PIN status

### Vehicle Management

- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Create new vehicle
- `GET /api/vehicles/:id` - Get vehicle by ID
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Fuel Tracking

- `GET /api/fuel-logs` - List fuel logs
- `POST /api/fuel-logs` - Create fuel log
- `GET /api/fuel-logs/:id` - Get fuel log by ID
- `PUT /api/fuel-logs/:id` - Update fuel log
- `DELETE /api/fuel-logs/:id` - Delete fuel log

### Maintenance Tracking

- `GET /api/maintenance-logs` - List maintenance logs
- `POST /api/maintenance-logs` - Create maintenance log
- `GET /api/maintenance-logs/:id` - Get maintenance log by ID
- `PUT /api/maintenance-logs/:id` - Update maintenance log
- `DELETE /api/maintenance-logs/:id` - Delete maintenance log

### Insurance Management

- `GET /api/insurance` - List insurance policies
- `POST /api/insurance` - Create insurance policy
- `GET /api/insurance/:id` - Get insurance by ID
- `PUT /api/insurance/:id` - Update insurance
- `DELETE /api/insurance/:id` - Delete insurance

### PUCC Management

- `GET /api/pucc` - List pollution certificates
- `POST /api/pucc` - Create pollution certificate
- `GET /api/pucc/:id` - Get PUCC by ID
- `PUT /api/pucc/:id` - Update PUCC
- `DELETE /api/pucc/:id` - Delete PUCC

## Code Examples

### JavaScript/Node.js

```javascript
// Set up API client
const API_BASE = "http://localhost:3000/api";
const PIN = "your-pin";

const headers = {
  "Content-Type": "application/json",
  "X-User-PIN": PIN,
};

// Get all vehicles
const response = await fetch(`${API_BASE}/vehicles`, { headers });
const data = await response.json();
console.log(data);
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

# Get all vehicles
response = requests.get(f'{API_BASE}/vehicles', headers=headers)
data = response.json()
print(data)
```

### cURL

```bash
# Get all vehicles
curl -H "X-User-PIN: your-pin" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/vehicles

# Create a new vehicle
curl -X POST \
     -H "X-User-PIN: your-pin" \
     -H "Content-Type: application/json" \
     -d '{"make":"Toyota","model":"Corolla","year":2022,"licensePlate":"ABC123"}' \
     http://localhost:3000/api/vehicles
```

## OpenAPI Specification

The complete API specification is available as an OpenAPI 3.0 document:

- **[View OpenAPI Spec](/api-specs/openapi.yaml)** - Complete specification file
- **[Interactive Documentation](./swagger-ui.md)** - Swagger UI interface

The OpenAPI specification includes:

- Complete endpoint documentation
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Error response formats

## Testing the API

### Using Swagger UI

The easiest way to test the API is through our interactive Swagger UI:

1. Visit the [Swagger UI page](./swagger-ui.md)
2. Set your PIN in the authentication section
3. Try out any endpoint directly in the browser

### Using Postman

Import the OpenAPI specification into Postman:

1. Download the [OpenAPI spec](/api-specs/openapi.yaml)
2. Import into Postman
3. Configure authentication with your PIN
4. Test endpoints

### Using cURL

All endpoints can be tested with cURL commands. See the code examples above for common patterns.

## SDK and Client Libraries

<PlaceholderBlock 
  id="api-sdk-documentation"
  type="feature-description" 
  message="Document any official SDKs or client libraries for the Tracktor API"
  priority="low"
  location="/developer-guide/api/index.md"
  instructions="List any available SDKs, client libraries, or wrapper packages for different programming languages"
/>

## Changelog and Versioning

<PlaceholderBlock 
  id="api-versioning-strategy"
  type="feature-description" 
  message="Document API versioning strategy and maintain changelog"
  priority="low"
  location="/developer-guide/api/index.md"
  instructions="Define the API versioning approach, breaking change policy, and maintain a changelog of API updates"
/>

## Support and Feedback

For API-related questions or issues:

- Check the [troubleshooting guide](/user-guide/troubleshooting/)
- Review the [developer setup guide](../development/setup.md)
- Open an issue on [GitHub](https://github.com/javedh-dev/tracktor)

## Next Steps

1. **[Set up authentication](./authentication.md)** - Learn about PIN-based auth
2. **[Try the interactive docs](./swagger-ui.md)** - Test endpoints in your browser
3. **[Explore specific endpoints](./vehicles.md)** - Detailed endpoint documentation
4. **[Review the OpenAPI spec](/api-specs/openapi.yaml)** - Complete technical specification
