# Data Models and Schema Analysis

This document contains the complete analysis of all data models, schemas, relationships, and validation rules extracted from the Tracktor backend codebase.

## Model Overview

The Tracktor application uses Sequelize ORM with the following core models:

1. **Vehicle** - Core entity representing vehicles
2. **FuelLog** - Fuel consumption tracking records
3. **Insurance** - Insurance policy records
4. **MaintenanceLog** - Vehicle maintenance records
5. **PollutionCertificate (PUCC)** - Pollution Under Control Certificate records
6. **Auth** - Authentication/PIN storage
7. **Config** - Application configuration settings

## Model Relationships

### Entity Relationship Diagram

```
Vehicle (1) ──── (Many) FuelLog
Vehicle (1) ──── (Many) Insurance
Vehicle (1) ──── (Many) MaintenanceLog
Vehicle (1) ──── (Many) PollutionCertificate

Auth (Standalone)
Config (Standalone)
```

### Relationship Details

- **Vehicle → FuelLog**: One-to-Many (foreignKey: vehicleId)
- **Vehicle → Insurance**: One-to-Many (foreignKey: vehicleId)
- **Vehicle → MaintenanceLog**: One-to-Many (foreignKey: vehicleId)
- **Vehicle → PollutionCertificate**: One-to-Many (foreignKey: vehicleId)

## Detailed Model Schemas

### 1. Vehicle Model

**Table**: `vehicles`

| Field        | Type    | Required | Unique | Validation                                     | Description                   |
| ------------ | ------- | -------- | ------ | ---------------------------------------------- | ----------------------------- |
| id           | UUID    | Yes      | Yes    | Auto-generated UUID                            | Primary key                   |
| make         | String  | Yes      | No     | Length: 3-50 chars                             | Vehicle manufacturer          |
| model        | String  | Yes      | No     | Length: 3-50 chars                             | Vehicle model                 |
| year         | Integer | Yes      | No     | Min: 1886, Max: current year                   | Manufacturing year            |
| licensePlate | String  | Yes      | Yes    | Pattern: `^[A-Z0-9- ]{2,25}$`                  | License plate number          |
| vin          | String  | No       | Yes    | Pattern: `^[A-HJ-NPR-Z0-9]{3,}$`               | Vehicle Identification Number |
| color        | String  | No       | No     | Pattern: `^#([A-Fa-f0-9]{6}\|[A-Fa-f0-9]{3})$` | Hex color code                |
| odometer     | Integer | No       | No     | Must be < min fuel log odometer                | Initial odometer reading      |

**Business Rules**:

- VIN must be unique across all vehicles
- License plate must be unique
- Initial odometer reading must be less than the first fuel log entry
- Year must be between 1886 (first car invented) and current year

### 2. FuelLog Model

**Table**: `fuel_logs`

| Field      | Type    | Required | Validation                 | Description                       |
| ---------- | ------- | -------- | -------------------------- | --------------------------------- |
| id         | UUID    | Yes      | Auto-generated UUID        | Primary key                       |
| vehicleId  | UUID    | Yes      | Foreign key to vehicles.id | Associated vehicle                |
| date       | Date    | Yes      | Valid date format          | Fuel purchase date                |
| odometer   | Integer | Yes      | Min: 0                     | Odometer reading at fuel purchase |
| fuelAmount | Float   | Yes      | Min: 0                     | Amount of fuel purchased          |
| cost       | Float   | Yes      | Min: 0                     | Cost of fuel purchase             |
| notes      | String  | No       | Max length: 500            | Optional notes                    |

**Business Rules**:

- All numeric values must be greater than 0
- Notes are limited to 500 characters

### 3. Insurance Model

**Table**: `insurances`

| Field        | Type   | Required | Unique | Validation                                  | Description             |
| ------------ | ------ | -------- | ------ | ------------------------------------------- | ----------------------- |
| id           | UUID   | Yes      | Yes    | Auto-generated UUID                         | Primary key             |
| vehicleId    | UUID   | Yes      | No     | Foreign key to vehicles.id                  | Associated vehicle      |
| provider     | String | Yes      | No     | Length: 3-50 chars                          | Insurance provider name |
| policyNumber | String | Yes      | Yes    | Length: 3-50, Pattern: `^[0-9A-Za-z- ]*$`   | Policy number           |
| startDate    | Date   | Yes      | No     | Valid date, must be after previous end date | Policy start date       |
| endDate      | Date   | Yes      | No     | Valid date, must be after start date        | Policy end date         |
| cost         | Float  | Yes      | No     | Min: 0                                      | Insurance cost          |
| notes        | String | No       | No     | Max length: 500                             | Optional notes          |

**Business Rules**:

- Policy numbers must be unique across all insurance records
- Start date must be before end date
- Start date must be after the previous insurance policy's end date for the same vehicle
- Only alphanumeric characters, spaces, and hyphens allowed in policy number

### 4. MaintenanceLog Model

**Table**: `maintenance_logs`

