import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const constants = {
	port: process.env.PORT,
	refresh_token: process.env.REFRESH_TOKEN_SECRET,
	access_token: process.env.ACCESS_TOKEN_SECRET,
	mongo_uri: process.env.MONGO_URI,
	cookie_secret: process.env.COOKIE_SECRET,
	openai_api_key: process.env.OPENAI_API_KEY,
	redis_url: process.env.REDIS_URL,
	frontend_url: process.env.FRONTEND_URL,
	pinecone_api_key: process.env.PINECONE_API_KEY,
	aws_region: process.env.AWS_REGION,
	aws_bucket_name: process.env.S3_BUCKET_NAME,
};

export default constants;
