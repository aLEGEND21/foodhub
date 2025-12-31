#!/bin/bash

# Deploy script for FoodHub
# This script handles deployment with git-based rollback capability using Docker

set -e  # Exit on any error

# Configuration
APP_DIR="$HOME/FoodHub"
LAST_GOOD_COMMIT_FILE="$APP_DIR/.last_good_commit"
CONTAINER_NAME="foodhub"
IMAGE_NAME="foodhub"
COMPOSE_FILE="$APP_DIR/docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Navigate to app directory
cd "$APP_DIR" || {
    print_error "Failed to navigate to $APP_DIR"
    exit 1
}

print_message "Starting deployment process..."

# Step 1: Store current commit hash before deployment (for rollback)
CURRENT_COMMIT=$(git rev-parse HEAD)
print_message "Current commit: $(git rev-parse --short HEAD)"
print_message "Storing current commit for potential rollback..."

# Step 2: Pull latest code
print_message "Pulling latest code from repository..."
git fetch origin
git reset --hard origin/main || {
    print_error "Failed to pull latest code"
    exit 1
}
NEW_COMMIT=$(git rev-parse HEAD)
print_message "Code updated to commit: $(git rev-parse --short HEAD)"

# Determine docker compose command (try new syntax first, fallback to old)
if docker compose version > /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Step 3: Stop and remove existing container if it exists
print_message "Stopping existing container..."
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    $DOCKER_COMPOSE -f "$COMPOSE_FILE" down || {
        print_warning "Failed to stop existing container (may not be running)"
    }
    print_message "Existing container stopped"
else
    print_message "No existing container found"
fi

# Step 4: Remove old Docker image to force rebuild
print_message "Removing old Docker image..."
docker rmi "$IMAGE_NAME" 2>/dev/null || {
    print_warning "No existing image to remove (first deployment?)"
}

# Step 5: Build new Docker image
print_message "Building Docker image..."
$DOCKER_COMPOSE -f "$COMPOSE_FILE" build || {
    print_error "Docker build failed"
    exit 1
}
print_message "Docker image built successfully"

# Step 6: Start the container
print_message "Starting Docker container..."
$DOCKER_COMPOSE -f "$COMPOSE_FILE" up -d || {
    print_error "Failed to start Docker container"
    exit 1
}
print_message "Docker container started successfully"

# Step 7: Wait a moment and verify container is running
sleep 3
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    print_error "Container failed to start"
    $DOCKER_COMPOSE -f "$COMPOSE_FILE" logs
    exit 1
fi

# Step 8: Health check - verify the app is responding
print_message "Performing health check..."
sleep 5
if curl -f http://localhost:2005 > /dev/null 2>&1; then
    print_message "Health check passed - application is responding"
else
    print_warning "Health check failed - application may not be ready yet"
fi

# Step 9: Save this commit as the last good commit (only after successful deployment)
echo "$NEW_COMMIT" > "$LAST_GOOD_COMMIT_FILE"
print_message "✅ Deployment completed successfully!"
print_message "Last good commit saved: $(git rev-parse --short HEAD)"
