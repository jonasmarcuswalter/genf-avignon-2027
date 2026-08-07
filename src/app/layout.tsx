import type { Metadata } from "next";
import Script from "next/script";
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
      <body className="min-h-full flex flex-col">
        <Script id="reset-initial-scroll" strategy="beforeInteractive">{`
          (() => {
            if (window.location.hash) return;

            if ("scrollRestoration" in window.history) {
              window.history.scrollRestoration = "manual";
            }

            let userInteracted = false;
            let guardVersion = 0;

            const markInteraction = () => {
              userInteracted = true;
            };

            window.addEventListener("touchstart", markInteraction, { capture: true, passive: true });
            window.addEventListener("pointerdown", markInteraction, { capture: true, passive: true });
            window.addEventListener("wheel", markInteraction, { capture: true, passive: true });
            window.addEventListener("keydown", markInteraction, { capture: true });

            const hardReset = () => {
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              if (document.body) document.body.scrollTop = 0;
            };

            const guardTop = () => {
              if (window.location.hash) return;

              userInteracted = false;
              const version = ++guardVersion;
              const root = document.documentElement;
              const previousBehavior = root.style.getPropertyValue("scroll-behavior");
              const previousPriority = root.style.getPropertyPriority("scroll-behavior");
              const stopAt = Date.now() + 1500;

              root.style.setProperty("scroll-behavior", "auto", "important");

              const release = () => {
                if (previousBehavior) {
                  root.style.setProperty("scroll-behavior", previousBehavior, previousPriority);
                } else {
                  root.style.removeProperty("scroll-behavior");
                }
              };

              const keepAtTop = () => {
                if (version !== guardVersion) return;
                if (userInteracted || window.location.hash || Date.now() >= stopAt) {
                  release();
                  return;
                }

                hardReset();
                window.requestAnimationFrame(keepAtTop);
              };

              keepAtTop();
            };

            hardReset();
            window.addEventListener("pageshow", guardTop);
          })();
        `}</Script>
        {children}
      </body>
    </html>
  );
}
