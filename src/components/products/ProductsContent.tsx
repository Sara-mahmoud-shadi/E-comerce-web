'use client';
import { apiFetch } from '@/lib/api';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductSort } from '@/components/products/ProductSort';
import { ShopBreadcrumb } from '@/components/shared/ShopBreadcrumb';
import AppPagination from '../shared/AppPagination';  
import { ChevronDown, RefreshCcw, ShoppingBag, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import SidebarFilters from './SidebarFilters';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';



export default function ProductsContent() {
  const t = useTranslations('Products');  
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('');
  
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
      const res = await apiFetch(`${apiBase}/categories`);
      if (res.ok) {
        const resData = await res.json();
        if (resData.data) {
          setCategoriesList(resData.data);
        } else if (Array.isArray(resData)) {
          setCategoriesList(resData);
        }
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const router = useRouter();

  const fetchData = async (isReset = false) => {
    setIsLoading(true);
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
      
      let finalUrl = '';
      if (search && !isReset) {
        let queryStr = `?page=${isReset ? 1 : currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}`;
        if (sortBy) queryStr += `&sort=${sortBy}`;
        finalUrl = `${apiBase}/products${queryStr}`;
      } else {
        let queryStr = `?page=${isReset ? 1 : currentPage}&limit=${itemsPerPage}`;
        if (!isReset && sortBy) queryStr += `&sort=${sortBy}`;
        if (!isReset && selectedPriceRanges.length > 0) {
          queryStr += `&priceRanges=${selectedPriceRanges.join(',')}`;
        }
        if (!isReset && selectedCategories.length > 0) {
          queryStr += `&categories=${selectedCategories.join(',')}`;
        }
        finalUrl = `${apiBase}/products/filter${queryStr}`;
      }
      
      const res = await apiFetch(finalUrl);
      if (res.ok) {
        const resData = await res.json();
        if (resData.data) {
          setProducts(resData.data);
          setTotalItems(resData.meta?.total || 0);
          setTotalPages(resData.meta?.last_page || Math.ceil((resData.meta?.total || 0) / itemsPerPage));
        }
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, sortBy, search]);

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
    setCurrentPage(1);
    if (search) {
      router.push('/products');
    } else {
      fetchData(true);
    }
  };
 
  const tp = useTranslations('PriceRange');

  const breadcrumbItems = [
    { label: t('allProducts'), href: '/products' },
    ...(search ? [{ label: `"${search}"` }] : [])
  ];
 
  return (
    <div className="min-h-screen">
      
      {/* Modern Premium All Products Header */}
      <header className="relative w-full min-h-[500px] bg-gradient-to-b from-[#f3f7f2] via-[#e8efe7] to-white dark:from-[#111c12] dark:via-[#19241b] dark:to-[#080808] overflow-hidden flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] border-b border-gray-100/10 transition-colors duration-500 py-16 md:py-32 animate-fade-in">
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
                  items={breadcrumbItems}
                  className="justify-center lg:justify-start"
                />

                {/* Subtitle Badge Row */}
                <div className="flex flex-wrap items-center justify-start gap-3">
                  <span className="bg-primary-500 text-white font-extrabold tracking-widest text-[10px] px-3.5 py-1.5 rounded-full shadow-sm uppercase">
                    {t('allProducts')}
                  </span>
                  <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-primary-600 dark:text-primary-400 border border-primary-500/10 font-bold text-[10px] px-3.5 py-1.5 rounded-full shadow-sm animate-pulse">
                    {totalItems} {isRtl ? 'منتج متاح' : 'Products Available'}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl text-start md:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight uppercase">
                  {search ? `"${search}"` : t('allProducts')}
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-600 text-start dark:text-gray-300 font-medium leading-relaxed max-w-lg">
                  {isRtl 
                    ? 'اكتشف تشكيلتنا الحصرية والمتكاملة من أفضل المنتجات المصممة خصيصاً لتمنحك الجودة والأناقة التي تستحقها.' 
                    : 'Explore our complete and exclusive catalog of premium products, meticulously chosen for exceptional quality and performance.'}
                </p>
              </motion.div>
            </div>

            {/* Right Content (Modern 3D Interactive Framed Image Collage) */}
            <div className="flex-1 w-full max-w-md lg:max-w-none flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
                animate={{ opacity: 1, scale: 1, rotate: isRtl ? -3 : 3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] group select-none cursor-pointer"
              >
                {/* Glowing Background Accent */}
                <div className="absolute inset-0 bg-primary-500/20 rounded-[2.5rem] blur-xl group-hover:scale-105 transition-transform duration-500 animate-pulse" />
                
                {/* Elegant White Outer Container with Glassmorphism */}
                <div className="absolute inset-0 bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden group-hover:rotate-0 transition-transform duration-700">
                  <Image
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                    alt={t('allProducts')}
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

      {/* Main Content Layout Card with Negative Margin */}
      <div className="flex flex-col bg-white dark:bg-[#0d1510] relative rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.03)] dark:shadow-none lg:top-[-100px] lg:flex-row gap-12 container mx-auto px-4 py-12">
        
        {/* Modern Sidebar Filters (Inline on desktop) */}
        <aside className="hidden lg:block w-80 shrink-0">
          <SidebarFilters
            selectedPriceRanges={selectedPriceRanges}
            handlePriceChange={handlePriceChange}
            categoriesList={categoriesList}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            handleReset={handleReset}
            fetchData={() => fetchData(false)}
          />
        </aside>

        {/* Products Display Area */}
        <div className="flex-grow space-y-10">
          
          {/* Modern Results Header Utility Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-5 sm:p-6 border border-gray-100 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.01)] dark:shadow-none flex flex-col sm:flex-row lg:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-500/10 shadow-inner rounded-2xl flex items-center justify-center text-primary-500 dark:text-primary-400 font-black text-2xl">
                {totalItems}
              </div>
              <div className="text-center sm:text-left rtl:text-right">
                <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white leading-tight mb-1">{t('masterSelection')}</h2>
                <p className="text-[10px] font-bold text-gray-400 ">{t('selectionSubtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <ProductSort value={sortBy} onValueChange={setSortBy} isRtl={isRtl} />
              
              {/* Responsive Filter Drawer trigger on mobile/tablet */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-3 bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center transition-all cursor-pointer">
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side={isRtl ? 'right' : 'left'}
                  className="w-[300px] sm:w-[350px] p-0 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 flex flex-col h-full"
                >
                         <SheetHeader className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between space-y-0">
                    <SheetTitle className="flex items-center gap-2 text-2xl font-black text-primary-500 select-none">
                      {t('filters')}
                    </SheetTitle>
                    <SheetClose asChild>
                      <button className="p-2 rounded-md bg-primary-500/10 text-primary-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </SheetClose>
                  </SheetHeader>
                    <div className="space-y-6">
                      <SidebarFilters
                        selectedPriceRanges={selectedPriceRanges}
                        handlePriceChange={handlePriceChange}
                        categoriesList={categoriesList}
                        selectedCategories={selectedCategories}
                        handleCategoryChange={handleCategoryChange}
                        handleReset={handleReset}
                        fetchData={() => fetchData(false)}
                        onClose={() => setIsFilterOpen(false)}
                      />
                    </div> 
                </SheetContent>
              </Sheet>
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
                  {isRtl ? 'لم نجد أي منتجات' : 'No Products Found'}
                </h3>
                 
                
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
