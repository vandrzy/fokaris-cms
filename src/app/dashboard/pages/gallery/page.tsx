"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function GalleryDashboardPage() {
  const [textData, setTextData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/beranda/text')
      .then(res => res.json())
      .then(data => {
        setTextData(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      galeri_hero_title: textData?.galeri_hero_title?.value,
      galeri_hero_subtitle: textData?.galeri_hero_subtitle?.value,
    };

    try {
      const res = await fetch('/api/beranda/text', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await res.json();
      if (!res.ok) {
        toast.error(`Gagal menyimpan data: ${resData.message}`);
      } else {
        toast.success("Perubahan teks berhasil disimpan");
        fetch('/api/beranda/text').then(r => r.json()).then(data => setTextData(data));
      }
    } catch (err) {
      toast.error("Gagal menyimpan data: Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleTextChange = (key: string, val: string) => {
    setTextData({
      ...textData,
      [key]: { ...textData[key], value: val }
    });
  };

  const getInputClass = (key: string) => {
    const val = textData?.[key]?.value || '';
    const max = textData?.[key]?.max_length || 0;
    const isError = max > 0 && val.length > max;

    return `w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-body transition-colors ${isError
      ? 'border-red-500 focus:ring-red-500 focus:ring-1 bg-red-50/30'
      : 'border-gray-200 focus:ring-primary/50'
      }`;
  };

  const getCharCountClass = (key: string) => {
    const val = textData?.[key]?.value || '';
    const max = textData?.[key]?.max_length || 0;
    const isError = max > 0 && val.length > max;
    return `text-xs mt-1 text-right ${isError ? 'text-red-500 font-semibold' : 'text-gray-500'}`;
  };

  if (loading) return <div className="p-8">Memuat data...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-poppins text-header">Manajemen Galeri</h2>
        <p className="text-body mt-1">Ubah konten pengantar pada halaman Galeri Kegiatan.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* HERO SECTION */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold font-poppins text-header mb-4 border-b border-gray-50 pb-2">Hero Section</h3>

          <div className="space-y-4">
            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">Galeri Hero Title</label>
              <input
                type="text"
                className={getInputClass('galeri_hero_title')}
                value={textData?.galeri_hero_title?.value || ''}
                onChange={(e) => handleTextChange('galeri_hero_title', e.target.value)}
              />
              <p className={getCharCountClass('galeri_hero_title')}>
                {textData?.galeri_hero_title?.value?.length || 0} / {textData?.galeri_hero_title?.max_length} karakter
              </p>
            </div>

            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">Galeri Hero Subtitle</label>
              <textarea
                rows={3}
                className={getInputClass('galeri_hero_subtitle')}
                value={textData?.galeri_hero_subtitle?.value || ''}
                onChange={(e) => handleTextChange('galeri_hero_subtitle', e.target.value)}
              />
              <p className={getCharCountClass('galeri_hero_subtitle')}>
                {textData?.galeri_hero_subtitle?.value?.length || 0} / {textData?.galeri_hero_subtitle?.max_length} karakter
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-semibold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
