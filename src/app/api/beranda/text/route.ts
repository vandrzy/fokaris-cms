import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';

// Helper function to get authenticated doc
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

const INITIAL_DATA = [
  { key: 'hero_title', value: 'Selamat Datang di Fokaris CMS', max_length: 60 },
  { key: 'hero_subtitle', value: 'Platform CMS terbaik untuk mengelola web Anda dengan mudah dan cepat.', max_length: 160 },
  { key: 'about_title', value: 'Tentang Kami', max_length: 50 },
  { key: 'about_desc', value: 'Kami adalah penyedia solusi digital yang berfokus pada inovasi dan kemudahan.', max_length: 400 },
  { key: 'stat_1_value', value: '103+', max_length: 8 },
  { key: 'stat_1_label', value: 'TOTAL ANGGOTA', max_length: 40 },
  { key: 'stat_2_value', value: '24', max_length: 8 },
  { key: 'stat_2_label', value: 'KEGIATAN TERLAKSANA', max_length: 40 },
  { key: 'hero_image_1', value: '', max_length: 0 },
  { key: 'hero_image_2', value: '', max_length: 0 },
  { key: 'hero_image_3', value: '', max_length: 0 },
  { key: 'blog_hero_title', value: 'Blog & Publikasi', max_length: 50 },
  { key: 'blog_hero_subtitle', value: 'Ikuti perkembangan terbaru, cerita inspiratif, dan laporan kegiatan dari berbagai program yang telah kami jalankan.', max_length: 150 },
  { key: 'galeri_hero_title', value: 'Galeri Kegiatan', max_length: 50 },
  { key: 'galeri_hero_subtitle', value: 'Jejak langkah nyata kami tergambar dalam momen-momen kebersamaan, perjuangan, dan senyum bahagia mereka yang terbantu.', max_length: 150 },
  { key: 'galeri_images', value: '[]', max_length: 0 },
];

export async function GET() {
  try {
    const doc = await getDoc();
    let sheet = doc.sheetsByTitle["beranda"];

    // Auto-create and seed if sheet doesn't exist
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'beranda', headerValues: ['key', 'value', 'max_length'] });
      await sheet.addRows(INITIAL_DATA);
    }

    let rows = await sheet.getRows();

    // Auto-seed missing rows
    const existingKeys = new Set(rows.map((row: any) => row.get('key')));
    const missingRows = INITIAL_DATA.filter(item => !existingKeys.has(item.key));
    if (missingRows.length > 0) {
      await sheet.addRows(missingRows);
      rows = await sheet.getRows();
    }

    const data: Record<string, any> = {};

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const key = row.get('key');
      data[key] = {
        value: row.get('value'),
        max_length: parseInt(row.get('max_length') || '0', 10)
      };
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API Beranda GET Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const doc = await getDoc();
    let sheet = doc.sheetsByTitle["beranda"];

    if (!sheet) {
      sheet = await doc.addSheet({ title: 'beranda', headerValues: ['key', 'value', 'max_length'] });
      await sheet.addRows(INITIAL_DATA);
    }

    let rows = await sheet.getRows();

    // Auto-seed missing rows
    const existingKeys = new Set(rows.map((row: any) => row.get('key')));
    const missingRows = INITIAL_DATA.filter(item => !existingKeys.has(item.key));
    if (missingRows.length > 0) {
      await sheet.addRows(missingRows);
      rows = await sheet.getRows();
    }

    // First pass: Validation
    console.log("PUT Payload received:", body);
    const keyLabels: Record<string, string> = {
      hero_title: 'Hero Title',
      hero_subtitle: 'Hero Subtitle',
      about_title: 'About Title',
      about_desc: 'About Text',
      stat_1_value: 'Nilai Statistik 1',
      stat_1_label: 'Label Statistik 1',
      stat_2_value: 'Nilai Statistik 2',
      stat_2_label: 'Label Statistik 2',
      hero_image_1: 'Hero Image 1',
      hero_image_2: 'Hero Image 2',
      hero_image_3: 'Hero Image 3',
      blog_hero_title: 'Blog Hero Title',
      blog_hero_subtitle: 'Blog Hero Subtitle',
      galeri_hero_title: 'Galeri Hero Title',
      galeri_hero_subtitle: 'Galeri Hero Subtitle',
      galeri_images: 'Galeri Images'
    };

    for (const row of rows) {
      const key = row.get('key');
      const maxLength = parseInt(row.get('max_length') || '0', 10);
      const newValue = body[key];

      console.log(`Checking row key: ${key}, maxLength: ${maxLength}, newValue:`, newValue);

      if (newValue !== undefined) {
        const strValue = String(newValue);
        if (maxLength > 0 && strValue.length > maxLength) {
          console.log(`Validation failed! ${strValue.length} > ${maxLength}`);
          const label = keyLabels[key] || key;
          return NextResponse.json(
            { message: `${label} maksimal ${maxLength} karakter. (Anda mengirim ${strValue.length} karakter)` },
            { status: 400 }
          );
        }
      }
    }

    // Second pass: Update and save
    let updated = false;
    for (const row of rows) {
      const key = row.get('key');
      if (body[key] !== undefined) {
        row.set('value', body[key]);
        await row.save();
        updated = true;
      }
    }

    if (!updated) {
      console.log("No data updated!");
      return NextResponse.json({ message: "Tidak ada data yang diperbarui. Pastikan key payload sesuai dengan key spreadsheet." }, { status: 400 });
    }

    return NextResponse.json({ message: "Data berhasil diperbarui." }, { status: 200 });

  } catch (error) {
    console.error("API Beranda PUT Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
