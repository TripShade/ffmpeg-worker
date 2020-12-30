# Base image
FROM jrottenberg/ffmpeg:4.1-alpine as ffmpeg
FROM node:alpine as build-stage

# Image owner
LABEL maintainer "Tripshade"

# Make the 'app' folder the current working directory
WORKDIR /app

COPY --from=ffmpeg / /

RUN apk add unzip

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .
RUN yarn
RUN yarn build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD  wget -q -O /dev/null http://localhost/ || exit 1

