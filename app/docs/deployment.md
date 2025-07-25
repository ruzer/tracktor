# Deployment

This guide provides instructions for deploying the Tracktor application on your own server. You can choose between using Docker for a containerized setup or deploying it as a standard Node.js application.

## Docker Deployment

Using Docker is the recommended way to deploy Tracktor, as it encapsulates the application and its dependencies in a consistent environment.

### Prerequisites

*   Docker installed on your server.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tracktor.git
    cd tracktor
    ```

2.  **Build the Docker image:**
    ```bash
    docker build -t tracktor .
    ```

3.  **Run the Docker container:**
    ```bash
    docker run -p 3000:3000 -d tracktor
    ```

This will start the Tracktor application, and it will be accessible at `http://localhost:3000`.

## Node.js Deployment

If you prefer to run the application directly on your server without Docker, you can follow these steps.

### Prerequisites

*   Node.js (v18 or higher) installed on your server.
*   npm (usually comes with Node.js).

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tracktor.git
    cd tracktor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the application:**
    ```bash
    npm run build
    ```

4.  **Start the application:**
    ```bash
    npm start
    ```

This will start the Tracktor application, and it will be accessible at `http://localhost:3000`.
