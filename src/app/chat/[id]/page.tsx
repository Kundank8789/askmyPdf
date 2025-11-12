"use client";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { id } = useParams();
  type Pdf = { _id: string; fileUrl: string; fileName: string } | null;
  const [pdf, setPdf] = useState<Pdf>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  type Message = { role: "user" | "assistant"; content: string };
  const [messages, setMessages] = useState<Message[]>([]);

  // ✅ Fetch single PDF details
  useEffect(() => {
    const fetchPdf = async () => {
      const res = await fetch(`/api/get-pdfs`);
      const data = await res.json();
      const singlePdf = data.find(
        (item: { _id: string }) => item._id === id
      ) as Pdf;
      setPdf(singlePdf);
    };
    fetchPdf();
  }, [id]);

  // ✅ Ask AI about the PDF
  const askAI = async () => {
    if (!question.trim()) return;

    setMessages((p) => [...p, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfId: id, question }),
      });

      const data = await res.json();
      setAnswer(data.answer);
      setMessages((p) => [...p, { role: "assistant", content: data.answer }]);
    } catch (err) {
      console.error("❌ Error asking AI:", err);
      alert("Something went wrong while processing your question.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Summarize PDF using /api/summarize (fixed route)
  const summarizePDF = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfId: id }),
      });

      if (!res.ok) throw new Error("Failed to summarize PDF");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "🧾 Summary:\n" + data.summary },
      ]);
    } catch (err) {
      console.error("❌ Error summarizing PDF:", err);
      alert("Something went wrong while summarizing the PDF.");
    } finally {
      setLoading(false);
    }
  };

  if (!pdf) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{pdf.fileName}</h1>
      <iframe
        src={pdf.fileUrl}
        className="w-full h-[500px] border rounded-xl"
      />

      <div className="mt-6">
        {/* 🧩 Chat history */}
        <div className="space-y-4 mt-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[75%] ${
                m.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>

        {/* 🧠 Input box */}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something about this PDF..."
          className="w-full p-3 rounded-lg border dark:border-gray-700 bg-white/80 dark:bg-black/40"
        ></textarea>

        {/* ✅ Buttons (with better spacing) */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <button
            onClick={askAI}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask AI 💬"}
          </button>

          <button
            onClick={summarizePDF}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Summarizing..." : "Summarize PDF 🧠"}
          </button>
        </div>

        {/* ✅ AI Answer Section */}
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
