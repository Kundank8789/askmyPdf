import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pinecone } from "@/lib/pinecone";
import connectDB from "@/lib/mongodb";
import PDF from "@/models/pdfModel";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse"; // ✅ works only after installing pdf-parse@1.1.1

export async function POST(req: Request) {
  try {
    console.log("✅ save-pdf route triggered");

    await connectDB();

    const { fileUrl, fileName, userId } = await req.json();

    if (!fileUrl) throw new Error("Missing fileUrl");

    // ✅ 1. Download and save the uploaded PDF
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const filePath = path.join(tempDir, `${Date.now()}_${fileName}`);
    console.log("⬇️ Downloading PDF from:", fileUrl);

    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Failed to download PDF: ${response.statusText}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    console.log("✅ File saved locally at:", filePath);

    // ✅ 2. Extract text from PDF
    console.log("📖 Extracting text from PDF...");
    const parsed = await pdf(fs.readFileSync(filePath));
    const text = parsed.text.trim();
    if (!text) throw new Error("No text extracted from PDF");

    // ✅ 3. Chunking text
    const chunkSize = 1000;
    const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
    console.log(`🧩 Split into ${chunks.length} chunks`);

    // ✅ 4. Create embeddings
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const embeddings = [];
    for (const chunk of chunks) {
      const res = await embedModel.embedContent(chunk);
      embeddings.push(res.embedding.values);
    }
    console.log("✨ Generated all embeddings");

    // ✅ 5. Store embeddings in Pinecone
    const index = pinecone.Index(process.env.PINECONE_INDEX!);
    await index.upsert({
      upsertRequest: {
        vectors: embeddings.map((values, i) => ({
          id: `${fileName}-${i}`,
          values,
          metadata: { text: chunks[i], fileName },
        })),
      },
    });
    console.log("📤 Uploaded embeddings to Pinecone");

    // ✅ 6. Save metadata in MongoDB
    await PDF.create({ fileName, fileUrl, userId });
    console.log("✅ PDF saved in MongoDB");

    // ✅ 7. Clean up
    fs.unlinkSync(filePath);
    console.log("🧹 Temporary file deleted");

    return NextResponse.json({ success: true, message: "PDF processed successfully" });
  } catch (err) {
    console.error("❌ save-pdf route error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
