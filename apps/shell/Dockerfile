# Stage 1: Build
FROM node:23-alpine AS builder

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configuration files first (for layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files for workspace resolution
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/event-bus/package.json ./packages/event-bus/
COPY packages/mfe-types/package.json ./packages/mfe-types/
COPY packages/ui/package.json ./packages/ui/

COPY apps/mfe-aao/package.json ./apps/mfe-aao/
COPY apps/mfe-car-control/package.json ./apps/mfe-car-control/
COPY apps/mfe-dashboard/package.json ./apps/mfe-dashboard/
COPY apps/mfe-rent/package.json ./apps/mfe-rent/
COPY apps/mfe-reports/package.json ./apps/mfe-reports/
COPY apps/mfe-reservation-lookup/package.json ./apps/mfe-reservation-lookup/
COPY apps/mfe-return/package.json ./apps/mfe-return/
COPY apps/mfe-settings/package.json ./apps/mfe-settings/
COPY apps/mfe-vehicle-exchange/package.json ./apps/mfe-vehicle-exchange/
COPY apps/shell/package.json ./apps/shell/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build all packages
RUN pnpm build

# Stage 2: Production
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/apps/shell/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
