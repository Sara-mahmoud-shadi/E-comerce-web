'use client';
import { apiFetch } from '@/lib/api';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { ShoppingBag, Star, RefreshCcw, ShoppingCart, SlidersHorizontal, ChevronDown, } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShopBreadcrumb } from './shared/ShopBreadcrumb';
import { ProductCard } from './products/ProductCard';
import { ProductSort } from './products/ProductSort';
import AppPagination from './shared/AppPagination';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';



export default function CategoryDetailsContent() {
  const { slug } = useParams();
  const locale = useLocale();
  const IsRtl = locale === 'ar';
  const t = useTranslations('Products');
  const tc = useTranslations('Categories');
  const tH = useTranslations('Home');
  const tp = useTranslations('PriceRange');
  const isRtl = locale === 'ar';
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('');
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}categories/${slug}/products`, window.location.origin);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', itemsPerPage.toString());
      if (sortBy) url.searchParams.append('sort', sortBy);
      if (selectedPriceRanges.length > 0) {
        url.searchParams.append('priceRanges', selectedPriceRanges.join(','));
      }

      const finalUrl = decodeURIComponent(url.toString());
      const res = await apiFetch(finalUrl);
      if (res.ok) {
        const resData = await res.json();


        if (resData.data[0].category) setCategory(resData.data[0].category);

        if (resData.data) {
          setProducts(resData.data);
          setTotalItems(resData.meta?.total || 0);
          setTotalPages(resData.meta?.lastPage || Math.ceil((resData.meta?.total || 0) / itemsPerPage));
        }
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (slug) fetchData();
  }, [slug, currentPage, sortBy]);

  const getImageUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop';
    return url.replace(/^https?:\/\/(localhost|192\.168\.0\.195):\d+/, '');
  };

  if (isLoading || !category) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f1f4f1] to-white dark:bg-[#080808] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Category...</p>
        </div>
      </div>
    );
  }

const handlePriceChange = (range: string) => {
  setSelectedPriceRanges(prev =>
    prev.includes(range)
      ? prev.filter(r => r !== range)
      : [...prev, range]
  );
};

  const handleReset = () => {
    setSelectedPriceRanges([]);
    setSortBy('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f1f4f1] to-white dark:bg-[#080808]">

      {/* Refined Modern Header */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ShopBreadcrumb
                items={[{ label: IsRtl ? category.name_ar : category.name_en }]}
                className="justify-center mb-8"
              />

              <h1 className="text-7xl md:text-8xl italic font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-[0.9] mb-6">
                {IsRtl ? category.name_ar : category.name_en}
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto italic">
                {tH('heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Background Image Overlay */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 grayscale pointer-events-none ltr:rotate-12 rtl:-rotate-12">
          <Image src={getImageUrl(category.image)} alt="" fill className="object-cover" />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 container mx-auto px-4 py-12">
        {/* Filters Sidebar */}
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
              <Accordion type="multiple" defaultValue={['price']} dir={isRtl ? 'rtl' : 'ltr'} className="space-y-4">

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
                    {['lessThan50', '50-200', '200-500', 'greaterThan500'].map(range => (
                      <label key={range} className="flex items-center justify-between group cursor-pointer">
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

            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={fetchData}
                className="w-full bg-primary-500 cursor-pointer hover:bg-primary-600 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                {t('refineResults')}
              </button>
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
              <div className="w-12 h-12 bg-[#f1f4f1] shadow-inner rounded-xl flex items-center justify-center text-primary-500 font-black text-xl">
                {totalItems}
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
          {/* Main Grid Area */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {/* Pagination Placeholder */}

            {totalPages > 1 && (
              <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
