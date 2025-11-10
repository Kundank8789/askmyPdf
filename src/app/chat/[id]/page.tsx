"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { id } = useParams();
  type Pdf = { _id: string; fileUrl: string; fileName: string } | null;
  const [pdf, setPdf] = useState<Pdf>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      const res = await fetch(`/api/get-pdfs`);
      const data = await res.json();
      const singlePdf = data.find((item: { _id: string }) => item._id === id) as Pdf;
      setPdf(singlePdf);
    };
    fetchPdf();
  }, [id]);

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const res = await fetch("/api/ask-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfId: id, question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  if (!pdf) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{pdf.fileName}</h1>
      <iframe src={pdf.fileUrl} className="w-full h-[500px] border rounded-xl" />

      <div className="mt-6">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something about this PDF..."
          className="w-full p-3 rounded-lg border dark:border-gray-700 bg-white/80 dark:bg-black/40"
        ></textarea>

        <button
          onClick={askAI}
          disabled={loading}
          className="mt-3 px-5 py-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-all"
        >
          {loading ? "Thinking..." : "Ask AI 💬"}
        </button>

        {answer && (
          <div className="mt-4 p-4 rounded-lg border bg-white/40 dark:bg-black/30">
            <h2 className="font-semibold">AI Answer:</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
