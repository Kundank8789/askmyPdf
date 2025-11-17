"use client";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UploadThingButton } from "@/components/UploadThingButton";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useUser();
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const fetchPDFs = async () => {
      const res = await fetch("/api/get-pdfs");
      const data = await res.json();
      setPdfs(data);
    };
    fetchPDFs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.fullName || "User"} 👋
      </h1>
      <p className="text-gray-500 dark:text-gray-300 mt-2">
        Upload PDFs and start chatting with them below.
      </p>

      <div className="mt-6">
        <UploadThingButton />
      </div>

      {/* Display PDFs */}
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfs.length === 0 ? (
          <p className="text-gray-500">No PDFs uploaded yet.</p>
        ) : (
          pdfs.map((pdf: any) => (
            <div
              key={pdf._id}
              className="p-5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-black/30 backdrop-blur-md shadow-sm hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg truncate">{pdf.fileName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Uploaded on {new Date(pdf.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <a
                  href={pdf.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  View PDF
                </a>

                <Link
                  href={`/chat/${pdf._id}`}
                  className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Chat 💬
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
