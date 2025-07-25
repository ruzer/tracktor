# Authentication API

This section documents the API endpoints for user authentication.

## Set PIN

Sets the user's PIN for authentication.

*   **Method:** `POST`
*   **Endpoint:** `/api/pin`
*   **Request Body:**
    ```json
    {
      "pin": "123456"
    }
    ```

## Verify PIN

Verifies the user's PIN.

*   **Method:** `POST`
*   **Endpoint:** `/api/pin/verify`
*   **Request Body:**
    ```json
    {
      "pin": "123456"
    }
    ```

## PIN Status

Checks if a PIN has been set.

*   **Method:** `GET`
*   **Endpoint:** `/api/pin/status`
