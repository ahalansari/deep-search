# 🐳 Docker Deployment Guide for DeepSearch

This guide covers deploying DeepSearch using Docker Compose and Portainer.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Portainer (for Portainer deployment)
- At least 2GB RAM
- 10GB free disk space

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone <your-repo-url>
cd searcher

# Build and run with Docker Compose
docker-compose up -d
```

### Production Deployment
```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up -d
```

### Portainer Deployment
1. Copy `deploy-portainer.yml` content
2. Create new stack in Portainer
3. Paste the configuration
4. Set environment variables
5. Deploy the stack

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | 3000 | Next.js application port |
| `APP_URL` | http://localhost:3000 | Public application URL |
| `APP_DOMAIN` | deepsearch.local | Domain for reverse proxy |
| `SEARXNG_PORT` | 8080 | SearXNG port |
| `SEARXNG_BASE_URL` | http://localhost:8080/ | SearXNG base URL |
| `SEARXNG_SECRET` | (required) | Secret key for SearXNG |
| `SEARXNG_DOMAIN` | search.local | SearXNG domain |
| `AI_URL` | http://localhost:1234 | External AI API URL (LM Studio, Ollama, etc.) |
| `REDIS_MAX_MEMORY` | 256mb | Redis memory limit |
| `HTTP_PORT` | 80 | HTTP port for nginx |
| `HTTPS_PORT` | 443 | HTTPS port for nginx |

### Portainer Environment Variables
```env
# Required
SEARXNG_SECRET=your-secret-key-here
AI_URL=http://host.docker.internal:1234

# Optional
APP_PORT=3000
APP_URL=https://deepsearch.yourdomain.com
SEARXNG_PORT=8080
REDIS_MAX_MEMORY=512mb
UPDATE_INTERVAL=3600
```

## 📁 Directory Structure

```
searcher/
├── docker-compose.yml          # Development compose
├── docker-compose.prod.yml     # Production compose  
├── deploy-portainer.yml        # Portainer stack file
├── Dockerfile                  # Next.js app image
├── .dockerignore              # Docker ignore file
├── .env.example               # Environment template
├── .env.production            # Production environment
├── searxng/
│   ├── docker-compose.yml     # Original SearXNG config
│   └── searxng.settings.yml   # SearXNG settings
└── monitoring/                # Optional monitoring configs
```

## 🏗️ Services Overview

### Core Services

#### 1. DeepSearch App (`deepsearch-app`)
- **Image**: Built from Dockerfile
- **Port**: 3000
- **Purpose**: Next.js application with AI search
- **Dependencies**: searxng, redis

#### 2. SearXNG (`searxng`) ✅ **Integrated from existing setup**
- **Image**: searxng/searxng:latest
- **Port**: 8080
- **Purpose**: Privacy-focused search engine
- **Config**: Uses existing `searxng/searxng.settings.yml`

#### 3. Redis (`redis`)
- **Image**: redis:7-alpine
- **Purpose**: Caching and session storage
- **Memory**: Configurable (default 256MB)

### Optional Services

### External Dependencies

#### AI Model Server
- **Purpose**: Provides AI completions (LM Studio, Ollama, OpenAI-compatible API)
- **URL**: Configured via `AI_URL` environment variable
- **Default**: `http://localhost:1234` (or `http://host.docker.internal:1234` in Docker)

### Optional Services

#### 4. Nginx Reverse Proxy (`nginx`)
- **Purpose**: SSL termination, load balancing
- **Ports**: 80, 443

#### 5. Watchtower (`watchtower`)
- **Purpose**: Automatic container updates
- **Configurable**: Update interval

## 🔧 Build & Deployment

### Building the Application
```bash
# Build the Next.js application image
docker build -t deepsearch:latest .

# Or build with compose
docker-compose build
```

### Development Deployment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment
```bash
# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Scale services (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale deepsearch-app=2
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **App Health**: `http://localhost:3000/api/health`
- **SearXNG**: `http://localhost:8080/search?q=test&format=json`
- **Redis**: `redis-cli ping`

### Service Status
```bash
# Check all services
docker-compose ps

# Check specific service logs
docker-compose logs deepsearch-app
docker-compose logs searxng
docker-compose logs redis
```

## 🔐 Security Configuration

### SearXNG Security
```yaml
# In searxng.settings.yml
server:
  secret_key: "your-secure-secret-key"
  limiter: true
  
search:
  safe_search: 1
```

### Environment Security
```bash
# Generate secure secrets
openssl rand -hex 32  # For SEARXNG_SECRET
openssl rand -hex 16  # For other secrets
```

## 🚨 Troubleshooting

### Common Issues

#### 1. SearXNG Not Starting
```bash
# Check SearXNG logs
docker-compose logs searxng

# Verify settings file
docker-compose exec searxng cat /etc/searxng/settings.yml
```

#### 2. App Cannot Connect to SearXNG
```bash
# Test internal networking
docker-compose exec deepsearch-app curl http://searxng:8080/search?q=test&format=json
```

#### 3. App Cannot Connect to AI Service
```bash
# Test AI connection from container (use host.docker.internal for external AI)
docker-compose exec deepsearch-app curl http://host.docker.internal:1234/v1/models

# Or if AI is on a different host
docker-compose exec deepsearch-app curl http://your-ai-server:1234/v1/models
```

#### 4. Redis Connection Issues
```bash
# Test Redis connection
docker-compose exec redis redis-cli ping
```

#### 5. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :8080
```

### Logs and Debugging
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f deepsearch-app
docker-compose logs -f searxng

# Enter container for debugging
docker-compose exec deepsearch-app sh
docker-compose exec searxng sh
```

## 🔄 Updates and Maintenance

### Manual Updates
```bash
# Pull latest images
docker-compose pull

# Restart with new images
docker-compose up -d
```

### Automatic Updates (with Watchtower)
Watchtower automatically updates containers when new images are available.

### Backup Important Data
```bash
# Backup SearXNG data
docker run --rm -v deepsearch-searxng-data:/source -v $(pwd):/backup alpine tar czf /backup/searxng-backup.tar.gz -C /source .

# Backup Redis data
docker run --rm -v deepsearch-redis-data:/source -v $(pwd):/backup alpine tar czf /backup/redis-backup.tar.gz -C /source .
```

## 🌐 Production Considerations

### SSL/TLS Configuration
- Use Let's Encrypt with nginx
- Configure proper certificates
- Set up automatic renewal

### Performance Tuning
- Adjust memory limits based on usage
- Configure Redis properly for your load
- Monitor resource usage

### Scaling
```bash
# Scale the application
docker-compose up -d --scale deepsearch-app=3

# Use load balancer for multiple instances
```

## 📞 Support

For issues related to:
- **DeepSearch App**: Check application logs
- **SearXNG**: Refer to [SearXNG documentation](https://docs.searxng.org/)
- **Docker**: Check Docker daemon and compose logs
- **Portainer**: Refer to Portainer documentation

## 🎯 Next Steps

1. Deploy the stack using your preferred method
2. Configure environment variables for your setup
3. Set up monitoring and alerting
4. Configure SSL certificates for production
5. Set up automated backups