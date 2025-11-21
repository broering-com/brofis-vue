###############################################
# Multi-stage Dockerfile for a Vite + Vue app #
###############################################

# ----- Build stage -----
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
# Use npm ci when lockfile exists for reproducible builds
RUN npm ci

# Copy the rest of the source and build
COPY . .
RUN npm run build


# ----- Runtime stage (Nginx) -----
FROM nginx:1.27-alpine AS runtime

# Copy custom nginx config (includes SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
