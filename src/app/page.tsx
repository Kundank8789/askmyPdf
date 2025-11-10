// src/app/page.tsx
import Link from "next/link";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-semibold mb-4">How AskMyPDF works</h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur border border-white/10">
            <h4 className="font-semibold mb-2">1. Upload</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Upload PDF documents — research papers, invoices, resumes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur border border-white/10">
            <h4 className="font-semibold mb-2">2. Process</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We chunk the text, create embeddings and index them for fast search.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur border border-white/10">
            <h4 className="font-semibold mb-2">3. Chat</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ask questions — answers come from your document, with sources.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
