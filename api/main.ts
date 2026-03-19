import express from 'express';
import cors from 'cors';
import loadRoutes from './routes/index.ts';
import { fromFileUrl, join } from "jsr:@std/path";

// Heroku sets `PORT` for the *web* process.
// Allow `SERVER_PORT` as a fallback for local/docker runs.
const PORT = Number(
  Deno.env.get("PORT") ?? Deno.env.get("SERVER_PORT") ?? "8000",
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
