import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import jwt from "jsonwebtoken";

import { JWT } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "username atau password salah" },
        { status: 401 }
      );
    }

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, serviceAccountAuth);

    await doc.loadInfo();

    // Look for 'akun' sheet
    let authSheet = doc.sheetsByTitle["akun"];
    
    // Fallback if sheet is not created yet (for robust early dev)
    if (!authSheet) {
      return NextResponse.json(
        { message: "username atau password salah" },
        { status: 401 }
      );
    }

    const rows = await authSheet.getRows();
    let userFound = false;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Compare values using .get() for google-spreadsheet v4+
      if (row.get('username') === username && row.get('password') === password) {
        userFound = true;
        break;
      }
    }

    if (!userFound) {
      return NextResponse.json(
        { message: "username atau password salah" },
        { status: 401 }
      );
    }

    // JWT Creation
    const secret = process.env.JWT_SECRET || "default_fokaris_secret_123";
    const token = jwt.sign({ username }, secret, { expiresIn: "1d" });

    // Return the response with token
    return NextResponse.json(
      { token },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login API Error:", error);
    // Generic failure
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
