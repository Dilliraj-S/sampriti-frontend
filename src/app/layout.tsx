import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans, Inter, Tenor_Sans } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/app/components/landing/CartDrawer";
import PopupBanner from "@/app/components/landing/PopupBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const tenorSans = Tenor_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sampriti Botanicals - Rooted in Living Herbal Lineages",
  description: "A botanical house of ritual science and disciplined formulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${inter.variable} ${tenorSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <CartDrawer />
        <PopupBanner />
      </body>
    </html>
  );
}
