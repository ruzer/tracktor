# Insurance API

This section documents the API endpoints for managing insurance policies.

## Add Insurance

Adds a new insurance policy for a vehicle.

*   **Method:** `POST`
*   **Endpoint:** `/api/vehicles/:vehicleId/insurance`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
*   **Request Body:**
    ```json
    {
      "provider": "ABC Insurance",
      "policyNumber": "POL123456",
      "startDate": "2025-01-01",
      "endDate": "2026-01-01",
      "cost": 5000
    }
    ```

## Get Insurance for Vehicle

Retrieves the insurance policy for a specific vehicle.

*   **Method:** `GET`
*   **Endpoint:** `/api/vehicles/:vehicleId/insurance`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.

## Update Insurance

Updates an insurance policy's information.

*   **Method:** `PUT`
*   **Endpoint:** `/api/vehicles/:vehicleId/insurance`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
*   **Request Body:**
    ```json
    {
      "provider": "XYZ Insurance",
      "policyNumber": "POL654321",
      "startDate": "2025-02-01",
      "endDate": "2026-02-01",
      "cost": 5200
    }
    ```

## Delete Insurance

Deletes an insurance policy.

*   **Method:** `DELETE`
*   **Endpoint:** `/api/vehicles/:vehicleId/insurance`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
