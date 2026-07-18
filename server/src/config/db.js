import mongoose from "mongoose";
import env from "./env.js";

const MongoURI = env.MONGO_URI;

const connectMongoDb = async () => {
    try {

        const poolOptions = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        };

        const conn = await mongoose.connect(MongoURI, poolOptions);

        console.log(`MongoDB Initialized: ${conn.connection.host}`);

    } catch (error) {
        console.error(`MongoDb connection Error: ${error}`);
        process.exit(1);
    }

};

export default connectMongoDb;