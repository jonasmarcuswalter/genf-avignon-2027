import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jonasmarcuswalter.github.io/genf-avignon-2027/"),
  title: "Auf der Spuren der Cols der Tour | Genf → Avignon 2027",
  description: "Auf der Spuren der Cols der Tour: 900 km, 17.000 Höhenmeter und 14 französische Cols.",
  openGraph: {
    title: "Auf der Spuren der Cols der Tour",
    description: "Genf → Avignon 2027: 900 km, 17.000 Höhenmeter, 14 Cols.",
    images: [{ url: "/og.png", width: 1792, height: 896, alt: "Alpenstraße für die Genf–Avignon-Rennradtour" }],
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
