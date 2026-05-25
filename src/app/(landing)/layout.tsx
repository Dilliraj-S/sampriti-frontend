import { ReactNode } from "react";
import "./globals.css";
import PromoStrip from "@/app/components/landing/PromoStrip";

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen antialiased">
      <PromoStrip />
      {children}
    </div>
  );
}
