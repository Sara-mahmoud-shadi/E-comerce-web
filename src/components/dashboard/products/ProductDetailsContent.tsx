'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Edit3,
  Package,
  Tag,
  Layers,
  Box,
  TrendingUp,
  Eye,
  ShoppingCart,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useRouter, Link } from '@/i18n/routing';

interface ProductDetailsContentProps {
  id: string;
}

const MOCK_PRODUCT = {
  id: '1',
  sku: 'PROD-0001',
  name: 'Artisan Plate',
  nameAr: 'صحن حرفي',
  description: 'Handcrafted premium ceramic plate with a unique glaze finish. Perfect for luxury hospitality and fine dining experiences. Each piece is unique due to the artisanal manufacturing process.',
  category: 'serving',
  price: 45.00,
  discountPrice: 35.00,
  stock: 45,
  images: [
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    'https://images.unsplash.com/photo-1574706196825-f2a632128c6a?w=800&q=80',
    'https://images.unsplash.com/photo-1514228742587-6b1558fbed20?w=800&q=80'
  ],
  attributes: [
    { name: 'Material', value: 'Ceramic' },
    { name: 'Dimensions', value: '28cm x 28cm' },
    { name: 'Weight', value: '0.8kg' },
    { name: 'Color', value: 'Glacial Blue' }
  ],
  stats: {
    views: 1240,
    sales: 156,
    conversion: '12.5%',
    profit: '$2,180'
  }
};

export default function ProductDetailsContent({ id }: ProductDetailsContentProps) {
  const t = useTranslations('Dashboard');
  const tc = useTranslations('Categories');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();

  const [activeImage, setActiveImage] = useState(0);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: t('outOfStock'), color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle };
    if (stock < 10) return { label: t('lowStock'), color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertCircle };
    return { label: t('inStock'), color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 };
  };

  const status = getStockStatus(MOCK_PRODUCT.stock);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
            {t('backToProducts')}
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white">
              {isRtl ? MOCK_PRODUCT.nameAr : MOCK_PRODUCT.name}
            </h1>
            <div className={`px-4 py-1.5 rounded-full ${status.bg} ${status.color} text-[10px] font-black uppercase tracking-widest flex items-center gap-2`}>
              <status.icon className="w-3 h-3" />
              {status.label}
            </div>
          </div>
          <p className="text-sm font-bold text-gray-400 tracking-widest flex items-center gap-2">
            {t('sku')}: {MOCK_PRODUCT.sku}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href={`/dashboard/products/${id}/edit`} className="flex-1 md:flex-none">
            <button className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
              <Edit3 className="w-4 h-4" />
              {t('editProduct')}
            </button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Images & Description */}
        <div className="lg:col-span-2 space-y-10">
          {/* Gallery */}
          <section className="bg-white dark:bg-[#081640] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden p-8">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/5">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={MOCK_PRODUCT.images[activeImage]}
                alt=""
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                <button
                  onClick={() => setActiveImage(prev => (prev === 0 ? MOCK_PRODUCT.images.length - 1 : prev - 1))}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveImage(prev => (prev === MOCK_PRODUCT.images.length - 1 ? 0 : prev + 1))}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {MOCK_PRODUCT.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === index ? 'border-blue-500 scale-95' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('fullDescription')}</h3>
            </div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-tight">
              {MOCK_PRODUCT.description}
            </p>
          </section>

          {/* Specifications */}
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Layers className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('specifications')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MOCK_PRODUCT.attributes.map((attr, index) => (
                <div key={index} className="flex flex-col gap-2 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-transparent hover:border-blue-500/20 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{attr.name}</span>
                  <span className="text-sm font-black dark:text-white uppercase tracking-tight">{attr.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Performance Stats */}
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('performance')}</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{t('views')}</span>
                </div>
                <p className="text-xl font-black dark:text-white">{MOCK_PRODUCT.stats.views}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{t('sales')}</span>
                </div>
                <p className="text-xl font-black dark:text-white">{MOCK_PRODUCT.stats.sales}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{t('conversionRate')}</span>
                </div>
                <p className="text-xl font-black text-blue-500">{MOCK_PRODUCT.stats.conversion}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{t('profit')}</span>
                </div>
                <p className="text-xl font-black text-emerald-500">{MOCK_PRODUCT.stats.profit}</p>
              </div>
            </div>
          </section>

          {/* Pricing & Inventory Card */}
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('pricing')}</h3>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('basePrice')}</span>
                  <p className={`text-3xl font-black tracking-tighter ${MOCK_PRODUCT.discountPrice ? 'text-gray-300 dark:text-gray-600 line-through text-xl' : 'dark:text-white'}`}>
                    ${MOCK_PRODUCT.price.toFixed(2)}
                  </p>
                </div>
                {MOCK_PRODUCT.discountPrice && (
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t('discountPrice')}</span>
                    <p className="text-4xl font-black tracking-tighter text-emerald-500">
                      ${MOCK_PRODUCT.discountPrice.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <Box className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('stockQuantity')}</span>
                  </div>
                  <span className="text-sm font-black dark:text-white">{MOCK_PRODUCT.stock} Units</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <Layers className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('category')}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-primary-500/10 dark:bg-blue-500/10 text-primary-500 dark:text-blue-400 px-3 py-1 rounded-lg">
                    {tc(MOCK_PRODUCT.category)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
