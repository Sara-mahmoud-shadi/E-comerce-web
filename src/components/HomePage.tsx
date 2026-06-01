'use client';
import { apiFetch } from '@/lib/api';
import { useTranslations, useLocale } from 'next-intl'; 
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import FeaturedCategories from './home/FeaturedCategories';
import HeroSection from './home/HeroSection';
import { getApiBase } from './dashboard/categories/CategoriesList';

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
        const res = await apiFetch(`${getApiBase()}categories`);
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
      {/* Hero Section */}
      <HeroSection isRtl={isRtl} t={t} />
      <FeaturedCategories categories={categories} isRtl={isRtl} t={t} getImageUrl={getImageUrl} />
      <BestSellersSlider />
    </div>
  );
}
