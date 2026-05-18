'use client';
import { apiFetch } from '@/lib/api';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppPagination from '@/components/shared/AppPagination';
import DeleteConfirmDialog from '@/components/shared/DeleteConfirmDialog';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}products`;


export default function ProductsList() {
  const t = useTranslations('Dashboard'); 
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
 const locale = useLocale();
  const isRtl = locale === 'ar';
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const url = new URL(window.location.origin + '/api/products');
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', itemsPerPage.toString());
      if (searchTerm) {
        url.searchParams.append('search', searchTerm);
      }
      
      const res = await apiFetch(url.toString(), {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        const productList = Array.isArray(data) ? data : (data.data || []);
        setProducts(productList);
        setTotalItems(data.meta?.total || data.total || productList.length || 0);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, searchTerm]);
 
 const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch(`${API_URL}/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete category');
      setProducts(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white mb-2">
            {t('products')}
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Manage your store inventory and availability
          </p>
        </div>

        <Link href="/dashboard/products/new">
          <button className="flex items-center gap-3 px-8 py-4 bg-primary-500 text-white rounded-md font-black cursor-pointer tracking-widest text-[12px] shadow-lg hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
            {t('create')}
          </button>
        </Link>
      </div>

      <div className="bg-white dark:bg-[#081640] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-xl py-3 pl-12 pr-6 text-sm outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/20 hover:bg-transparent">
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{t('productName')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{t('categories')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{t('price')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{t('status')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 text-right h-auto">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500 font-bold">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : products.map((product, index) => (
                  <TableRow
                    key={product.id}
                    className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                  >
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/5 relative shadow-sm group-hover:scale-105 transition-transform duration-500">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-black dark:text-white uppercase tracking-tight mb-1">{isRtl ? product.name_ar : product.name}</h4>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-lg">
                            SKU: PROD-{product.id?.toString().padStart(4, '0') || '0000'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <Badge variant="secondary" className="bg-primary-500/10 dark:bg-blue-500/10 text-primary-500 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none">
                        {isRtl ? product.category?.name_ar : product.category?.name_en}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className={`text-sm font-black tracking-tighter ${product.price_discount ? 'text-emerald-500' : 'dark:text-white'}`}>
                           {parseFloat(product.price_discount || product.price || 0).toFixed(2)} ر.س
                        </span>
                        {product.price_discount && (
                          <span className="text-[10px] font-bold text-gray-400 line-through tracking-widest">
                             {parseFloat(product.price || 0).toFixed(2)} ر.س
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.instock ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.instock ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {product.instock ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center  gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/products/${product.id}`}>
                          <button className="p-2.5 cursor-pointer rounded-xl bg-primary-500/10 dark:bg-gray-900 text-gray-400 hover:bg-primary-500 hover:text-white transition-all">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteId(product.id)}
                          className="p-2.5 cursor-pointer rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>

      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />
      
   
         <DeleteConfirmDialog
           isOpen={!!deleteId}
           isDeleting={isDeleting}
           onClose={() => setDeleteId(null)}
           onConfirm={handleDelete}
         />
    </div>
  );
}
