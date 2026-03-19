FROM denoland/deno:latest

WORKDIR /app

# Cache npm/deno dependencies
COPY deno.json deno.lock package.json ./
RUN deno install

# Runtime configuration (Heroku overrides these at deploy time)
ENV POSTGRES_URI=""

# Copy all source files
COPY . .

RUN deno run -A npm:vite build

# Expose backend port
EXPOSE 8000

# Single web process: serves API + the built UI from `dist/`
CMD ["deno", "run", "-A", "api/main.ts"]
