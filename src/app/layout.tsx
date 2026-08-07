import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jonasmarcuswalter.github.io/genf-avignon-2027/"),
  title: "Ullaub – Tour des Cols | Genf → Avignon 2027",
  description: "Zehn Tage Strampelplan, fünf Tage Ullaub-Zone: Genf → Avignon 2027.",
  openGraph: {
    title: "Ullaub – Tour des Cols",
    description: "Genf → Avignon 2027: zehn Tage Strampelplan, fünf Tage Ullaub-Zone und 14 Cols.",
    images: [{ url: "/og.png", width: 1774, height: 887, alt: "Ullaub – Tour des Cols: Genf nach Avignon 2027" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
