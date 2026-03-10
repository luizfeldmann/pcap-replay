# --- Base image ---
FROM node:24-slim AS base

WORKDIR /app

# Install dependencies & tools
RUN apt-get update && \
    apt-get install -y \
    tcpdump \
    tcpreplay \
    libcap2-bin \
    python3 \
    build-essential \
    && \
    setcap cap_net_raw,cap_net_admin=eip $(which tcpreplay-edit) && \
    rm -rf /var/lib/apt/lists/*

# --- Node deps ---
FROM base AS deps

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/
COPY packages/ui/package.json packages/ui/

# --- Build deps ---
FROM deps AS depsbuild
RUN npm ci

# --- Production deps ---
FROM deps AS depsprod
RUN npm ci --omit=dev

# Remove build tools to slim image
RUN apt-get purge -y \
    python3 \
    build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# --- Build stage ---
FROM depsbuild AS build

# Copy all source tree
COPY . .

# Run builds
RUN npm run build --workspace=shared
RUN npm run build --workspace=server
RUN npm run build --workspace=ui

# Initialize DB
RUN mkdir -p /app/packages/server/data
RUN npm run migrate --workspace=server

# --- Runtime ---
FROM depsprod AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Copy build
COPY --from=build /app/packages/server/dist ./packages/server/dist
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/ui/dist ./packages/server/dist/server/public

# Copy initial DB
COPY --from=build /app/packages/server/data ./packages/server/data
VOLUME /app/packages/server/data

# Run
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=server"]
