# PUCC API

This section documents the API endpoints for managing Pollution Under Control Certificates (PUCC).

## Add Pollution Certificate

Adds a new PUCC for a vehicle.

*   **Method:** `POST`
*   **Endpoint:** `/api/vehicles/:vehicleId/pucc`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
*   **Request Body:**
    ```json
    {
      "certificateNumber": "PUCC123456",
      "issueDate": "2025-01-01",
      "expiryDate": "2026-01-01",
      "testingCenter": "Test Center",
      "notes": "All clear"
    }
    ```

## Get Pollution Certificate for Vehicle

Retrieves the PUCC for a specific vehicle.

*   **Method:** `GET`
*   **Endpoint:** `/api/vehicles/:vehicleId/pucc`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.

## Update Pollution Certificate

Updates a PUCC's information.

*   **Method:** `PUT`
*   **Endpoint:** `/api/vehicles/:vehicleId/pucc`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
*   **Request Body:**
    ```json
    {
      "certificateNumber": "PUCC654321",
      "issueDate": "2025-02-01",
      "expiryDate": "2026-02-01",
      "testingCenter": "New Center",
      "notes": "Renewed"
    }
    ```

## Delete Pollution Certificate

Deletes a PUCC.

*   **Method:** `DELETE`
*   **Endpoint:** `/api/vehicles/:vehicleId/pucc`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
