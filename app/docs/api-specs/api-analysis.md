# API Endpoint Analysis

This document contains the complete analysis of all API endpoints extracted from the Tracktor backend codebase.

## Base API Structure

All API endpoints are prefixed with `/api` and organized into the following main categories:

- **Authentication**: `/api/pin/*` - PIN-based authentication system
- **Vehicles**: `/api/vehicles/*` - Vehicle management and related resources
- **Configuration**: `/api/config/*` - Application configuration management

## Authentication Requirements

Most endpoints require PIN authentication via the `authenticatePin` middleware, except for:

- PIN management endpoints (setting and verifying PIN)
- Configuration endpoints (no authentication required)

## Complete API Endpoint Inventory

### 1. PIN Authentication Endpoints

| Method | Endpoint          | Controller Function | Auth Required | Rate Limited     | Description                   |
| ------ | ----------------- | ------------------- | ------------- | ---------------- | ----------------------------- |
| POST   | `/api/pin`        | `setPin`            | No            | No               | Set a new 6-digit PIN         |
| POST   | `/api/pin/verify` | `verifyPin`         | No            | Yes (5 req/5min) | Verify PIN for authentication |
| GET    | `/api/pin/status` | `getPinStatus`      | No            | No               | Get PIN setup status          |

**Request/Response Details:**

- `POST /api/pin`: Requires `{ pin: string }` (6-digit number)
- `POST /api/pin/verify`: Requires `{ pin: string }`
- `GET /api/pin/status`: Returns PIN setup status

### 2. Vehicle Management Endpoints

| Method | Endpoint            | Controller Function | Auth Required | Description                |
| ------ | ------------------- | ------------------- | ------------- | -------------------------- |
| POST   | `/api/vehicles`     | `addVehicle`        | Yes           | Create a new vehicle       |
| GET    | `/api/vehicles`     | `getAllVehicles`    | Yes           | Get all vehicles           |
| GET    | `/api/vehicles/:id` | `getVehicleById`    | Yes           | Get vehicle by ID          |
| PUT    | `/api/vehicles/:id` | `updateVehicle`     | Yes           | Update vehicle information |
| DELETE | `/api/vehicles/:id` | `deleteVehicle`     | Yes           | Delete a vehicle           |

**Request/Response Details:**

- Vehicle operations require: `{ make, model, year, licensePlate }` (all required)
- All endpoints return vehicle objects or arrays of vehicle objects

### 3. Fuel Log Endpoints

| Method | Endpoint                                 | Controller Function | Auth Required | Description                   |
| ------ | ---------------------------------------- | ------------------- | ------------- | ----------------------------- |
| POST   | `/api/vehicles/:vehicleId/fuel-logs`     | `addFuelLog`        | Yes           | Add fuel log entry            |
| GET    | `/api/vehicles/:vehicleId/fuel-logs`     | `getFuelLogs`       | Yes           | Get all fuel logs for vehicle |
| GET    | `/api/vehicles/:vehicleId/fuel-logs/:id` | `getFuelLogById`    | Yes           | Get specific fuel log         |
| PUT    | `/api/vehicles/:vehicleId/fuel-logs/:id` | `updateFuelLog`     | Yes           | Update fuel log entry         |
| DELETE | `/api/vehicles/:vehicleId/fuel-logs/:id` | `deleteFuelLog`     | Yes           | Delete fuel log entry         |

**Request/Response Details:**

- Fuel log operations require: `{ date, odometer, fuelAmount, cost }` (all required)

### 4. Insurance Endpoints

| Method | Endpoint                                 | Controller Function | Auth Required | Description                           |
| ------ | ---------------------------------------- | ------------------- | ------------- | ------------------------------------- |
| POST   | `/api/vehicles/:vehicleId/insurance`     | `addInsurance`      | Yes           | Add insurance record                  |
| GET    | `/api/vehicles/:vehicleId/insurance`     | `getInsurances`     | Yes           | Get all insurance records for vehicle |
| PUT    | `/api/vehicles/:vehicleId/insurance/:id` | `updateInsurance`   | Yes           | Update insurance record               |
| DELETE | `/api/vehicles/:vehicleId/insurance/:id` | `deleteInsurance`   | Yes           | Delete insurance record               |

