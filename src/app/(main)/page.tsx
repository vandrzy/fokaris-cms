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
  aboutText: "Misi kami adalah mewujudkan organisasi yang sejahtera, mandiri, dan berbudaya melalui kolaborasi aktif, pemanfaatan potensi yang berkelanjutan, serta pelayanan publik yang transparan.Misi kami adalah mewujudkan organisasi yang sejahtera, mandiri, dan berbudaya melalui kolaborasi aktif, pemanfaatan potensi yang berkelanjutan, serta pelayanan publik yang transparan.Misi kami adalah mewujudkan organisasi yang sejahtera, mandiri, dan berbudaya melalui kolaborasi aktif, pemanfaatan potensi yang berkelanjutan, serta pelayanan publik yang transparan.",
  stats: [
    { id: 1, value: "103+", label: "TOTAL ANGGOTA" },
    { id: 2, value: "24", label: "KEGIATAN TERLAKSANA" }
  ],
  galleryData: [
    { id: 1, src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Kegiatan Sosial 1" },
    { id: 2, src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Kegiatan Pendidikan 2" },
    { id: 3, src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Kegiatan Lingkungan 3" },
    { id: 4, src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Komunitas 4" },
  ]
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(1);
  const [textData, setTextData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/beranda/text')
      .then(res => res.json())
      .then(data => setTextData(data))
      .catch(console.error);
  }, []);

  const heroImages = [];
  if (textData) {
    if (textData.hero_image_1?.value) heroImages.push(textData.hero_image_1.value);
    if (textData.hero_image_2?.value) heroImages.push(textData.hero_image_2.value);
    if (textData.hero_image_3?.value) heroImages.push(textData.hero_image_3.value);
  }
  const activeHeroImages = heroImages.length > 0 ? heroImages : cmsData.heroImages;

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeHeroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeHeroImages.length]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 3.1 Hero Section (Slider) */}
      <section className="relative w-full h-screen overflow-hidden bg-header flex items-center">
        {/* Background Images */}
        {activeHeroImages.map((src, index) => (
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
                {textData ? textData.hero_title?.value : cmsData.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed drop-shadow-md">
                {textData ? textData.hero_subtitle?.value : cmsData.heroSubtitle}
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
              {activeHeroImages.map((_, idx) => (
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
              {textData ? textData.about_title?.value : cmsData.aboutTitle}
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

            {/* Left: Mission Statement */}
            <div className="w-full lg:w-2/3">
              <p className="text-[18px] text-body leading-relaxed font-medium whitespace-pre-line">
                {textData ? textData.about_desc?.value : cmsData.aboutText}
              </p>
            </div>

            {/* Right: Stats */}
            <div className="w-full lg:w-1/3 flex flex-col space-y-8 lg:pl-12 lg:border-l border-gray-200">
              {[1, 2].map((num, index) => {
                const statValue = textData ? textData[`stat_${num}_value`]?.value : cmsData.stats[index].value;
                const statLabel = textData ? textData[`stat_${num}_label`]?.value : cmsData.stats[index].label;
                
                return (
                  <div key={num} className="flex flex-col">
                    <span className="text-5xl md:text-6xl font-bold text-primary font-poppins mb-2">
                      {statValue}
                    </span>
                    <span className="text-sm font-semibold text-gray-500 tracking-wider">
                      {statLabel}
                    </span>
                    {/* Subtle divider except for last item */}
                    {index !== 1 && (
                      <div className="h-px w-16 bg-gray-200 mt-6"></div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 3.3 Galeri Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-[20px] md:text-[32px] font-bold text-header font-poppins mb-4">
                Galeri Kegiatan
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full"></div>
            </div>
            <Link
              href="/galeri"
              className="inline-flex items-center justify-center gap-2 text-primary hover:text-primary/80 text-lg font-medium transition-colors duration-300 whitespace-nowrap"
            >
              Lihat Semua Foto
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center mt-12 mb-4">
            {cmsData.galleryData.map((item, index) => {
              const total = cmsData.galleryData.length;
              let state = 'hidden';
              if (index === activeGalleryIndex) state = 'active';
              else if (index === (activeGalleryIndex - 1 + total) % total) state = 'prev';
              else if (index === (activeGalleryIndex + 1) % total) state = 'next';

              return (
                <div
                  key={item.id}
                  className={`absolute transition-all duration-700 ease-in-out group ${state === 'active'
                    ? 'z-20 w-[85%] md:w-[65%] h-full opacity-100 shadow-2xl scale-100 rounded-3xl'
                    : state === 'prev'
                      ? 'z-10 w-[40%] md:w-[30%] h-[70%] opacity-60 -translate-x-[90%] md:-translate-x-[110%] scale-95 rounded-2xl cursor-pointer hover:opacity-100'
                      : state === 'next'
                        ? 'z-10 w-[40%] md:w-[30%] h-[70%] opacity-60 translate-x-[90%] md:translate-x-[110%] scale-95 rounded-2xl cursor-pointer hover:opacity-100'
                        : 'z-0 w-[40%] md:w-[30%] h-[70%] opacity-0 scale-90 pointer-events-none'
                    }`}
                  onClick={() => {
                    if (state === 'prev' || state === 'next') setActiveGalleryIndex(index);
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover rounded-[inherit]"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 rounded-[inherit] transition-opacity duration-300 ${state === 'active' ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
                    <h3 className="text-white font-bold text-xl md:text-3xl drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.alt}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-3 mt-6 mb-8">
            {cmsData.galleryData.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveGalleryIndex(idx); }}
                className={`transition-all duration-300 rounded-full shadow-sm ${idx === activeGalleryIndex ? "bg-primary w-8 h-2.5" : "bg-gray-300 w-2.5 h-2.5 hover:bg-gray-400"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
