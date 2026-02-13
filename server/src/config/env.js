import dotenv from "dotenv";


dotenv.config();

const requiredEnvVars = [
	"PORT",
	"REFRESH_TOKEN_SECRET",
	"ACCESS_TOKEN_SECRET",
	"MONGO_URI",
	"COOKIE_SECRET",
	"OPENAI_API_KEY",
	"REDIS_URL",
	"FRONTEND_URL",
	"PINECONE_API_KEY",
	"AWS_REGION",
	"S3_BUCKET_NAME",
]

requiredEnvVars.forEach((varName) => {
	if(!process.env[varName]){
		throw new Error(`Environment variable ${varName} is not set`);
	}
})

const env = Object.freeze({
	port: Number(process.env.PORT),
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
});

export default env;
