// import constants from "../config/constant.js";
import dotenv from "dotenv";
import transcriptionData from "./transcription.js";

dotenv.config({ path: "../../.env" });

import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
	model: "gpt-5",
	reasoning: { effort: "low" },
	input: [
		{
			role: "developer",
			content: `consider this transcription and do as the user role says. Transcription: ${transcriptionData.text}`,
		},
		{
			role: "user",
			content:
				"generate concise notes from the transcription developer provides, the notes should consist of the following sections: Title, Summary, Bullet Points, Action Items. Make sure the notes are easy to read and understand. ",
		},
	],
});

console.log(response.output_text);
