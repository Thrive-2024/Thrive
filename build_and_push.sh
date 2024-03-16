#!/bin/bash

# Build and push frontend Docker image
echo "Building and pushing frontend Docker image..."
cd frontend
docker build --platform linux/amd64 -t panmingwei/thrive-frontend .
docker push panmingwei/thrive-frontend
cd ..

# Build and push backend Docker image
echo "Building and pushing backend Docker image..."
cd backend
docker build -t panmingwei/thrive-backend .
docker push panmingwei/thrive-backend
cd ..

echo "Done."