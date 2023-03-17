import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
dotenv.config()

import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URL


//export const client = new MongoClient(mongoUri);

export async function runDb(){
    try {
        //await client.connect()
        if(!mongoUri){
            throw new Error('URL not found')
        }
        await mongoose.connect(mongoUri, {dbName: "blogsAndPosts"})
        console.log("Connected successfully to mongo server")
    }
    catch {
        console.log("Can't connect to db")
        //await client.close()
        await mongoose.disconnect()
    }
}