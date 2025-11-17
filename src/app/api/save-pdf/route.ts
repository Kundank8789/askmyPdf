import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import PDF from "@/models/pdfModel";
import { pinecone } from "@/lib/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

// Dynamic import pdf-parse to avoid DOMMatrix issues in Node
let pdfParse: any;
(async () => {
  const mod = await import("pdf-parse/lib/pdf-parse.js");
  pdfParse = mod.default || mod;
})();

export async function POST(req: Request) {
  try {
    console.log("✅ /api/save-pdf triggered");

    // Correct Clerk auth for API routes
    const { userId } = auth();
    console.log("👤 Clerk userId:", userId);

    if (!userId) {
      console.error("❌ Unauthorized: No Clerk user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl, fileName } = await req.json();
    if (!fileUrl || !fileName) {
      return NextResponse.json({ error: "Missing PDF data" }, { status: 400 });
    }

    await connectDB();
    console.log("✅ MongoDB connected");

    // Download PDF buffer
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const pdfBuffer = Buffer.from(response.data, "binary");

    // Extract text
    const data = await pdfParse(pdfBuffer);
    const text = data.text?.trim() || "";
    if (!text || text.length < 50) {
      console.warn("⚠️ PDF has no readable text");
      return NextResponse.json({ error: "No readable text in PDF" }, { status: 400 });
    }
    console.log("📄 Extracted text length:", text.length);

    // Generate embeddings (Google Generative)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embeddingResponse = await embedModel.embedContent(text);
    const embedding = embeddingResponse.embedding.values;
    console.log("🧠 Embedding generated");

    // Upsert to Pinecone
    const index = pinecone.Index(process.env.PINECONE_INDEX!);
    await index.upsert([
      {
        id: `${fileName}-${Date.now()}`,
        values: embedding,
        metadata: { text, fileName, userId },
      },
    ]);
    console.log("📦 Saved embedding in Pinecone");

    // Save PDF to MongoDB
    const newPdf = await PDF.create({ userId, fileName, fileUrl });
    console.log("✅ PDF saved to DB", newPdf._id);

    return NextResponse.json({ message: "PDF processed & saved", pdfId: newPdf._id });
  } catch (error) {
    console.error("❌ Error in /api/save-pdf:", error);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
