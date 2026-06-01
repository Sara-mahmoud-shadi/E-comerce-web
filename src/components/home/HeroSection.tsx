'use client';
import { Link } from '@/i18n/routing';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface HeroSectionProps {
  isRtl: boolean;
  t: (key: string) => string;
}

export default function HeroSection({ isRtl, t }: HeroSectionProps) {
  return (
    <section className="relative w-full h-[100vh] lg:h-[80vh] max-h-[850px] bg-gradient-to-b from-[#f3f7f2] via-[#e8efe7] to-[#ffffff] dark:from-[#111c12] dark:via-[#19241b] dark:to-[#0f172a] rounded-b-[40px] md:rounded-b-[80px] lg:rounded-b-[120px] overflow-hidden flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] border-b border-gray-100/10 mb-8 transition-colors duration-500">

      {/* Soft Background Silhouette Vector Outlines */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none mix-blend-overlay">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[url('/leaf-overlay.webp')] bg-contain bg-no-repeat rotate-12 filter blur-[4px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[url('/leaf-overlay.webp')] bg-contain bg-no-repeat -rotate-45 filter blur-[6px]" />
      </div>

      {/* Faint Abstract Background Circles */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full bg-radial-gradient from-primary-500/10 to-transparent pointer-events-none blur-3xl animate-pulse-slow" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20 h-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8 z-10">

        {/* Left Column: Premium Typography Content */}
        <div className="flex-1 max-w-2xl text-center lg:text-left rtl:lg:text-right flex flex-col justify-center items-center lg:items-start relative z-10">

          {/* Floating Frying Pan Asset */}
          <div className="absolute -top-20 -left-16 rtl:left-auto rtl:-right-16 w-44 h-44 pointer-events-none opacity-50 dark:opacity-30 animate-float z-0 select-none mix-blend-multiply dark:mix-blend-normal filter blur-[0.5px] hover:scale-105 hover:rotate-45 transition-all duration-700">
            <Image
              src="/floating_pan.webp"
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
              if (idx >= arr.length - 2) {
                return (
                  <span key={idx} className="ltr:font-serif italic text-primary-600 dark:text-primary-400">
                    {' '}{word}
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

          {/* Primary Product Showcase image */}
          <div className="relative z-10 w-[280px] rounded-2xl h-[280px] md:w-[450px] md:h-[450px] lg:w-[480px] lg:h-[480px] transition-all duration-700 hover:scale-102 flex items-center justify-center animate-float">
            <Image
              src="/kitchen_hero_products.webp"
              alt="Premium Kitchenware Stand Mixer Pots Pans"
              width={500}
              height={500}
              className="object-contain rounded-3xl drop-shadow-[0_20px_35px_rgba(0,0,0,0.05)] mix-blend-multiply dark:mix-blend-normal"
              priority
            />
          </div>

          {/* Discount Badge */}
          <div className="absolute top-1/3 -left-8 md:-left-4 lg:left-2 z-25 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-[2.25rem] shadow-[0_25px_50px_rgba(107,142,107,0.12)] border border-white/60 dark:border-slate-800/40 hover:scale-105 active:scale-98 transition-all duration-300 pointer-events-auto flex flex-col items-center justify-center text-center w-[165px] md:w-[185px] animate-float-delayed select-none group">
            <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-tr from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <span className="text-[10px] text-primary-600 dark:text-primary-400 font-extrabold uppercase tracking-widest leading-none mb-4 whitespace-nowrap bg-primary-500/10 dark:bg-primary-500/20 px-3 py-1.5 rounded-full">
              {isRtl ? 'خصومات لفترة محدودة' : 'Limited Offers'}
            </span>
            <div className="flex items-center gap-2.5 justify-center w-full">
              <div className="flex flex-col leading-tight justify-center shrink-0">
                <span className="text-[12px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider leading-none">
                  {isRtl ? 'من' : 'from'} <span className="font-extrabold text-gray-800 dark:text-white">20%</span>
                </span>
                <span className="text-[10px] text-primary-600 dark:text-primary-400 font-extrabold uppercase mt-1 leading-none">
                  {isRtl ? 'إلى' : 'to'}
                </span>
              </div>
              <span className="text-5xl md:text-6xl font-black text-primary-500 dark:text-white tracking-tighter leading-none drop-shadow-[0_4px_12px_rgba(107,142,107,0.15)]">
                50%
              </span>
            </div>
          </div>

          {/* Shop Now floating pill */}
          <Link
            href="/products"
            className="absolute -top-2 -right-2 md:top-12 md:right-8 z-20 bg-accent-500 hover:bg-accent-600 text-white font-black text-xs md:text-sm tracking-wider uppercase px-5 py-3 rounded-full flex items-center gap-1.5 shadow-[0_10px_25px_rgba(107,142,107,0.3)] animate-float-delayed hover:scale-105 active:scale-95 transition-transform"
          >
            <span>{t('shopNow')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>

          {/* Floating trust badge */}
          <div className="absolute -bottom-4 -left-2 md:bottom-8 md:left-6 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/50 dark:border-slate-800/40 p-4 rounded-2xl flex items-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.06)] animate-bounce-slow">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center text-primary-500 shrink-0">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div className="whitespace-nowrap text-left rtl:text-right">
              <h4 className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-wider">{t('featuredProducts')}</h4>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-0.5">{t('freeShippingSub')}</p>
            </div>
          </div>

          {/* Decorative leaves */}
          <div className="absolute -bottom-8 hidden 2xl:block -left-25 rtl:right-8 z-25 w-24 h-24 pointer-events-none opacity-85 animate-float-delayed blur-[0.8px]">
            <Image src="/leaf-overlay.webp" alt="Leaf" width={96} height={96} className="object-contain rotate-45" />
          </div>
          <div className="absolute top-8 -left-8 z-0 w-16 h-16 pointer-events-none opacity-40 animate-float blur-[1.8px]">
            <Image src="/leaf-overlay.webp" alt="Leaf" width={64} height={64} className="object-contain -rotate-[60deg]" />
          </div>

        </div>
      </div>
    </section>
  );
}
