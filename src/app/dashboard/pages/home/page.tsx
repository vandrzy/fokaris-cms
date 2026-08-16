"use client";

import { useState, useEffect } from "react";
import { Save, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

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
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});
  const [previewImages, setPreviewImages] = useState<Record<number, string>>({});

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
    let successCount = 0;
    let hasError = false;

    // Upload pending images first
    for (const [idxStr, file] of Object.entries(pendingImages)) {
      const index = parseInt(idxStr);
      setUploadingImage(index);
      const formUpload = new FormData();
      formUpload.append("file", file);
      formUpload.append("index", index.toString());

      try {
        const res = await fetch("/api/beranda/hero-image", {
          method: "POST",
          body: formUpload,
        });
        const data = await res.json();
        if (res.ok) {
          successCount++;
        } else {
          toast.error(data.message || `Gagal mengunggah gambar ${index}`);
          hasError = true;
          break;
        }
      } catch (err) {
        toast.error(`Terjadi kesalahan saat mengunggah gambar ${index}`);
        hasError = true;
        break;
      } finally {
        setUploadingImage(null);
      }
    }

    if (hasError) {
      setSaving(false);
      return; // Berhenti jika ada gambar yang gagal diupload
    }

    const payload = {
      hero_title: textData?.hero_title?.value,
      hero_subtitle: textData?.hero_subtitle?.value,
      about_title: textData?.about_title?.value,
      about_desc: textData?.about_desc?.value,
      stat_1_value: textData?.stat_1_value?.value,
      stat_1_label: textData?.stat_1_label?.value,
      stat_2_value: textData?.stat_2_value?.value,
      stat_2_label: textData?.stat_2_label?.value,
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
        toast.success(`Perubahan teks ${successCount > 0 ? "dan gambar " : ""}berhasil disimpan`);
        setPendingImages({});
        setPreviewImages({});
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file tidak valid. Harap unggah gambar.");
      return;
    }

    setPendingImages((prev) => ({ ...prev, [index]: file }));
    setPreviewImages((prev) => ({ ...prev, [index]: URL.createObjectURL(file) }));
    if (e.target) e.target.value = ""; 
  };

  if (loading) return <div className="p-8">Memuat data...</div>;



  const handleGalleryChange = (index: number, field: "src" | "alt", val: string) => {
    const newGallery = [...formData.galleryData];
    newGallery[index] = { ...newGallery[index], [field]: val };
    setFormData({ ...formData, galleryData: newGallery });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-poppins text-header">Manajemen Halaman Beranda</h2>
        <p className="text-body mt-1">Ubah konten teks dan gambar yang ditampilkan di halaman beranda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* HERO SECTION */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold font-poppins text-header mb-4 border-b border-gray-50 pb-2">Hero Section</h3>

          <div className="space-y-4">
            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">Hero Title</label>
              <input
                type="text"
                className={getInputClass('hero_title')}
                value={textData?.hero_title?.value || ''}
                onChange={(e) => handleTextChange('hero_title', e.target.value)}
              />
              <p className={getCharCountClass('hero_title')}>
                {textData?.hero_title?.value?.length || 0} / {textData?.hero_title?.max_length} karakter
              </p>
            </div>

            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">Hero Subtitle</label>
              <textarea
                rows={3}
                className={getInputClass('hero_subtitle')}
                value={textData?.hero_subtitle?.value || ''}
                onChange={(e) => handleTextChange('hero_subtitle', e.target.value)}
              />
              <p className={getCharCountClass('hero_subtitle')}>
                {textData?.hero_subtitle?.value?.length || 0} / {textData?.hero_subtitle?.max_length} karakter
              </p>
            </div>

            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-2">Hero Images (Slider)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => {
                  const key = `hero_image_${num}`;
                  const imgUrl = previewImages[num] || textData?.[key]?.value;
                  const isLoading = uploadingImage === num;

                  return (
                    <div key={num} className="relative w-full h-40 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary/50 transition-colors flex flex-col items-center justify-center overflow-hidden group">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        disabled={isLoading}
                        onChange={(e) => handleImageUpload(e, num)}
                      />
                      
                      {imgUrl && (
                        <div className="absolute inset-0 z-0">
                          <img src={imgUrl} alt={`Hero ${num}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                        </div>
                      )}
                      
                      <div className="relative z-10 flex flex-col items-center pointer-events-none text-center p-4">
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                        ) : (
                          <ImageIcon className={`w-8 h-8 mb-2 ${imgUrl ? 'text-white' : 'text-gray-400'}`} />
                        )}
                        <span className={`text-sm font-medium ${imgUrl ? 'text-white' : 'text-gray-500'}`}>
                          {isLoading ? "Mengunggah..." : imgUrl ? "Ubah Gambar" : "Tarik & Lepas"}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                className={getInputClass('about_title')}
                value={textData?.about_title?.value || ''}
                onChange={(e) => handleTextChange('about_title', e.target.value)}
              />
              <p className={getCharCountClass('about_title')}>
                {textData?.about_title?.value?.length || 0} / {textData?.about_title?.max_length} karakter
              </p>
            </div>

            <div>
              <label className="block font-inter text-sm font-semibold text-header mb-1">About Text</label>
              <textarea
                rows={4}
                className={getInputClass('about_desc')}
                value={textData?.about_desc?.value || ''}
                onChange={(e) => handleTextChange('about_desc', e.target.value)}
              />
              <p className={getCharCountClass('about_desc')}>
                {textData?.about_desc?.value?.length || 0} / {textData?.about_desc?.max_length} karakter
              </p>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold font-poppins text-header mb-4 border-b border-gray-50 pb-2">Statistik Pencapaian</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((num) => {
              const valKey = `stat_${num}_value`;
              const labelKey = `stat_${num}_label`;
              return (
              <div key={num} className="p-4 bg-gray-50 rounded-md border border-gray-100 space-y-3">
                <h4 className="font-semibold text-sm text-header">Statistik {num}</h4>
                <div>
                  <label className="block font-inter text-xs font-semibold text-body/80 mb-1">Nilai (Value)</label>
                  <input
                    type="text"
                    className={getInputClass(valKey)}
                    value={textData?.[valKey]?.value || ''}
                    onChange={(e) => handleTextChange(valKey, e.target.value)}
                  />
                  <p className={getCharCountClass(valKey)}>
                    {textData?.[valKey]?.value?.length || 0} / {textData?.[valKey]?.max_length || 8} karakter
                  </p>
                </div>
                <div>
                  <label className="block font-inter text-xs font-semibold text-body/80 mb-1">Label</label>
                  <input
                    type="text"
                    className={getInputClass(labelKey)}
                    value={textData?.[labelKey]?.value || ''}
                    onChange={(e) => handleTextChange(labelKey, e.target.value)}
                  />
                  <p className={getCharCountClass(labelKey)}>
                    {textData?.[labelKey]?.value?.length || 0} / {textData?.[labelKey]?.max_length || 40} karakter
                  </p>
                </div>
              </div>
            )})}
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
