import type { Metadata } from "next";
import { Inter, Instrument_Serif, Chakra_Petch } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra-petch",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXA Ops Handbook",
  description:
    "NEXA's internal operations platform — SOPs, credentials, team, documents, and tools.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${chakraPetch.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
