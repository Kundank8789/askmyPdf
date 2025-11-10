import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load your .env.local file (where GOOGLE_API_KEY is stored)
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const test = async () => {
  try {
    console.log("🔑 Using Gemini API key:", process.env.GOOGLE_API_KEY ? "Loaded ✅" : "Missing ❌");
    console.log("Fetching available Gemini models...");

    const response = await fetch("https://generativelanguage.googleapis.com/v1/models?key=" + process.env.GOOGLE_API_KEY);
    const data = await response.json();

    if (data.models) {
      console.log("\n✅ Available Gemini models:\n");
      data.models.forEach((model) => {
        console.log("•", model.name);
      });
    } else {
      console.log("⚠️ No models found. Response:", data);
    }
  } catch (error) {
    console.error("❌ Error fetching models:", error);
  }
};

test();
