import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K2viewer",
  description: "Interactive vitamin K database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}