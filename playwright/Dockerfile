# Use official Docker Playwright image as base image
FROM mcr.microsoft.com/playwright:v1.42.1-jammy

# Change working dir to '/app'
WORKDIR /app

# Copy dependencies and init.sh script
COPY ./package.json ./package-lock.json ./docker/init.sh ./

# Install dependencies, xvfb, set permissions to init.sh, and fix line endings
RUN apt-get update && apt-get install -y xvfb \
    && npm install \
    && npm run init-playwright \
    && sed -i 's/\r$//' ./init.sh \
    && chmod u+x ./init.sh

# Add tests etc.
COPY . .

# Run init.sh at container startup
CMD /bin/bash -c './init.sh'
