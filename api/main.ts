import express from 'express';
import cors from 'cors';
import loadRoutes from './routes/index.ts';

// Heroku sets `PORT` for the *web* process. The backend should be controlled
// explicitly by `SERVER_PORT` so it doesn't fight with the frontend port.
const PORT = Number(Deno.env.get("SERVER_PORT") ?? "8000");

const app = express()


const corsOptions = {};

app.use(cors(corsOptions));
loadRoutes(app);

app.listen(PORT, () => {
  console.log(`web server listening on port ${PORT}`)
})
