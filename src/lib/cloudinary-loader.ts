"use client";
import type { ImageLoaderProps } from "next/image";

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) return src;
  
  // Avoid double transforming if f_auto is already there (from cldTransform)
  if (src.match(/\/upload\/[^/]*f_auto[^/]*\//)) return src;

  const t = `f_auto,q_${quality || "auto"},w_${width}`;
  return src.replace("/upload/", `/upload/${t}/`);
}
