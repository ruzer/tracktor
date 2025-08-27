# Manual Deployment

Deploy Tracktor directly on a server without Docker containers. This method provides more control over the environment but requires more setup and maintenance.

## Server Requirements

### Hardware Requirements

- **CPU:** 1 core minimum (2+ cores recommended for better performance)
- **Memory:** 1GB RAM minimum (2GB+ recommended)
- **Storage:** 2GB minimum (includes OS, Node.js, and application data)
- **Network:** Stable internet connection for dependencies

### Software Requirements

- **Operating System:** Linux (Ubuntu 20.04+, CentOS 8+, or similar)
- **Node.js:** Version 18 or higher
- **npm:** Version 8 or higher (usually comes with Node.js)
- **Git:** For cloning the repository
- **Process Manager:** PM2 (recommended) or systemd

### Optional Components

- **Reverse Proxy:** nginx or Apache (recommended for production)
- **SSL Certificate:** Let's Encrypt or commercial certificate
- **Firewall:** ufw or iptables for security

## Installation Steps

### 1. Prepare the Server

Update the system and install dependencies:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential

# CentOS/RHEL
sudo yum update -y
sudo yum groupinstall -y "Development Tools"
sudo yum install -y curl git
```

### 2. Install Node.js

Install Node.js using NodeSource repository:

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18 or higher
npm --version   # Should be 8 or higher
```

Alternative using nvm (Node Version Manager):

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install and use Node.js 18
nvm install 18
nvm use 18
nvm alias default 18
```

### 3. Create Application User

Create a dedicated user for running Tracktor:

```bash
# Create user
sudo useradd -m -s /bin/bash tracktor

# Switch to tracktor user
sudo su - tracktor
```

### 4. Clone and Setup Application

```bash
# Clone the repository
git clone https://github.com/javedh-dev/tracktor.git
cd tracktor

# Install dependencies
npm install

# Build the application
npm run build
```

### 5. Configure Environment

Create production environment configuration:

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

Example production .env:

```properties
NODE_ENV=production
PORT=3000
DATABASE_PATH=/home/tracktor/tracktor/app/backend/tracktor.db
LOG_LEVEL=info
```

### 6. Database Setup

Initialize the database:

```bash
# Navigate to backend directory
cd app/backend

# Run migrations
npm run db:migrate

# Optional: Seed initial data
npm run db:seed

# Return to root directory
cd ../..
```

## Service Configuration

### Method 1: Using PM2 (Recommended)

Install and configure PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'tracktor',
    script: 'npm',
    args: 'start',
    cwd: '/home/tracktor/tracktor',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/home/tracktor/logs/err.log',
    out_file: '/home/tracktor/logs/out.log',
    log_file: '/home/tracktor/logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p /home/tracktor/logs

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the instructions provided by the command
```

### Method 2: Using systemd

Create a systemd service:

```bash
# Exit from tracktor user
exit

# Create systemd service file
sudo nano /etc/systemd/system/tracktor.service
```

Add the following content:

```ini
[Unit]
Description=Tracktor Vehicle Management Application
After=network.target

[Service]
Type=simple
User=tracktor
WorkingDirectory=/home/tracktor/tracktor
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=tracktor

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable tracktor

# Start service
sudo systemctl start tracktor

# Check status
sudo systemctl status tracktor
```

## Reverse Proxy Setup

### nginx Configuration

Install and configure nginx:

```bash
# Install nginx
sudo apt install -y nginx

# Create nginx configuration
sudo nano /etc/nginx/sites-available/tracktor
```

Add nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Optional: Serve static files directly
    location /static/ {
        alias /home/tracktor/tracktor/public/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/tracktor /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### SSL Configuration with Let's Encrypt

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Setup auto-renewal cron job
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Firewall Configuration

Configure firewall for security:

```bash
# Install ufw
sudo apt install -y ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Monitoring and Maintenance

### Log Management

```bash
# View application logs (PM2)
pm2 logs tracktor

# View system logs (systemd)
sudo journalctl -u tracktor -f

# Rotate logs
sudo logrotate -f /etc/logrotate.d/tracktor
```

### Performance Monitoring

```bash
# Monitor with PM2
pm2 monit

# System resource monitoring
htop
iostat -x 1
```

### Backup Strategy

```bash
# Create backup script
cat > /home/tracktor/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/tracktor/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
cp /home/tracktor/tracktor/app/backend/tracktor.db $BACKUP_DIR/tracktor_$DATE.db

# Backup configuration
cp /home/tracktor/tracktor/.env $BACKUP_DIR/env_$DATE.backup

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.backup" -mtime +7 -delete
EOF

chmod +x /home/tracktor/backup.sh

# Setup daily backup cron job
crontab -e
# Add: 0 2 * * * /home/tracktor/backup.sh
```

## Updates and Maintenance

### Application Updates

```bash
# Switch to tracktor user
sudo su - tracktor
cd tracktor

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart application
pm2 restart tracktor
# OR for systemd:
# sudo systemctl restart tracktor
```

### System Maintenance

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js (if needed)
nvm install node --reinstall-packages-from=node

# Clean up old packages
sudo apt autoremove -y
sudo apt autoclean
```

## Troubleshooting

### Common Issues

1. **Application won't start:**

   ```bash
   # Check logs
   pm2 logs tracktor
   # OR
   sudo journalctl -u tracktor -n 50

   # Check port availability
   sudo netstat -tlnp | grep :3000
   ```

2. **Database connection issues:**

   ```bash
   # Check database file permissions
   ls -la /home/tracktor/tracktor/app/backend/tracktor.db

   # Verify database integrity
   sqlite3 /home/tracktor/tracktor/app/backend/tracktor.db ".schema"
   ```

3. **nginx proxy issues:**

   ```bash
   # Test nginx configuration
   sudo nginx -t

   # Check nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

### Performance Issues

- **High memory usage:** Restart the application or increase server memory
- **Slow response times:** Check database queries and add indexes if needed
- **High CPU usage:** Monitor with `htop` and optimize code if necessary

## Security Best Practices

1. **Keep system updated** with latest security patches
2. **Use strong passwords** and SSH keys for server access
3. **Configure firewall** to allow only necessary ports
4. **Regular backups** of database and configuration
5. **Monitor logs** for suspicious activity
6. **Use HTTPS** with valid SSL certificates
7. **Limit user permissions** - run application as non-root user

## Next Steps

After successful manual deployment:

1. **Configure monitoring** and alerting systems
2. **Set up automated backups** and test restore procedures
3. **Plan update procedures** for application and system maintenance
4. **Review [Production Considerations](./production-considerations.md)** for optimization
5. **Configure [Environment Variables](./environment-variables.md)** for your specific setup

For additional help, see the [troubleshooting guide](/user-guide/troubleshooting/) or [developer documentation](../development/).
