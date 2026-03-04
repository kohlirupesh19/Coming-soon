import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Akruit Labs | Intelligent Digital Systems",
  description:
    "Akruit Labs designs modern web platforms, AI-powered software, and scalable digital products for forward-looking teams.",
  metadataBase: new URL("https://akruitlabs.com"),
  openGraph: {
    title: "Akruit Labs",
    description:
      "Engineering-first startup building intelligent digital systems for long-term technology growth.",
    url: "https://akruitlabs.com",
    siteName: "Akruit Labs",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Akruit Labs",
    description:
      "Modern engineering for scalable web, cloud, and AI products."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} bg-background font-sans text-text antialiased`}>
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-accent-gradient focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
