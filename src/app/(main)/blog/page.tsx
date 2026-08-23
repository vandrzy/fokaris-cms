"use client";

import { useState, useEffect, useCallback } from "react";
import { useTextData } from "@/context/TextContext";
import Link from "next/link";
import { Calendar, Search, Loader2 } from "lucide-react";

type BlogItem = {
  id: string;
  shortcode: string;
  "cover link": string;
  judul: string;
  "tanggal dupload": string;
  "isi blog": string;
};

export default function Blog() {
  const textData = useTextData();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/blog?nama=${searchQuery}`);
      const result = await res.json();
      if (res.ok) {
        setPosts(result.data || []);
      }
    } catch (error) {
      console.error("Gagal memuat blog:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="pt-20 pb-32 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-10 md:mt-16 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-header mb-4">
            {textData ? textData.blog_hero_title?.value : "Blog & Publikasi"}
          </h1>
          <p className="text-lg text-body max-w-2xl mx-auto">
            {textData ? textData.blog_hero_subtitle?.value : "Ikuti perkembangan terbaru, cerita inspiratif, dan laporan kegiatan dari berbagai program yang telah kami jalankan."}
          </p>
        </div>

        <div className="flex justify-end mb-8">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
              placeholder="Cari berdasarkan judul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.shortcode}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col h-full group"
              >
                <div className={`h-48 w-full bg-primary/10 relative overflow-hidden flex items-center justify-center`}>
                  {post["cover link"] ? (
                    <img src={post["cover link"]} alt={post.judul} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50`}></div>
                  )}
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-end mb-4 text-gray-400">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span className="text-sm font-medium">{formatDate(post["tanggal dupload"])}</span>
                  </div>
                  <h2 className="text-xl font-bold text-header mb-8 font-poppins group-hover:text-primary transition-colors line-clamp-2" title={post.judul}>
                    {post.judul}
                  </h2>
                  <Link
                    href={`/blog/${post.shortcode}`}
                    className="inline-flex items-center text-primary font-semibold hover:text-secondary transition-colors mt-auto"
                  >
                    Baca Selengkapnya
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Pencarian Tidak Ditemukan</h3>
            <p className="text-gray-500">Kami tidak dapat menemukan blog dengan judul tersebut.</p>
          </div>
        )}
      </div>
    </div>
  );
}
