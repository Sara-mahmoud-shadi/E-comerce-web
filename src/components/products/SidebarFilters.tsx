'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SlidersHorizontal, RefreshCcw, ShoppingBag, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

interface SidebarFiltersProps {
  selectedPriceRanges: string[];
  handlePriceChange: (range: string) => void;
  categoriesList?: any[];
  selectedCategories?: string[];
  handleCategoryChange?: (categoryId: string) => void;
  handleReset: () => void;
  fetchData: () => void;
  onClose?: () => void;
}

export default function SidebarFilters({
  selectedPriceRanges,
  handlePriceChange,
  categoriesList,
  selectedCategories,
  handleCategoryChange,
  handleReset,
  fetchData,
  onClose
}: SidebarFiltersProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations('Products');
  const tp = useTranslations('PriceRange');

  const handleApply = () => {
    fetchData();
    if (onClose) onClose();
  };

  const handleResetFilters = () => {
    handleReset();
    if (onClose) onClose();
  };

  const defaultValues = ['price'];
  if (categoriesList) defaultValues.push('categories');

  return (
    <div className="bg-white/70  dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] px-4 lg:p-6 lg:border border-gray-100 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.01)] dark:shadow-none space-y-6">
      {/* Main Sidebar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 dark:text-primary-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div className="text-left rtl:text-right">
            <h4 className="text-sm hidden lg:block font-black text-primary-600 dark:text-primary-400 leading-tight uppercase tracking-wider">
              {t('filters')}
            </h4>
            <p className="lg:text-[10px] text-primary-500 font-bold lg:text-gray-400 uppercase tracking-widest">
              {t('refineResults')}
            </p>
          </div>
        </div>

        <motion.button
          whileTap={{ rotate: 180 }}
          onClick={handleResetFilters}
          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-colors cursor-pointer"
        >
          <RefreshCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Accordion Filter Wrapper */}
      <div className="space-y-4 mt-6 overflow-y-auto">
        <Accordion type="multiple" defaultValue={defaultValues} dir={isRtl ? 'rtl' : 'ltr'} className="space-y-4">
          {/* Category Filter (Optional) */}
          {categoriesList && selectedCategories && handleCategoryChange && (
            <AccordionItem value="categories" className="border border-gray-100 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-900/30">
              <AccordionTrigger className="px-5 py-4.5 hover:no-underline bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-100 dark:border-slate-800/80 [&>svg]:hidden">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                    <span className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                      {t('categoryTitle')}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 space-y-4">
                {categoriesList.map((cat) => (
                  <label key={cat.id} className="flex items-center justify-between group cursor-pointer">
                    <span className={cn(
                      "text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors flex-grow",
                      isRtl ? "text-right ml-4" : "text-left mr-4"
                    )}>
                      {isRtl ? (cat.name_ar || cat.name) : (cat.name_en || cat.name)}
                    </span>
                    
                    {/* Premium custom checkbox */}
                    <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(cat.id.toString())}
                        onChange={() => handleCategoryChange(cat.id.toString())}
                        className="peer absolute inset-0 opacity-0 cursor-pointer z-10" 
                      />
                      <div className="absolute inset-0 border-2 border-gray-200 dark:border-slate-700 rounded-lg peer-checked:border-primary-500 dark:peer-checked:border-primary-400 peer-checked:bg-primary-500/10 transition-all duration-300" />
                      <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-[3px] scale-0 peer-checked:scale-100 transition-transform duration-300" />
                    </div>
                  </label>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Price Filter */}
          <AccordionItem value="price" className="border border-gray-100 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-900/30">
            <AccordionTrigger className="px-5 py-4.5 hover:no-underline bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-100 dark:border-slate-800/80 [&>svg]:hidden">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    {t('priceRangeTitle')}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="p-6 space-y-4">
              {['lessThan50', '50-200', '200-500', 'greaterThan500'].map(range => (
                <label key={range} className="flex items-center justify-between group cursor-pointer">
                  <span className={cn(
                    "text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors flex-grow",
                    isRtl ? "text-right ml-4" : "text-left mr-4"
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
          onClick={handleApply}
          className="w-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-2xl transition-all shadow-[0_10px_25px_rgba(107,142,107,0.15)] dark:shadow-none hover:-translate-y-0.5 active:scale-98 cursor-pointer"
        >
          {t('refineResults')}
        </button>
      </div>
    </div>
  );
}
