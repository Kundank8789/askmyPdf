import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("🔑 PINECONE_API_KEY:", process.env.PINECONE_API_KEY);
console.log("🌐 PINECONE_HOST:", process.env.PINECONE_HOST);
console.log("🧭 PINECONE_CONTROLLER_HOST:", process.env.PINECONE_CONTROLLER_HOST);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  controllerHostUrl: `https://${process.env.PINECONE_CONTROLLER_HOST}`,
});

const test = async () => {
  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    console.log(`🚀 Attempting to query index: ${process.env.PINECONE_INDEX}`);

    // just check if index exists by running a dummy query
    await index.describeIndexStats();
    console.log("✅ Successfully connected to your Pinecone index!");
  } catch (err) {
    console.error("❌ Pinecone connection failed:", err);
  }
};

test();
