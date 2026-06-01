'use client';
// Modern Category details view and layout
import { apiFetch } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { CategoryHeader } from './shared/CategoryHeader';
import { ProductCard } from './products/ProductCard';
import { ProductSort } from './products/ProductSort';
import AppPagination from './shared/AppPagination'; 
import SidebarFilters from './products/SidebarFilters';
import FilterDrawer from './products/FilterDrawer';
import { getApiBase } from './dashboard/categories/CategoriesList';



export default function CategoryDetailsContent() {
  const { slug } = useParams();
  const locale = useLocale();
  const IsRtl = locale === 'ar';
  const t = useTranslations('Products'); 
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try { 
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (sortBy) params.append('sort', sortBy);
      if (selectedPriceRanges.length > 0) {
        params.append('priceRanges', selectedPriceRanges.join(','));
      }

      const finalUrl = `${getApiBase()}categories/${slug}/products?${params.toString()}`;
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
      {/* Header Component */}
      <CategoryHeader category={category} productsCount={products.length} />

      <div className="flex flex-col bg-white relative rounded-3xl shadow lg:top-[-100px] lg:flex-row gap-12 container mx-auto px-4 py-8">

        {/*  Sidebar Filters (Inline on desktop) */}
        <aside className="hidden lg:block w-80 shrink-0">
          <SidebarFilters
            selectedPriceRanges={selectedPriceRanges}
            handlePriceChange={handlePriceChange}
            handleReset={handleReset}
            fetchData={fetchData}
          />
        </aside>

        {/* Products Display Area */}
        <div className="flex-grow space-y-10"> 
          {/* Results Header */}
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
                <p className="text-[12px] font-bold text-gray-400 ">{t('selectionSubtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <ProductSort value={sortBy} onValueChange={setSortBy} isRtl={isRtl} />

              {/* Responsive Filter Drawer trigger on mobile/tablet */}
              <FilterDrawer
                isOpen={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                isRtl={isRtl}
                selectedPriceRanges={selectedPriceRanges}
                handlePriceChange={handlePriceChange}
                handleReset={handleReset}
                fetchData={fetchData}
              />
            </div>
          </motion.div>

          <div>
            {products.length === 0 ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
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
