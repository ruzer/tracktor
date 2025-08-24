# Developer Guide

Welcome to the Tracktor Developer Guide. This comprehensive resource provides technical documentation for developers working with or contributing to Tracktor.

## Quick Navigation

- [Architecture](./architecture/) - System design and technical overview
- [API Documentation](./api/) - Complete API reference and interactive docs
- [Development](./development/) - Setup, coding standards, and workflows
- [Deployment](./deployment/) - Deployment guides and configurations
- [Contributing](./contributing/) - Contribution guidelines and processes

## Getting Started as a Developer

1. **Review the [Architecture Overview](./architecture/overview.md)** - Understand the system design
2. **Set up your [Development Environment](./development/setup.md)** - Get your local environment ready
3. **Explore the [API Documentation](./api/)** - Learn about the REST API
4. **Read the [Contributing Guidelines](./contributing/guidelines.md)** - Understand our development process

## Technology Stack

Tracktor is built with a modern and robust technology stack:

### Frontend

- **SvelteKit:** A powerful framework for building fast and resilient web applications
- **Svelte 5:** Latest version with enhanced reactivity and performance
- **Tailwind CSS:** A utility-first CSS framework for creating modern and responsive designs
- **TypeScript:** For type safety and improved code quality

### Backend

- **Node.js with Express.js:** A fast and minimalist web framework for building the API
- **TypeScript:** For type safety and improved code quality throughout the backend
- **Sequelize ORM:** Promise-based Node.js ORM for database operations
- **PIN-based Authentication:** Secure, simple authentication system

### Database

- **SQLite:** A lightweight, serverless SQL database perfect for single-user applications
- **Sequelize:** A promise-based Node.js ORM for SQLite with migration support

### Development Tools

- **Vite:** Fast build tool and development server
- **ESLint:** Code linting and quality assurance
- **Prettier:** Code formatting and style consistency
- **Docker:** Containerization for consistent deployment

## Project Structure

The project is organized into several main directories:

```
tracktor/
├── app/
│   ├── frontend/          # SvelteKit frontend application
│   ├── backend/           # Express.js backend API
│   └── docs/              # VitePress documentation
├── docker/                # Docker configuration files
└── scripts/               # Build and deployment scripts
```

### Frontend Structure (`app/frontend/`)

- **`src/components/`** - Reusable Svelte components
- **`src/routes/`** - SvelteKit routes and pages
- **`src/lib/`** - Shared utilities, stores, and models
- **`src/styles/`** - Global styles and Tailwind configuration

### Backend Structure (`app/backend/`)

- **`src/controllers/`** - API endpoint handlers
- **`src/models/`** - Database models and schemas
- **`src/services/`** - Business logic and data processing
- **`src/middleware/`** - Authentication and request processing
- **`src/db/`** - Database configuration and migrations

## Development Workflow

1. **Fork and clone** the repository
2. **Set up your development environment** following the [setup guide](./development/setup.md)
3. **Create a feature branch** for your changes
4. **Follow coding standards** outlined in our [guidelines](./contributing/guidelines.md)
5. **Test your changes** thoroughly
6. **Submit a pull request** following our [PR guidelines](./contributing/pull-requests.md)

## API Overview

Tracktor provides a comprehensive REST API for managing vehicles, fuel logs, maintenance records, and more. Key features include:

- **Vehicle Management** - CRUD operations for vehicle data
- **Fuel Tracking** - Log refuels and calculate efficiency
- **Maintenance Logs** - Track service history and schedules
- **Insurance Management** - Policy tracking and renewals
- **PUCC Management** - Pollution certificate tracking
- **Authentication** - PIN-based secure access

For detailed API documentation, see the [API section](./api/) or explore the [interactive Swagger documentation](./api/swagger-ui.md).

## Getting Help

- **[Architecture Documentation](./architecture/)** - Understand the system design
- **[Development Setup](./development/setup.md)** - Environment configuration
- **[API Reference](./api/)** - Complete endpoint documentation
- **[Contributing Guidelines](./contributing/)** - Development process and standards

For user-focused documentation, see the [User Guide](/user-guide/).
