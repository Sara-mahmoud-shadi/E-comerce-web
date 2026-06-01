'use client';
import { apiFetch } from '@/lib/api';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Save, X, Tag, Upload, ImageIcon, Trash2, Loader2, CheckCircle, AlertCircle, Type } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import DynamicInput from '@/components/shared/DynamicInput';
import { ShopBreadcrumb } from '@/components/shared/ShopBreadcrumb';
import { getApiBase } from './CategoriesList';

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

  // Fetch data if editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchData = async () => {
        setStatus('loading');
        try {
          const res = await apiFetch(`${getApiBase()}categories/${id}`);
          if (!res.ok) throw new Error(t('failedToFetchCategory'));
          const data = await res.json();
          setFormData({
            name_en: data.name_en || '',
            name_ar: data.name_ar || '',
            image: null,
            imagePreview: data.image || null,
          });
          setStatus('idle');
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : t('failedToFetchData'));
          setStatus('error');
        }
      };
      fetchData();
    }
  }, [isEditing, id]);

  // Submission state
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      setFieldErrors({
        ...(!formData.name_en.trim() ? { name_en: t('namesRequired') } : {}),
        ...(!formData.name_ar.trim() ? { name_ar: t('namesRequired') } : {}),
      });
      setStatus('error');
      return;
    }
    setFieldErrors({});

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

      const res = await apiFetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // Map field-level errors from backend [{ field, message }] array
        if (Array.isArray(data?.errors) && data.errors.length > 0) {
          const mapped: Record<string, string> = {};
          data.errors.forEach((e: { field: string; message: string }) => {
            // backend sends field: "name" — map to our field names
            if (e.field === 'name' || e.field === 'name_en') mapped['name_en'] = e.message;
            if (e.field === 'name_ar') mapped['name_ar'] = e.message;
            if (e.field === 'description') mapped['description'] = e.message;
          });
          setFieldErrors(mapped);
        }
        throw new Error(data?.message ?? `Request failed (${res.status})`);
      }

      setStatus('success');
      setTimeout(() => router.back(), 1500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : t('somethingWentWrong'));
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="container 2xl:max-w-5xl mx-auto space-y-8">
      <ShopBreadcrumb
        items={[
          { label: t('dashboard'), href: '/dashboard' },
          { label: t('categories'), href: '/dashboard/categories' },
          { label: isEditing ? t('edit') : t('create') }
        ]}
      />
      <form onSubmit={handleSubmit}>
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="md:text-4xl text-2xl font-black tracking-tighter uppercase dark:text-white mb-2">
              {isEditing ? t('edit') : t('create')} {t('categories')}
            </h1>
            <p className="text-sm font-bold text-gray-400 tracking-widest">
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
              {isLoading ? t('saving') : t('save')}
            </button>
          </div>
        </header>

        {/* ── Status banners ─────────────────────────────────────────────────── */}
        {status === 'success' && (
          <div className="mb-6 flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-500 text-sm font-bold">
            <CheckCircle className="w-5 h-5 shrink-0" />
            {t('categorySavedSuccess')}
          </div>
        )}
        {status === 'error' && errorMsg && (
          <div className="mb-6 flex items-center gap-3 px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* ── Fields ─────────────────────────────────────────────────────────── */}
        <div className=" space-y-8 mt-8">

          {/* General Info Card */}
          <section className="bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary-500" />
                {t('generalInfo')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('generalInfoDesc')}
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Field Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">
                    {t('categoryNameEn')}
                  </label>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                    {t('categoryNameEnDesc')}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <DynamicInput
                    label=""
                    icon={Type}
                    value={formData.name_en}
                    onChange={(val) => setFormData(prev => ({ ...prev, name_en: val }))}
                    onClearError={() => {
                      if (fieldErrors['name_en']) {
                        setFieldErrors(prev => { const next = { ...prev }; delete next['name_en']; return next; });
                      }
                    }}
                    placeholder={t('nameEnPlaceholder')}
                    required
                    error={fieldErrors['name_en']}
                    className="!mt-0"
                  />
                </div>
              </div>

              <hr className="border-gray-100 dark:border-white/5" />

              {/* Field Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">
                    {t('categoryNameAr')}
                  </label>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                    {t('categoryNameArDesc')}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <DynamicInput
                    label=""
                    icon={Type}
                    value={formData.name_ar}
                    onChange={(val) => setFormData(prev => ({ ...prev, name_ar: val }))}
                    onClearError={() => {
                      if (fieldErrors['name_ar']) {
                        setFieldErrors(prev => { const next = { ...prev }; delete next['name_ar']; return next; });
                      }
                    }}
                    placeholder={t('nameArPlaceholder')}
                    required
                    error={fieldErrors['name_ar']}
                    className="text-right !mt-0"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Media Card */}
          <section className="bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-500" />
                {t('categoryImage')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('categoryImageDesc')}
              </p>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">{t('thumbnail')}</label>
                  <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">
                    {t('thumbnailDesc')}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-4 text-center group hover:border-primary-500/50 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-all relative overflow-hidden h-[240px]">
                    {formData.imagePreview ? (
                      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm">
                        <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="p-3 bg-red-500/90 hover:bg-red-500 cursor-pointer text-white rounded-xl hover:scale-105 transition-all shadow-xl text-sm font-bold flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> {t('remove')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-gray-400 mb-4 group-hover:scale-110 group-hover:text-primary-500 group-hover:bg-primary-500/10 transition-all duration-500">
                          <Upload className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold dark:text-white">
                            {t('uploadPrompt')}
                          </h4>
                          <p className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-white/5 inline-block px-3 py-1 rounded-full">
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
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
