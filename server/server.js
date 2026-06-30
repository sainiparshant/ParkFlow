import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { connectDb } from './src/config/db.js';
import authRoutes from './src/routes/AuthRoutes.js';
import vendorRoutes from './src/routes/VendorRoutes.js';
import parkingRoutes from './src/routes/ParkingRoutes.js';
import redisClient from './src/config/redis.js';


config();
connectDb();
await redisClient.connect();
console.log("redis connected");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth" , authRoutes);
app.use("/api/v1/vendor" , vendorRoutes);
app.use("/api/v1", parkingRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});