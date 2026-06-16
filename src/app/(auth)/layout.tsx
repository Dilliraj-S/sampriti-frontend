import Navbar from "@/app/components/landing/Navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#FDFAF5] text-[#2C2A26]" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled />
      {children}
    </main>
  );
}
