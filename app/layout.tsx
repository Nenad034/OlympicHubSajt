import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OlympicHub - Travel Platform",
  description: "Discover and book your next adventure with our AI-powered travel platform",
  keywords: ["travel", "hotels", "flights", "packages", "tourism", "vacation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
