"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImageIcon, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

function GalleryUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editShortcode = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!editShortcode);

  useEffect(() => {
    if (editShortcode) {
      const fetchEditData = async () => {
        try {
          const res = await fetch(`/api/galeri?shortcode=${editShortcode}`);
          const result = await res.json();
          if (res.ok && result.data) {
            setTitle(result.data.judul || '');
            setPreviewUrl(result.data["link gambar"] || null);
          } else {
            toast.error(result.message || "Gagal mengambil data");
            router.push('/dashboard/gallery');
          }
        } catch (error) {
          console.error(error);
          toast.error("Terjadi kesalahan sistem");
        } finally {
          setIsFetching(false);
        }
      };
      fetchEditData();
    }
  }, [editShortcode, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Format file tidak valid. Harap unggah gambar.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    
    // Reset input value to allow selecting the same file again if needed
    if (e.target) e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editShortcode && !file) {
      toast.error("Silakan pilih gambar terlebih dahulu.");
      return;
    }

    if (!title.trim()) {
      toast.error("Silakan masukkan judul gambar.");
      return;
    }
    
    if (title.length > 20) {
      toast.error("Judul gambar maksimal 20 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("judul", title);
      if (file) {
        formData.append("gambar", file);
      }

      const url = editShortcode ? `/api/galeri?shortcode=${editShortcode}` : '/api/galeri';
      const method = editShortcode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || (editShortcode ? "Gambar berhasil diupdate!" : "Gambar berhasil diupload!"));
        router.push('/dashboard/gallery');
      } else {
        toast.error(result.message || "Gagal memproses data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan server");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link 
          href="/dashboard/gallery"
          className="inline-flex items-center justify-center p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {editShortcode ? "Edit Gambar Galeri" : "Upload Gambar Baru"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {editShortcode ? "Perbarui judul atau ganti foto pada galeri." : "Tambahkan foto baru ke dalam galeri website Anda."}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Pilih Gambar</label>
            <div className="relative w-full h-64 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary/50 transition-colors flex flex-col items-center justify-center overflow-hidden group">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={handleImageUpload}
              />
              
              {/* Kondisi Jika ada gambar preview */}
              {previewUrl && (
                <div className="absolute inset-0 z-0">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                </div>
              )}
              
              {/* Indikator Teks di Tengah */}
              <div className="relative z-10 flex flex-col items-center pointer-events-none text-center p-4">
                <ImageIcon className={`w-10 h-10 mb-2 ${previewUrl ? 'text-white' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${previewUrl ? 'text-white' : 'text-gray-500'}`}>
                  {previewUrl ? "Klik atau Tarik untuk Mengubah Gambar" : "Tarik & Lepas Gambar ke Sini"}
                </span>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block font-inter text-sm font-semibold text-header mb-1">Judul Gambar</label>
            <input
              id="title"
              type="text"
              maxLength={20}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-body transition-colors ${
                title.length > 20 ? 'border-red-500 focus:ring-red-500 focus:ring-1 bg-red-50/30' : 'border-gray-200 focus:ring-primary/50'
              }`}
              placeholder="Masukkan judul untuk gambar ini (maks. 20 karakter)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className={`text-xs mt-1 text-right ${title.length > 20 ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
              {title.length} / 20 karakter
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
            <Link
              href="/dashboard/gallery"
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-center"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg transition-colors shadow-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'}`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GalleryUploadPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <GalleryUploadContent />
    </Suspense>
  );
}
