// src/app/layout.tsx
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { UploadThingButton } from "@/components/UploadThingButton";

export const metadata: Metadata = {
  title: "AskMyPDF — AI PDF Chat",
  description: "Upload PDFs and chat with them instantly.",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem={false} >
            <Toaster />
            <div className="min-h-screen bg-linear-to-b from-white/70 to-white/40 dark:from-[#0b1220] dark:to-[#03111a]">
              <Navbar />
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
