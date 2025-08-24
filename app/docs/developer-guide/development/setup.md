# Development Environment Setup

This guide provides comprehensive instructions for setting up a local development environment for the Tracktor application. Follow these steps to get the application running on your machine.

## Prerequisites

### Required Software

Before starting, ensure you have the following software installed:

#### Node.js and npm

- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm**: Version 9.x or higher (comes with Node.js)

**Installation:**

```bash
# Check current versions
node --version
npm --version

# Install Node.js (if needed)
# Visit https://nodejs.org/ for official installers
# Or use a version manager like nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

#### Git

- **Git**: Version 2.x or higher for version control

**Installation:**

```bash
# Check version
git --version

# Install Git (if needed)
# macOS: git is included with Xcode Command Line Tools
xcode-select --install

# Linux (Ubuntu/Debian):
sudo apt update && sudo apt install git

# Windows: Download from https://git-scm.com/
```

### Optional but Recommended

#### Docker (for containerized development)

- **Docker**: Latest stable version
- **Docker Compose**: Version 2.x or higher

**Installation:**

```bash
# Check versions
docker --version
docker compose version

# Install Docker Desktop from https://www.docker.com/products/docker-desktop/
```

#### IDE/Editor

- **VS Code** (recommended) with extensions:
  - Svelte for VS Code
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

## Project Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd tracktor

# Or if you're working with a fork
git clone <your-fork-url>
cd tracktor
git remote add upstream <original-repository-url>
```

### 2. Install Dependencies

The project uses npm workspaces to manage multiple packages:

```bash
# Install all dependencies for all workspaces
npm install

# This installs dependencies for:
# - Root project (build tools, scripts)
# - Backend (app/backend)
# - Frontend (app/frontend)
# - Documentation (app/docs)
```

### 3. Environment Configuration

#### Automated Setup (Recommended)

```bash
# Run the setup script
npm run setup
```

This script will:

- Copy `.env.example` to `.env`
- Create symbolic links for environment variables
- Set up the development environment

#### Manual Setup

If the automated setup doesn't work:

```bash
# Copy environment template
cp .env.example .env

# Create frontend environment link
cd app/frontend
ln -s ../../.env .env
cd ../..
```

#### Configure Environment Variables

Edit the `.env` file to match your local setup:

```bash
# Open in your preferred editor
nano .env
# or
code .env
```

**Key variables to review:**

```bash
# Server configuration
SERVER_HOST=0.0.0.0
SERVER_PORT=3000
CLIENT_PORT=5173

# API configuration
PUBLIC_API_BASE_URL=http://localhost:3000

# Database
DATABASE_PATH=./tracktor.db

# Development features
PUBLIC_DEMO_MODE=false
LOG_LEVEL=info
```

### 4. Database Setup

Initialize the database with migrations and seed data:

```bash
# Run database migrations
npm run db:migrate

# Seed with demo data (optional)
npm run db:seed

# Check database status
npm run db:status
```

## Development Workflow

### Starting the Development Servers

#### Option 1: Start Both Servers (Recommended)

```bash
# Start both frontend and backend in development mode
npm run dev
```

This command uses `concurrently` to run:

- Backend server on `http://localhost:3000`
- Frontend dev server on `http://localhost:5173`

#### Option 2: Start Servers Individually

```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend
```

### Accessing the Application

Once both servers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api-docs (if Swagger is configured)

### Development Features

#### Hot Module Replacement (HMR)

- **Frontend**: Vite provides instant updates for Svelte components and styles
- **Backend**: tsx with nodemon provides automatic server restart on file changes

#### Type Checking

```bash
# Check TypeScript types across all workspaces
npm run check

# Check specific workspace
npm run check --workspace=frontend
npm run check --workspace=backend
```

#### Code Formatting and Linting

