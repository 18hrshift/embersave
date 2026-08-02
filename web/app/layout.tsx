import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { brand } from "@/lib/brand";
import "./globals.css";

/* Brand §10: Inter for interface and copy, JetBrains Mono for exact values. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE = "https://embersave.18hrshift.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  keywords: [
    "shared save",
    "co-op survival",
    "Palworld",
    "dedicated server alternative",
    "save sync",
    "open source",
    "self-hosted",
  ],
  authors: [{ name: "18hrshift", url: "https://github.com/18hrshift" }],
  creator: "18hrshift",
  openGraph: {
    type: "website",
    url: SITE,
    siteName: brand.name,
    /* Brand §17, GitHub social preview line. */
    title: `${brand.name} — Your world. Any host.`,
    description: brand.short,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Your world. Any host.`,
    description: brand.short,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#17191c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
