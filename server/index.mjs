import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv"; //to access env variables
import userRouter from './routes/userRoute.mjs'
import authRouter from './routes/authRoutes.mjs'
//CONFIGURATIONS
dotenv.config();
const app = express();
const PORT = process.env.PORT 
app.use(express.json()); //without this we cannot send or receive json using api calls

//ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

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