export const metadata = {
  title: "Dashboard | Admin Panel",
  description: "Dashboard overview for admin panel",
};

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <h2 className="text-xl font-poppins font-semibold text-header mb-2">
          Selamat datang kembali, Admin! 👋
        </h2>
        <p className="text-body">
          Ini adalah tampilan awal dashboard Anda. Anda dapat mengelola seluruh konten website dari panel ini.
        </p>
      </div>

      {/* Stats Cards Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Artikel Blog", value: "24" },
          { title: "Total Foto Galeri", value: "156" },
          { title: "Pengunjung Bulan Ini", value: "1,204" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center">
            <span className="text-sm text-body/70 font-medium mb-1">{stat.title}</span>
            <span className="text-3xl font-poppins font-bold text-primary">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
