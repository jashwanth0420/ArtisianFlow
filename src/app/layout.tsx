import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Market-Linkage System · Artisan Product Lifecycle",
  description:
    "An interactive system map tracing one artisan product from physical craft through AI cataloguing, market network, logistics, and demand intelligence to the next business decision.",
  other: {
    "theme-color": "#0a0713",
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
