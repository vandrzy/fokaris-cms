// Sisipkan transformasi tepat setelah "/upload/". Hanya untuk URL Cloudinary;
// URL lain (mis. unsplash fallback, /logo.png) dikembalikan apa adanya.
export function cldTransform(url: string, transform = "f_auto,q_auto,w_800"): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  // hindari dobel-transform kalau sudah ada
  if (url.match(/\/upload\/[^/]*f_auto[^/]*\//)) return url; // Cek jika sudah ada f_auto
  
  return url.replace("/upload/", `/upload/${transform}/`);
}
