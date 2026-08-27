"use client";

import React, { useEffect, useState } from "react";
import { Newspaper, Image as ImageIcon, HardDrive, Loader2, AlertCircle, BookOpen, PenTool, LayoutTemplate, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalBlog: 0,
    totalGallery: 0,
    storageUsage: 0,
    storageLimit: 25 * 1024 * 1024 * 1024 // 25 GB default
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();

        if (res.ok) {
          setStats({
            totalBlog: data.totalBlog || 0,
            totalGallery: data.totalGallery || 0,
            storageUsage: data.storageUsage || 0,
            storageLimit: data.storageLimit || 25 * 1024 * 1024 * 1024
          });
        } else {
          setError(data.message || "Gagal memuat statistik");
          toast.error("Gagal memuat statistik dashboard");
        }
      } catch (err) {
        setError("Terjadi kesalahan jaringan");
        toast.error("Terjadi kesalahan saat memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usagePercent = Math.min(100, Math.max(0, (stats.storageUsage / stats.storageLimit) * 100));

  return (
    <div className="max-w-5xl space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-2">
            Selamat datang kembali, Admin!
          </h2>
          <p className="text-gray-500 text-sm">
            Ini adalah tampilan awal dashboard Anda. Anda dapat mengelola seluruh konten website dari panel ini.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Blog Stat */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Newspaper className="w-6 h-6" />
            </div>
          </div>
          <span className="text-sm text-gray-500 font-medium mb-1">Total Artikel Blog</span>
          {isLoading ? (
            <div className="h-9 flex items-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
          ) : (
            <span className="text-3xl font-poppins font-bold text-gray-900">{stats.totalBlog}</span>
          )}
        </div>

        {/* Gallery Stat */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
          <span className="text-sm text-gray-500 font-medium mb-1">Total Foto Galeri</span>
          {isLoading ? (
            <div className="h-9 flex items-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
          ) : (
            <span className="text-3xl font-poppins font-bold text-gray-900">{stats.totalGallery}</span>
          )}
        </div>

        {/* Storage Stat */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
              <HardDrive className="w-6 h-6" />
            </div>
            {!isLoading && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {usagePercent.toFixed(1)}% Terpakai
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500 font-medium mb-1">Penyimpanan</span>
          {isLoading ? (
            <div className="h-9 flex items-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
          ) : (
            <div>
              <span className="text-3xl font-poppins font-bold text-gray-900">{formatBytes(stats.storageUsage)}</span>
              <span className="text-sm text-gray-400 ml-1">/ {formatBytes(stats.storageLimit)}</span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-1000 ${usagePercent > 90 ? 'bg-red-500' : usagePercent > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${isLoading ? 0 : usagePercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* User Guide Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-8">
        <div className="bg-primary/5 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-poppins font-bold text-header">Panduan Penggunaan CMS</h2>
        </div>

        <div className="p-6 md:p-8 space-y-8">

          {/* Guide Item 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <LayoutTemplate className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-header mb-2">1. Mengelola Halaman Publik</h3>
              <p className="text-body text-sm leading-relaxed mb-2">
                Melalui menu <strong>Manajemen Konten</strong> di <em>sidebar</em> kiri, Anda dapat mengubah teks, deskripsi, dan gambar utama pada halaman publik:
              </p>
              <ul className="list-disc list-inside text-sm text-body space-y-1 ml-2">
                <li><strong>Halaman Beranda:</strong> Mengubah teks sambutan, deskripsi <em>About</em>, angka statistik, serta mengunggah gambar latar belakang (<em>Hero Slider</em>). Anda juga dapat memilih foto unggulan untuk ditampilkan di seksi Galeri Beranda.</li>
                <li><strong>Halaman Galeri & Blog:</strong> Mengubah teks pengantar pada masing-masing halaman.</li>
              </ul>
              <div className="mt-2 text-xs text-primary bg-primary/10 inline-block px-3 py-1 rounded-md">
                Tip: Jangan lupa klik tombol &quot;Simpan Perubahan&quot; di bagian bawah layar setelah mengedit.
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Guide Item 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-header mb-2">2. Menambah & Mengelola Galeri</h3>
              <p className="text-body text-sm leading-relaxed mb-2">
                Pilih menu <strong>Galeri</strong> pada kategori <em>Metadata</em> untuk mengelola kumpulan foto kegiatan.
              </p>
              <ul className="list-disc list-inside text-sm text-body space-y-1 ml-2">
                <li>Klik tombol <strong>+ Tambah Foto</strong> untuk mengunggah gambar baru dari perangkat Anda.</li>
                <li>Anda dapat memberikan judul dan kategori warna <em>highlight</em> pada setiap foto.</li>
                <li>Gunakan fitur Pencarian untuk menemukan foto tertentu dengan cepat.</li>
                <li>Klik ikon tempat sampah berwarna merah untuk menghapus foto secara permanen.</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Guide Item 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <PenTool className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-header mb-2">3. Menulis & Mempublikasikan Blog</h3>
              <p className="text-body text-sm leading-relaxed mb-2">
                Pilih menu <strong>Blog</strong> pada kategori <em>Metadata</em> untuk menulis artikel berita atau pengumuman.
              </p>
              <ul className="list-disc list-inside text-sm text-body space-y-1 ml-2">
                <li>Klik <strong>+ Tambah Blog</strong> untuk masuk ke editor artikel.</li>
                <li>Anda wajib mengunggah <strong>Gambar Cover</strong> sebagai <em>thumbnail</em> artikel.</li>
                <li>Gunakan <em>Rich Text Editor</em> (kolom isi) untuk menebalkan teks, menambahkan poin (<em>bullet</em>), atau menyisipkan gambar pendukung langsung di dalam isi artikel.</li>
                <li>Artikel yang sudah dibuat dapat di-edit ulang dengan menekan ikon Pensil pada daftar tabel.</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-100" />

        </div>
      </div>
    </div>
  );
}
