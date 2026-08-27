"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTextData } from "@/context/TextContext";
import Image from "next/image";
import cloudinaryLoader from "@/lib/cloudinary-loader";

type GalleryItem = {
  judul: string;
  "link gambar": string;
  shortcode: string;
  color: string;
  height: string;
};

const ITEMS_PER_PAGE = 9;

export default function Galeri() {
  const textData = useTextData();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Random styles for the masonry effect
  const colors = [
    "bg-primary/20", "bg-secondary/20", "bg-blue-200", 
    "bg-primary/30", "bg-orange-200", "bg-secondary/30", 
    "bg-teal-200", "bg-purple-200", "bg-primary/40"
  ];
  const heights = ["h-64", "h-80", "h-96", "h-72"];

  const fetchGallery = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/galeri?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const result = await res.json();
      
      if (res.ok) {
        const fetchedItems = (result.data || []).map((item: any, index: number) => ({
          ...item,
          color: colors[index % colors.length],
          height: heights[index % heights.length]
        }));

        if (page === 1) {
          setItems(fetchedItems);
        } else {
          setItems(prev => [...prev, ...fetchedItems]);
        }
        setTotalPages(result.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(1);
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchGallery(nextPage);
      }
    }, { rootMargin: '100px' });
    
    if (node) observer.current.observe(node);
  }, [isLoading, currentPage, totalPages]);

  return (
    <div className="pt-20 pb-32 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-10 md:mt-16 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-header mb-4">
            {textData ? textData.galeri_hero_title?.value : "Galeri Kegiatan"}
          </h1>
          <p className="text-lg text-body max-w-2xl mx-auto">
            {textData ? textData.galeri_hero_subtitle?.value : "Jejak langkah nyata kami tergambar dalam momen-momen kebersamaan, perjuangan, dan senyum bahagia mereka yang terbantu."}
          </p>
        </div>

        {items.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500 py-12">
            Belum ada foto galeri yang diunggah.
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item, index) => {
              const isLastItem = index === items.length - 1;
              return (
                <div
                  ref={isLastItem ? lastItemRef : null}
                  key={`${item.shortcode}-${index}`}
                  className={`relative rounded-3xl overflow-hidden group cursor-pointer break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-300 ${item.height} ${item.color}`}
                  onClick={() => setSelectedImage(item)}
                >
                  <Image 
                    loader={cloudinaryLoader}
                    src={item["link gambar"]} 
                    alt={item.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-header/90 via-header/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <h3 className="text-white font-bold font-poppins text-xl">{item.judul}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isLoading && (
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center max-w-6xl">
            <button 
              className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white p-2 z-50 bg-black/30 hover:bg-black/50 rounded-full transition-all"
              onClick={() => setSelectedImage(null)}
              title="Tutup"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <Image 
              loader={cloudinaryLoader}
              src={selectedImage["link gambar"]} 
              alt={selectedImage.judul}
              width={1600}
              height={900}
              className="w-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="mt-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-white text-2xl font-bold font-poppins tracking-wide">
                {selectedImage.judul}
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
