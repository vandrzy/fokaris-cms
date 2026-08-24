import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';
import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";

async function getDoc() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

export async function GET() {
  try {
    await requireAuth();
    const doc = await getDoc();

    // 1. Get Blog Count
    let totalBlog = 0;
    const blogSheet = doc.sheetsByTitle["blog"];
    if (blogSheet) {
      const blogRows = await blogSheet.getRows();
      totalBlog = blogRows.length;
    }

    // 2. Get Gallery Count
    let totalGallery = 0;
    const galeriSheet = doc.sheetsByTitle["galeri"];
    if (galeriSheet) {
      const galeriRows = await galeriSheet.getRows();
      totalGallery = galeriRows.length;
    }

    // 3. Get Cloudinary Storage Usage
    let storageUsage = 0;
    let storageLimit = 0; // Usually 25GB (25,000,000,000 bytes) for free tier but Cloudinary uses credits
    
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      // API usage requires PRO plan or specific settings, but we can try
      const usageRes = await cloudinary.api.usage();
      if (usageRes && usageRes.storage) {
        storageUsage = usageRes.storage.usage || 0; 
        storageLimit = usageRes.storage.limit || 25 * 1024 * 1024 * 1024; // fallback 25GB
      }
    } catch (cloudinaryErr) {
      console.error("Gagal mengambil data usage Cloudinary", cloudinaryErr);
    }

    return NextResponse.json(
      {
        totalBlog,
        totalGallery,
        storageUsage,
        storageLimit
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
