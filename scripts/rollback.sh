#!/bin/bash

# Rollback script for FoodHub
# This script restores the previous successful deployment from git commit using Docker

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

print_message "Starting rollback process..."

# Step 1: Get the last good commit hash
if [ ! -f "$LAST_GOOD_COMMIT_FILE" ]; then
    print_error "Last good commit file not found: $LAST_GOOD_COMMIT_FILE"
    print_message "Attempting to find previous commit from git history..."
    
    # Try to get the previous commit from git reflog
    PREVIOUS_COMMIT=$(git reflog | grep -E "checkout|reset|pull" | head -n 2 | tail -n 1 | awk '{print $1}')
    
    if [ -z "$PREVIOUS_COMMIT" ]; then
        # Fallback: get the commit before HEAD
        PREVIOUS_COMMIT=$(git rev-parse HEAD~1 2>/dev/null || echo "")
    fi
    
    if [ -z "$PREVIOUS_COMMIT" ]; then
        print_error "Could not determine previous commit. Manual intervention required."
        exit 1
    fi
    
    ROLLBACK_COMMIT="$PREVIOUS_COMMIT"
    print_warning "Using commit from git history: $(git rev-parse --short "$ROLLBACK_COMMIT")"
else
    ROLLBACK_COMMIT=$(cat "$LAST_GOOD_COMMIT_FILE" | tr -d '\n' | tr -d ' ')
    
    if [ -z "$ROLLBACK_COMMIT" ]; then
        print_error "Last good commit file is empty"
        exit 1
    fi
    
    # Verify the commit exists
    if ! git cat-file -e "$ROLLBACK_COMMIT" 2>/dev/null; then
        print_error "Commit $ROLLBACK_COMMIT not found in repository"
        exit 1
    fi
    
    print_message "Found last good commit: $(git rev-parse --short "$ROLLBACK_COMMIT")"
fi

# Determine docker compose command (try new syntax first, fallback to old)
if docker compose version > /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Step 2: Stop the application
print_message "Stopping application..."

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    $DOCKER_COMPOSE -f "$COMPOSE_FILE" down || {
        print_warning "Failed to stop container (may not be running)"
    }
    print_message "Container stopped"
else
    print_warning "No container found to stop"
fi

# Step 3: Checkout the last good commit
print_message "Checking out last good commit: $(git rev-parse --short "$ROLLBACK_COMMIT")"
git fetch origin || true
git checkout "$ROLLBACK_COMMIT" || {
    print_error "Failed to checkout commit $ROLLBACK_COMMIT"
    exit 1
}
print_message "Successfully checked out commit: $(git rev-parse --short HEAD)"

# Step 4: Remove old Docker image to force rebuild
print_message "Removing old Docker image..."
docker rmi "$IMAGE_NAME" 2>/dev/null || {
    print_warning "No existing image to remove"
}

# Step 5: Rebuild the Docker image
print_message "Rebuilding Docker image from rollback commit..."
$DOCKER_COMPOSE -f "$COMPOSE_FILE" build || {
    print_error "Docker build failed during rollback"
    exit 1
}
print_message "Docker image rebuilt successfully"

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

# Step 9: Update the last good commit file to this commit
echo "$ROLLBACK_COMMIT" > "$LAST_GOOD_COMMIT_FILE"

print_message "✅ Rollback completed successfully!"
print_message "Restored to commit: $(git rev-parse --short HEAD)"
print_message "Commit message: $(git log -1 --pretty=format:'%s' HEAD)"
