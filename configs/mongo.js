'use strict';
 
import mongoose from "mongoose";
 
export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () =>{
            console.log('MongoDB | Could not be connected to MongoDb');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', ()=>{
            console.log('MongoDB | Try connecting');
        });
        mongoose.connection.on('connected', ()=>{
            console.log('MongoDB | connected to MongoDB');
        });
        mongoose.connection.on('open', ()=>{
            console.log('MongoDB | connected to database');
        });
        mongoose.connection.on('reconnected', ()=>{
            console.log('MongoDB | reconnected to MongoDB');
        });

        mongoose.connection.on('disconnectd', ()=>{
            console.log('MongoDB | disconnected');
        });
        mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });
    } catch (error) {
       console.log('Database connection failed', error);
    }
}