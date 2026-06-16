import { ReactNode } from "react";
import "./globals.css";

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen antialiased">
      {children}
    </div>
  );
}
