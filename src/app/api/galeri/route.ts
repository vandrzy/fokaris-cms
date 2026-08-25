import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth";
import { handleApiError, ApiError } from "@/lib/api-error";

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

function getPublicIdFromUrl(url: string) {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const pathParts = parts.slice(uploadIndex + 2);
    const fullPath = pathParts.join("/");
    return fullPath.substring(0, fullPath.lastIndexOf("."));
  } catch (e) {
    return null;
  }
}

function configCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shortcode = url.searchParams.get("shortcode");
    const judulParam = url.searchParams.get("judul");
    const pageStr = url.searchParams.get("page");
    const limitStr = url.searchParams.get("limit");

    const doc = await getDoc();
    const sheet = doc.sheetsByTitle["galeri"];
    if (!sheet) {
      throw new ApiError(500, "Sheet galeri tidak ditemukan");
    }

    const rows = await sheet.getRows();

    if (shortcode) {
      const row = rows.find((r) => r.get("shortcode") === shortcode);
      if (!row) {
        throw new ApiError(404, "Data tidak ditemukan");
      }
      return NextResponse.json({
        data: {
          judul: row.get("judul"),
          "link gambar": row.get("link gambar"),
          shortcode: row.get("shortcode"),
          tanggalDiubah: row.get("tanggal diubah"),
        },
      }, { status: 200 });
    }

    // Pagination
    let allData = rows.map((row) => ({
      judul: row.get("judul"),
      "link gambar": row.get("link gambar"),
      shortcode: row.get("shortcode"),
      tanggalDiubah: row.get("tanggal diubah"),
    }));

    if (judulParam) {
      allData = allData.filter(item => 
        item.judul && item.judul.toLowerCase().includes(judulParam.toLowerCase())
      );
    }

    // Data in sheet might be oldest to newest, usually we want newest first, let's reverse it to show newest uploads first
    allData = allData.reverse();

    const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(limitStr || "10", 10) || 10));
    const startIndex = (page - 1) * limit;
    const paginatedData = allData.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      data: paginatedData,
      total: allData.length,
      page,
      limit,
      totalPages: Math.ceil(allData.length / limit),
    }, { status: 200 });

  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    configCloudinary();
    const formData = await req.formData();
    const file = formData.get("gambar") as File | null;
    const judul = formData.get("judul") as string | null;

    if (!file || !judul) {
      throw new ApiError(400, "Gambar dan judul wajib diisi");
    }
    if (judul.length > 20) {
      throw new ApiError(400, "Judul gambar maksimal 20 karakter");
    }
    if (!file.type.startsWith("image/")) {
      throw new ApiError(400, "Format file tidak valid. Harap unggah gambar.");
    }
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      throw new ApiError(413, "Ukuran gambar maksimal 5 MB");
    }

    // 1. Generate ID & shortcode
    const id = crypto.randomUUID();
    const shortcode = crypto.createHash('md5').update(id).digest('hex').substring(0, 10);

    // 2. Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "fokaris_cms/galeri" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const secureUrl = uploadResult.secure_url;

    // 3. Save to Google Sheets
    const doc = await getDoc();
    let sheet = doc.sheetsByTitle["galeri"];
    if (!sheet) {
      // Create sheet if it doesn't exist
      sheet = await doc.addSheet({ headerValues: ["id", "link gambar", "judul", "shortcode", "tanggal diubah"], title: "galeri" });
    } else {
      await sheet.loadHeaderRow();
      if (!sheet.headerValues.includes("tanggal diubah")) {
        await sheet.setHeaderRow([...sheet.headerValues, "tanggal diubah"]);
      }
    }

    const tanggalDiubah = new Date().toISOString();

    await sheet.addRow({
      id,
      "link gambar": secureUrl,
      judul,
      shortcode,
      "tanggal diubah": tanggalDiubah,
    });

    return NextResponse.json({ message: "Berhasil menambahkan data galeri", shortcode }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request) {
  try {
    await requireAuth();
    configCloudinary();
    const url = new URL(req.url);
    const shortcode = url.searchParams.get("shortcode");

    if (!shortcode) {
      throw new ApiError(400, "Shortcode wajib diisi");
    }

    const formData = await req.formData();
    const file = formData.get("gambar") as File | null;
    const judul = formData.get("judul") as string | null;

    if (judul && judul.length > 20) {
      throw new ApiError(400, "Judul gambar maksimal 20 karakter");
    }

    const doc = await getDoc();
    const sheet = doc.sheetsByTitle["galeri"];
    if (!sheet) {
      throw new ApiError(500, "Sheet galeri tidak ditemukan");
    }

    await sheet.loadHeaderRow();
    if (!sheet.headerValues.includes("tanggal diubah")) {
      await sheet.setHeaderRow([...sheet.headerValues, "tanggal diubah"]);
    }

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("shortcode") === shortcode);

    if (!row) {
      throw new ApiError(404, "Data tidak ditemukan");
    }

    let secureUrl = row.get("link gambar");

    if (file && file.type.startsWith("image/")) {
      const MAX_BYTES = 5 * 1024 * 1024;
      if (file.size > MAX_BYTES) {
        throw new ApiError(413, "Ukuran gambar maksimal 5 MB");
      }
      // Upload new image
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "fokaris_cms/galeri" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      secureUrl = uploadResult.secure_url;

      // Delete old image
      const oldUrl = row.get("link gambar");
      if (oldUrl && oldUrl.includes("cloudinary.com")) {
        const publicId = getPublicIdFromUrl(oldUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Gagal menghapus gambar lama di Cloudinary:", err);
          }
        }
      }
    }

    if (judul) {
      row.set("judul", judul);
    }
    if (secureUrl) {
      row.set("link gambar", secureUrl);
    }
    row.set("tanggal diubah", new Date().toISOString());
    await row.save();

    return NextResponse.json({ message: "Berhasil mengupdate data galeri" }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth();
    configCloudinary();
    const url = new URL(req.url);
    const shortcode = url.searchParams.get("shortcode");

    if (!shortcode) {
      throw new ApiError(400, "Shortcode wajib diisi");
    }

    const doc = await getDoc();
    const sheet = doc.sheetsByTitle["galeri"];
    if (!sheet) {
      throw new ApiError(500, "Sheet galeri tidak ditemukan");
    }

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("shortcode") === shortcode);

    if (!row) {
      throw new ApiError(404, "Data tidak ditemukan");
    }

    const linkGambar = row.get("link gambar");
    if (linkGambar && linkGambar.includes("cloudinary.com")) {
      const publicId = getPublicIdFromUrl(linkGambar);
      if (publicId) {
        // Must wait for cloudinary deletion to succeed
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await row.delete();

    return NextResponse.json({ message: "Berhasil menghapus data galeri" }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
