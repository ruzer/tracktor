# Vehicles API

The Vehicles API provides endpoints for managing vehicle information in Tracktor. This includes creating, reading, updating, and deleting vehicle records.

## Overview

Vehicle management is a core feature of Tracktor. The API allows you to:

- **Create vehicles** with detailed information
- **List all vehicles** with filtering options
- **Get specific vehicle** details by ID
- **Update vehicle** information
- **Delete vehicles** when no longer needed

All vehicle endpoints require [authentication](./authentication.md) via the `X-User-PIN` header.

## Endpoints Overview

| Method   | Endpoint            | Description        |
| -------- | ------------------- | ------------------ |
| `GET`    | `/api/vehicles`     | List all vehicles  |
| `POST`   | `/api/vehicles`     | Create new vehicle |
| `GET`    | `/api/vehicles/:id` | Get vehicle by ID  |
| `PUT`    | `/api/vehicles/:id` | Update vehicle     |
| `DELETE` | `/api/vehicles/:id` | Delete vehicle     |

## Vehicle Schema

| Field          | Type    | Required | Description                                    |
| -------------- | ------- | -------- | ---------------------------------------------- |
| `id`           | Integer | Auto     | Unique vehicle identifier                      |
| `vehicleType`  | String  | Yes      | Type of vehicle (Car, Truck, Motorcycle, etc.) |
| `make`         | String  | Yes      | Vehicle manufacturer                           |
| `model`        | String  | Yes      | Vehicle model                                  |
| `year`         | Integer | Yes      | Manufacturing year                             |
| `licensePlate` | String  | Yes      | License plate number                           |
| `vin`          | String  | No       | Vehicle Identification Number                  |
| `odometer`     | Integer | No       | Current odometer reading                       |

## Examples

<PlaceholderBlock 
  id="vehicles-api-examples"
  type="api-example" 
  message="Add comprehensive API request/response examples for all vehicle endpoints"
  priority="high"
  location="/developer-guide/api/vehicles.md"
  instructions="Include complete curl examples with actual request/response bodies, error cases, and different scenarios for each endpoint"
/>

### Create Vehicle

```bash
curl -X POST \
     -H "X-User-PIN: your-pin" \
     -H "Content-Type: application/json" \
     -d '{
       "vehicleType": "Car",
       "make": "Toyota",
       "model": "Corolla",
       "year": 2022,
       "licensePlate": "ABC123"
     }' \
     http://localhost:3000/api/vehicles
```

### Get All Vehicles

```bash
curl -H "X-User-PIN: your-pin" \
     http://localhost:3000/api/vehicles
```

### Update Vehicle

```bash
curl -X PUT \
     -H "X-User-PIN: your-pin" \
     -H "Content-Type: application/json" \
     -d '{"odometer": 16000}' \
     http://localhost:3000/api/vehicles/1
```

## Complete Reference

For the complete vehicles API specification:

- **[OpenAPI Specification](/api-specs/openapi.yaml)** - Complete technical specification
- **[Interactive Documentation](./swagger-ui.md)** - Test endpoints in your browser

<PlaceholderBlock 
  id="vehicles-api-integration-examples"
  type="api-example" 
  message="Add integration examples showing how to use the vehicles API in real applications"
  priority="medium"
  location="/developer-guide/api/vehicles.md"
  instructions="Include JavaScript/TypeScript examples, error handling patterns, and common integration scenarios"
/>

See the [main API documentation](./index.md) for detailed examples and integration patterns.
