# Interactive API Documentation

This page provides an interactive interface for exploring and testing the Tracktor API using the OpenAPI specification. You can view all available endpoints, examine request/response schemas, and test API calls directly from this interface.

## API Explorer

<OASpec spec="/api-specs/openapi.yaml" />

## Getting Started with API Testing

### 1. Authentication Setup

Before testing protected endpoints, you need to authenticate:

1. **Set up a PIN** (if not already done):
   - Use the `POST /api/pin` endpoint to set a 6-digit PIN
   - This endpoint doesn't require authentication

2. **Configure Authentication**:
   - Click the "Authorize" button in the Swagger UI above
   - Enter your 6-digit PIN in the `X-User-PIN` field
   - Click "Authorize" to apply the authentication to all requests

### 2. Testing Endpoints

1. **Expand an endpoint** by clicking on it
2. **Click "Try it out"** to enable the testing interface
3. **Fill in required parameters** and request body (if applicable)
4. **Click "Execute"** to send the request
5. **Review the response** including status code, headers, and body

### 3. Understanding Responses

- **200-299**: Success responses
- **400**: Bad request (validation errors)
- **401**: Authentication required or invalid PIN
- **404**: Resource not found
- **429**: Rate limit exceeded (for PIN verification)

## API Workflow Examples

### Adding a Vehicle and Fuel Log

1. **Authenticate** using the steps above
2. **Create a vehicle** using `POST /api/vehicles`
3. **Add fuel logs** using `POST /api/vehicles/{vehicleId}/fuel-logs`
4. **Retrieve data** using the corresponding GET endpoints

### Managing Maintenance Records

1. **Get vehicle list** using `GET /api/vehicles`
2. **Add maintenance log** using `POST /api/vehicles/{vehicleId}/maintenance-logs`
3. **Update records** using PUT endpoints as needed

## Server Configuration

The Swagger UI supports multiple server environments. Use the server dropdown in the interface to switch between:

### Development Environment

- **URL**: `http://localhost:3000/api`
- **Purpose**: Local development and testing
- **Setup**: Ensure your local backend server is running on port 3000
- **CORS**: Automatically configured for localhost testing

### Staging Environment

- **URL**: `https://api-staging.tracktor.example.com/api`
- **Purpose**: Pre-production testing
- **Setup**: Update the URL to match your staging server
- **Authentication**: Use staging-specific PIN credentials

### Production Environment

- **URL**: `https://api.tracktor.example.com/api`
- **Purpose**: Live production API
- **Setup**: Update the URL to match your production server
- **Security**: Ensure HTTPS is enabled and proper authentication

### Custom Server Configuration

To test against a custom server:

1. **Modify the OpenAPI spec**: Update the `servers` section in `/api-specs/openapi.yaml`
2. **Add your server URL**: Include description and any special configuration
3. **Reload the page**: The new server will appear in the dropdown

Example server configuration:

```yaml
servers:
  - url: http://localhost:3000/api
    description: Development server
  - url: https://your-custom-domain.com/api
    description: Custom deployment
```

## Request/Response Validation

### Automatic Validation

The Swagger UI automatically validates:

- **Request schemas**: Ensures request bodies match defined schemas
- **Parameter formats**: Validates path parameters, query parameters, and headers
- **Response formats**: Displays expected response structures
- **Authentication**: Verifies required authentication headers

### Testing Best Practices

1. **Start with authentication**: Always set up your PIN first
2. **Use realistic data**: Follow the example values provided in schemas
3. **Check response codes**: Understand what each status code means
4. **Review error messages**: Use error responses to debug issues
5. **Test edge cases**: Try invalid data to see error handling

## Troubleshooting

### Authentication Issues

**Problem**: 401 Unauthorized responses

- **Solution**: Ensure PIN is set using `POST /api/pin` (no auth required)
- **Check**: Verify PIN is entered correctly in the Authorization section
- **Rate Limiting**: Wait if you've exceeded 5 PIN verification attempts

**Problem**: Missing X-User-PIN header

- **Solution**: Click "Authorize" button and enter your 6-digit PIN
- **Verify**: Check that the lock icon shows "Authorized" status

### Server Connection Issues

**Problem**: Network errors or timeouts

- **Solution**: Verify the selected server is running and accessible
- **Check**: Ensure the server URL is correct in the dropdown
- **CORS**: Confirm CORS headers are properly configured on the backend

**Problem**: 404 Not Found errors

- **Solution**: Check that the API endpoint exists on the selected server
- **Verify**: Ensure the server is running the correct version of the API

### Request/Response Issues

**Problem**: 400 Bad Request responses

- **Solution**: Review the request schema and ensure all required fields are provided
- **Check**: Validate data formats (dates, UUIDs, numbers) match the schema
- **Examples**: Use the provided example values as a reference

**Problem**: Validation errors

- **Solution**: Check the error response for specific validation messages
- **Fix**: Adjust your request data to match the schema requirements
- **Reference**: Review the schema definitions for field constraints

### Performance and Rate Limiting

**Problem**: 429 Too Many Requests

- **Solution**: Wait for the rate limit window to reset (5 minutes for PIN verification)
- **Prevention**: Avoid rapid successive requests to rate-limited endpoints

**Problem**: Slow response times

- **Check**: Verify network connectivity and server performance
- **Optimize**: Use appropriate query parameters to limit response size

## Advanced Testing Features

### Request Interceptors

The Swagger UI includes request logging for debugging:

- **Console Logging**: All requests are logged to browser console
- **Headers**: Review request headers including authentication
- **Body**: Inspect request body data before sending
- **CORS**: Automatic CORS header configuration for development

### Response Analysis

- **Status Codes**: Color-coded response status indicators
- **Headers**: Full response header information
- **Body**: Formatted JSON response display
- **Timing**: Request duration and performance metrics

### Error Response Examples

Each endpoint includes comprehensive error examples:

- **400**: Validation errors with specific field messages
- **401**: Authentication failures with clear instructions
- **404**: Resource not found with helpful guidance
- **429**: Rate limiting with retry information
- **500**: Server errors with troubleshooting steps

- Verify the server URL is correct
- Ensure the API server is running on the expected port

### Rate Limiting

The PIN verification endpoint has rate limiting:

- Maximum 5 attempts per 5 minutes
- If exceeded, wait 5 minutes before trying again

## OpenAPI Specification

The interactive documentation is generated from our OpenAPI 3.1 specification located at `/api-specs/openapi.yaml`. This specification is automatically kept in sync with the actual API implementation.
