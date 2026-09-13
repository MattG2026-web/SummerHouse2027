import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Summer House",
  description: "Private booking site.",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
