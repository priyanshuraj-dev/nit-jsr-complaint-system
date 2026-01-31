import mongoose from "mongoose";

export const connectDB = async() => {

    const MONGODB_URI = process.env.MONGODB_URI!;
    if(!MONGODB_URI){
        throw new Error("Please define MONOGODB_URI in .env");
    }

    if(mongoose.connections[0].readyState == 1){
        console.log("Already connected");
        return mongoose.connection;
    }
    
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log("DB Connected successfully");
        return conn;
    } catch (error) {
        console.error("DB connection failed",error);
        throw error;
    }
}