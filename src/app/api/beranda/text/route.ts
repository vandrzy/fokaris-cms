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

    const rows = await sheet.getRows();
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

    const rows = await sheet.getRows();
    
    // First pass: Validation
    console.log("PUT Payload received:", body);
    for (const row of rows) {
      const key = row.get('key');
      const maxLength = parseInt(row.get('max_length') || '0', 10);
      const newValue = body[key];

      console.log(`Checking row key: ${key}, maxLength: ${maxLength}, newValue:`, newValue);

      if (newValue !== undefined) {
        const strValue = String(newValue);
        if (maxLength > 0 && strValue.length > maxLength) {
          console.log(`Validation failed! ${strValue.length} > ${maxLength}`);
          return NextResponse.json(
            { message: `${key} maksimal ${maxLength} karakter. (Anda mengirim ${strValue.length} karakter)` },
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
