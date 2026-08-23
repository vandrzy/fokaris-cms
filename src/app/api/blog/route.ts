import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import crypto from "crypto";

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

  while ((match = regex.exec(html)) !== null) {
    const base64Data = match[1];
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
        return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
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
      "isi blog": row.get("isi blog"),
    }));

    if (namaParam) {
      allData = allData.filter(item => 
        item.judul && item.judul.toLowerCase().includes(namaParam.toLowerCase())
      );
    }

    // Latest first
    allData = allData.reverse();

    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 10;
    const startIndex = (page - 1) * limit;
    const paginatedData = allData.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      data: paginatedData,
      total: allData.length,
      page,
      limit,
      totalPages: Math.ceil(allData.length / limit),
    }, { status: 200 });

  } catch (error: any) {
    console.error("GET Blog Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    configCloudinary();
    const formData = await req.formData();
    const file = formData.get("cover") as File | null;
    const judul = formData.get("judul") as string | null;
    const isi = formData.get("isi") as string | null;

    if (!file || !judul || !isi) {
      return NextResponse.json({ message: "Cover, judul, dan isi wajib diisi" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Format file cover tidak valid. Harap unggah gambar." }, { status: 400 });
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
      "isi blog": processedIsi,
      "tanggal dupload": tanggalDupload,
      "cover link": secureCoverUrl,
    });

    return NextResponse.json({ message: "Berhasil menambahkan blog", shortcode }, { status: 201 });
  } catch (error: any) {
    console.error("POST Blog Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    configCloudinary();
    const url = new URL(req.url);
    const shortcode = url.searchParams.get("shortcode");

    if (!shortcode) {
      return NextResponse.json({ message: "Shortcode wajib diisi" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("cover") as File | null;
    const judul = formData.get("judul") as string | null;
    const isi = formData.get("isi") as string | null;

    const doc = await getDoc();
    const sheet = doc.sheetsByTitle["blog"];
    if (!sheet) {
      return NextResponse.json({ message: "Sheet blog tidak ditemukan" }, { status: 500 });
    }

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("shortcode") === shortcode);

    if (!row) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    }

    let secureCoverUrl = row.get("cover link");
    let processedIsi = row.get("isi blog");

    // Process new cover image
    if (file && file.type.startsWith("image/")) {
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
    // Note: Do not update tanggal dupload on edit based on typical CMS, or do it if required. 
    // Spec doesn't say "tanggal diubah", only "tanggal dupload", so we leave it as is.
    
    await row.save();

    return NextResponse.json({ message: "Berhasil mengupdate blog" }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Blog Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server saat mengupdate data" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    configCloudinary();
    const url = new URL(req.url);
    const shortcode = url.searchParams.get("shortcode");

    if (!shortcode) {
      return NextResponse.json({ message: "Shortcode wajib diisi" }, { status: 400 });
    }

    const doc = await getDoc();
    const sheet = doc.sheetsByTitle["blog"];
    if (!sheet) {
      return NextResponse.json({ message: "Sheet blog tidak ditemukan" }, { status: 500 });
    }

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("shortcode") === shortcode);

    if (!row) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
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
  } catch (error: any) {
    console.error("DELETE Blog Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server saat menghapus data" }, { status: 500 });
  }
}
