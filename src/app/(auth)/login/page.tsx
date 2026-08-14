"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-8 border border-primary/10">

        {/* Header Card */}
        <div className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-body hover:text-primary transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>

          <div className="text-left">
            <h1 className="text-3xl font-bold font-poppins text-header">Admin Login</h1>
            <p className="text-sm text-body mt-2">Masuk untuk mengelola konten</p>
          </div>
        </div>

        {/* Form Fields */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-header">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-header bg-gray-50/50"
              placeholder="Masukkan username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-header">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-header bg-gray-50/50"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-white font-poppins font-medium rounded-lg transition-colors focus:ring-4 focus:ring-primary/20 mt-4 shadow-md shadow-primary/20"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}
