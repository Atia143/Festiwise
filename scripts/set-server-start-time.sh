#!/bin/bash

# Script to generate server start time for uptime tracking

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  touch .env.local
  echo "Created .env.local file"
fi

# Check if NEXT_PUBLIC_SERVER_START_TIME already exists in .env.local
if grep -q "NEXT_PUBLIC_SERVER_START_TIME" .env.local; then
  # Update the existing value
  sed -i '' "s/NEXT_PUBLIC_SERVER_START_TIME=.*/NEXT_PUBLIC_SERVER_START_TIME=$(date +%s)000/" .env.local
  echo "Updated NEXT_PUBLIC_SERVER_START_TIME in .env.local"
else
  # Append the new value
  echo "NEXT_PUBLIC_SERVER_START_TIME=$(date +%s)000" >> .env.local
  echo "Added NEXT_PUBLIC_SERVER_START_TIME to .env.local"
fi

echo "Server start time set to $(date)"
