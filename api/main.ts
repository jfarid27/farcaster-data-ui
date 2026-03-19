import express from 'express';
import cors from 'cors';
import loadRoutes from './routes/index.ts';

const PORT = process.env.PORT || 8000;

const app = express()


const corsOptions = {};

app.use(cors(corsOptions));
loadRoutes(app);

app.listen(PORT, () => {
  console.log(`web server listening on port ${PORT}`)
})
