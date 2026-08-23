import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PUT(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Password lama dan baru wajib diisi" },
        { status: 400 }
      );
    }

    // 1. Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Tidak ada akses (Unauthorized)" },
        { status: 401 }
      );
    }

    // 2. Verify and decode token
    const secret = process.env.JWT_SECRET || "default_fokaris_secret_123";
    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return NextResponse.json(
        { message: "Token tidak valid atau kedaluwarsa" },
        { status: 401 }
      );
    }

    const username = decoded.username;
    if (!username) {
      return NextResponse.json(
        { message: "Username tidak ditemukan dalam token" },
        { status: 401 }
      );
    }

    // 3. Connect to Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();

    const authSheet = doc.sheetsByTitle["akun"];
    if (!authSheet) {
      return NextResponse.json(
        { message: "Konfigurasi akun tidak ditemukan" },
        { status: 500 }
      );
    }

    const rows = await authSheet.getRows();
    let userRow = null;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].get('username') === username) {
        userRow = rows[i];
        break;
      }
    }

    if (!userRow) {
      return NextResponse.json(
        { message: "Akun tidak ditemukan" },
        { status: 404 }
      );
    }

    // 4. Validate old password
    if (userRow.get('password') !== oldPassword) {
      return NextResponse.json(
        { message: "Password lama salah" },
        { status: 400 }
      );
    }

    // 5. Update to new password
    userRow.set('password', newPassword);
    await userRow.save();

    return NextResponse.json(
      { message: "Password berhasil diperbarui" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Password API Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
