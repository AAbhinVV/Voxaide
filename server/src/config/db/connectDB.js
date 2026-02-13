import mongoose from "mongoose";
import env from "../env.js"

export const connectDB = async () => {
	try {
		
		const conn = await mongoose.connect(env.mongo_uri, {
			dbname: "voxiadeDB",
		});
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(`Error: ${error.message}`);
		process.exit(1); //failure, success 0
	}
};
