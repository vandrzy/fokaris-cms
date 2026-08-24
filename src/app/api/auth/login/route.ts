import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { JWT } from 'google-auth-library';
import { getJwtSecret } from "@/lib/env";
import { handleApiError, ApiError } from "@/lib/api-error";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      throw new ApiError(401, "username atau password salah");
    }

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, serviceAccountAuth);

    await doc.loadInfo();

    let authSheet = doc.sheetsByTitle["akun"];
    
    if (!authSheet) {
      throw new ApiError(401, "username atau password salah");
    }

    const rows = await authSheet.getRows();
    let userRow = null;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.get('username') === username) {
        userRow = row;
        break;
      }
    }

    if (!userRow) {
      throw new ApiError(401, "username atau password salah");
    }

    const storedHash = userRow.get('password');
    // If it's the first time and not hashed (for safety during migration)
    const isMatch = storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") 
      ? await bcrypt.compare(password, storedHash)
      : storedHash === password;

    if (!isMatch) {
      throw new ApiError(401, "username atau password salah");
    }

    const secret = getJwtSecret();
    const token = jwt.sign({ username }, secret, { expiresIn: "2h" });

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 jam
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    return handleApiError(error);
  }
}
