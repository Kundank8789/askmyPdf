import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pinecone } from "@/lib/pinecone";
import PDF from "@/models/pdfModel";
import connectDB from "@/lib/mongodb";
import pdfParse from "pdf-parse";

export async function POST(req: Request) {
  try {
    const { pdfId } = await req.json();
    await connectDB();

    const pdf = await PDF.findById(pdfId);
    if (!pdf) return NextResponse.json({ error: "PDF not found" }, { status: 404 });

    console.log("🧾 Processing PDF:", pdf.fileName);

    const response = await fetch(pdf.fileUrl);
    const buffer = await response.arrayBuffer();
    const data = await pdfParse(Buffer.from(buffer));
    const text = data.text;

    if (!text.trim()) {
      return NextResponse.json({ error: "PDF has no extractable text" }, { status: 400 });
    }

    const chunks = text.match(/.{1,1000}/g) || [];

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const index = pinecone.Index(process.env.PINECONE_INDEX!);

    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embeddingResponse = await embedModel.embedContent(chunk);
      const embedding = embeddingResponse.embedding.values;

      vectors.push({
        id: `${pdfId}_chunk_${i}`,
        values: embedding,
        metadata: { text: chunk, pdfId },
      });
    }

    await index.upsert(vectors);
    console.log(`✅ Uploaded ${vectors.length} chunks to Pinecone`);

    return NextResponse.json({ message: "✅ PDF processed and stored successfully" });
  } catch (error) {
    console.error("❌ Error processing PDF:", error);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
