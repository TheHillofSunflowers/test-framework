# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}-alpine

# temp
FROM mcr.microsoft.com/playwright:v1.45.1-jammy

# temp
WORKDIR /app

# Use production node environment by default.
ENV NODE_ENV production


#WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
#RUN --mount=type=bind,source=package.json,target=package.json \
#    --mount=type=bind,source=package-lock.json,target=package-lock.json \
#    --mount=type=cache,target=/root/.npm \
#    npm ci --omit=dev

# Run the application as a non-root user.
#USER node

# Copy the rest of the source files into the image.
#COPY . .

# Expose the port that the application listens on.
#EXPOSE 3000

# Run the application.
#CMD node index.js





# Use the official Playwright base image, which includes necessary dependencies.
# temp FROM mcr.microsoft.com/playwright:v1.45.1-jammy

# Set the working directory
# temp WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    xvfb \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libpango1.0-0 \
    libcups2 \
    libgtk-3-0 \
    libxdamage1 \
    libxshmfence1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libx11-xcb1

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies, including Playwright
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Install Playwright browsers (Chromium, Firefox, WebKit)
RUN npx playwright install --with-deps

# Use non-root user for security (Root currently required for perms)
#USER pwuser

# Expose the port that the application listens on, if your app needs it
#EXPOSE 3000

# Default command to run Playwright tests
CMD ["xvfb-run", "--auto-servernum", "npx", "playwright", "test"]

# docker build -t playwright-docker .
# docker run -it --rm -e DISPLAY=:0 -v /tmp/.X11-unix:/tmp/.X11-unix playwright-docker:latest xvfb-run --auto-servernum npx playwright test