import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Website Organisasi",
  description: "Landing page resmi organisasi kami.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-inter bg-background text-body text-[16px] md:text-[18px] min-h-screen flex flex-col`}
      >
        <main className="flex-grow">{children}</main>
        <Toaster richColors position="top-right" style={{ marginTop: '55px' }} />
      </body>
    </html>
  );
}