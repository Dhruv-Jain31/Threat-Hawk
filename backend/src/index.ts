import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';

const app = express();

// Enable CORS for the Next.js frontend
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Mount auth routes
app.use('/api/auth', authRouter);
app.use('/api/scan', scanRouter);

app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});