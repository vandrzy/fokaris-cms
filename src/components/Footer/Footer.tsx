import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-header text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-poppins text-2xl font-bold mb-4 text-primary">Organisasi.</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Kami adalah wadah penggerak aksi positif untuk membangun masyarakat yang lebih baik. Mari bersama-sama menciptakan perubahan nyata di sekitar kita.
            </p>
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4">Tautan Pantas</h4>
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
            <h4 className="font-poppins font-semibold text-lg mb-4">Hubungi Kami</h4>
            <p className="text-sm text-gray-400 mb-2">Email: info@organisasi.id</p>
            <p className="text-sm text-gray-400 mb-2">Telepon: +62 811 2345 6789</p>
            <p className="text-sm text-gray-400">Gedung Harmoni Lt. 4, Jakarta</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Organisasi. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social Icons Placeholder */}
            <div className="w-8 h-8 rounded-full bg-gray-700 hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="w-8 h-8 rounded-full bg-gray-700 hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="w-8 h-8 rounded-full bg-gray-700 hover:bg-primary transition-colors cursor-pointer"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