| Field         | Type    | Required | Validation                 | Description                     |
| ------------- | ------- | -------- | -------------------------- | ------------------------------- |
| id            | UUID    | Yes      | Auto-generated UUID        | Primary key                     |
| vehicleId     | UUID    | Yes      | Foreign key to vehicles.id | Associated vehicle              |
| date          | Date    | Yes      | Valid date format          | Maintenance date                |
| odometer      | Integer | Yes      | Min: 0                     | Odometer reading at maintenance |
| serviceCenter | String  | Yes      | Length: 3-50 chars         | Service center name             |
| cost          | Float   | Yes      | Min: 0                     | Maintenance cost                |
| notes         | String  | No       | Max length: 500            | Optional notes                  |

**Business Rules**:

- All numeric values must be greater than 0
- Service center name must be between 3-50 characters

### 5. PollutionCertificate (PUCC) Model

**Table**: `pollution_certificates`

| Field             | Type   | Required | Unique | Validation                                | Description             |
| ----------------- | ------ | -------- | ------ | ----------------------------------------- | ----------------------- |
| id                | UUID   | Yes      | Yes    | Auto-generated UUID                       | Primary key             |
| vehicleId         | UUID   | Yes      | No     | Foreign key to vehicles.id                | Associated vehicle      |
| certificateNumber | String | Yes      | Yes    | Length: 3-50, Pattern: `^[0-9A-Za-z- ]*$` | Certificate number      |
| issueDate         | Date   | Yes      | No     | Valid date, must be after previous expiry | Certificate issue date  |
| expiryDate        | Date   | Yes      | No     | Valid date, must be after issue date      | Certificate expiry date |
| testingCenter     | String | Yes      | No     | Length: 3-50 chars                        | Testing center name     |
| notes             | String | No       | No     | Max length: 500                           | Optional notes          |

**Business Rules**:

- Certificate numbers must be unique across all PUCC records
- Issue date must be before expiry date
- Issue date must be after the previous PUCC's expiry date for the same vehicle
- Only alphanumeric characters, spaces, and hyphens allowed in certificate number

### 6. Auth Model

**Table**: `auth`

| Field | Type    | Required | Description                   |
| ----- | ------- | -------- | ----------------------------- |
| id    | Integer | Yes      | Primary key (fixed value)     |
| hash  | String  | Yes      | Hashed PIN for authentication |

**Business Rules**:

- Stores hashed PIN for authentication
- Single record system (id is fixed)

### 7. Config Model

**Table**: `config`

| Field       | Type   | Required | Unique | Description                     |
| ----------- | ------ | -------- | ------ | ------------------------------- |
| key         | String | Yes      | Yes    | Configuration key (Primary key) |
| value       | String | Yes      | No     | Configuration value             |
| description | String | No       | No     | Configuration description       |

**Business Rules**:

- Key serves as primary key
- Used for application-wide configuration settings

## Validation Rules Summary

### Common Patterns

1. **UUID Fields**: All primary keys (except Auth.id and Config.key) use UUID v4
2. **String Length**: Most string fields have 3-50 character limits
3. **Notes Fields**: All optional notes fields limited to 500 characters
4. **Numeric Minimums**: All cost and measurement fields must be > 0
5. **Date Validation**: All date fields validated for proper format
6. **Alphanumeric Patterns**: Policy numbers and certificate numbers use `^[0-9A-Za-z- ]*$`

### Unique Constraints

- Vehicle: `licensePlate`, `vin`
- Insurance: `policyNumber`
- PollutionCertificate: `certificateNumber`
- Config: `key`

### Foreign Key Relationships

All vehicle-related models (FuelLog, Insurance, MaintenanceLog, PollutionCertificate) reference `vehicles.id` via `vehicleId` field.

## Database Configuration

- **ORM**: Sequelize
- **Naming Convention**: `underscored: true` (snake_case)
- **Timestamps**: Enabled for all models (created_at, updated_at)
- **Cascade Behavior**: Not explicitly defined (default Sequelize behavior)

## Schema Evolution Considerations

1. **Migration Support**: Models are designed to work with Sequelize migrations
2. **Extensibility**: Optional fields allow for future enhancements
3. **Data Integrity**: Strong validation rules ensure data quality
4. **Relationship Integrity**: Foreign key constraints maintain referential integrity

## API Schema Implications

### Request Schemas

Based on the model validation rules, API requests should validate:

1. **Required Fields**: All non-optional fields must be present
2. **Format Validation**: String patterns, date formats, numeric ranges
3. **Business Logic**: Date ordering, uniqueness constraints
4. **Length Limits**: String field length restrictions

### Response Schemas

API responses will include:

1. **Full Model Data**: All fields including auto-generated UUIDs and timestamps
2. **Relationship Data**: Nested objects when associations are included
3. **Validation Errors**: Detailed error messages from model validation

This schema analysis provides the foundation for generating comprehensive OpenAPI specifications and ensuring API documentation accuracy.