**Request/Response Details:**

- Insurance operations require: `{ provider, policyNumber, startDate, endDate, cost }` (all required)

### 5. Maintenance Log Endpoints

| Method | Endpoint                                        | Controller Function     | Auth Required | Description                          |
| ------ | ----------------------------------------------- | ----------------------- | ------------- | ------------------------------------ |
| POST   | `/api/vehicles/:vehicleId/maintenance-logs`     | `addMaintenanceLog`     | Yes           | Add maintenance log entry            |
| GET    | `/api/vehicles/:vehicleId/maintenance-logs`     | `getMaintenanceLogs`    | Yes           | Get all maintenance logs for vehicle |
| GET    | `/api/vehicles/:vehicleId/maintenance-logs/:id` | `getMaintenanceLogById` | Yes           | Get specific maintenance log         |
| PUT    | `/api/vehicles/:vehicleId/maintenance-logs/:id` | `updateMaintenanceLog`  | Yes           | Update maintenance log entry         |
| DELETE | `/api/vehicles/:vehicleId/maintenance-logs/:id` | `deleteMaintenanceLog`  | Yes           | Delete maintenance log entry         |

**Request/Response Details:**

- Maintenance log operations require: `{ date, odometer, serviceCenter, cost }` for creation
- Update operations require: `{ date, odometer, service, cost }` (note: different field names)

### 6. Pollution Certificate (PUCC) Endpoints

| Method | Endpoint                            | Controller Function          | Auth Required | Description                                |
| ------ | ----------------------------------- | ---------------------------- | ------------- | ------------------------------------------ |
| POST   | `/api/vehicles/:vehicleId/pucc`     | `addPollutionCertificate`    | Yes           | Add pollution certificate                  |
| GET    | `/api/vehicles/:vehicleId/pucc`     | `getPollutionCertificates`   | Yes           | Get all pollution certificates for vehicle |
| PUT    | `/api/vehicles/:vehicleId/pucc/:id` | `updatePollutionCertificate` | Yes           | Update pollution certificate               |
| DELETE | `/api/vehicles/:vehicleId/pucc/:id` | `deletePollutionCertificate` | Yes           | Delete pollution certificate               |

**Request/Response Details:**

- PUCC operations require: `{ certificateNumber, issueDate, expiryDate, testingCenter }` (all required)

### 7. Configuration Endpoints

| Method | Endpoint           | Controller Function | Auth Required | Description                       |
| ------ | ------------------ | ------------------- | ------------- | --------------------------------- |
| GET    | `/api/config`      | `getConfig`         | No            | Get all application configuration |
| GET    | `/api/config/:key` | `getConfigByKey`    | No            | Get configuration by key          |
| PUT    | `/api/config`      | `updateConfig`      | No            | Update configuration values       |

**Request/Response Details:**

- `PUT /api/config`: Requires array of `{ key: string, value: string }` objects

## Error Handling Patterns

All controllers follow consistent error handling patterns:

1. **Validation Errors**: Return 400 Bad Request with descriptive messages
2. **Missing Parameters**: Specific error messages for required fields
3. **Custom Error Classes**: Each domain has its own error class (VehicleError, FuelLogError, etc.)
4. **Status Codes**: Consistent use of HTTP status codes (200, 201, 400, etc.)

## Authentication Flow

1. **PIN Setup**: `POST /api/pin` to set initial PIN
2. **PIN Verification**: `POST /api/pin/verify` to authenticate
3. **Protected Endpoints**: Include `X-User-PIN` header or use session-based auth
4. **Rate Limiting**: PIN verification is rate-limited to prevent brute force attacks

## Middleware Usage

- **asyncHandler**: Wraps all controller functions for error handling
- **authenticatePin**: Protects most endpoints except PIN and config routes
- **Rate Limiting**: Applied to PIN verification endpoint (5 requests per 5 minutes)
- **CORS**: Configured with explicit origins and credentials support

## Notes

1. **Nested Resources**: Fuel logs, insurance, maintenance logs, and PUCC are nested under vehicles
2. **Parameter Validation**: All endpoints validate required parameters and return specific error messages
3. **Consistent Response Format**: All endpoints return JSON responses
4. **RESTful Design**: Follows REST conventions for resource management