```bash
# Format code across all workspaces
npm run format

# Lint code across all workspaces
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

## IDE Configuration

### VS Code Setup

#### Recommended Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "svelte.svelte-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

#### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.svelte": "svelte"
  },
  "emmet.includeLanguages": {
    "svelte": "html"
  }
}
```

#### Debug Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/app/backend/index.ts",
      "runtimeArgs": ["--loader", "tsx/esm"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Other IDEs

#### WebStorm/IntelliJ

- Enable TypeScript service
- Install Svelte plugin
- Configure Prettier and ESLint
- Set up run configurations for npm scripts

#### Vim/Neovim

- Install TypeScript language server
- Configure Svelte syntax highlighting
- Set up Prettier and ESLint integration

## Debugging Setup

### Backend Debugging

#### Using VS Code Debugger

1. Set breakpoints in TypeScript files
2. Use the "Debug Backend" configuration
3. Start debugging with F5

#### Using Node.js Inspector

```bash
# Start backend with inspector
node --inspect --loader tsx/esm app/backend/index.ts

# Connect with Chrome DevTools
# Open chrome://inspect in Chrome browser
```

#### Console Debugging

```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev:backend

# Enable SQL query logging
SHOW_SQL=true npm run dev:backend
```

### Frontend Debugging

#### Browser DevTools

- Use Chrome/Firefox DevTools for debugging
- Svelte DevTools extension for component inspection
- Network tab for API request debugging

#### Console Logging

```typescript
// Add debug logging in Svelte components
console.log("Component state:", $store);
console.debug("API response:", response);
```

### Database Debugging

#### SQLite Browser

Install a SQLite browser for database inspection:

```bash
# Install DB Browser for SQLite
# macOS: brew install --cask db-browser-for-sqlite
# Ubuntu: sudo apt install sqlitebrowser
# Windows: Download from https://sqlitebrowser.org/
```

#### Command Line Access

```bash
# Access database directly
sqlite3 app/backend/tracktor.db

# Common queries
.tables
.schema vehicles
SELECT * FROM vehicles LIMIT 5;
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :5173

# Kill process
kill -9 <PID>

# Or change ports in .env
SERVER_PORT=3001
CLIENT_PORT=5174
```

#### Permission Errors

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Database Issues

```bash
# Reset database
rm app/backend/tracktor.db
npm run db:migrate
npm run db:seed

# Check database permissions
ls -la app/backend/tracktor.db
chmod 664 app/backend/tracktor.db
```

#### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf app/frontend/.svelte-kit
rm -rf app/backend/dist

# Rebuild
npm run build
```

#### CORS Errors

```bash
# Update CORS origins in .env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000

# Restart backend server
npm run dev:backend
```

### Environment Validation

#### Check Environment Loading

```bash
# Backend environment check
cd app/backend
node -e "console.log(process.env)"

# Frontend environment check
cd app/frontend
npm run dev -- --debug
```

#### Verify API Connectivity

```bash
# Test API endpoint
curl http://localhost:3000/api/health

# Test with authentication
curl -H "X-User-PIN: your-pin" http://localhost:3000/api/vehicles
```

### Performance Issues

#### Slow Development Server

```bash
# Clear Vite cache
rm -rf app/frontend/.vite

# Disable source maps (if needed)
# Add to vite.config.ts:
# build: { sourcemap: false }
```

#### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

## Development Best Practices

### Code Organization

- Follow the established project structure
- Use TypeScript for all new code
- Implement proper error handling
- Write meaningful commit messages

### Testing

```bash
# Run tests (when implemented)
npm test

# Run specific test suites
npm test -- --grep "Vehicle"
```

### Database Management

- Always use migrations for schema changes
- Test migrations in development before production
- Keep seeders up to date with schema changes

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make commits with clear messages
git commit -m "feat: add vehicle search functionality"

# Push and create pull request
git push origin feature/new-feature
```

This setup guide should get you up and running with the Tracktor development environment. If you encounter any issues not covered here, check the troubleshooting section or create an issue in the project repository.
