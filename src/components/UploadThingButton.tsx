"use client";

import { UploadButton } from "@uploadthing/react";
import { useState } from "react";

export function UploadThingButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  return (
    <div className="flex flex-col items-center justify-center">
      {isProcessing && (
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-3 animate-pulse">
          {statusMessage || "⏳ Processing your PDF... Please wait"}
        </p>
      )}

      <UploadButton
        endpoint="pdfUploader"
        appearance={{
          button:
            "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition disabled:opacity-50",
          container:
            "border-2 border-dashed border-gray-400 dark:border-gray-600 p-6 rounded-lg bg-white/20 dark:bg-black/30 backdrop-blur-md text-center hover:scale-[1.02] transition-transform duration-200",
          allowedContent: "text-xs text-gray-500 mt-2",
        }}
        onClientUploadComplete={async (res) => {
          try {
            setIsProcessing(true);
            setStatusMessage("💾 Saving PDF to database...");

            const fileUrl = res[0].ufsUrl; // ✅ Correct UploadThing final URL
            const fileName = res[0].name;

            // Step 1 — Save uploaded PDF info to MongoDB
            const saveRes = await fetch("/api/save-pdf", {
              method: "POST",
              credentials: "include", // ✅ Send Clerk cookies
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileUrl, fileName }),
            });

            if (!saveRes.ok) {
              const errText = await saveRes.text();
              throw new Error("Save failed: " + errText);
            }

            const savedPdf = await saveRes.json();
            console.log("✅ Saved PDF:", savedPdf);

            // Step 2 — Trigger optional PDF processing route
            setStatusMessage("🧠 Extracting and embedding PDF content...");

            const processRes = await fetch("/api/process-pdf", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ pdfId: savedPdf.pdfId }),
            });

            const processResult = await processRes.json();
            console.log("✅ Process result:", processResult);

            setStatusMessage("🎉 Done! PDF is ready for chat.");
            setTimeout(() => setIsProcessing(false), 2000);

            alert("✅ PDF uploaded and processed successfully!");
          } catch (err) {
            console.error("❌ Error uploading or processing PDF:", err);
            alert("Failed to process PDF. Please try again.");
            setIsProcessing(false);
          }
        }}
        onUploadError={(err) => {
          console.error("❌ Upload error:", err);
          alert("Upload failed. Please try again.");
          setIsProcessing(false);
        }}
      />
    </div>
  );
}
