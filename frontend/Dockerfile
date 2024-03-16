# from base image node
FROM node:20-alpine

# Set the timezone in the Dockerfile
ENV TZ=Asia/Singapore

WORKDIR /app

# copy other files as well
COPY . .

RUN rm -rf /app/node_modules

RUN npm install --legacy-peer-deps

#expose the port
EXPOSE 3000

# command to run when intantiate an image
CMD ["npm","start"]