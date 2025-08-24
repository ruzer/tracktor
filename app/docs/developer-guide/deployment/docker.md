# Docker Deployment

Deploy Tracktor using Docker containers for a consistent and reliable production environment.

## Prerequisites

Before deploying with Docker, ensure you have:

### Required Software

- **Docker** installed on your server ([Installation Guide](https://docs.docker.com/get-docker/))
- **Docker Compose** (optional but recommended)
- **Git** for cloning the repository

### System Requirements

- **CPU:** 1 core minimum (2+ cores recommended)
- **Memory:** 512MB minimum (1GB+ recommended)
- **Storage:** 1GB minimum for application and data
- **Network:** Internet access for pulling Docker images

### Server Access

- SSH access to your deployment server
- Sudo privileges for Docker commands
- Open ports: 80 (HTTP) and/or 443 (HTTPS)

## Deployment Steps

### Method 1: Using Docker Build (Recommended)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/javedh-dev/tracktor.git
   cd tracktor
   ```

2. **Build the Docker image:**

   ```bash
   docker build -t tracktor .
   ```

3. **Run the Docker container:**

   ```bash
   docker run -p 3000:3000 -d --name tracktor-app tracktor
   ```

4. **Verify deployment:**
   ```bash
   docker ps
   curl http://localhost:3000
   ```

### Method 2: Using Docker Compose

1. **Create docker-compose.yml:**

   ```yaml
   version: "3.8"
   services:
     tracktor:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       volumes:
         - ./data:/app/data
       restart: unless-stopped
   ```

2. **Deploy with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

3. **Check status:**
   ```bash
   docker-compose ps
   docker-compose logs tracktor
   ```

### Method 3: Using Pre-built Image (Future)

```bash
# When available on Docker Hub
docker run -p 3000:3000 -d tracktor/tracktor:latest
```

## Configuration

### Environment Variables

Configure Tracktor using environment variables:

```bash
docker run -p 3000:3000 -d \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DATABASE_PATH=/app/data/tracktor.db \
  --name tracktor-app \
  tracktor
```

### Volume Mounting

Mount volumes to persist data:

```bash
docker run -p 3000:3000 -d \
  -v /host/path/data:/app/data \
  -v /host/path/logs:/app/logs \
  --name tracktor-app \
  tracktor
```

### Docker Compose Configuration

Complete docker-compose.yml example:

```yaml
version: "3.8"
services:
  tracktor:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_PATH=/app/data/tracktor.db
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - tracktor
    restart: unless-stopped
```

## Production Considerations

### Reverse Proxy Setup

Use nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### SSL/HTTPS Configuration

For HTTPS with Let's Encrypt:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Resource Limits

Set resource limits for production:

```yaml
services:
  tracktor:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M
```

## Management Commands

### Container Management

```bash
# Start container
docker start tracktor-app

# Stop container
docker stop tracktor-app

# Restart container
docker restart tracktor-app

# View logs
docker logs tracktor-app

# Execute commands in container
docker exec -it tracktor-app /bin/sh
```

### Docker Compose Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Update and restart
docker-compose pull
docker-compose up -d
```

### Backup and Restore

```bash
# Backup data volume
docker run --rm -v tracktor_data:/data -v $(pwd):/backup alpine tar czf /backup/tracktor-backup.tar.gz -C /data .

# Restore data volume
docker run --rm -v tracktor_data:/data -v $(pwd):/backup alpine tar xzf /backup/tracktor-backup.tar.gz -C /data
```

## Monitoring and Logs

### Health Checks

Monitor container health:

```bash
# Check container status
docker ps

# View health check status
docker inspect tracktor-app | grep Health -A 10

# Manual health check
curl http://localhost:3000/health
```

### Log Management

```bash
# View recent logs
docker logs --tail 100 tracktor-app

# Follow logs in real-time
docker logs -f tracktor-app

# Configure log rotation
docker run -d --log-driver=json-file --log-opt max-size=10m --log-opt max-file=3 tracktor
```

## Troubleshooting

### Common Issues

1. **Container won't start:**

   ```bash
   docker logs tracktor-app
   # Check for port conflicts, permission issues
   ```

2. **Database issues:**

   ```bash
   # Check volume mounts and permissions
   docker exec -it tracktor-app ls -la /app/data
   ```

3. **Network connectivity:**
   ```bash
   # Test internal connectivity
   docker exec -it tracktor-app curl localhost:3000
   ```

### Performance Optimization

- **Use multi-stage builds** to reduce image size
- **Configure proper resource limits**
- **Use volume mounts** for persistent data
- **Implement health checks** for reliability
- **Set up log rotation** to manage disk space

## Security Best Practices

1. **Run as non-root user** in container
2. **Use specific image tags** instead of 'latest'
3. **Scan images** for vulnerabilities
4. **Limit container capabilities**
5. **Use secrets management** for sensitive data
6. **Keep Docker updated** to latest version

## Next Steps

After successful Docker deployment:

1. **Configure [Environment Variables](./environment-variables.md)** for your setup
2. **Review [Production Considerations](./production-considerations.md)** for optimization
3. **Set up monitoring and alerting** for your deployment
4. **Plan backup and disaster recovery** procedures
5. **Configure SSL/HTTPS** for secure access

For additional help, see the [troubleshooting guide](/user-guide/troubleshooting/) or [developer documentation](../development/).
