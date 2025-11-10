import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PDF from "@/models/PDF";

export async function POST(req: NextRequest) {
  const { fileUrl, fileName } = await req.json();

  // Get userId from Clerk session if needed
  const userId = "demoUser"; // replace with actual Clerk userId

  try {
    await dbConnect();
    const pdf = await PDF.create({ fileUrl, fileName, userId });
    return NextResponse.json({ success: true, pdf });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to save PDF" });
  }
}
