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

app.use(cors({
  origin: 'http://localhost:3000', // your React app origin
  credentials: true, // if you want to send cookies/auth headers
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
  app.listen(5000, () => console.log('🚀 Server running at http://localhost:5000'));
})
.catch(err => console.error('❌ MongoDB connection failed:', err));
