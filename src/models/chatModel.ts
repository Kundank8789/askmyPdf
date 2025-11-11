import mongoose, { Schema, Document, models } from "mongoose";

export interface IChat extends Document {
  pdfId: mongoose.Schema.Types.ObjectId;
  userId: string;
  messages: { role: string; content: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: String, required: true },
    pdfId: { type: mongoose.Schema.Types.ObjectId, ref: "PDF", required: true }, // ✅ FIXED ref to PDF
    messages: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Chat = models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
