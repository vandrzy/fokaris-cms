import Link from "next/link";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "Kegiatan Penanaman 1000 Pohon Bakau di Pesisir Utara",
      excerpt: "Bulan ini kami bersama lebih dari 200 relawan telah berhasil melaksanakan program penghijauan pesisir.",
      date: "12 Agustus 2026",
      category: "Lingkungan",
      color: "primary"
    },
    {
      id: 2,
      title: "Pendidikan Gratis Untuk Anak Jalanan Berprestasi",
      excerpt: "Membuka akses pendidikan seluas-luasnya untuk anak-anak kurang mampu agar dapat menggapai cita-citanya.",
      date: "5 Agustus 2026",
      category: "Pendidikan",
      color: "secondary"
    },
    {
      id: 3,
      title: "Bantuan Kesehatan Cepat Tanggap Daerah Bencana",
      excerpt: "Tim medis dan relawan kami telah dikerahkan ke lokasi terdampak untuk memberikan pertolongan pertama.",
      date: "28 Juli 2026",
      category: "Sosial",
      color: "primary"
    },
    {
      id: 4,
      title: "Workshop Kewirausahaan Pemuda Desa",
      excerpt: "Mendorong kemandirian ekonomi desa melalui pelatihan UMKM dan pemasaran digital bagi pemuda.",
      date: "15 Juli 2026",
      category: "Ekonomi",
      color: "secondary"
    },
    {
      id: 5,
      title: "Kampanye Bebas Sampah Plastik di Sekolah Dasar",
      excerpt: "Edukasi dini pentingnya menjaga kebersihan lingkungan dengan mendaur ulang sampah plastik.",
      date: "2 Juli 2026",
      category: "Edukasi",
      color: "primary"
    },
    {
      id: 6,
      title: "Donor Darah Nasional: Setetes Darah Sejuta Harapan",
      excerpt: "Acara donor darah rutin tahunan yang berhasil mengumpulkan lebih dari 500 kantong darah.",
      date: "20 Juni 2026",
      category: "Kesehatan",
      color: "secondary"
    }
  ];

  return (
    <div className="pt-20 pb-32 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-10 md:mt-16 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-header mb-4">Blog & Publikasi</h1>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Ikuti perkembangan terbaru, cerita inspiratif, dan laporan kegiatan dari berbagai program yang telah kami jalankan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col h-full group"
            >
              <div className={`h-48 w-full bg-${post.color}/10 relative overflow-hidden flex items-center justify-center`}>
                <div className={`absolute inset-0 bg-gradient-to-br from-${post.color}/20 to-transparent opacity-50`}></div>
                <span className={`text-${post.color} font-poppins font-bold text-2xl opacity-40 group-hover:scale-110 transition-transform duration-500`}>
                  {post.category}
                </span>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold uppercase tracking-wider text-${post.color} bg-${post.color}/10 px-3 py-1 rounded-full`}>
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-400 font-medium">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-header mb-3 font-poppins group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-body text-sm leading-relaxed mb-6 flex-grow">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-primary font-semibold hover:text-secondary transition-colors"
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
      </div>
    </div>
  );
}
