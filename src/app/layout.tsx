import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata = {
  title: "AskMyPDF",
  description: "Chat with and summarize PDFs using AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
