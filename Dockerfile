# --- Download native deps ---
FROM dhi.io/node:25-alpine3.23-dev AS native

# Download runtime libs and tcp-replay
RUN apk add --no-cache \
    jq \
    curl \
    tcpdump \
    tcpreplay \
    libcap

# Download release of udp-replay
RUN set -eu; \
    URL=$(curl -fsSL https://api.github.com/repos/luizfeldmann/udp-replay/releases/latest \
           | jq -r '.assets[] | select(.name=="alpine-x86_64-udp-replay") | .browser_download_url'); \
    [ -n "$URL" ]; \
    curl -fL "$URL" -o "/usr/bin/udp-replay"; \
    chmod +x "/usr/bin/udp-replay"

# Set capabilities for tcpreplay-edit
#RUN setcap cap_net_raw,cap_net_admin=eip $(which tcpreplay-edit)

# Smoke-test the apps
RUN udp-replay --version && \
    tcpreplay-edit --version

# --- Node deps ---
FROM dhi.io/node:25-alpine3.23-dev AS nodedepsbase

WORKDIR /app

# Native build required for node-gyp
RUN apk add --no-cache \
    build-base \
    py3-pip

# Optimize node_modules
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/
COPY packages/ui/package.json packages/ui/

# --- Build deps ---
FROM nodedepsbase AS nodedepsbuild
RUN npm ci

# --- Production deps ---
FROM nodedepsbase AS nodedepsruntime
RUN npm ci --omit=dev

# --- Build stage ---
FROM nodedepsbuild AS build

# Copy all source tree
COPY . .

# Run builds
RUN npm run build

# Initialize DB
RUN mkdir -p /app/packages/server/data
RUN mkdir -p /app/packages/server/data/uploads
RUN npm run migrate --workspace=server
RUN chmod 777 -R /app/packages/server/data

# --- Runtime ---
FROM dhi.io/node:25-alpine3.23 AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Copy native dependencies
COPY --from=native /usr/bin/udp-replay /usr/bin
COPY --from=native /usr/bin/tcpreplay-edit /usr/bin
COPY --from=native /usr/bin/tcpdump /usr/bin

COPY --from=native /usr/lib/libpcap.* /usr/lib
COPY --from=native /usr/lib/libdnet.* /usr/lib

# Smoke test
RUN ["udp-replay", "--version"]
RUN ["tcpreplay-edit", "--version"]

# Copy node_modules
COPY --from=nodedepsruntime /app /app

# Copy build
COPY --from=build /app/packages/server/dist ./packages/server/dist
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/ui/dist ./packages/server/dist/server/public

# Copy initial DB
COPY --from=build --chown=1000:1000 /app/packages/server/data ./packages/server/data
VOLUME /app/packages/server/data

# Run
EXPOSE 3000
WORKDIR /app/packages/server
CMD ["node", "dist/server/src/index.js"]
