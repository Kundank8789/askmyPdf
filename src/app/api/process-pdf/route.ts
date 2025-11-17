import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PDF from "@/models/pdfModel";

export async function POST(req: Request) {
  try {
    const { pdfId } = await req.json();

    if (!pdfId) {
      return NextResponse.json({ error: "Missing pdfId" }, { status: 400 });
    }

    await connectDB();

    // Verify the PDF exists in MongoDB
    const pdf = await PDF.findById(pdfId);

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Mark PDF as processed (optional - you can add this field to your schema if needed)
    console.log("✅ PDF processing verified:", pdfId);

    return NextResponse.json({
      message: "✅ PDF processing verified",
      pdfId,
    });
  } catch (error) {
    console.error("❌ Error in /api/process-pdf:", error);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
