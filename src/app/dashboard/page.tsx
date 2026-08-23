"use client";

import React, { useEffect, useState } from "react";
import { Newspaper, Image as ImageIcon, HardDrive, Loader2, AlertCircle } from "lucide-react";
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
            Selamat datang kembali, Admin! 👋
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
    </div>
  );
}
