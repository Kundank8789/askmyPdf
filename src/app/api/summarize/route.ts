import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pinecone } from "@/lib/pinecone";
import connectDB from "@/lib/mongodb";
import PDF from "@/models/pdfModel";

export async function POST(req: Request) {
  try {
    console.log("✅ summarize route triggered");

    const { pdfId } = await req.json();
    console.log("📄 Received PDF ID:", pdfId);

    await connectDB();
    console.log("✅ MongoDB connected");

    // Fetch PDF
    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      console.log("❌ PDF not found in MongoDB");
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Fetch from Pinecone
    console.log("🧠 Querying Pinecone...");
    const index = pinecone.Index(process.env.PINECONE_INDEX!);

    const queryResponse = await index.query({
      topK: 10,
      includeMetadata: true,
      vector: Array(1024).fill(0.1),
      filter: { pdfId },
    });

    const context =
      queryResponse.matches?.map((m: any) => m.metadata?.text).join("\n") || "";

    console.log("📚 Retrieved context length:", context.length);

    if (!context.trim()) {
      console.log("⚠️ No context found in Pinecone.");
      return NextResponse.json(
        { error: "No content found for this PDF." },
        { status: 404 }
      );
    }

    // Summarize using Gemini
    console.log("✨ Summarizing using Gemini...");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const prompt = `
Summarize the following text clearly and concisely:
${context}
`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    console.log("✅ Summary generated successfully");

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("❌ summarize route error:", error);
    return NextResponse.json(
      { error: "Failed to summarize PDF", details: String(error) },
      { status: 500 }
    );
  }
}
