import mongoose, { Schema, model, models } from "mongoose";

const pdfSchema = new Schema(
  {
    userId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PDF = models.PDF || model("PDF", pdfSchema);

export default PDF;
