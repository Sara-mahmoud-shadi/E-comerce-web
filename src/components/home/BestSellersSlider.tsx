'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const getImageUrl = (url?: string) => {
  if (!url) return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop';
  return url.replace(/^https?:\/\/(localhost|192\.168\.0\.195):\d+/, '');
};

export default function BestSellersSlider() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      setIsLoading(true);
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
        const res = await apiFetch(`${apiBase}/products?page=1&limit=10`);
        if (res.ok) {
          const resData = await res.json();
          const list = Array.isArray(resData) ? resData : (resData.data || []);
          setBestSellers(list);
          if (list.length > 0) {
            setActiveProductIndex(Math.floor(list.length / 2));
          }
        }
      } catch (err) {
        console.error('Failed to fetch best sellers:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const items = bestSellers;

  const handlePrev = () => {
    setActiveProductIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveProductIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = (idx: number, e: React.MouseEvent) => {
    if (idx !== activeProductIndex) {
      e.preventDefault();
      setActiveProductIndex(idx);
    }
  };

  const getCardStyle = (index: number) => {
    const offset = index - activeProductIndex;
    const absOffset = Math.abs(offset);
    
    const baseStyle = {
      left: '50%',
      top: '50%',
      position: 'absolute' as const,
    };

    if (absOffset > 2) {
      return {
        ...baseStyle,
        opacity: 0,
        transform: `translate3d(${offset > 0 ? '600px' : '-600px'}, 0, 0) translate3d(-50%, -50%, -250px) scale(0.6)`,
        zIndex: 0,
        pointerEvents: 'none' as const,
        transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
      };
    }

    const dirMultiplier = isRtl ? -1 : 1;
    const zTranslation = -absOffset * 110;
    const rotationY = -offset * 18 * dirMultiplier;
    const scale = 1 - absOffset * 0.12;
    const opacity = 1 - absOffset * 0.25;

    return {
      ...baseStyle,
      transform: `translate3d(${offset * 180 * dirMultiplier}px, 0, 0) translate3d(-50%, -50%, ${zTranslation}px) rotateY(${rotationY}deg) scale(${scale})`,
      opacity: opacity,
      zIndex: 30 - absOffset * 10,
      cursor: index === activeProductIndex ? 'default' : 'pointer',
      pointerEvents: 'auto' as const,
      transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
    };
  };

  if (isLoading) {
    return (
      <section className="pt-24 pb-20 relative -top-10 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-[#0d1510] dark:to-[#0f172a] transition-colors duration-500 flex items-center justify-center min-h-[500px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{isRtl ? 'جاري التحميل...' : 'Loading Best Sellers...'}</span>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="pt-24 relative -top-10 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-[#0d1510] dark:to-[#0f172a] transition-colors duration-500">
      {/* Soft Background Accent Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-5 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-6 bg-primary-500/50" />
            <span className="text-primary-500 dark:text-primary-400 font-extrabold tracking-widest text-xs uppercase animate-pulse-slow">
              {t('bestSellingProducts')}
            </span>
            <span className="h-[1px] w-6 bg-primary-500/50" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-primary-500 dark:text-white tracking-tight uppercase">
            {isRtl ? 'المنتجات الأكثر طلباً' : 'Sizzling Best Sellers'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium max-w-xl mx-auto">
            {isRtl ? 'اكتشف التشكيلة الأكثر مبيعاً لدينا والمصممة خصيصاً لتلبي احتياجاتك بأعلى جودة وأفضل الأسعار.' : 'Indulge in our most celebrated culinary and catering pieces, handpicked for exceptional quality and performance.'}
          </p>
        </div>

        {/* 3D Stacked Slider Container */}
        <div className="relative w-full h-[450px] sm:h-[520px] flex items-center justify-center select-none overflow-hidden [perspective:1200px]">
          
          {/* Slider cards list */}
          {items.map((product, idx) => { 
            const isActive = idx === activeProductIndex;

            return (
              <div
                key={product.id}
                style={getCardStyle(idx)}
                onClick={(e) => handleCardClick(idx, e)}
                className={`absolute w-[260px] sm:w-[310px] md:w-[300px] h-[360px] sm:h-[420px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 origin-center bg-white border border-primary-500 ${
                  isActive 
                    ? 'border-4   dark:border-slate-800 shadow-[0_25px_60px_rgba(107,142,107,0.25)] hover:scale-[1.02]' 
                    : 'pointer-events-auto hover:brightness-110 shadow-[0_15px_30px_rgba(0,0,0,0.3)]'
                } group`}
              >
                {/* Card Main Image */}
                <Image
                  src={getImageUrl(product.images?.[0] || product.image)}
                  alt={product.name_en}
                  fill
                  className=" object-cover group-hover:scale-100 transition-transform duration-1000 select-none rounded-3xl"
                  sizes="(max-width: 768px) 260px, 340px"
                  priority={idx === activeProductIndex}
                />

                {/* Black Ambient Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-white/40 to-transparent z-10 rounded-3xl" />
                
                {/* Rating Badge on Top Right */}
                <div className="absolute top-4 ltr:left-4 rtl:right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
                  <div className="flex items-center gap-2 mb-3 flex-wrap justify-start">
                    <span className="bg-primary-500 text-white font-extrabold tracking-widest text-[9px] px-3 py-1.5 rounded-full shadow-sm">
                      {isRtl ? product.category?.name_ar || product.category?.name : product.category?.name_en || product.category?.name}
                    </span>
                    <span className="bg-accent-500 text-white font-black text-[10px] px-3 py-1.5 rounded-full shadow-inner">
                      {product.price} ر.س
                    </span>
                  </div>
                </div>

                {/* Card Bottom Identity Details */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 flex flex-col justify-end text-left rtl:text-right">
                  
                  {/* Title */}
                  <h3 className="text-white text-lg sm:text-xl font-black mb-1.5 line-clamp-1">
                    {isRtl ? product.name_ar : product.name_en}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-[11px] sm:text-xs font-medium leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  {/* Shop Now Action trigger inside card for center active element */}
                  {isActive && (
                    <Link 
                      href={`/products/${product.id}`}
                      className="mt-4 bg-[#f2a93b] hover:bg-[#d9922e] text-white text-center font-black text-[10px] uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 group/btn self-start rtl:self-end"
                    >
                      <span>{t('shopNow')}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 rtl:rotate-180 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {/* Slider Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 md:left-40 z-40 w-12 h-12 rounded-full bg-primary-500 backdrop-blur-md border border-primary-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl group cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform ltr:rotate-180" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 md:right-40 z-40 w-12 h-12 rounded-full bg-primary-500 backdrop-blur-md border border-primary-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl group cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform ltr:rotate-180" />
          </button>

        </div>

        {/* Slider Bullet Dots Indicators */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveProductIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeProductIndex 
                  ? 'w-8 bg-primary-500' 
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
