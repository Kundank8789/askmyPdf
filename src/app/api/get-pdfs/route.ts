import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PDF from "@/models/PDF";

export async function GET() {
  try {
    await dbConnect();
    const pdfs = await PDF.find().sort({ createdAt: -1 });
    return NextResponse.json(pdfs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch PDFs" }, { status: 500 });
  }
}
