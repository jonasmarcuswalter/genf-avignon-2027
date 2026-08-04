import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jonasmarcuswalter.github.io/genf-avignon-2027/"),
  title: "Genf → Avignon 2027 | Alpen Bikepacking",
  description: "Der Tour-Kompass für 900 km, 17.000 Höhenmeter und 14 französische Cols.",
  openGraph: {
    title: "Genf → Avignon 2027",
    description: "900 km, 17.000 Höhenmeter, 14 Cols. Der Alpen-Bikepacking-Tourkompass.",
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
