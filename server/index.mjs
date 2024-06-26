import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv"; //to access env variables
import userRouter from './routes/userRoute.mjs'
import authRouter from './routes/authRoutes.mjs'
import listingRouter from './routes/listingRoutes.mjs'
import cookieParser from 'cookie-parser';
//CONFIGURATIONS
dotenv.config();
const app = express();
const PORT = process.env.PORT 
app.use(express.json()); //without this we cannot send or receive json using api calls

app.use(cookieParser()); //to verify the auth token inside the cookie, while performing user updation or deletion.

//ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

//A COMMON MIDDLEWARE TO HANDLE ERROR
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const msg = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message: msg
    })
})

// MONGOOSE SETUP
const connectToMongo = async()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected!")
}
connectToMongo().catch((error)=>{console.log("Error connecting to database")})

//SERVER LISTEN
app.listen(PORT, ()=>console.log(`Server Port: ${PORT}`))