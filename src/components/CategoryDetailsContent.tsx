'use client';
// Modern Category details view and layout
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
        console.log(resData);

        if (resData?.data[0]?.category) setCategory(resData?.data[0]?.category);

        if (resData?.data) {
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



const handlePriceChange = (range: string) => {
  setSelectedPriceRanges(prev =>
    prev.includes(range)
      ? prev.filter(r => r !== range)
      : [...prev, range]
  );
};

  const handleReset = () => {
    fetchData()
    setSelectedPriceRanges([]);
    setSortBy('');
  };

  return (
    <div className="min-h-screen ">

      {/* Modern Premium Category Header */}
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
                  items={[{ label: IsRtl ? category?.name_ar : category?.name_en }]}
                  className="justify-center lg:justify-start"
                />

                {/* Subtitle Badge Row */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <span className="bg-primary-500 text-white font-extrabold tracking-widest text-[10px] px-3.5 py-1.5 rounded-full shadow-sm uppercase">
                    {IsRtl ? 'تصنيف مميز' : 'Featured Category'}
                  </span>
                  <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-primary-600 dark:text-primary-400 border border-primary-500/10 font-bold text-[10px] px-3.5 py-1.5 rounded-full shadow-sm animate-pulse">
                    {products.length} {IsRtl ? 'منتج متاح' : 'Products Available'}
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

      <div className="flex flex-col bg-white relative rounded-3xl shadow lg:top-[-100px] lg:flex-row gap-12 container mx-auto px-4 py-8">
        
        {/* Modern Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-100 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.01)] dark:shadow-none space-y-6">
            
            {/* Main Sidebar Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 dark:text-primary-400">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-primary-600 dark:text-primary-400 leading-tight uppercase tracking-wider">{t('filters')}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('refineResults')}</p>
                </div>
              </div>

              <motion.button
                whileTap={{ rotate: 180 }}
                onClick={handleReset}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Accordion Filter Wrapper */}
            <div className="space-y-4 mt-6">
              <Accordion type="multiple" defaultValue={['price']} dir={isRtl ? 'rtl' : 'ltr'} className="space-y-4">
                
                {/* Price Filter */}
                <AccordionItem value="price" className="border border-gray-100 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-900/30">
                  <AccordionTrigger className="px-5 py-4.5 hover:no-underline bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-100 dark:border-slate-800/80 [&>svg]:hidden">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                        <span className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider">{t('priceRangeTitle')}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="p-6 space-y-4">
                    {['lessThan50', '50-200', '200-500', 'greaterThan500'].map(range => (
                      <label key={range} className="flex items-center justify-between group cursor-pointer">
                        <span className={cn(
                          "text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors mx-4 flex-grow",
                          isRtl ? "text-right" : "text-left"
                        )}>
                          {tp(range)}
                        </span>
                        
                        {/* Premium custom checkbox */}
                        <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedPriceRanges.includes(range)}
                            onChange={() => handlePriceChange(range)}
                            className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="absolute inset-0 border-2 border-gray-200 dark:border-slate-700 rounded-lg peer-checked:border-primary-500 dark:peer-checked:border-primary-400 peer-checked:bg-primary-500/10 transition-all duration-300" />
                          <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-[3px] scale-0 peer-checked:scale-100 transition-transform duration-300" />
                        </div>
                      </label>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Sidebar CTA Action */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800/80">
              <button
                onClick={fetchData}
                className="w-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-2xl transition-all shadow-[0_10px_25px_rgba(107,142,107,0.15)] dark:shadow-none hover:-translate-y-0.5 active:scale-98 cursor-pointer"
              >
                {t('refineResults')}
              </button>
            </div>

          </div>
        </aside>

        {/* Products Display Area */}
        <div className="flex-grow space-y-10">
          
          {/* Modern Results Header Utility Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-5 sm:p-6 border border-gray-100 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.01)] dark:shadow-none flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-500/10 shadow-inner rounded-2xl flex items-center justify-center text-primary-500 dark:text-primary-400 font-black text-2xl">
                {totalItems}
              </div>
              <div className="text-center sm:text-left rtl:text-right">
                <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white leading-tight mb-1">{t('masterSelection')}</h2>
                <p className="text-[12px] font-bold text-gray-400 ">{t('selectionSubtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <ProductSort value={sortBy} onValueChange={setSortBy} isRtl={isRtl} />
            </div>
          </motion.div>

          {/* Dynamic Grid Layout */}
          <div>
            {products.length === 0 ? (
              /* Beautiful Modern Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800"
              >
                <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center text-primary-500 mb-6 animate-pulse">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                  {IsRtl ? 'لم نجد أي منتجات' : 'No Products Found'}
                </h3>
                <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 max-w-sm mb-8 leading-relaxed">
                  {IsRtl 
                    ? 'جرب تعديل نطاق الأسعار أو إعادة تعيين الفلاتر لعرض التشكيلة الكاملة.' 
                    : 'Try resetting the active price filters or sorting parameters to discover our full product catalogue.'}
                </p> 
              </motion.div>
            ) : (
              /* High-end Responsive 3-Column Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}

            {/* Pagination Segment */}
            {totalPages > 1 && (
              <div className="pt-6">
                <AppPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
