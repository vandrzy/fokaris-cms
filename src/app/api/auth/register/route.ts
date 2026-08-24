import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/auth";
import { handleApiError, ApiError } from "@/lib/api-error";

export async function POST(req: Request) {
  try {
    // 1. Verifikasi token (hanya bisa diakses jika sudah login)
    await requireAuth();

    // 2. Ambil data dari request body
    const body = await req.json();
    const { username, password, confirmPassword } = body;

    // Validasi input dasar
    if (!username || !password || !confirmPassword) {
      throw new ApiError(400, "Username, password, dan konfirmasi password wajib diisi");
    }

    if (password !== confirmPassword) {
      throw new ApiError(400, "Password dan konfirmasi password tidak cocok");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password minimal 6 karakter");
    }

    // 3. Konek ke Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();

    let authSheet = doc.sheetsByTitle["akun"];
    if (!authSheet) {
      // Buat sheet 'akun' jika belum ada (meskipun seharusnya sudah ada)
      authSheet = await doc.addSheet({ title: 'akun', headerValues: ['username', 'password'] });
    }

    // 4. Periksa apakah username sudah ada
    const rows = await authSheet.getRows();
    const existingUser = rows.find(r => r.get('username') === username);
    if (existingUser) {
      throw new ApiError(400, "Username sudah digunakan, silakan pilih yang lain");
    }

    // 5. Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6. Simpan akun baru ke Google Sheets
    await authSheet.addRow({
      username,
      password: hashedPassword
    });

    return NextResponse.json({ message: "User baru berhasil ditambahkan" }, { status: 201 });

  } catch (error: unknown) {
    return handleApiError(error);
  }
}
