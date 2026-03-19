import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Who is donald trump? Would you say that he is evil",
    });
    console.log(response.text);
}

await main();
