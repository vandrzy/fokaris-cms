"use client";

import { useState } from "react";
import { Save } from "lucide-react";

const initialData = {
  heroTitle: "Blog & Publikasi",
  heroSubtitle: "Ikuti perkembangan terbaru, cerita inspiratif, dan laporan kegiatan dari berbagai program yang telah kami jalankan."
};

export default function BlogDashboardPage() {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Perubahan berhasil disimpan! (Hanya simulasi UI)");
    console.log("Data Tersimpan:", formData);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-poppins text-header">Manajemen Blog</h2>
        <p className="text-body mt-1">Ubah konten pengantar pada halaman Blog.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-6">
          <h3 className="text-lg font-bold font-poppins text-header mb-4 border-b border-gray-50 pb-2">Hero Section</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">Header Judul (Hero Title)</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">Sub-Judul (Hero Subtitle / Description)</label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-semibold transition-colors shadow-sm"
          >
            <Save className="w-5 h-5" />
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
