"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import cloudinaryLoader from "@/lib/cloudinary-loader";

type BlogData = {
  judul: string;
  "isi blog": string;
  "cover link": string;
  "tanggal dupload": string;
};

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const shortcode = params.shortcode as string;

  const [data, setData] = useState<BlogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/blog?shortcode=${shortcode}`);
        const result = await res.json();
        
        if (res.ok && result.data) {
          setData(result.data);
        } else {
          toast.error("Gagal memuat data blog.");
          router.push('/blog');
        }
      } catch (error) {
        toast.error("Terjadi kesalahan server.");
        router.push('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shortcode, router]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="pt-24 pb-32 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link 
          href="/blog"
          className="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Blog
        </Link>

        <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          
          {data["cover link"] && (
            <div className="w-full h-[400px] relative">
              <Image 
                loader={cloudinaryLoader}
                src={data["cover link"]} 
                alt={data.judul} 
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="flex items-center text-gray-400 mb-6">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-medium">{formatDate(data["tanggal dupload"])}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-header mb-8 font-poppins leading-tight">
              {data.judul}
            </h1>

            <div 
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: data["isi blog"] || "" }}
            />
          </div>
        </article>

      </div>
    </div>
  );
}
