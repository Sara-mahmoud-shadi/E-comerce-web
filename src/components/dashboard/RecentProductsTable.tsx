'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Package, Image as ImageIcon, PackageX } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import LoaderIcon from '../shared/LoaderIcon';
import { getApiBase } from './categories/CategoriesList';
import LoadingState from '../shared/LoadingState';

export default function RecentProductsTable() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setIsLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        // Limit to 5 recent products for dashboard overview
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '5');
        const res = await apiFetch(`${getApiBase()}products?${params.toString()} `, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });

        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || []);
          setProducts(list);
        }
      } catch (error) {
        console.error('Failed to fetch recent products', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  const getStockBadge = (stockPercent: number) => {
    if (stockPercent === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10">
          {isRtl ? 'نفذت الكمية' : 'Out of Stock'}
        </span>
      );
    }
    if (stockPercent <= 10) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10">
          {isRtl ? 'كمية منخفضة' : 'Low Stock'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
        {isRtl ? 'متوفر' : 'In Stock'}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white col-span-1 xl:col-span-3 dark:bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[1rem] border border-gray-100 dark:border-slate-800/80 shadow space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">
              {isRtl ? 'أحدث المنتجات' : 'Recent Products'}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest">
              {isRtl ? 'إدارة كتالوج المنتجات والمخزون' : 'Product catalog and stock manager'}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr className="border-b bg-gray-50 border-gray-100 dark:border-slate-800/80 text-[12px] font-black text-primary-500 dark:text-gray-500 tracking-wider">
              <th className="p-3 text-start whitespace-nowrap w-auto">{isRtl ? 'المنتج' : 'Product'}</th>
              <th className="p-3 text-start whitespace-nowrap w-auto">{isRtl ? 'القسم' : 'Category'}</th>
              <th className="p-3 text-start whitespace-nowrap w-auto">{isRtl ? 'السعر' : 'Price'}</th>
              <th className="p-3 text-start whitespace-nowrap w-auto">{isRtl ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-800/40 text-sm">
            {isLoading ? (
              <tr className='w-full'>
                <td colSpan={5}  className="py-10 text-center  w-full">
                  <div className="flex justify-center h-32 items-center w-full">
                    <LoadingState />
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center gap-3"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                      className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-2"
                    >
                      <PackageX className="w-8 h-8" strokeWidth={1.5} />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">
                        {isRtl ? 'لا توجد منتجات حالياً' : 'No products found'}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                        {isRtl ? 'لم يتم العثور على أي منتجات مطابقة' : 'No matching products were found'}
                      </p>
                    </motion.div>
                  </motion.div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                // Safely extract numeric stock from instock status or product fields
                const rawStock = typeof product.stock !== 'undefined' ? Number(product.stock) : (product.instock ? 100 : 0);
                const stockPercent = Math.min(100, Math.max(0, rawStock));

                const imageUrl = product.images?.[0] || product.image;
                const productName = locale === 'ar' ? (product.name_ar || product.nameAr || product.name) : (product.name || product.nameEn);
                const skuCode = product.sku || `PROD-${product.id?.toString().padStart(4, '0')}`;
                const categoryName = locale === 'ar'
                  ? (product.category?.name_ar)
                  : (product.category?.name_en);

                return (
                  <tr key={product.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 text-start whitespace-nowrap w-auto">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-100 dark:border-slate-800/50 shadow-sm flex items-center justify-center">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={productName}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-extrabold text-gray-900 dark:text-white block truncate max-w-[150px] sm:max-w-[200px]">
                            {productName}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider block mt-0.5">
                            {skuCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-start whitespace-nowrap w-auto dark:text-gray-400">
                      <span className='font-bold bg-primary-500/10 px-3 py-1 shadow rounded-full text-[12px] text-primary-500 '>
                        {categoryName || '—'}
                      </span>
                    </td>
                    <td className="p-3 text-start whitespace-nowrap w-auto font-black text-gray-900 dark:text-white">
                      {product.price_discount || product.price || 0} ر.س
                    </td>

                    <td className="p-3 text-start whitespace-nowrap w-auto">
                      {getStockBadge(stockPercent)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
