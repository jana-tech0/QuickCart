import express from 'express';
import connectDB from './config/db.js'; 
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser'; 


connectDB();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));

