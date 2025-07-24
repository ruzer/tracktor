# Stage 1: Build the SvelteKit frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/client
COPY app/client/package*.json ./
RUN npm install
COPY app/client/ ./
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:22-alpine AS backend-builder
WORKDIR /app/server
COPY app/server/package*.json ./
RUN npm install
COPY app/server/ ./
ENV NODE_ENV=production
RUN npm run build
RUN npm run seed

# Stage 3: Final production image
FROM node:22-alpine
WORKDIR /app

# Copy built backend from backend-builder stage
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/package.json ./server/package.json
COPY --from=backend-builder /app/server/vehicles.db ./server/vehicles.db

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/client/build ./server/client/build

WORKDIR /app/server

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
CMD ["node", "dist/index.js"]
