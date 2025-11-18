// src/app/api/save-pdf/route.ts
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import PDF from "@/models/pdfModel";
import { NextResponse } from "next/server";
import axios from "axios";
let pdfParse: any;
(async () => {
  const mod = await import("pdf-parse/lib/pdf-parse.js");
  pdfParse = mod.default || mod;
})();

export async function POST(req: Request) {
  try {
    const { userId } = auth(); // server-side
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

    // download buffer
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const pdfBuffer = Buffer.from(response.data, "binary");

    // extract text
    const data = await pdfParse(pdfBuffer);
    const text = data.text?.trim() || "";
    if (!text || text.length < 50) {
      return NextResponse.json({ error: "No readable text in PDF" }, { status: 400 });
    }

    // (embedding + pinecone code omitted here — keep your existing)
    const newPdf = await PDF.create({ userId, fileName, fileUrl });

    return NextResponse.json({ message: "PDF processed & saved", pdfId: newPdf._id });
  } catch (error) {
    console.error("❌ Error in /api/save-pdf:", error);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
