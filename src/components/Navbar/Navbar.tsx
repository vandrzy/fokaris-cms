"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const showSolidBackground = !isHomePage || isScrolled;

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        showSolidBackground 
          ? `bg-background/90 backdrop-blur-md text-header ${isScrolled ? 'shadow-md' : ''}` 
          : "bg-transparent text-white drop-shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-3">
            {/* Placeholder logo icon */}
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Link href="/" className="font-poppins font-bold text-xl tracking-wide">
              Organisasi.
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <Link href="/" className={`transition-colors font-medium text-sm uppercase tracking-wider ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`}>
              Beranda
            </Link>
            <Link href="/blog" className={`transition-colors font-medium text-sm uppercase tracking-wider ${isActive('/blog') ? 'text-primary' : 'hover:text-primary'}`}>
              Blog
            </Link>
            <Link href="/galeri" className={`transition-colors font-medium text-sm uppercase tracking-wider ${isActive('/galeri') ? 'text-primary' : 'hover:text-primary'}`}>
              Galeri
            </Link>
            
            <Link
              href="/login"
              className={`flex items-center gap-2 transition-colors font-medium text-sm uppercase tracking-wider ${isActive('/login') ? 'text-primary' : 'hover:text-primary'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Masuk
            </Link>
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background shadow-lg border-t border-gray-100">
          <div className="flex flex-col px-6 pt-4 pb-8 space-y-5 text-header">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`transition-colors font-bold text-base uppercase tracking-wider block ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`}
            >
              Beranda
            </Link>
            <Link 
              href="/blog" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`transition-colors font-bold text-base uppercase tracking-wider block ${isActive('/blog') ? 'text-primary' : 'hover:text-primary'}`}
            >
              Blog
            </Link>
            <Link 
              href="/galeri" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`transition-colors font-bold text-base uppercase tracking-wider block ${isActive('/galeri') ? 'text-primary' : 'hover:text-primary'}`}
            >
              Galeri
            </Link>
            
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 transition-colors font-bold text-base uppercase tracking-wider ${isActive('/login') ? 'text-primary' : 'hover:text-primary'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Masuk
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
