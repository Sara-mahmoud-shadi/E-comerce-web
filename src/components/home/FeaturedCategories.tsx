'use client';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LayoutGrid, RefreshCw } from 'lucide-react';

interface FeaturedCategoriesProps {
  categories: any[];
  isRtl: boolean;
  t: (key: string) => string;
  getImageUrl: (url: string) => string;
}

export default function FeaturedCategories({ categories, isRtl, t, getImageUrl }: FeaturedCategoriesProps) {
  // After 4 seconds with no data, stop showing the spinner and show the empty state
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (categories.length > 0) {
      setIsLoading(false);
      return;
    }

    // Animate ellipsis dots while loading
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // After 4 seconds, give up loading and show empty state
    const timeout = setTimeout(() => {
      setIsLoading(false);
      clearInterval(dotsInterval);
    }, 4000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timeout);
    };
  }, [categories.length]);

  // Also clear loading as soon as categories arrive
  useEffect(() => {
    if (categories.length > 0) setIsLoading(false);
  }, [categories.length]);

  return (
    <section className="container bg-white lg:shadow mx-auto py-20 relative -top-20 lg:-top-30 rounded-3xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white mb-2">
            {t('featuredCategories')}
          </h2>
          <div className="h-2 w-32 bg-accent-500 rounded-full" />
        </div>
      </div>

      {categories.length >= 1 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
            {/* Main Large Card */}
            {categories[0] && (
              <Link
                href={`/categories/${categories[0].slug}`}
                className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1 h-72 sm:h-80 md:h-auto col-span-2 md:col-span-2 md:row-span-2 group"
              >
                <Image src={getImageUrl(categories[0].image)} alt={isRtl ? categories[0].name_ar || categories[0].name : categories[0].name_en || categories[0].name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" priority className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:via-black/40 transition-colors duration-700" />
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 rtl:left-auto rtl:right-8 flex flex-col items-start gap-1 sm:gap-2">
                  
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter drop-shadow-md">{isRtl ? categories[0].name_ar || categories[0].name : categories[0].name_en || categories[0].name}</h3>
                </div>
              </Link>
            )}

            {/* Medium Horizontal Card */}
            {categories[1] && (
              <Link
                href={`/categories/${categories[1].slug}`}
                className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 transform hover:-translate-y-1 h-48 sm:h-56 md:h-auto col-span-2 md:col-span-2 group"
              >
                <Image src={getImageUrl(categories[1].image)} alt={isRtl ? categories[1].name_ar || categories[1].name : categories[1].name_en || categories[1].name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent rtl:bg-gradient-to-l group-hover:from-black/95 transition-all duration-700" />
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 rtl:left-auto rtl:right-8 flex flex-col items-start gap-1 sm:gap-2">
               
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter drop-shadow-md">{isRtl ? categories[1].name_ar || categories[1].name : categories[1].name_en || categories[1].name}</h3>
                </div>
              </Link>
            )}

            {/* Small Square Cards */}
            {categories[2] && (
              <Link
                href={`/categories/${categories[2].slug}`}
                className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 transform hover:-translate-y-1 h-40 sm:h-48 md:h-auto col-span-1 group"
              >
                <Image src={getImageUrl(categories[2].image)} alt={isRtl ? categories[2].name_ar || categories[2].name : categories[2].name_en || categories[2].name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:via-black/40 transition-colors duration-700" />
                <div className="absolute z-10 bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex justify-center text-center">
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-[11px] sm:text-xs xl:text-xl font-black text-white uppercase tracking-widest transition-transform group-hover:scale-105 duration-500 shadow-md">
                    {isRtl ? categories[2].name_ar || categories[2].name : categories[2].name_en || categories[2].name}
                  </span>
                </div>
              </Link>
            )}

            {categories[3] && (
              <Link
                href={`/categories/${categories[3].slug}`}
                className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 transform hover:-translate-y-1 h-40 sm:h-48 md:h-auto col-span-1 group"
              >
                <Image src={getImageUrl(categories[3].image)} alt={isRtl ? categories[3].name_ar || categories[3].name : categories[3].name_en || categories[3].name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:via-black/40 transition-colors duration-700" />
                <div className="absolute z-10 bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex justify-center text-center">
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-[11px] sm:text-xs xl:text-xl font-black text-white uppercase tracking-widest transition-transform group-hover:scale-105 duration-500 shadow-md">
                    {isRtl ? categories[3]?.name_ar || categories[3].name : categories[3]?.name_en || categories[3].name}
                  </span>
                </div>
              </Link>
            )}
          </div>

          {categories.length > 4 && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
              {categories.slice(4).map((category, index) => (
                <Link
                  key={index}
                  href={`/categories/${category.slug}`}
                  className="group h-44 sm:h-52 md:h-60 relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 transform hover:-translate-y-1"
                >
                  <Image src={getImageUrl(category.image)} alt={isRtl ? category.name_ar || category.name : category.name_en || category.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:via-black/40 transition-colors duration-700" />
                  <div className="absolute z-10 bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex justify-center text-center">
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-[11px] sm:text-xs xl:text-xl font-black text-white uppercase tracking-widest transition-transform group-hover:scale-105 duration-500 shadow-md">
                      {isRtl ? category.name_ar || category.name : category.name_en || category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : isLoading ? (
        /* ── Loading State ── */
        <div className="w-full h-56 flex flex-col items-center justify-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-gray-100 border-t-primary-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-primary-400 animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase tabular-nums">
            {isRtl ? `جارٍ التحميل${dots}` : `Loading${dots}`}
          </p>
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="w-full py-16 flex flex-col items-center justify-center gap-6 text-center select-none">
          {/* Decorative rings */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-36 h-36 rounded-full bg-primary-50 dark:bg-primary-950/30 animate-pulse-slow" />
            <div className="absolute w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30" />
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <LayoutGrid className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2 max-w-xs">
            <h3 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">
              {t('noCategoriesTitle')}
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
              {t('noCategoriesDesc')}
            </p>
          </div>
 
        </div>
      )}
    </section>
  );
}
