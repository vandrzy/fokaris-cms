import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { JWT } from 'google-auth-library';
import { getJwtSecret } from "@/lib/env";
import { handleApiError, ApiError } from "@/lib/api-error";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) {
      throw new ApiError(429, "Terlalu banyak percobaan login. Coba lagi nanti.");
    }

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
    const isMatch = await bcrypt.compare(password, storedHash);

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
