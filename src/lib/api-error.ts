import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }
  console.error("[API]", error);
  return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
}
