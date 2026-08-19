"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ImageIcon,
  Save,
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIconToolbar
} from 'lucide-react';
import { toast } from 'sonner';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, forceUpdate] = useState({});

  React.useEffect(() => {
    if (!editor) return undefined;

    const handleUpdate = () => forceUpdate({});
    editor.on('transaction', handleUpdate);

    return () => {
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Format file tidak valid. Harap unggah gambar.");
        return;
      }
      const url = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: url }).run();
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap items-center relative">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors"
          title="Insert Image"
        >
          <ImageIconToolbar className="w-4 h-4" />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default function BlogUploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'w-full p-4 min-h-[400px] max-h-[450px] overflow-y-auto focus:outline-none text-gray-900 bg-white prose max-w-none',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const dropFile = event.dataTransfer.files[0];
          if (dropFile.type.startsWith('image/')) {
            const url = URL.createObjectURL(dropFile);
            const { schema } = view.state;
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            const node = schema.nodes.image.create({ src: url });
            if (coordinates) {
              const transaction = view.state.tr.insert(coordinates.pos, node);
              view.dispatch(transaction);
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Format file tidak valid. Harap unggah gambar.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    if (e.target) e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Silakan pilih gambar cover terlebih dahulu.");
      return;
    }

    if (!title.trim()) {
      toast.error("Silakan masukkan judul blog.");
      return;
    }

    toast.success("Blog berhasil dipublikasikan!");
    router.push('/dashboard/blog');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link
          href="/dashboard/blog"
          className="inline-flex items-center justify-center p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Blog Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Buat dan publikasikan artikel blog baru Anda.</p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Pilih Gambar Cover</label>
            <div className="relative w-full h-64 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary/50 transition-colors flex flex-col items-center justify-center overflow-hidden group">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={handleCoverUpload}
              />

              {previewUrl && (
                <div className="absolute inset-0 z-0">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                </div>
              )}

              <div className="relative z-10 flex flex-col items-center pointer-events-none text-center p-4">
                <ImageIcon className={`w-10 h-10 mb-2 ${previewUrl ? 'text-white' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${previewUrl ? 'text-white' : 'text-gray-500'}`}>
                  {previewUrl ? "Klik atau Tarik untuk Mengubah Gambar" : "Tarik & Lepas Gambar ke Sini"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">Judul Blog</label>
            <input
              id="title"
              type="text"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-gray-900"
              placeholder="Masukkan judul untuk artikel ini..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Isi Blog</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-colors">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
            <Link
              href="/dashboard/blog"
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-center"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
