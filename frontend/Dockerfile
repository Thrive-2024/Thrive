# from base image node
FROM node:20-alpine

# Set the timezone in the Dockerfile
ENV TZ=Asia/Singapore

WORKDIR /app

# copy other files as well
COPY . .

RUN rm -rf /app/node_modules

RUN npm install

# Build for production.
RUN npm run build

# Install `serve` to run the application.
RUN npm install -g serve

# Uses port which is used by the actual application
EXPOSE 3000

# Run application
# CMD [ "npm", "start" ]
CMD serve -s build