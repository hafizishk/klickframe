import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { STUDIO } from "@/lib/content";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${STUDIO.name} — Photo, film and live production. ${STUDIO.city}.`,
  description:
    "A Singapore photo, film and live production studio. Weddings, boardrooms, brands, stages and stadiums — one crew, from first call to final grade.",
  openGraph: {
    title: `${STUDIO.name} — Photo, film and live production`,
    description:
      "Multi-camera live production with on-screen graphics, photography and film, run end to end from Singapore.",
    locale: "en_SG",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070707",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
