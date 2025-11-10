import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_HOST) {
  throw new Error("❌ Missing Pinecone API configuration");
}

// ✅ Correct config: use api.pinecone.io as controller, and index host for querying
export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  controllerHostUrl: "https://api.pinecone.io",
});
