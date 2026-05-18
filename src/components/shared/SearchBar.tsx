'use client';
import { apiFetch } from '@/lib/api';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

const getImageUrl = (url?: string) => {
  if (!url) return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop';
  return url.replace(/^https?:\/\/(localhost|192\.168\.0\.195):\d+/, '');
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Search');
  const tp = useTranslations('Products');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const showResults = isFocused && query.length > 1;

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query fetching
  useEffect(() => {
    if (query.trim().length <= 1) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}products`, window.location.origin);
        url.searchParams.append('search', query.trim());
        url.searchParams.append('page', '1');
        url.searchParams.append('limit', '8');

        const res = await apiFetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          const productList = Array.isArray(data) ? data : (data.data || []);
          setResults(productList);
        }
      } catch (err) {
        console.error('Failed to fetch search results:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsFocused(true);
  };

  return (
    <div className="relative w-full max-w-lg mx-4" ref={containerRef}>
      <div className={cn(
        "relative flex items-center transition-all duration-300 rounded-lg border",
        isFocused 
          ? "bg-white dark:bg-gray-800 border-primary-600 shadow-lg shadow-primary-500/10 ring-4 ring-primary-500/5" 
          : "bg-gray-100 dark:bg-gray-900 border-transparent hover:bg-gray-200 dark:hover:bg-gray-800"
      )}>
        <div className="pl-4 rtl:pl-0 rtl:pr-4">
          <Search className={cn(
            "w-5 h-5 transition-colors duration-300",
            isFocused ? "text-primary-500" : "text-gray-400"
          )} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 1) {
              setIsLoading(true);
            } else {
              setIsLoading(false);
            }
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={t('placeholder')}
          className="w-full py-2.5 px-3 bg-transparent outline-none text-sm font-medium placeholder:text-gray-400 dark:text-gray-100"
        />

        <div className="pr-2 rtl:pr-0 rtl:pl-2 flex items-center gap-2">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </motion.div>
            )}
            
            {query && !isLoading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/5 p-2"
          >
            <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('suggested_products')}
            </div>
            
            <div className="space-y-1">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => {
                    setIsFocused(false);
                    setQuery('');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all group text-left rtl:text-right"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-800">
                    <Image
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      width={1000}
                      height={1000}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="text-sm font-bold truncate dark:text-gray-100">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {isRtl ? product.category?.name_ar : product.category?.name_en}
                    </div>
                  </div>
                  <div className="text-sm font-black text-primary-600 dark:text-primary-400">
                    {tp('price', { price: product.price_discount || product.price })}
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href={`/products?search=${encodeURIComponent(query)}`}
              onClick={() => setIsFocused(false)}
              className="block w-full mt-2 cursor-pointer py-2 text-sm font-bold text-center text-primary-600 hover:text-primary-700 transition-colors border-t border-gray-100 dark:border-gray-800"
            >
              {t('view_all_results')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
