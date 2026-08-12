import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 animate-pulse">
            Bersama Membangun Masa Depan
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight max-w-4xl">
            Langkah Nyata Untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Perubahan</span>
          </h1>
          <p className="text-lg md:text-xl text-body mb-10 max-w-2xl leading-relaxed">
            Bergabunglah bersama kami dalam berbagai inisiatif sosial. Jadilah agen perubahan dan ciptakan dampak positif yang berarti di lingkunganmu hari ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#gabung"
              className="bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(11,191,191,0.5)] hover:shadow-[0_10px_35px_-5px_rgba(255,140,66,0.6)] hover:-translate-y-1"
            >
              Mulai Beraksi
            </Link>
            <Link
              href="/galeri"
              className="bg-white text-header border-2 border-gray-200 hover:border-primary px-8 py-3.5 rounded-full font-bold text-lg transition-all duration-300 hover:text-primary hover:shadow-lg"
            >
              Lihat Dokumentasi
            </Link>
          </div>
        </div>
      </section>

      {/* Feature / Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-background border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center group">
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-header mb-2 font-poppins">5K+</h3>
              <p className="text-body font-medium">Relawan Aktif</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-background border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center group">
              <div className="w-16 h-16 mx-auto bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-header mb-2 font-poppins">120+</h3>
              <p className="text-body font-medium">Program Terlaksana</p>
            </div>

            <div className="p-8 rounded-3xl bg-background border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center group">
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-header mb-2 font-poppins">34</h3>
              <p className="text-body font-medium">Kota & Kabupaten</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-header text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-poppins text-white">Siap Untuk Berkontribusi?</h2>
          <p className="text-gray-300 text-lg mb-10">Jadilah bagian dari solusi nyata. Setiap langkah kecilmu membawa perubahan besar bagi mereka yang membutuhkan.</p>
          <Link
            href="/blog"
            className="inline-block bg-secondary hover:bg-[#ff7a29] text-white px-10 py-4 rounded-full font-bold text-lg transition-transform duration-300 hover:scale-105 shadow-xl"
          >
            Pelajari Program Kami
          </Link>
        </div>
      </section>
    </div>
  );
}
