# Installation

Learn how to install and run **Tracktor** on your system. This guide covers multiple installation methods to suit different deployment scenarios.

## Installation Methods

Choose the installation method that best fits your needs:

- **Docker Compose (Recommended):** Complete setup with all services
- **Docker:** Single container deployment
- **Bare Metal:** Direct installation on your system
- **Proxmox LXC:** Install LXC on proxmox host using [ProxmoxVE Helper Scripts](https://community-scripts.github.io/ProxmoxVE/)
- **Development Setup:** For contributors and developers

## System Requirements

Before installing Tracktor, ensure your system meets these minimum requirements which varies based on the installation type :

| Installation Type     | Hardware Requirements                                                        | Software Dependencies          |
| --------------------- | ---------------------------------------------------------------------------- | ------------------------------ |
| **Docker Compose**    | **-**                                                                        | - docker<br>- compose<br>- git |
| **Docker**            | **-**                                                                        | - docker<br>- git              |
| **Bare Metal**        | **- Memory:** 512MB RAM<br>**- Storage:** 1GB free space                     | - node.js<br>- git             |
| **Proxmox LXC**       | **- Memory:** 512MB RAM<br>**- Storage:** 1GB free space<br>**- CPU:** 1vCPU | - proxmox<br>- lxc             |
| **Development Setup** | [Setup Guide](/developer-guide/development/setup.html)                       | -                              |
> **Note:** For production deployments, it is recommended to have at least 1GB of RAM and 2GB of free disk space.

## Installation Steps

### Method 1: Docker Compose (Recommended)

Docker Compose provides the easiest way to deploy Tracktor with all services configured automatically.

#### Prerequisites

- Docker and Docker Compose installed on your system
- At least 1GB free disk space

#### Quick Start Steps

**Step 1:** Download or create a `docker-compose.yml` file in your directory:
```bash
# Downlaod Docker compose file
curl -o docker-compose.yml https://raw.githubusercontent.com/javedh-dev/tracktor/main/docker/docker-compose.yml
```
```yaml
services:
  app:
    image: ghcr.io/javedh-dev/tracktor:latest
    container_name: tracktor-app
    restart: always
    env_file: .env
    ports:
      - "3333:3000"
    volumes:
      - tracktor-app-data:/data/tracktor.db

volumes:
  tracktor-app-data: null
```

**Step 2:** Download the example `.env` file from github

```bash
curl -o .env https://raw.githubusercontent.com/javedh-dev/tracktor/main/.env.example
```

OR create the `.env` file and add environement variables as per your requirement.

```bash
touch .env
```
You can check the available environment variables in the [Configuration Reference](../configuration/environment-variables.md).
**Step 3:** Start the application using Docker Compose:

```bash
docker-compose up -d
```
**Step 4:** Access the application:
Open `http://localhost:3333` in your browser
> **Note:** The `-d` flag runs the containers in detached mode.


### Method 2: Docker Installation

For a simpler Docker setup without Docker Compose.

#### Prerequisites

- Docker installed on your system

#### Steps

**Step 1:** Pull the Tracktor Docker image -

   ```bash
   docker pull ghcr.io/javedh-dev/tracktor:latest
   ```

**Step 2:** Create a persistent volume for data storage -

   ```bash
   docker volume create tracktor-data
   ```

**Step 3:** (Optional) Create a `.env` file for environment variables -

   ```bash
   touch .env
   ```

   Add any necessary environment variables as per your requirement. You can check the available environment variables in the [Configuration Reference](../configuration/environment-variables.md).

**Step 3:** Run the container -

   ```bash
    docker run -d --name tracktor -p 3000:3000 -v tracktor-data:/app/data --env-file .env ghcr.io/javedh-dev/tracktor:latest
   ```

**Step 4:** Access the application -
   Open `http://localhost:3000` in your browser


> **Note:** The `-v tracktor-data:/app/data` flag creates a persistent volume for your data.

### Method 3: Bare Metal(Manual) Installation

Install Tracktor directly on your system for more control over the deployment and code transparency.

#### Prerequisites

- Node.js (v18 or higher) installed
- npm (v8 or higher) installed
- Git installed

#### Installation Steps

**Step 1:** Clone the repository and checkout main(stable) branch and navigate into it -

   ```bash
   git clone https://github.com/javedh-dev/tracktor.git
   git checkout main
   cd tracktor
   ```

**Step 2:** Install dependencies -

   ```bash
   npm install
   ```

**Step 3:** (Optional) Create a `.env` file for environment variables -

   ```bash
   touch .env
   ```



**Step 3:** Set up environment and database -

   ```bash
   npm run setup
   ```
   This creates necessary configuration files and initializes the database.
   Add any necessary environment variables as per your requirement. You can check the available environment variables in the [Configuration Reference](../configuration/environment-variables.md).

   > **Note:** Set the `NODE_ENV` variable to `production` in the `.env` file for production deployments.

**Step 4:** Build the application -

   ```bash
   npm run build
   ```

5. **Start the application:**

   ```bash
   npm run start
   ```

6. **Access the application:**
   Open `http://localhost:3000` in your browser


### Method 4: Proxmox LXC Installation

For installing Tracktor in a lightweight LXC container on a Proxmox host.

#### Prerequisites
- Proxmox VE installed and running
- ProxmoxVE Helper Scripts (see [ProxmoxVE Helper Scripts](https://community-scripts.github.io/ProxmoxVE/))
- At least 1GB free disk space

#### Installation Steps
**Step 1:** Create a new LXC container using the ProxmoxVE Helper Scripts by running the following command on your Proxmox host.
> Reference : [ProxmoxVE Helper Scripts - Tracktor LXC](https://community-scripts.github.io/ProxmoxVE/ct/tracktor/)

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVED/main/ct/tracktor.sh)"
```

### Method 5: Development Setup

For contributors and developers who want to set up a development environment.
> Please refer to the [Development Setup Guide](/developer-guide/development/setup.html) for detailed instructions.

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
- Review the installation steps to ensure all commands were executed correctly
- Check for error messages in the terminal or browser console
- Ensure all prerequisites are met (e.g., Docker, Node.js versions)
- Check out the [troubleshooting guide](../support/common-issues.md) for common problems and solutions

#### Getting Help

If issues persist:

- Check the [troubleshooting guide](../support/common-issues.md)
- Review the [FAQ](../support/faq.md)
- See the [developer guide](/developer-guide/) for technical details
- Check and raise a new issue if it doesn't exist [GitHub issues](https://github.com/javedh-dev/tracktor/issues)

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
8. **[Data Management](../support/data-management.md)** - Learn about backup and data safety

The application is now ready for initial configuration and use.
