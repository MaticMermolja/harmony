# Use the official Node.js 18 image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Build the Angular application
RUN npm run build

# Expose the port the app runs on
EXPOSE 4200

# Start the application
# If you're serving the Angular app with a Node.js server
CMD ["npm", "start"]

# If you're serving the Angular app statically, you might use a server like nginx
# In that case, you would use a multi-stage build and copy the build artifacts
# to an nginx image. Example:

# FROM nginx:alpine as final
# COPY --from=build /app/dist/your-angular-app-name /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
