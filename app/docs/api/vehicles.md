# Vehicles API

This section documents the API endpoints for managing vehicles.

## Add Vehicle

Adds a new vehicle.

*   **Method:** `POST`
*   **Endpoint:** `/api/vehicles`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
*   **Request Body:**
    ```json
    {
      "vehicleType": "Car",
      "make": "Toyota",
      "model": "Corolla",
      "year": 2022,
      "licensePlate": "ABC1234"
    }
    ```

## Get All Vehicles

Retrieves all vehicles.

*   **Method:** `GET`
*   **Endpoint:** `/api/vehicles`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.

## Get Vehicle By ID

Retrieves a single vehicle by its ID.

*   **Method:** `GET`
*   **Endpoint:** `/api/vehicles/:id`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.

## Update Vehicle

Updates a vehicle's information.

*   **Method:** `PUT`
*   **Endpoint:** `/api/vehicles/:id`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
*   **Request Body:**
    ```json
    {
      "make": "Toyota",
      "model": "Camry",
      "year": 2023,
      "licensePlate": "XYZ789"
    }
    ```

## Delete Vehicle

Deletes a vehicle.

*   **Method:** `DELETE`
*   **Endpoint:** `/api/vehicles/:id`
*   **Headers:**
    *   `X-User-PIN`: The user's PIN.
