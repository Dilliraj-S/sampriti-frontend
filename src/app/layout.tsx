import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Tenor_Sans } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/app/components/landing/CartDrawer";
import PromoStrip from "@/app/components/landing/PromoStrip";
import BackToTop from "@/app/components/landing/BackToTop";
import AuthProvider from "@/app/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${tenorSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <PromoStrip />
          {children}
          <BackToTop />
          <CartDrawer />
        </AuthProvider>
      </body>
    </html>
  );
}
