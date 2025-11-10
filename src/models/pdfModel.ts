import mongoose, { Schema, Document, models } from "mongoose";

export interface IPDF extends Document {
  userId: string;
  fileName: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const PDFSchema = new Schema<IPDF>(
  {
    userId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const PDF = models.PDF || mongoose.model<IPDF>("PDF", PDFSchema);
export default PDF;
