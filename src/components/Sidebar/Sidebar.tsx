"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/Sidebar/SidebarContext";
import {
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  PanelsTopLeft,
  Settings,
  LogOut,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    category: "Metadata",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Blog", href: "/dashboard/blog", icon: Newspaper },
      { name: "Galeri", href: "/dashboard/gallery", icon: ImageIcon },
    ],
  },
  {
    category: "Manajemen Konten",
    items: [
      { name: "Halaman Beranda", href: "/dashboard/pages/home", icon: PanelsTopLeft },
      { name: "Halaman Blog", href: "/dashboard/pages/blog", icon: PanelsTopLeft },
      { name: "Halaman Galeri", href: "/dashboard/pages/gallery", icon: PanelsTopLeft },
    ],
  },
  {
    category: "Pengaturan Admin",
    items: [
      { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, setIsOpen } = useSidebar();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[80%] max-w-sm bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:w-64 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <img src="/logo.png" alt="Admin Logo" className="h-8 w-auto object-contain" />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {SIDEBAR_ITEMS.map((group, index) => (
          <div key={index} className="mb-6 px-4">
            <h2 className="px-2 mb-2 text-xs font-bold font-poppins text-body/70 uppercase tracking-wider">
              {group.category}
            </h2>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-body hover:bg-primary/10 hover:text-primary"
                        }`}
                    >
                      <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-body/70 group-hover:text-primary"}`} />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-red-600 hover:bg-red-50">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </div>
    </aside>
    </>
  );
}
