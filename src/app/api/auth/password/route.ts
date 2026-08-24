import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/auth";
import { handleApiError, ApiError } from "@/lib/api-error";

export async function PUT(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "Password lama dan baru wajib diisi");
    }

    const { username } = await requireAuth();

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();

    const authSheet = doc.sheetsByTitle["akun"];
    if (!authSheet) {
      throw new ApiError(500, "Konfigurasi akun tidak ditemukan");
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
      throw new ApiError(404, "Akun tidak ditemukan");
    }

    const storedHash = userRow.get('password');
    const isMatch = storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") 
      ? await bcrypt.compare(oldPassword, storedHash)
      : storedHash === oldPassword;

    if (!isMatch) {
      throw new ApiError(400, "Password lama salah");
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    userRow.set('password', newHash);
    await userRow.save();

    return NextResponse.json(
      { message: "Password berhasil diperbarui" },
      { status: 200 }
    );

  } catch (error) {
    return handleApiError(error);
  }
}
