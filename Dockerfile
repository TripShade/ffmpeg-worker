# Base image
FROM node:alpine as build-stage

# Arguments
ARG NPM_TOKEN
ARG HTTP_PROXY

# Image owner
LABEL maintainer "Tripshade"

# Make the 'app' folder the current working directory
WORKDIR /app

RUN apk add ffmpeg unzip

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .
RUN npm install
RUN npm run build

# Build app for production with minification
# RUN npm run start:prod

EXPOSE 8080

CMD ["npm", "run", "start:prod"]

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD  wget -q -O /dev/null http://localhost/ || exit 1

