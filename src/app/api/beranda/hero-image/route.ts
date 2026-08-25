import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';
import { requireAuth } from "@/lib/auth";
import { handleApiError, ApiError } from "@/lib/api-error";

// Config dipindahkan ke dalam handler untuk memastikan env ter-load

async function getDoc() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

function getPublicIdFromUrl(url: string) {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    const pathParts = parts.slice(uploadIndex + 2);
    const fullPath = pathParts.join('/');
    return fullPath.substring(0, fullPath.lastIndexOf('.'));
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const index = formData.get("index") as string;

    if (!file) {
      throw new ApiError(400, "File tidak ditemukan");
    }

    if (!['1', '2', '3'].includes(index)) {
      throw new ApiError(400, "Index tidak valid (harus 1, 2, atau 3)");
    }

    if (!file.type.startsWith("image/")) {
      throw new ApiError(400, "Format file tidak valid. Harap unggah gambar.");
    }

    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      throw new ApiError(413, "Ukuran gambar maksimal 5 MB");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using stream
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "fokaris_cms/hero" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const secureUrl = uploadResult.secure_url;

    // Update Spreadsheet
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle["beranda"];
    if (!sheet) {
      throw new ApiError(500, "Sheet beranda tidak ditemukan");
    }

    const rows = await sheet.getRows();
    const keyToUpdate = `hero_image_${index}`;
    let oldUrl = "";
    let rowFound = false;

    for (const row of rows) {
      if (row.get('key') === keyToUpdate) {
        oldUrl = row.get('value');
        row.set('value', secureUrl);
        await row.save();
        rowFound = true;
        break;
      }
    }

    if (!rowFound) {
      await sheet.addRow({ key: keyToUpdate, value: secureUrl, max_length: 0 });
    }

    // Cleanup old image from Cloudinary
    if (oldUrl && oldUrl.includes('cloudinary.com')) {
      const publicId = getPublicIdFromUrl(oldUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Failed to delete old image from Cloudinary:", err);
        }
      }
    }

    return NextResponse.json({ message: "Gambar berhasil diunggah", url: secureUrl }, { status: 200 });

  } catch (error: unknown) {
    return handleApiError(error);
  }
}
