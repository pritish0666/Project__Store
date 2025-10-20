import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Hub - Showcase Your Personal Projects",
  description:
    "Discover, rate, and review amazing personal projects. A Play Store-like experience for developers to showcase their work.",
  keywords: [
    "projects",
    "portfolio",
    "developer",
    "showcase",
    "reviews",
    "ratings",
  ],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Project Hub - Showcase Your Personal Projects",
    description:
      "Discover, rate, and review amazing personal projects. A Play Store-like experience for developers to showcase their work.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Hub - Showcase Your Personal Projects",
    description:
      "Discover, rate, and review amazing personal projects. A Play Store-like experience for developers to showcase their work.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
