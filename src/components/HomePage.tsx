'use client';
import { apiFetch } from '@/lib/api';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Heart, Star, Headphones } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const BestSellersSlider = dynamic(() => import('@/components/home/BestSellersSlider'), {
  ssr: false,
  loading: () => (
    <section className="pt-24 pb-20 relative -top-10 overflow-hidden bg-gradient-to-b from-[#f3f7f2] via-[#e8efe7] to-[#ffffff] dark:from-[#111c12] dark:via-[#19241b] dark:to-[#0f172a] transition-colors duration-500 flex items-center justify-center min-h-[500px]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Loading Best Sellers...</span>
      </div>
    </section>
  )
});

export default function HomePage() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [categories, setCategories] = useState<any[]>([]);

  const getImageUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop';
    return url.replace(/^https?:\/\/(localhost|192\.168\.0\.195):\d+/, '');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}categories`, window.location.origin);
        const res = await apiFetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || []);
          setCategories(list);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col py-6">
      {/* Hero Section - True Premium Curved Banner */}
      <section className="relative w-full h-[100vh] lg:h-[80vh] max-h-[850px] bg-gradient-to-b from-[#f3f7f2] via-[#e8efe7] to-[#ffffff] dark:from-[#111c12] dark:via-[#19241b] dark:to-[#0f172a] rounded-b-[40px] md:rounded-b-[80px] lg:rounded-b-[120px] overflow-hidden flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] border-b border-gray-100/10 mb-8 transition-colors duration-500">

        {/* Soft Background Silhouette Vector Outlines */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none mix-blend-overlay">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[url('/leaf-overlay.png')] bg-contain bg-no-repeat rotate-12 filter blur-[4px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[url('/leaf-overlay.png')] bg-contain bg-no-repeat -rotate-45 filter blur-[6px]" />
        </div>

        {/* Faint Abstract Background Circles */}
        <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full bg-radial-gradient from-primary-500/10 to-transparent pointer-events-none blur-3xl animate-pulse-slow" />

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20 h-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8 z-10">

          {/* Left Column: Premium Typography Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left rtl:lg:text-right flex flex-col justify-center items-center lg:items-start relative z-10">

            {/* Suitable Premium Floating Frying Pan Asset (Opacity .5, slowly floating/rotating) */}
            <div className="absolute -top-20 -left-16 rtl:left-auto rtl:-right-16 w-44 h-44 pointer-events-none opacity-50 dark:opacity-30 animate-float z-0 select-none mix-blend-multiply dark:mix-blend-normal filter blur-[0.5px] hover:scale-105 hover:rotate-45 transition-all duration-700">
              <Image
                src="/floating_pan.png"
                alt="Premium Copper Pan Silhouette"
                width={176}
                height={176}
                className="object-contain rotate-12"
              />
            </div>

            {/* Elegant Subtitle Tagline */}
            <div className="flex items-center gap-2 mb-6">
              <span className="h-[1px] w-6 bg-primary-500/50" />
              <span className="text-primary-600 dark:text-primary-400 font-black tracking-widest text-xs uppercase">
                {t('newCollection')}
              </span>
              <span className="h-[1px] w-6 bg-primary-500/50" />
            </div>

            {/* Title with dual editorial font-pairing */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-6">
              {t('heroTitle').split(' ').map((word, idx, arr) => {
                // Highlight the final words in beautiful serif italic
                if (idx >= arr.length - 2) {
                  return (
                    <span key={idx} className="ltr:font-serif italic   text-primary-600 dark:text-primary-400">
                      {" "}{word}
                    </span>
                  );
                }
                return (idx > 0 ? ' ' : '') + word;
              })}
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg leading-relaxed font-medium">
              {t('heroSubtitle')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
              <Link
                href="/products"
                className="bg-primary-500 hover:bg-primary-600 text-white px-10 py-4.5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_30px_rgba(107,142,107,0.3)] hover:-translate-y-0.5 active:scale-98 group"
              >
                {t('shopNow')}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 rtl:rotate-180" />
              </Link>

            </div>

          </div>

          {/* Right Column: Premium Interactive Showcase */}
          <div className="flex-1 relative w-full flex items-center justify-center min-h-[400px] lg:min-h-[600px]">

            {/* Spinning background halo */}
            <div className="absolute w-[300px] h-[300px] md:w-[460px] md:h-[460px] rounded-full bg-gradient-to-tr from-white/80 to-white/10 dark:from-slate-800/40 dark:to-transparent border border-white/40 dark:border-slate-700/20 shadow-2xl flex items-center justify-center animate-spin-slow pointer-events-none z-0" />

            {/* White porcelain platter ground podium */}
            <div className="absolute w-[260px] h-[260px] md:w-[400px] md:h-[400px] rounded-full bg-white dark:bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100/50 flex items-center justify-center pointer-events-none z-0" />

            {/* Primary Product Showcase image with floating animations */}
            <div className="relative z-10 w-[280px] rounded-2xl h-[280px] md:w-[450px] md:h-[450px] lg:w-[480px] lg:h-[480px] transition-all duration-700 hover:scale-102 flex items-center justify-center animate-float">
              <Image
                src="/kitchen_hero_products.png"
                alt="Premium Kitchenware Stand Mixer Pots Pans"
                width={500}
                height={500}
                className="object-contain rounded-3xl drop-shadow-[0_20px_35px_rgba(0,0,0,0.05)] mix-blend-multiply dark:mix-blend-normal"
                priority
              />
            </div>

            {/* Large Premium Floating Discount Badge (User requested: Large, Modern, Same Content as Image) */}
            <div className="absolute top-1/3 -left-8 md:-left-4 lg:left-2 z-25 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-[2.25rem] shadow-[0_25px_50px_rgba(107,142,107,0.12)] border border-white/60 dark:border-slate-800/40 hover:scale-105 active:scale-98 transition-all duration-300 pointer-events-auto flex flex-col items-center justify-center text-center w-[165px] md:w-[185px] animate-float-delayed select-none group">
              
              {/* Dynamic ambient hover ring */}
              <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-tr from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Tagline Badge */}
              <span className="text-[10px] text-primary-600 dark:text-primary-400 font-extrabold uppercase tracking-widest leading-none mb-4 whitespace-nowrap bg-primary-500/10 dark:bg-primary-500/20 px-3 py-1.5 rounded-full">
                {isRtl ? "خصومات لفترة محدودة" : "Limited Offers"}
              </span>

              {/* Exact Image Alignment: Stacked Text next to Huge 50% */}
              <div className="flex items-center gap-2.5 justify-center w-full">
                 {/* Stacked Text ("من 20% / إلى") */}
                <div className="flex flex-col leading-tight justify-center shrink-0  ">
                  <span className="text-[12px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider leading-none">
                    {isRtl ? "من" : "from"} <span className="font-extrabold text-gray-800 dark:text-white">20%</span>
                  </span>
                  <span className="text-[10px] text-primary-600 dark:text-primary-400 font-extrabold uppercase mt-1 leading-none">
                    {isRtl ? "إلى" : "to"}
                  </span>
                </div>
                {/* 50% Number (Large & Bold with soft theme glow) */}
                <span className="text-5xl md:text-6xl font-black text-primary-500 dark:text-white tracking-tighter leading-none drop-shadow-[0_4px_12px_rgba(107,142,107,0.15)]">
                  50%
                </span>

               
              </div>

            </div>

            {/* Floating Badge: Shop Now (Matches Juice organic banner's shop now pointer) */}
            <Link
              href="/products"
              className="absolute -top-2 -right-2 md:top-12 md:right-8 z-20 bg-accent-500 hover:bg-accent-600 text-white font-black text-xs md:text-sm tracking-wider uppercase px-5 py-3 rounded-full flex items-center gap-1.5 shadow-[0_10px_25px_rgba(107,142,107,0.3)] animate-float-delayed hover:scale-105 active:scale-95 transition-transform"
            >
              <span>{t('shopNow')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>

            {/* Floating Badge: Quality Guarantee */}
            <div className="absolute -bottom-4 -left-2 md:bottom-8 md:left-6 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/50 dark:border-slate-800/40 p-4 rounded-2xl flex items-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.06)] animate-bounce-slow">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center text-primary-500 shrink-0">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <div className="whitespace-nowrap text-left rtl:text-right">
                <h4 className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-wider">{t('featuredProducts')}</h4>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-0.5">{t('freeShippingSub')}</p>
              </div>
            </div>

            {/* Floating Cinematic Herb Leaf overlays for organic kitchen feel */}
            <div className="absolute -bottom-8 hidden 2xl:block -left-25 rtl:right-8 z-25 w-24 h-24 pointer-events-none opacity-85 animate-float-delayed blur-[0.8px]">
              <Image src="/leaf-overlay.png" alt="Leaf" width={96} height={96} className="object-contain rotate-45" />
            </div>

            <div className="absolute top-8 -left-8 z-0 w-16 h-16 pointer-events-none opacity-40 animate-float blur-[1.8px]">
              <Image src="/leaf-overlay.png" alt="Leaf" width={64} height={64} className="object-contain -rotate-[60deg]" />
            </div>

          </div>
        </div>
      </section>

      {/* Main Grid Content - Contained */}
      <section className="container bg-white lg:shadow mx-auto py-20  relative -top-20 lg:-top-30 rounded-3xl px-4 sm:px-6 lg:px-8">
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
                    <span className="text-[10px] text-accent-400 font-extrabold uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
                      {isRtl ? "مجموعة مميزة" : "Featured Collection"}
                    </span>
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
                  <div className="absolute z-10 top-6 left-6 right-6 rtl:left-auto rtl:right-6 flex flex-col items-start gap-1 sm:gap-2">
                    <span className="text-[9px] text-primary-400 font-extrabold uppercase tracking-widest bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 shadow-sm">
                      {isRtl ? "الأكثر مبيعاً" : "Top Choice"}
                    </span>
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
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-[11px] sm:text-xs font-black text-white uppercase tracking-widest transition-transform group-hover:scale-105 duration-500 shadow-md">
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
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-[11px] sm:text-xs font-black text-white uppercase tracking-widest transition-transform group-hover:scale-105 duration-500 shadow-md">
                      {isRtl ? categories[3].name_ar || categories[3].name : categories[3].name_en || categories[3].name}
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
                      <span className="px-3 py-1.5 sm:px-4 sm:py-2 w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-[11px] sm:text-xs font-black text-white uppercase tracking-widest transition-transform group-hover:scale-105 duration-500 shadow-md">
                        {isRtl ? category.name_ar || category.name : category.name_en || category.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-32 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
            </div>
          </div>
        )}
      </section>

      {/* Premium Best Sellers 3D Stacked Coverflow Slider Section */}
      <BestSellersSlider />
    </div>
  );
}
