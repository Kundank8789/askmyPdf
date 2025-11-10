import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { pinecone } from "@/lib/pinecone";
import  connectDB  from "@/lib/mongodb";
// Ensure the path is correct and the file exists
import PDF from "../../../models/pdfModel";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { pdfId, question } = await req.json();

    await connectDB();
    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Get embedding for the user's question
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embeddingResponse = await embedModel.embedContent(question);
    const questionEmbedding = embeddingResponse.embedding;

    // Query Pinecone
const index = pinecone.Index(process.env.PINECONE_INDEX!);

    const queryResponse = await index.query({
      vector: questionEmbedding.values,
      topK: 5,
      includeMetadata: true,
    });

    // Get AI answer
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const contextText = queryResponse.matches
      ?.map((m) => m.metadata?.text || "")
      .join("\n");

    const prompt = `
      You are an AI assistant helping the user understand the uploaded PDF.
      Context:
      ${contextText}

      Question: ${question}
    `;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("❌ ask-ai route error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
