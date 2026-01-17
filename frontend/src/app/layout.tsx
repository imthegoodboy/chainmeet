import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ChainMeet - Privacy-First Web3 Meetings",
  description: "Join private meetings with zero-knowledge proofs. Prove eligibility without revealing your identity. Built on Aleo blockchain.",
  keywords: ["Aleo", "Web3", "Privacy", "Zero Knowledge", "Meetings", "Blockchain", "ZK Proofs"],
  authors: [{ name: "ChainMeet Team" }],
  openGraph: {
    title: "ChainMeet - Privacy-First Web3 Meetings",
    description: "Join private meetings with zero-knowledge proofs on Aleo blockchain.",
    type: "website",
    locale: "en_US",
    siteName: "ChainMeet",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainMeet - Privacy-First Web3 Meetings",
    description: "Join private meetings with zero-knowledge proofs on Aleo blockchain.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-white via-sky-50/30 to-white">
          {children}
        </main>
        <footer className="bg-slate-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/icon.svg" alt="ChainMeet" className="w-8 h-8" />
              <span className="font-semibold text-lg">ChainMeet</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Privacy-First Web3 Meetings on Aleo
            </p>
            <div className="flex justify-center gap-6 text-sm text-slate-400">
              <span>Built with ❤️ for privacy</span>
              <span>•</span>
              <a href="https://aleo.org" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                Powered by Aleo
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
              Contracts: meeting_chainmeet_7879.aleo • eligibility_chainmeet_8903.aleo • attendance_chainmeet_1735.aleo
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
