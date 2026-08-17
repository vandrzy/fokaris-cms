"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

type GalleryItem = {
  id: string;
  imageUrl: string;
  title: string;
  uploadDate: string;
};

// Dummy data
const dummyGalleryData: GalleryItem[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `${i + 1}`,
  imageUrl: `https://images.unsplash.com/photo-1506744626753-eda8151a7471?q=80&w=150&auto=format&fit=crop&sig=${i}`,
  title: `Gambar Pemandangan ${i + 1}`,
  uploadDate: `2026-08-${(i % 30 + 1).toString().padStart(2, '0')}`,
}));

const ITEMS_PER_PAGE = 5;

export default function GalleryAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter items based on search query
  const filteredData = useMemo(() => {
    return dummyGalleryData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Reset to first page when searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Galeri</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola gambar yang ditampilkan di website Anda.</p>
        </div>
        <Link
          href="/dashboard/gallery/upload"
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Gambar
        </Link>
      </div>

      {/* Combined Filter & Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 border-b border-gray-100">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
              placeholder="Cari gambar berdasarkan judul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Gambar
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Judul
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Tanggal Upload
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{item.uploadDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    Tidak ada gambar yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 0 && (
          <div className="bg-white px-4 sm:px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> hingga{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
                  </span>{' '}
                  dari <span className="font-medium">{filteredData.length}</span> hasil
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, idx) => {
                    const page = idx + 1;
                    if (totalPages > 5 && Math.abs(page - currentPage) > 1 && page !== 1 && page !== totalPages) {
                      if (Math.abs(page - currentPage) === 2) {
                        return <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>

            {/* Mobile Pagination */}
            <div className="flex items-center justify-between w-full sm:hidden">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 mx-4">
                Hal {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
