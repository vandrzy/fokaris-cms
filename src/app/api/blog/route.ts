import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth";
import sanitizeHtml from "sanitize-html";
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

async function uploadToCloudinary(buffer: Buffer, folder: string) {
  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

// Helper to extract Cloudinary public IDs from HTML
function extractCloudinaryPublicIds(html: string): string[] {
  const regex = /src="(https:\/\/res\.cloudinary\.com\/[^"]+)"/g;
  let match;
  const ids: string[] = [];
  while ((match = regex.exec(html)) !== null) {
    const publicId = getPublicIdFromUrl(match[1]);
    if (publicId) ids.push(publicId);
  }
  return ids;
}

// Function to replace base64 images in HTML with Cloudinary URLs
async function processBase64Images(html: string): Promise<string> {
  const regex = /src="(data:image\/[^;]+;base64,[^"]+)"/g;
  let match;
  let processedHtml = html;
  const MAX_BYTES = 5 * 1024 * 1024;

  while ((match = regex.exec(html)) !== null) {
    const base64Data = match[1];
    
    const approxBytes = Math.floor((base64Data.length * 3) / 4);
    if (approxBytes > MAX_BYTES) {
      throw new ApiError(413, "Gambar dalam konten terlalu besar (maks 5 MB)");
    }

    const base64String = base64Data.split(",")[1];
    const buffer = Buffer.from(base64String, "base64");

    try {
      const result = await uploadToCloudinary(buffer, "fokaris_cms/blog");
      processedHtml = processedHtml.replace(base64Data, result.secure_url);
    } catch (err) {
      console.error("Gagal mengunggah gambar inline:", err);
    }
  }

  return processedHtml;
}


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shortcode = url.searchParams.get("shortcode");
    const namaParam = url.searchParams.get("nama");
    const pageStr = url.searchParams.get("page");
    const limitStr = url.searchParams.get("limit");

    const doc = await getDoc();
    const sheet = doc.sheetsByTitle["blog"];
    if (!sheet) {
      return NextResponse.json({ data: [], total: 0, message: "Sheet blog belum ada" }, { status: 200 });
    }

    const rows = await sheet.getRows();

    if (shortcode) {
      const row = rows.find((r) => r.get("shortcode") === shortcode);
      if (!row) {
        throw new ApiError(404, "Data tidak ditemukan");
      }
      return NextResponse.json({
        data: {
          id: row.get("id"),
          judul: row.get("judul"),
          "isi blog": row.get("isi blog"),
          "cover link": row.get("cover link"),
          shortcode: row.get("shortcode"),
          "tanggal dupload": row.get("tanggal dupload"),
        },
      }, { status: 200 });
    }

    // Pagination & Search
    let allData = rows.map((row) => ({
      judul: row.get("judul"),
      "cover link": row.get("cover link"),
      shortcode: row.get("shortcode"),
      "tanggal dupload": row.get("tanggal dupload"),
    }));

    if (namaParam) {
      allData = allData.filter(item => 
        item.judul && item.judul.toLowerCase().includes(namaParam.toLowerCase())
      );
    }

    // Latest first
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
    const file = formData.get("cover") as File | null;
    const judul = formData.get("judul") as string | null;
    const isi = formData.get("isi") as string | null;

    if (!file || !judul || !isi) {
      throw new ApiError(400, "Cover, judul, dan isi wajib diisi");
    }

    if (!file.type.startsWith("image/")) {
      throw new ApiError(400, "Format file cover tidak valid. Harap unggah gambar.");
    }
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      throw new ApiError(413, "Ukuran gambar cover maksimal 5 MB");
    }

    // 1. Generate ID & shortcode
    const id = crypto.randomUUID();
    const shortcode = crypto.createHash('md5').update(id).digest('hex').substring(0, 10);

    // 2. Upload cover to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const coverUploadResult = await uploadToCloudinary(buffer, "fokaris_cms/blog");
    const secureCoverUrl = coverUploadResult.secure_url;

    // 3. Process base64 images in "isi" and upload to Cloudinary
    const processedIsi = await processBase64Images(isi);
    
    // 3b. Sanitize HTML
    const cleanIsi = sanitizeHtml(processedIsi, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'img': [ 'src', 'alt', 'width', 'height', 'style' ]
      }
    });

    // 4. Save to Google Sheets
    const doc = await getDoc();
    let sheet = doc.sheetsByTitle["blog"];
    if (!sheet) {
      sheet = await doc.addSheet({ headerValues: ["id", "shortcode", "judul", "isi blog", "tanggal dupload", "cover link"], title: "blog" });
    } else {
      await sheet.loadHeaderRow();
    }

    const tanggalDupload = new Date().toISOString();

    await sheet.addRow({
      id,
      shortcode,
      judul,
      "isi blog": cleanIsi,
      "tanggal dupload": tanggalDupload,
      "cover link": secureCoverUrl,
    });

    return NextResponse.json({ message: "Berhasil menambahkan blog", shortcode }, { status: 201 });
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
    const file = formData.get("cover") as File | null;
    const judul = formData.get("judul") as string | null;
    const isi = formData.get("isi") as string | null;

    const doc = await getDoc();
    const sheet = doc.sheetsByTitle["blog"];
    if (!sheet) {
      throw new ApiError(500, "Sheet blog tidak ditemukan");
    }

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("shortcode") === shortcode);

    if (!row) {
      throw new ApiError(404, "Data tidak ditemukan");
    }

    let secureCoverUrl = row.get("cover link");
    let processedIsi = row.get("isi blog");

    // Process new cover image
    if (file && file.type.startsWith("image/")) {
      const MAX_BYTES = 5 * 1024 * 1024;
      if (file.size > MAX_BYTES) {
        throw new ApiError(413, "Ukuran gambar cover maksimal 5 MB");
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "fokaris_cms/blog");
      secureCoverUrl = uploadResult.secure_url;

      // Delete old cover
      const oldUrl = row.get("cover link");
      if (oldUrl && oldUrl.includes("cloudinary.com")) {
        const publicId = getPublicIdFromUrl(oldUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Gagal menghapus cover lama di Cloudinary:", err);
          }
        }
      }
    }

    // Process new content
    if (isi) {
      // Find old images
      const oldImages = extractCloudinaryPublicIds(row.get("isi blog") || "");
      
      // Process new images (uploads base64)
      processedIsi = await processBase64Images(isi);
      processedIsi = sanitizeHtml(processedIsi, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          'img': [ 'src', 'alt', 'width', 'height', 'style' ]
        }
      });
      
      // Find images currently in new content
      const newImages = extractCloudinaryPublicIds(processedIsi);
      
      // Delete removed images
      const imagesToDelete = oldImages.filter(id => !newImages.includes(id));
      for (const publicId of imagesToDelete) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Gagal menghapus gambar inline yang sudah dihapus dari konten:", err);
        }
      }
    }

    if (judul) row.set("judul", judul);
    row.set("isi blog", processedIsi);
    row.set("cover link", secureCoverUrl);
    
    await row.save();

    return NextResponse.json({ message: "Berhasil mengupdate blog" }, { status: 200 });
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
    const sheet = doc.sheetsByTitle["blog"];
    if (!sheet) {
      throw new ApiError(500, "Sheet blog tidak ditemukan");
    }

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("shortcode") === shortcode);

    if (!row) {
      throw new ApiError(404, "Data tidak ditemukan");
    }

    // Delete Cover
    const coverLink = row.get("cover link");
    if (coverLink && coverLink.includes("cloudinary.com")) {
      const publicId = getPublicIdFromUrl(coverLink);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Gagal menghapus cover di Cloudinary:", err);
        }
      }
    }

    // Delete Inline Images
    const isiBlog = row.get("isi blog");
    if (isiBlog) {
      const inlineImageIds = extractCloudinaryPublicIds(isiBlog);
      for (const publicId of inlineImageIds) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Gagal menghapus gambar inline di Cloudinary:", err);
        }
      }
    }

    await row.delete();

    return NextResponse.json({ message: "Berhasil menghapus blog" }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
