"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// CMS Mock Data
const cmsData = {
  heroTitle: "Membangun Organisasi yang Lebih Mandiri dan Sejahtera",
  heroSubtitle: "Bergabunglah bersama kami dalam berbagai inisiatif sosial. Jadilah agen perubahan dan ciptakan dampak positif yang berarti.",
  heroImages: [
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
  ],
  aboutTitle: "Tentang Organisasi Kami",
  aboutText: "Misi kami adalah mewujudkan organisasi yang sejahtera, mandiri, dan berbudaya melalui kolaborasi aktif, pemanfaatan potensi yang berkelanjutan, serta pelayanan publik yang transparan.",
  stats: [
    { id: 1, value: "103+", label: "TOTAL ANGGOTA" },
    { id: 2, value: "24", label: "KEGIATAN TERLAKSANA" }
  ],
  galleryData: [
    { id: 1, src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Kegiatan Sosial 1" },
    { id: 2, src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Kegiatan Pendidikan 2" },
    { id: 3, src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Kegiatan Lingkungan 3" },
    { id: 4, src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Komunitas 4" },
    { id: 5, src: "https://images.unsplash.com/photo-1593113565694-c6f33e370a80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Bantuan Bencana 5" },
    { id: 6, src: "https://images.unsplash.com/photo-1531844251246-9a1bfa80c8a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Donor Darah 6" },
  ]
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cmsData.heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 3.1 Hero Section (Slider) */}
      <section className="relative w-full h-screen overflow-hidden bg-header flex items-center">
        {/* Background Images */}
        {cmsData.heroImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-[20s]"
              style={{ backgroundImage: `url(${src})` }}
            />
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          </div>
        ))}

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full flex justify-between items-end">
            {/* Left Content */}
            <div className="max-w-2xl text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins text-white mb-6 leading-tight drop-shadow-lg">
                {cmsData.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed drop-shadow-md">
                {cmsData.heroSubtitle}
              </p>
              <Link
                href="#profil"
                className="inline-flex items-center gap-3 bg-transparent border-2 border-primary text-white hover:bg-primary px-8 py-3 rounded-full font-bold text-lg transition-all duration-300"
              >
                Lihat Profil
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Right Content: Slider Indicators */}
            <div className="hidden md:flex items-center gap-3 mb-4">
              {cmsData.heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full bg-white ${idx === currentSlide ? "w-10 h-2 opacity-100" : "w-2 h-2 opacity-50 hover:opacity-100"
                    }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3.2 About Section */}
      <section id="profil" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-[20px] md:text-[32px] font-bold text-header font-poppins mb-4">
              {cmsData.aboutTitle}
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            
            {/* Left: Mission Statement */}
            <div className="w-full lg:w-2/3">
              <p className="text-[18px] text-body leading-relaxed font-medium">
                {cmsData.aboutText}
              </p>
            </div>

            {/* Right: Stats */}
            <div className="w-full lg:w-1/3 flex flex-col space-y-8 lg:pl-12 lg:border-l border-gray-200">
              {cmsData.stats.map((stat, index) => (
                <div key={stat.id} className="flex flex-col">
                  <span className="text-5xl md:text-6xl font-bold text-primary font-poppins mb-2">
                    {stat.value}
                  </span>
                  <span className="text-sm font-semibold text-gray-500 tracking-wider">
                    {stat.label}
                  </span>
                  {/* Subtle divider except for last item */}
                  {index !== cmsData.stats.length - 1 && (
                    <div className="h-px w-16 bg-gray-200 mt-6"></div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3.3 Galeri Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[20px] md:text-[32px] font-bold text-header font-poppins mb-4">
              Galeri Kegiatan
            </h2>
            <p className="text-body text-lg">Momen-momen bermakna dalam setiap langkah perjalanan kami.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cmsData.galleryData.map((item) => (
              <div
                key={item.id}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-gray-100"
              >
                {/* Fallback color/placeholder if Next Image requires domains configured, using standard img tag for ease with unsplash */}
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-bold font-poppins text-lg">{item.alt}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/galeri"
              className="inline-block bg-white border border-gray-300 text-header hover:border-primary hover:text-primary px-8 py-3 rounded-full font-bold transition-all duration-300"
            >
              Lihat Semua Foto
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
