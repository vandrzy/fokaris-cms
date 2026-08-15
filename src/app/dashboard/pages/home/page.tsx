"use client";

import { useState, useEffect } from "react";
import { Save, Image as ImageIcon } from "lucide-react";

// Mock data as initial state
const initialData = {
  heroTitle: "Membangun Organisasi yang Lebih Mandiri dan Sejahtera",
  heroSubtitle:
    "Bergabunglah bersama kami dalam berbagai inisiatif sosial. Jadilah agen perubahan dan ciptakan dampak positif yang berarti.",
  heroImages: [
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  ],
  aboutTitle: "Tentang Organisasi Kami",
  aboutText:
    "Misi kami adalah mewujudkan organisasi yang sejahtera, mandiri, dan berbudaya melalui kolaborasi aktif, pemanfaatan potensi yang berkelanjutan, serta pelayanan publik yang transparan.",
  stats: [
    { id: 1, value: "103+", label: "TOTAL ANGGOTA" },
    { id: 2, value: "24", label: "KEGIATAN TERLAKSANA" },
  ],
  galleryData: [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Kegiatan Sosial 1",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Kegiatan Pendidikan 2",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Kegiatan Lingkungan 3",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Komunitas 4",
    },
  ],
};

export default function HomeDashboardPage() {
  const [formData, setFormData] = useState(initialData);
  const [textData, setTextData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
    setMessage("");

    const payload = {
      hero_title: textData?.hero_title?.value,
      hero_subtitle: textData?.hero_subtitle?.value,
      about_title: textData?.about_title?.value,
      about_desc: textData?.about_desc?.value,
    };

    try {
      const res = await fetch('/api/beranda/text', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${resData.message}`);
      } else {
        setMessage("Perubahan teks berhasil disimpan!");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan jaringan.");
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

  if (loading) return <div className="p-8">Memuat data...</div>;

  const handleStatChange = (index: number, field: "value" | "label", val: string) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: val };
    setFormData({ ...formData, stats: newStats });
  };

  const handleGalleryChange = (index: number, field: "src" | "alt", val: string) => {
    const newGallery = [...formData.galleryData];
    newGallery[index] = { ...newGallery[index], [field]: val };
    setFormData({ ...formData, galleryData: newGallery });
  };

  const handleHeroImageChange = (index: number, val: string) => {
    const newImages = [...formData.heroImages];
    newImages[index] = val;
    setFormData({ ...formData, heroImages: newImages });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-poppins text-header">Manajemen Halaman Beranda</h2>
        <p className="text-body mt-1">Ubah konten teks dan gambar yang ditampilkan di halaman beranda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {message && (
          <div className={`p-4 rounded-md ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        {/* HERO SECTION */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold font-poppins text-header mb-4 border-b border-gray-50 pb-2">Hero Section</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">Hero Title</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body"
                value={textData?.hero_title?.value || ''}
                onChange={(e) => handleTextChange('hero_title', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {textData?.hero_title?.value?.length || 0} / {textData?.hero_title?.max_length} karakter
              </p>
            </div>
            
            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">Hero Subtitle</label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body"
                value={textData?.hero_subtitle?.value || ''}
                onChange={(e) => handleTextChange('hero_subtitle', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {textData?.hero_subtitle?.value?.length || 0} / {textData?.hero_subtitle?.max_length} karakter
              </p>
            </div>

            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-2">Hero Images (Slider)</label>
              <div className="space-y-3">
                {formData.heroImages.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      className="flex-1 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body"
                      value={img}
                      onChange={(e) => handleHeroImageChange(idx, e.target.value)}
                      placeholder={`URL Gambar ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold font-poppins text-header mb-4 border-b border-gray-50 pb-2">Tentang Kami</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">About Title</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body"
                value={textData?.about_title?.value || ''}
                onChange={(e) => handleTextChange('about_title', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {textData?.about_title?.value?.length || 0} / {textData?.about_title?.max_length} karakter
              </p>
            </div>
            
            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">About Text</label>
              <textarea
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body"
                value={textData?.about_desc?.value || ''}
                onChange={(e) => handleTextChange('about_desc', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {textData?.about_desc?.value?.length || 0} / {textData?.about_desc?.max_length} karakter
              </p>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold font-poppins text-header mb-4 border-b border-gray-50 pb-2">Statistik Pencapaian</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.stats.map((stat, idx) => (
              <div key={stat.id} className="p-4 bg-gray-50 rounded-md border border-gray-100 space-y-3">
                <h4 className="font-semibold text-sm text-header">Statistik {idx + 1}</h4>
                <div>
                  <label className="block font-inter text-xs font-semibold text-body/80 mb-1">Nilai (Value)</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body text-sm"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-inter text-xs font-semibold text-body/80 mb-1">Label</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body text-sm"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GALLERY SECTION */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold font-poppins text-header mb-4 border-b border-gray-50 pb-2">Galeri Kegiatan (Preview)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.galleryData.map((gallery, idx) => (
              <div key={gallery.id} className="p-4 bg-gray-50 rounded-md border border-gray-100 space-y-3">
                <h4 className="font-semibold text-sm text-header">Gambar Galeri {idx + 1}</h4>
                <div>
                  <label className="block font-inter text-xs font-semibold text-body/80 mb-1">Image URL</label>
                  <div className="flex items-center gap-2">
                     <div className="p-2 bg-white border border-gray-200 rounded-md text-gray-400">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body text-sm"
                      value={gallery.src}
                      onChange={(e) => handleGalleryChange(idx, "src", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-inter text-xs font-semibold text-body/80 mb-1">Alt Text</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-body text-sm"
                    value={gallery.alt}
                    onChange={(e) => handleGalleryChange(idx, "alt", e.target.value)}
                  />
                </div>
              </div>
            ))}
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
            {saving ? "Menyimpan..." : "Simpan Perubahan Teks"}
          </button>
        </div>
      </form>
    </div>
  );
}
