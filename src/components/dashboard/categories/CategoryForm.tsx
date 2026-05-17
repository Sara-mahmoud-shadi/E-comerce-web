'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Save, X, Tag, Upload, ImageIcon, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}categories`;

interface CategoryFormProps {
  id?: string;
  initialData?: {
    name_en: string;
    name_ar: string;
    image?: string;
  };
  isEditing?: boolean;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function CategoryForm({ id, initialData, isEditing }: CategoryFormProps) {
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name_en: string;
    name_ar: string;
    image: File | null;
    imagePreview: string | null;
  }>({
    name_en: initialData?.name_en ?? '',
    name_ar: initialData?.name_ar ?? '',
    image: null,
    imagePreview: initialData?.image ?? null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch data if editing
  React.useEffect(() => {
    if (isEditing && id) {
      const fetchData = async () => {
        setStatus('loading');
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}categories/${id}`);
          if (!res.ok) throw new Error('Failed to fetch category');
          const data = await res.json();
          setFormData({
            name_en: data.name_en || '',
            name_ar: data.name_ar || '',
            image: null,
            imagePreview: data.image || null,
          });
          setStatus('idle');
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : 'Failed to fetch data');
          setStatus('error');
        }
      };
      fetchData();
    }
  }, [isEditing, id]);

  // Submission state
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Image helpers ────────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({ ...prev, image: file, imagePreview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null, imagePreview: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_en.trim() || !formData.name_ar.trim()) {
      setErrorMsg('Both English and Arabic names are required.');
      setStatus('error');
      return;
    }

    // Retrieve the Bearer token stored under "token" in localStorage
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';

    const body = new FormData();
    body.append('name_en', formData.name_en.trim());
    body.append('name_ar', formData.name_ar.trim());
    if (formData.image) body.append('image', formData.image);

    setStatus('loading');
    setErrorMsg('');

    try {
      const url = isEditing ? `${API_URL}/${id}` : API_URL;
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? `Request failed (${res.status})`);
      }

      setStatus('success');
      setTimeout(() => router.back(), 1500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit}>
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white mb-2">
              {isEditing ? t('edit') : t('create')} {t('categories')}
            </h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {isEditing ? t('editSubtitle') : t('createSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="flex items-center cursor-pointer gap-3 px-6 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              {t('cancel')}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-3 px-8 py-4 bg-primary-500 text-white rounded-md font-black cursor-pointer tracking-widest text-[12px] shadow-lg hover:scale-105 transition-transform disabled:opacity-60 disabled:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? 'Saving…' : t('save')}
            </button>
          </div>
        </header>

        {/* ── Status banners ─────────────────────────────────────────────────── */}
        {status === 'success' && (
          <div className="mb-6 flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-500 text-sm font-bold">
            <CheckCircle className="w-5 h-5 shrink-0" />
            Category saved successfully
          </div>
        )}
        {status === 'error' && errorMsg && (
          <div className="mb-6 flex items-center gap-3 px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* ── Fields ─────────────────────────────────────────────────────────── */}
        <div className="space-y-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* General info */}
          <section className="bg-white dark:bg-[#081640] p-10 h-full rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Tag className="w-5 h-5 text-primary-500" />
                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">
                  {t('generalInfo')}
                </h3>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] m-2">
                  {t('categoryNameEn')}
                </label>
                <input
                  type="text"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleChange}
                  placeholder="e.g. Kitchen Supplies"
                  required
                  className="w-full bg-gray-50 mt-2 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] m-2">
                  {t('categoryNameAr')}
                </label>
                <input
                  type="text"
                  name="name_ar"
                  value={formData.name_ar}
                  onChange={handleChange}
                  placeholder="مثال: مستلزمات المطبخ"
                  required
                  dir="rtl"
                  className="w-full bg-gray-50 mt-2 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all text-right"
                />
              </div>
            </div>
          </section>

          {/* Image upload */}
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">
                  {t('categoryImage')}
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2rem] p-5 text-center group hover:border-blue-500/50 transition-colors relative overflow-hidden h-[300px]">
                {formData.imagePreview ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-3 bg-red-500 cursor-pointer text-white rounded-full hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest dark:text-white">
                        {t('uploadPrompt')}
                      </h4>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                        {t('uploadRestrictions')}
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
