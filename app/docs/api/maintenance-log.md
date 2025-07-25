# Maintenance Log API

This section documents the API endpoints for managing maintenance logs.

## Add Maintenance Log

Adds a new maintenance log for a vehicle.

*   **Method:** `POST`
*   **Endpoint:** `/api/vehicles/:vehicleId/maintenance-logs`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
*   **Request Body:**
    ```json
    {
      "date": "2025-07-24",
      "odometer": 12345,
      "service": "Oil Change",
      "cost": 100,
      "notes": "Changed oil and filter"
    }
    ```

## Get All Maintenance Logs for Vehicle

Retrieves all maintenance logs for a specific vehicle.

*   **Method:** `GET`
*   **Endpoint:** `/api/vehicles/:vehicleId/maintenance-logs`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.

## Get Maintenance Log By ID

Retrieves a single maintenance log by its ID.

*   **Method:** `GET`
*   **Endpoint:** `/api/vehicles/:vehicleId/maintenance-logs/:id`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.

## Update Maintenance Log

Updates a maintenance log's information.

*   **Method:** `PUT`
*   **Endpoint:** `/api/vehicles/:vehicleId/maintenance-logs/:id`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
*   **Request Body:**
    ```json
    {
      "date": "2025-07-25",
      "odometer": 12400,
      "service": "Tire Rotation",
      "cost": 50,
      "notes": "Rotated all tires"
    }
    ```

## Delete Maintenance Log

Deletes a maintenance log.

*   **Method:** `DELETE`
*   **Endpoint:** `/api/vehicles/:vehicleId/maintenance-logs/:id`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
