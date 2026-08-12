import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="font-poppins font-bold text-2xl text-primary">
              Organisasi.
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-header hover:text-primary transition-colors duration-300 font-medium"
              >
                Beranda
              </Link>
              <Link
                href="/blog"
                className="text-header hover:text-primary transition-colors duration-300 font-medium"
              >
                Blog
              </Link>
              <Link
                href="/galeri"
                className="text-header hover:text-primary transition-colors duration-300 font-medium"
              >
                Galeri
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <Link
              href="#gabung"
              className="bg-primary hover:bg-secondary text-white px-5 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Gabung Sekarang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
