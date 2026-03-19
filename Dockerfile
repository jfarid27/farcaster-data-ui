FROM denoland/deno:alpine

WORKDIR /app

# Cache npm/deno dependencies
COPY deno.json deno.lock package.json ./
RUN deno install

# Runtime configuration (override at deploy time)
ARG POSTGRES_URI=""
ENV POSTGRES_URI=${POSTGRES_URI}

ARG SERVER_PORT=8000
ENV SERVER_PORT=${SERVER_PORT}

# Web/frontend server port (Vite preview).
# Keep default empty so Heroku's `PORT` can take over automatically.
ARG server_port=""
ENV server_port=${server_port}

# Copy all source files
COPY . .

# Build the Vite frontend for production
# VITE_API_URL must be set at build time since Vite bakes env vars into the bundle
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=${VITE_API_URL}
RUN deno run -A npm:vite build

# Expose frontend + backend ports
EXPOSE 3000 8000

# Run API server + Vite preview.
# `/api` is proxied by Vite (see `vite.config.ts`) to `SERVER_PORT`.
# Ensure the website uses Heroku's `PORT` when `server_port` isn't provided.
CMD ["sh", "-c", "deno run -A api/main.ts & deno run -A npm:vite preview --host --port ${server_port:-${PORT:-3000}}"]
