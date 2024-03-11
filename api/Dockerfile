# Use a slim version of the Node.js official image for development
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Only copy package.json and other necessary files
# Note: We're assuming you're managing dependencies on the host in development
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Your application's default port, expose it
EXPOSE 3000

# The command to run your application
CMD ["npm", "start"]
