"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  ClipboardList,
  Users,
  Tag,
  FileText,
  Star,
  BarChart3,
  CreditCard,
  Truck,
  Image as ImageIcon,
  Bell,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const adminNav = [
  {
    label: "CORE",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "CATALOG",
    items: [
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Categories", href: "/admin/categories", icon: FolderTree },
      { name: "Inventory", href: "/admin/inventory", icon: ClipboardList },
    ],
  },
  {
    label: "SALES",
    items: [
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Payments", href: "/admin/payments", icon: CreditCard },
      { name: "Shipping", href: "/admin/shipping", icon: Truck },
    ],
  },
  {
    label: "CUSTOMERS & MARKETING",
    items: [
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Promotions", href: "/admin/promotions", icon: Tag },
      { name: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { name: "Blog & CMS", href: "/admin/content", icon: FileText },
      { name: "Banners", href: "/admin/banners", icon: ImageIcon },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="pl-2 pr-4 pt-6 pb-4 border-b border-gray-200">
        {!collapsed ? (
          <div>
            <img src="/assets/sampriti-wordmark.svg" alt="Sampriti" className="h-8 w-auto" />
            <p className="text-[12px] pl-3 text-gray-500 font-bold uppercase tracking-wider">Botanicals</p>
          </div>
        ) : (
          <img src="/assets/sampriti-wordmark.svg" alt="Sampriti" className="h-8 w-auto" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin">
        {adminNav.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-gray-100 text-gray-900 border border-gray-200 shadow-sm"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-700"} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white text-gray-700 shadow-lg border border-gray-200"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full bg-white shadow-2xl border-r border-gray-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-sm z-40 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
