import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pinecone } from "@/lib/pinecone";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/chatModel";
import PDF from "@/models/pdfModel";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // ✅ Step 1: Get user info
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // ✅ Step 2: Parse input
    const { pdfId, question } = await req.json();
    if (!pdfId || !question) {
      return NextResponse.json({ error: "Missing PDF ID or question" }, { status: 400 });
    }

    // ✅ Step 3: Connect to DB
    await connectDB();

    // ✅ Step 4: Retrieve or create chat for this user & PDF
    let chat = await Chat.findOne({ pdfId, userId: user.id });
    if (!chat) {
      chat = await Chat.create({
        pdfId,
        userId: user.id,
        messages: [],
      });
    }

    // ✅ Step 5: Embed question for semantic search
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embeddingResponse = await embedModel.embedContent(question);
    const questionEmbedding = embeddingResponse.embedding.values;

    // ✅ Step 6: Query Pinecone for relevant PDF chunks
    const index = pinecone.Index(process.env.PINECONE_INDEX!);
    const queryResponse = await index.query({
      vector: questionEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    const context =
      queryResponse.matches?.map((m: any) => m.metadata.text).join("\n") || "";

    // ✅ Step 7: Create full AI prompt
    const history = chat.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const prompt = `
You are an AI assistant helping the user understand a PDF.
Use the following context extracted from the PDF:
${context}

Chat history:
${history}

User question: ${question}

Answer clearly and concisely based only on the PDF context.
    `;

    // ✅ Step 8: Use Gemini to generate the response
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    let result;
    for (let i = 0; i < 3; i++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err: any) {
        if (err.message?.includes("503")) {
          console.warn("Gemini model overloaded, retrying...");
          await new Promise((r) => setTimeout(r, 2000));
        } else throw err;
      }
    }

    const answer = result.response.text();

    // ✅ Step 9: Save chat message properly
    chat.messages.push({ role: "user", content: question });
    chat.messages.push({ role: "assistant", content: answer });
    await chat.save();

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("❌ ask-ai route error:", error);
    return NextResponse.json({ error: "Failed to generate answer" }, { status: 500 });
  }
}
