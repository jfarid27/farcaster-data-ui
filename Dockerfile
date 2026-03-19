FROM denoland/deno:alpine

WORKDIR /app

# Cache npm/deno dependencies
COPY deno.json deno.lock package.json ./
RUN deno install

# Copy all source files
COPY . .

# Build the Vite frontend for production
# VITE_API_URL must be set at build time since Vite bakes env vars into the bundle
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=${VITE_API_URL}
RUN deno run -A npm:vite build

# Expose Vite preview port
EXPOSE 3000

# Serve the production build using vite preview (lightweight static server)
CMD ["deno", "run", "-A", "npm:vite", "preview", "--host", "--port", "3000"]
