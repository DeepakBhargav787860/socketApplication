# Stage 1: Build the React app
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:stable-alpine

# Remove default NGINX static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Replace default NGINX config (if needed)
 COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
