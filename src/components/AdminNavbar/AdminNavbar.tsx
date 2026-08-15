"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, LogOut, User, PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/Sidebar/SidebarContext";

export default function AdminNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { setIsOpen } = useSidebar();

  // Parse a readable title from pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("/dashboard/blog")) return "Manajemen Blog";
    if (pathname.includes("/dashboard/gallery")) return "Manajemen Galeri";
    if (pathname.includes("/dashboard/pages")) return "Manajemen Halaman";
    if (pathname.includes("/dashboard/settings")) return "Pengaturan Admin";
    return "Dashboard";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8">
      {/* Page Title & Mobile Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 -ml-2 text-header hover:bg-gray-100 rounded-md transition-colors"
        >
          <PanelLeft className="w-6 h-6" />
        </button>
        <h1 className="font-poppins text-xl md:text-2xl font-bold text-header">
          {getPageTitle()}
        </h1>
      </div>

      {/* User Profile */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors focus:outline-none"
        >
          <User className="w-5 h-5" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-50">
            <div className="p-4 border-b border-gray-50">
              <p className="text-sm font-semibold text-header">Admin User</p>

            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-body hover:bg-gray-50 rounded-md transition-colors">
                <Settings className="w-4 h-4" />
                Pengaturan
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-1">
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
