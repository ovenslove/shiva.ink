#!/bin/bash
###
 # @Author: ovenslove 1905997838@qq.com
 # @Date: 2026-03-06 15:30:05
 # @LastEditors: ovenslove 1905997838@qq.com
 # @LastEditTime: 2026-03-06 15:30:06
 # @FilePath: /shiva.ink/deploy.sh
 # @Description: 
 # 
 # Copyright (c) 2026 by Yatsen, All Rights Reserved. 
### 

# Shiva.ink - One-Click Deployment Script
# Usage: ./deploy.sh [environment] (default: prod)

set -e

# Configuration
APP_NAME="shiva-ink"
ENV_FILE=".env"
DOCKER_COMPOSE_FILE="docker-compose.yml"
IMAGE_NAME="shiva-ink:latest"
BACKUP_DIR="./backups"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Deployment for Shiva.ink...${NC}"

# Check for .env file
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Warning: .env file not found. Copying from .env.example...${NC}"
    cp .env.example .env
fi

# Load environment variables
source .env

# Backup previous deployment (optional, if using bind mounts or persistent data)
mkdir -p "$BACKUP_DIR"
if [ -d "dist" ]; then
    echo -e "${GREEN}Backing up previous build...${NC}"
    tar -czf "$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).tar.gz" dist
fi

# Build Docker Image
echo -e "${GREEN}Building Docker Image...${NC}"
docker build -t "$IMAGE_NAME" .

# Stop existing containers
echo -e "${GREEN}Stopping existing containers...${NC}"
docker-compose down || true

# Start new containers
echo -e "${GREEN}Starting application...${NC}"
docker-compose up -d

# Health Check
echo -e "${GREEN}Running Health Check...${NC}"
sleep 5 # Wait for Nginx to start
if curl -s -f "http://localhost:${APP_PORT:-8080}/health" > /dev/null; then
    echo -e "${GREEN}Deployment Successful! App is running on port ${APP_PORT:-8080}.${NC}"
else
    echo -e "${RED}Deployment Failed! Health check endpoint is unreachable.${NC}"
    echo -e "${YELLOW}Check docker logs using: docker logs shiva-ink-app${NC}"
    # Rollback logic could be added here (e.g., restore backup or restart previous image)
    exit 1
fi

echo -e "${GREEN}Done.${NC}"
