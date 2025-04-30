import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import scanRouter from './routes/scan';
import * as dotenv from 'dotenv';


dotenv.config();

const app = express();

// Enable CORS for the Next.js frontend
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/scan-and-scrape', scanRouter);

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});

console.log('FLASK_API_URL:', process.env.FLASK_API_URL);