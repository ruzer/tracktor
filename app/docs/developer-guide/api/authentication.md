# Authentication API

Tracktor uses PIN-based authentication for secure access to all API endpoints. This guide covers the authentication system and related endpoints.

## Overview

The authentication system is designed for simplicity and security:

- **PIN-based authentication** - Simple numeric PIN instead of complex passwords
- **Header-based authentication** - PIN sent via `X-User-PIN` header
- **Stateless authentication** - No sessions or tokens required
- **Secure storage** - PINs are hashed and stored securely

## Authentication Flow

1. **Check PIN status** - Determine if a PIN has been set
2. **Set PIN** (first time only) - Create your authentication PIN
3. **Verify PIN** - Validate PIN for subsequent requests
4. **Use PIN in headers** - Include PIN in all API requests

## API Endpoints

### Check PIN Status

Check if a PIN has been configured for the system.

**Endpoint:** `GET /api/pin/status`

**Response:**

```json
{
  "success": true,
  "data": {
    "hasPIN": false
  }
}
```

### Set PIN

Set the authentication PIN for the system (first-time setup only).

**Endpoint:** `POST /api/pin`

**Request Body:**

```json
{
  "pin": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "PIN set successfully"
}
```

### Verify PIN

Verify that a PIN is correct (used for login validation).

**Endpoint:** `POST /api/pin/verify`

**Request Body:**

```json
{
  "pin": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "valid": true
  }
}
```

## Using Authentication

All protected endpoints require the `X-User-PIN` header:

```bash
curl -H "X-User-PIN: 123456" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/vehicles
```

## Security Considerations

- **Hashing:** PINs are hashed using bcrypt before storage
- **HTTPS:** Use HTTPS in production to protect PIN transmission
- **Strong PINs:** Avoid sequential or repeated digits
- **Secure storage:** Don't hardcode PINs in client applications

## Complete Reference

For the complete authentication API specification:

- **[OpenAPI Specification](/api-specs/openapi.yaml)** - Complete technical specification
- **[Interactive Documentation](./swagger-ui.md)** - Test endpoints in your browser

See the [main API documentation](./index.md) for detailed examples and integration patterns.
