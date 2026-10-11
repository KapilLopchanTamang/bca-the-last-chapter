import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MEMORY_CONFIG } from "@/lib/memory-config";

export const metadata: Metadata = {
  metadataBase: new URL(MEMORY_CONFIG.share.url),
  title: `${MEMORY_CONFIG.opening.title} | Graduation Memory Experience`,
  description: MEMORY_CONFIG.share.description,
  keywords: ["BCA", "Graduation", "Farewell", "Memories", "3D WebGL", "Interactive Experience"],
  authors: [{ name: MEMORY_CONFIG.batchName }],
  openGraph: {
    title: MEMORY_CONFIG.opening.title,
    description: MEMORY_CONFIG.share.description,
    url: MEMORY_CONFIG.share.url,
    siteName: "BCA — The Last Chapter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: MEMORY_CONFIG.opening.title,
    description: MEMORY_CONFIG.share.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#07090e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-cream overflow-hidden">
        <div className="film-grain" />
        {children}
      </body>
    </html>
  );
}
