'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Save, X, Package, DollarSign, Box, Image as ImageIcon, Plus, Trash2, ListTree, Star } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing }: ProductFormProps) {
  const t = useTranslations('Dashboard');
  const tc = useTranslations('Categories');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();
  const [images, setImages] = React.useState<string[]>(initialData?.images || []);
  const [mainImageIndex, setMainImageIndex] = React.useState<number>(0);
  const [attributes, setAttributes] = React.useState<{ name: string, value: string }[]>(initialData?.attributes || [{ name: '', value: '' }]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addAttribute = () => {
    setAttributes(prev => [...prev, { name: '', value: '' }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(prev => prev.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: 'name' | 'value', value: string) => {
    setAttributes(prev => prev.map((attr, i) => i === index ? { ...attr, [field]: value } : attr));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white mb-2">
            {isEditing ? t('edit') : t('create')} {t('products')}
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {isEditing ? t('productEditSubtitle') : t('productCreateSubtitle')}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('productDetails')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('productNameEn')}</label>
                <input 
                  type="text" 
                  defaultValue={initialData?.name}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('productNameAr')}</label>
                <input 
                  type="text" 
                  dir="rtl"
                  defaultValue={initialData?.nameAr}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('fullDescription')}</label>
              <textarea 
                rows={6}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all resize-none"
              />
            </div>
          </section>

          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('mediaAssets')}</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {images.map((img, index) => (
                  <motion.div
                    key={`${img}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group relative aspect-square rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-white/5"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => setMainImageIndex(index)}
                        className={`p-2 rounded-xl transition-all ${mainImageIndex === index ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                        title={t('setAsMain')}
                      >
                        <Star className={`w-4 h-4 ${mainImageIndex === index ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={() => removeImage(index)}
                        className="p-2 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {mainImageIndex === index && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                        {t('main')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all group"
              >
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t('addImage')}</span>
              </button>
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>
          </section>
 
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('pricing')}</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('basePrice')}</label>
                <input 
                  type="number" 
                  defaultValue={initialData?.price}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('discountPrice')}</label>
                <input 
                  type="number" 
                  defaultValue={initialData?.discountPrice}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Box className="w-5 h-5 text-purple-500" />
                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('inventory')}</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('category')}</label>
                <Select defaultValue="serving">
                  <SelectTrigger 
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className="w-full h-14 bg-gray-50 dark:bg-gray-900/50 border-transparent rounded-2xl px-6 text-sm font-bold focus:ring-0 focus:border-blue-500/50 transition-all"
                  >
                    <SelectValue placeholder={t('selectCategory')} />
                  </SelectTrigger>
                  <SelectContent 
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className="bg-white dark:bg-[#081640] border-gray-100 dark:border-white/5 rounded-2xl shadow-2xl"
                  >
                    <SelectItem value="serving" className="font-bold text-xs uppercase tracking-widest py-3">{tc('serving')}</SelectItem>
                    <SelectItem value="electrical" className="font-bold text-xs uppercase tracking-widest py-3">{tc('electrical')}</SelectItem>
                    <SelectItem value="cooking" className="font-bold text-xs uppercase tracking-widest py-3">{tc('cooking')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
