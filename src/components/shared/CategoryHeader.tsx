'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShopBreadcrumb } from './ShopBreadcrumb';

interface CategoryHeaderProps {
  category: {
    name_ar: string;
    name_en: string;
    image: string;
  } | null;
  productsCount: number;
}

export function CategoryHeader({ category, productsCount }: CategoryHeaderProps) {
  const locale = useLocale();
  const IsRtl = locale === 'ar';

  const getImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop';
    return url.replace(/^https?:\/\/(localhost|192\.168\.0\.195):\d+/, '');
  };

  return (
    <header className="relative w-full min-h-[500px] bg-gradient-to-b from-[#f3f7f2] via-[#e8efe7] to-white dark:from-[#111c12] dark:via-[#19241b] dark:to-[#080808] overflow-hidden flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] border-b border-gray-100/10 transition-colors duration-500 py-32">
      {/* Abstract Glowing Accent Circles */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-primary-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left Content (Metadata & Titles) */}
          <div className="flex-1 max-w-2xl text-center flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Shop Breadcrumb */}
              <ShopBreadcrumb
                items={[{ label: IsRtl ? category?.name_ar || '' : category?.name_en || '' }]}
                className="justify-center lg:justify-start"
              />

              {/* Subtitle Badge Row */}
              <div className="flex flex-wrap items-center justify-start gap-3">
                <span className="bg-primary-500 text-white font-extrabold tracking-widest text-[10px] px-3.5 py-1.5 rounded-full shadow-sm uppercase">
                  {IsRtl ? 'تصنيف مميز' : 'Featured Category'}
                </span>
                <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-primary-600 dark:text-primary-400 border border-primary-500/10 font-bold text-[10px] px-3.5 py-1.5 rounded-full shadow-sm animate-pulse">
                  {productsCount} {IsRtl ? 'منتج متاح' : 'Products Available'}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-start text-gray-900 dark:text-white leading-[1.1] tracking-tight uppercase">
                {IsRtl ? category?.name_ar : category?.name_en}
              </h1>

              {/* Description */}
              <p className="text-base text-start sm:text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-lg">
                {IsRtl
                  ? `اكتشف تشكيلتنا الحصرية من ${category?.name_ar || ''} المصممة خصيصاً لتمنحك الجودة والأناقة التي تستحقها.`
                  : `Explore our handpicked curation of ${category?.name_en || ''}, meticulously designed for culinary perfection and exceptional performance.`}
              </p>
            </motion.div>
          </div>

          {/* Right Content (Modern 3D Interactive Framed Image) */}
          <div className="flex-1 w-full max-w-md lg:max-w-none flex items-center justify-center ">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
              animate={{ opacity: 1, scale: 1, rotate: IsRtl ? -3 : 3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] group select-none cursor-pointer"
            >
              {/* Glowing Background Glow Card */}
              <div className="absolute inset-0 bg-primary-500/20 rounded-[2.5rem] blur-xl group-hover:scale-105 transition-transform duration-500 animate-pulse" />

              {/* Elegant White Outer Container with Glassmorphism */}
              <div className="absolute inset-0 bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden group-hover:rotate-0 transition-transform duration-700">
                <Image
                  src={getImageUrl(category?.image)}
                  alt={(IsRtl ? category?.name_ar : category?.name_en) || ""}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  sizes="320px"
                  priority
                />
                {/* Subtle Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
              </div>

              {/* Ornamental Floating Shapes */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent-500 rounded-2xl shadow-lg -rotate-12 animate-float pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 border-4 border-primary-500 rounded-full shadow-lg rotate-45 pointer-events-none" />
            </motion.div>
          </div>

        </div>
      </div>
    </header>
  );
}
