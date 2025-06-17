import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import formDataRoutes from './routes/FormData.js';
import clientRoutes from './routes/client.js'
import clientFetchRouter from './routes/clientFetch.js'

dotenv.config();
const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://dashboard-bice-five.vercel.app', // your Vercel frontend
  'https://www.dashboard-bice-five.vercel.app', // your Vercel frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));


// Routes
app.use('/auth', authRoutes); 
app.use('/forms', formDataRoutes);
app.use('/client', clientRoutes);
app.use('/client', clientFetchRouter);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(3002, () => console.log('🚀 Server running at http://localhost:3002'));
})
.catch(err => console.error('❌ MongoDB connection failed:', err));
