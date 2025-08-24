# Installation

Learn how to install and run Tracktor on your system. This guide covers multiple installation methods to suit different deployment scenarios.

## System Requirements

Before installing Tracktor, ensure your system meets these minimum requirements:

### Hardware Requirements

- **Memory:** Minimum 512MB RAM (1GB recommended)
- **Storage:** At least 500MB free space (for application and data)
- **Network:** Internet connection for initial setup and updates

### Software Requirements

- **Node.js:** Version 18 or higher (LTS version recommended)
- **npm:** Version 8 or higher (usually comes with Node.js)
- **Git:** For cloning the repository
- **Web Browser:** Modern browser (Chrome, Firefox, Safari, Edge)

### Optional Requirements

- **Docker:** Version 20.10 or higher (for containerized deployment)
- **Docker Compose:** Version 2.0 or higher (for multi-container setup)

## Installation Methods

Choose the installation method that best fits your needs:

- **Docker Compose (Recommended):** Complete setup with all services
- **Docker:** Single container deployment
- **Manual Installation:** Direct installation on your system
- **Development Setup:** For contributors and developers

<PlaceholderBlock 
  id="installation-methods-screenshot"
  type="screenshot" 
  message="Add screenshot showing the different installation options and their outcomes"
  priority="medium"
  location="/user-guide/getting-started/installation.md"
  instructions="Capture screenshots of successful installations for each method, showing the final running application"
/>

### Method 1: Docker Compose (Recommended)

Docker Compose provides the easiest way to deploy Tracktor with all services configured automatically.

#### Prerequisites

- Docker and Docker Compose installed on your system
- At least 1GB free disk space

#### Quick Start Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/javedh-dev/tracktor.git
   cd tracktor
   ```

2. **Start all services:**

   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Main Application: `http://localhost:3000`
   - Documentation: `http://localhost:5173`

<PlaceholderBlock 
  id="docker-compose-success-screenshot"
  type="screenshot" 
  message="Add screenshot of successful Docker Compose startup showing running containers and accessible application"
  priority="high"
  location="/user-guide/getting-started/installation.md"
  instructions="Show docker-compose ps output and browser screenshot of running application at localhost:3000"
/>

#### What Gets Installed

- Tracktor backend API server
- Tracktor frontend application
- SQLite database (persistent storage)
- Documentation server

### Method 2: Docker Installation

For a simpler Docker setup without Docker Compose.

#### Prerequisites

- Docker installed on your system

#### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/javedh-dev/tracktor.git
   cd tracktor
   ```

2. **Build the Docker image:**

   ```bash
   docker build -t tracktor .
   ```

3. **Run the container:**

   ```bash
   docker run -p 3000:3000 -v tracktor-data:/app/data -d tracktor
   ```

4. **Access the application:**
   Open `http://localhost:3000` in your browser

<PlaceholderBlock 
  id="docker-installation-config"
  type="configuration" 
  message="Add environment-specific Docker configuration examples for different deployment scenarios"
  priority="medium"
  location="/user-guide/getting-started/installation.md"
  instructions="Include examples for production, development, and custom port configurations"
/>

> **Note:** The `-v tracktor-data:/app/data` flag creates a persistent volume for your data.

### Method 3: Manual Installation

Install Tracktor directly on your system for more control over the deployment.

#### Prerequisites

- Node.js (v18 or higher) installed
- npm (v8 or higher) installed
- Git installed

#### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/javedh-dev/tracktor.git
   cd tracktor
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment:**

   ```bash
   npm run setup
   ```

   This creates necessary configuration files and initializes the database.

4. **Build the application:**

   ```bash
   npm run build
   ```

5. **Start the application:**

   ```bash
   npm start
   ```

6. **Access the application:**
   Open `http://localhost:3000` in your browser

#### Manual Setup Details

The setup process will:

- Create environment configuration files
- Initialize the SQLite database
- Set up default application settings
- Create necessary directories for data storage

### Method 4: Development Setup

For developers who want to contribute or modify Tracktor.

#### Prerequisites

- All manual installation prerequisites
- Code editor (VS Code recommended)

#### Development Steps

1. **Clone and install:**

   ```bash
   git clone https://github.com/javedh-dev/tracktor.git
   cd tracktor
   npm install
   ```

2. **Set up development environment:**

   ```bash
   npm run setup
   ```

3. **Start development servers:**

   ```bash
   npm run dev
   ```

4. **Access development servers:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`
   - Documentation: `http://localhost:5174`

For more details, see the [Developer Guide](/developer-guide/development/setup.md).

## Post-Installation Verification

After installation, verify that Tracktor is running correctly:

### Basic Verification

1. **Open your web browser** and navigate to `http://localhost:3000`
2. **Check the login page** - You should see the Tracktor login interface with:
   - Tracktor logo and branding
   - PIN input field
   - Clean, responsive design
3. **Verify page loading** - The page should load completely without errors
4. **Test responsiveness** - Resize your browser window to ensure mobile compatibility

### Advanced Verification

For Docker installations, you can also verify the containers are running:

```bash
# Check running containers
docker ps

# Check application logs
docker logs tracktor

# For Docker Compose
docker-compose ps
docker-compose logs
```

### Troubleshooting Installation Issues

If you encounter problems:

#### Common Issues

**Port Already in Use:**

```bash
# Check what's using port 3000
lsof -i :3000

# Use a different port
docker run -p 3001:3000 tracktor
```

**Permission Errors:**

```bash
# On Linux/macOS, you might need sudo for Docker
sudo docker-compose up -d

# Or add your user to the docker group
sudo usermod -aG docker $USER
```

**Node.js Version Issues:**

```bash
# Check your Node.js version
node --version

# Update Node.js if needed (using nvm)
nvm install 18
nvm use 18
```

#### Getting Help

If issues persist:

- Check the [troubleshooting guide](../troubleshooting/common-issues.md)
- Review the [FAQ](../troubleshooting/faq.md)
- See the [developer guide](/developer-guide/) for technical details
- Check the [GitHub issues](https://github.com/javedh-dev/tracktor/issues)

## Next Steps

Once Tracktor is installed and running successfully:

### Immediate Next Steps

1. **[Complete the first setup](./first-setup.md)** - Configure your PIN and initial settings
2. **[Learn basic navigation](./basic-navigation.md)** - Understand the interface and features
3. **[Add your first vehicle](../tutorials/adding-first-vehicle.md)** - Start tracking your first vehicle

### Explore Features

4. **[Vehicle Management](../features/vehicle-management.md)** - Learn about managing multiple vehicles
5. **[Fuel Tracking](../features/fuel-tracking.md)** - Start logging fuel consumption
6. **[Maintenance Logs](../features/maintenance-logs.md)** - Record service history

### Advanced Usage

7. **[Dashboard Overview](../features/)** - Understand analytics and reporting
8. **[Data Management](../troubleshooting/common-issues.md#data-backup)** - Learn about backup and data safety

## Installation Summary

You've successfully installed Tracktor! Here's what you accomplished:

- ✅ Installed Tracktor using your chosen method
- ✅ Verified the application is running correctly
- ✅ Confirmed access to the login interface

The application is now ready for initial configuration and use.
