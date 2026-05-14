'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductSort } from '@/components/products/ProductSort';
import { ShopBreadcrumb } from '@/components/shared/ShopBreadcrumb';
import AppPagination from '../shared/AppPagination'; 
import { cn } from '@/lib/utils';
import { ChevronDown, RefreshCcw, ShoppingCart, SlidersHorizontal } from 'lucide-react';

const PRODUCTS = [
  {
    id: 1,
    name: 'Artisan Plate',
    price: 45.00,
    discountPrice: 39.00,
    category: 'serving',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    rating: 4.8,
    reviews: 88,
    badge: 'luxury',
    asset: 'Ceramic Pro',
    assetImg: 'https://images.unsplash.com/photo-1594913785162-e6785b42fbb1?w=200&q=80'
  },
  {
    id: 2,
    name: 'Espresso Master',
    price: 899.00,
    category: 'electrical',
    image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&q=80',
    rating: 4.9,
    reviews: 210,
    badge: 'premium',
    asset: 'Steam X-200',
    assetImg: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&q=80'
  },
  {
    id: 3,
    name: 'Copper Set',
    price: 350.00,
    discountPrice: 299.00,
    category: 'cooking',
    image: 'https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=800&q=80',
    rating: 5.0,
    reviews: 145,
    badge: 'premium',
    asset: 'HeatFlow v3',
    assetImg: 'https://images.unsplash.com/photo-1584990344321-27662ef2049e?w=200&q=80'
  },
  {
    id: 4,
    name: 'Chef Knife',
    price: 120.00,
    category: 'cooking',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80',
    rating: 4.7,
    reviews: 92,
    badge: 'luxury',
    asset: 'Edge Elite',
    assetImg: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80'
  },
];

export default function ProductsContent() {
  const t = useTranslations('Products');
  const tca = useTranslations('Categories');
  const tn = useTranslations('Home');
  const tpr = useTranslations('PriceRange');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('');

  const handlePriceChange = (range: string) => {
    setSelectedPriceRanges(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleReset = () => {
    setSelectedPriceRanges([]);
    setSelectedCategories([]);
    setSortBy('');
  };

  const tc = useTranslations('Categories');
  const tp = useTranslations('PriceRange');

  const breadcrumbItems = [
    { label: t('allProducts') }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f1f4f1] to-white dark:bg-[#080808]">
      {/* Editorial Header Section */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ShopBreadcrumb items={breadcrumbItems} className="justify-center mb-2" />

              <h1 className="text-7xl md:text-8xl italic font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-[0.9] mb-8">
                {t('allProducts')}
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto italic">
                {tn('heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Background Image Overlay */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 grayscale pointer-events-none ltr:rotate-12 rtl:-rotate-12">
          <Image
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80"
            alt=""
            fill
            className="object-cover"
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 container mx-auto px-4 py-12">
        {/* Filters Sidebar - Modern Card Style */}
        <aside className="w-full lg:w-80 shrink-0 space-y-4">
          <div className=' bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            {/* Main Sidebar Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className=" flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f1f4f1] flex items-center justify-center">
                  <SlidersHorizontal className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h4 className="text-md font-bold text-primary-500 leading-tight">{t('filters')}</h4>
                  <p className="text-[11px] font-medium text-gray-400">{t('refineResults')}</p>
                </div>
              </div>

              <motion.button
                whileTap={{ rotate: 180 }}
                onClick={handleReset}
                className="text-gray-300 cursor-pointer hover:text-primary-500 transition-colors"
              >
                <RefreshCcw className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <div className="space-y-4 mt-6">
              <Accordion type="multiple" defaultValue={['categories', 'price']} dir={isRtl ? 'rtl' : 'ltr'} className="space-y-4">
                {/* Category Filter */}
                <AccordionItem value="categories" className="bg-white rounded-xl border shadow-sm overflow-hidden border-gray-100">
                  <AccordionTrigger className="p-5 hover:no-underline bg-[#f1f4f1] border-b border-gray-50 [&>svg]:hidden">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-bold text-[#1a3a5f]">{t('categoryTitle')}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 space-y-5">
                    {['luxurySets', 'premiumTools', 'eliteServing', 'economySeries'].map((cat, idx) => (
                      <label key={cat} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-xs font-medium text-gray-400">({(142 - idx * 40)})</span>
                        <span className={cn(
                          "text-sm font-bold text-gray-600 group-hover:text-primary-500 transition-colors mx-4 flex-grow",
                          isRtl ? "text-right" : "text-left"
                        )}>
                          {tc(cat)}
                        </span>
                        <div className="relative w-6 h-6 flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={selectedCategories.includes(cat)}
                            onChange={() => handleCategoryChange(cat)}
                            className="peer absolute inset-0 opacity-0 cursor-pointer z-10" 
                          />
                          <div className="absolute inset-0 border-2 border-gray-100 dark:border-white/5 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-500/5 transition-all duration-300" />
                          <div className="w-2.5 h-2.5 bg-primary-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-300" />
                        </div>
                      </label>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {/* Price Filter */}
                <AccordionItem value="price" className="bg-white rounded-xl border shadow-sm overflow-hidden border-gray-100">
                  <AccordionTrigger className="p-5 hover:no-underline border-b bg-[#f1f4f1] border-gray-50 [&>svg]:hidden">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-bold text-[#1a3a5f]">{t('priceRangeTitle')}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 space-y-5">
                    {['under50', '50-200', '200-500', 'over500'].map(range => (
                      <label key={range} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-xs font-medium text-gray-400">($)</span>
                        <span className={cn(
                          "text-sm font-bold text-gray-600 group-hover:text-primary-500 transition-colors mx-4 flex-grow",
                          isRtl ? "text-right" : "text-left"
                        )}>
                          {tp(range)}
                        </span>
                        <div className="relative w-6 h-6 flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedPriceRanges.includes(range)}
                            onChange={() => handlePriceChange(range)}
                            className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="absolute inset-0 border-2 border-gray-200 rounded-lg peer-checked:border-primary-500 transition-all" />
                          <div className="w-2.5 h-2.5 bg-primary-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                      </label>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>
        </aside>

        <div className="flex-grow space-y-8">
          {/* Modern Utility Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#f1f4f1] shadow-inner  rounded-xl flex items-center justify-center text-primary-500 font-black text-xl shadow-inner">
                {PRODUCTS.length}
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tighter text-primary-500 dark:text-white leading-none mb-1">{t('masterSelection')}</h2>
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.3em]">{t('selectionSubtitle')}</p>
              </div>
           
            </div>

            <div className="flex items-center gap-4">
              <ProductSort value={sortBy} onValueChange={setSortBy} isRtl={isRtl} />
            </div>
          </motion.div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {/* Pagination */}
          <AppPagination currentPage={1} totalPages={10} totalItems={PRODUCTS.length} onPageChange={() => { }} />
        </div>
      </div>
    </div>
  );
}
