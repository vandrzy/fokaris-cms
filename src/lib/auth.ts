import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/env";
import { ApiError } from "@/lib/api-error";

export interface AuthPayload {
  username: string;
  role?: string;
}

export async function requireAuth(): Promise<AuthPayload> {
  const token = (await cookies()).get("token")?.value;
  if (!token) throw new ApiError(401, "Tidak terautentikasi");
  try {
    return jwt.verify(token, getJwtSecret()) as AuthPayload;
  } catch {
    throw new ApiError(401, "Sesi tidak valid atau kedaluwarsa");
  }
}
