import express from 'express';
import cors from 'cors';
import loadRoutes from './routes/index.ts';
import { fromFileUrl, join } from "jsr:@std/path";

// For local dev with Vite proxy: use SERVER_PORT (8000) so the API doesn't
// conflict with Vite's frontend port. For Heroku: set SERVER_PORT=$PORT in the
// Procfile so the API binds to the correct port.
const PORT = Number(
  Deno.env.get("SERVER_PORT") ?? Deno.env.get("PORT") ?? "8000",
);

const app = express()


const corsOptions = {};

app.use(cors(corsOptions));
loadRoutes(app);

// Serve built Vite assets from `dist/` (repo root).
const distDir = fromFileUrl(new URL("../dist/", import.meta.url).href);
app.use(express.static(distDir));

// SPA fallback: any non-API GET returns `index.html`.
// Express 5's router doesn't like `*` as a path string, so we use a regex.
app.get(/.*/, (req, res) => {
  const reqPath = req.path ?? "";
  if (reqPath.startsWith("/api")) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.sendFile(join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`web server listening on port ${PORT}`)
})
