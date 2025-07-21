# Stage 1: Build Client
FROM node:20-alpine AS client-builder

WORKDIR /usr/src/app/client

COPY client/package*.json ./
RUN npm install
COPY client/ ./

# Set the public API base URL during the build
ARG PUBLIC_API_BASE_URL=/
ENV PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL

RUN npm run build

# Stage 2: Build Server
FROM node:20-alpine AS server-builder

WORKDIR /usr/src/app/server

COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Final Production Image
FROM node:20-alpine

WORKDIR /usr/src/app

# Install server production dependencies
COPY --from=server-builder /usr/src/app/server/package*.json ./
RUN npm install --omit=dev

# Copy built server code
COPY --from=server-builder /usr/src/app/server/dist ./dist

# Copy client build output to a public directory
COPY --from=client-builder /usr/src/app/client/build ./public

# Copy database and environment files
COPY server/vehicles.db ./
COPY server/.env ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
