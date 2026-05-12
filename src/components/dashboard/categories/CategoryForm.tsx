'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Save, X, Tag, Upload, ImageIcon, Trash2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

interface CategoryFormProps {
  initialData?: {
    name: string;
    nameAr: string;
    slug: string;
    description: string;
    image?: string;
  };
  isEditing?: boolean;
}

export default function CategoryForm({ initialData, isEditing }: CategoryFormProps) {
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  return (
    <div className="container mx-auto">
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
            onClick={() => router.back()}
            className="flex items-center gap-3 px-6 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
            {t('cancel')}
          </button>
          <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
            <Save className="w-4 h-4" />
            {t('save')}
          </button>
        </div>
      </header>

      <div className="space-y-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-[#081640] p-10 h-full rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Tag className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('generalInfo')}</h3>
            </div>
            
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] m-2">{t('categoryNameEn')}</label>
              <input 
                type="text" 
                defaultValue={initialData?.name}
                placeholder="e.g. Kitchen Supplies"
                className="w-full bg-gray-50 mt-2 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] m-2">{t('categoryNameAr')}</label>
              <input 
                type="text" 
                defaultValue={initialData?.nameAr}
                placeholder="مثال: مستلزمات المطبخ"
                className="w-full bg-gray-50 mt-2 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all text-right"
              />
            </div>
          </div>
        </section>

        {/* Image Upload Section */}
        <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('categoryImage')}</h3>
            </div>

            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2rem] p-12 text-center group hover:border-blue-500/50 transition-colors relative overflow-hidden h-[250px]">
              {imagePreview ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={removeImage}
                      className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
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
                    <h4 className="text-[10px] font-black uppercase tracking-widest dark:text-white">{t('uploadPrompt')}</h4>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t('uploadRestrictions')}</p>
                  </div>
                  <input 
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
    </div>
  );
}
