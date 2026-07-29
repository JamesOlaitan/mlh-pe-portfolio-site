#!/bin/bash

# Redeploys my portfolio service after changes are pushed to GitHub.

# cd into the project folder
cd ~/mlh-pe-portfolio-site

# Make the repo match the latest changes on the main branch
git fetch && git reset origin/main --hard

# Spin containers down first to avoid out-of-memory issues while rebuilding
docker compose -f docker-compose.prod.yml down

# Rebuild and start the containers in detached mode
docker compose -f docker-compose.prod.yml up -d --build

echo "Redeploy complete."
