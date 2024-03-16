# Update the base image to Node 20
FROM node:20-buster-slim

# Set the timezone in the Dockerfile
ENV TZ=Asia/Singapore

WORKDIR /app

# Copy other files as well
COPY . .

# Remove node_modules if exists
RUN rm -rf /app/node_modules


# Install npm dependencies
RUN npm install


# Expose the port your app runs on
EXPOSE 8000

# Command to run your app
CMD ["npm", "start"]