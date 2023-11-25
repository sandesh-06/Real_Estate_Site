import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv"; //to access env variables

dotenv.config();

const app = express();
const PORT = process.env.PORT 

// MONGOOSE SETUP
const connectToMongo = async()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected!")
}
connectToMongo().catch((error)=>{console.log("Error connecting to database")})

//SERVER LISTEN
app.listen(PORT, ()=>console.log(`Server Port: ${PORT}`))