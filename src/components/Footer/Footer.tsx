import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-header text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Image src="/logo.png" alt="Logo" width={160} height={56} className="h-14 w-auto object-contain" />
            </div>

          </div>
          <div>
            <h4 className="font-poppins font-semibold text-lg text-gray-600 mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-secondary transition-colors duration-200">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-secondary transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-secondary transition-colors duration-200">
                  Galeri
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4 text-gray-600">Hubungi Kami</h4>
            <p className="text-sm text-gray-400 mb-2">Email: info@organisasi.id</p>
            <p className="text-sm text-gray-400 mb-2">Telepon: +62 811 2345 6789</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Fokaris
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-primary transition-colors flex items-center justify-center text-white cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
