# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build the project
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:stable-alpine
# Copy the build output to nginx's html folder
COPY --from=build /app/dist/quantity-measurement-app/browser /usr/share/nginx/html
# Copy a custom nginx config to handle Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
