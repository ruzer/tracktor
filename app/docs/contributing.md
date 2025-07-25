# Contributing

We welcome contributions to the Tracktor project! This guide will help you get started with setting up your development environment and understanding our technology stack.

## Technology Stack

Tracktor is built with a modern and robust technology stack:

*   **Frontend:**
    *   **SvelteKit:** A powerful framework for building fast and resilient web applications.
    *   **Tailwind CSS:** A utility-first CSS framework for creating modern and responsive designs.
*   **Backend:**
    *   **Node.js with Express.js:** A fast and minimalist web framework for building the API.
    *   **TypeScript:** For type safety and improved code quality.
*   **Database:**
    *   **SQLite:** A lightweight, serverless SQL database.
    *   **Sequelize:** A promise-based Node.js ORM for SQLite.

## Development Environment Setup

### Prerequisites

*   Node.js (v18 or higher)
*   npm

### Steps

1.  **Fork and clone the repository:**
    ```bash
    git clone https://github.com/your-username/tracktor.git
    cd tracktor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development servers:**
    This command will start both the frontend and backend development servers concurrently.
    ```bash
    npm run dev
    ```

4.  **Access the application:**
    *   The frontend will be available at `http://localhost:5173`.
    *   The backend API will be available at `http://localhost:3000`.

## Project Structure

The project is organized into two main packages:

*   `app/client`: The SvelteKit frontend application.
*   `app/server`: The Express.js backend API.

When making changes, please adhere to the existing code style and conventions. We use Prettier for code formatting, which should be run automatically if you have the appropriate editor extensions installed.

## Submitting Changes

1.  Create a new branch for your feature or bug fix.
2.  Make your changes and commit them with a clear and descriptive message.
3.  Push your branch to your fork.
4.  Open a pull request to the main Tracktor repository.

We appreciate your contributions to making Tracktor a better application!
