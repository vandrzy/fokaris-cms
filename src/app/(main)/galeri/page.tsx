export default function Galeri() {
  // Dummy gallery items
  const galleryItems = [
    { id: 1, title: "Penghijauan Pesisir", color: "bg-primary/20", height: "h-64" },
    { id: 2, title: "Kelas Inspirasi", color: "bg-secondary/20", height: "h-96" },
    { id: 3, title: "Bantuan Logistik Bencana", color: "bg-blue-200", height: "h-80" },
    { id: 4, title: "Pelatihan UMKM", color: "bg-primary/30", height: "h-96" },
    { id: 5, title: "Edukasi Daur Ulang", color: "bg-orange-200", height: "h-64" },
    { id: 6, title: "Aksi Donor Darah", color: "bg-secondary/30", height: "h-80" },
    { id: 7, title: "Pembangunan MCK", color: "bg-teal-200", height: "h-72" },
    { id: 8, title: "Santunan Anak Yatim", color: "bg-purple-200", height: "h-80" },
    { id: 9, title: "Kampanye Lingkungan", color: "bg-primary/40", height: "h-64" },
  ];

  return (
    <div className="pt-20 pb-32 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-10 md:mt-16 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-header mb-4">Galeri Kegiatan</h1>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Jejak langkah nyata kami tergambar dalam momen-momen kebersamaan, perjuangan, dan senyum bahagia mereka yang terbantu.
          </p>
        </div>

        {/* Masonry-like CSS Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-3xl overflow-hidden group cursor-pointer break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-300 ${item.height} ${item.color}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-header/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-white/50 group-hover:scale-125 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white font-bold font-poppins text-xl">{item.title}</h3>
                <p className="text-white/80 text-sm mt-1">Lihat selengkapnya →</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-bold transition-colors duration-300 shadow-md hover:shadow-lg">
            Muat Lebih Banyak
          </button>
        </div>
      </div>
    </div>
  );
}
