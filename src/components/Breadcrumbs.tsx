import { ChevronRight } from "lucide-react";

interface Crumb { label?: string; href?: string; icon?: React.ReactNode; }

export default function Breadcrumb({ title, items }: { title?: string; items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} className="text-gray-300" />}
          {item.icon ? item.icon : item.href ? <a href={item.href} className="hover:text-gray-700 transition-colors">{item.label}</a> : <span className="text-gray-900 font-medium">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}