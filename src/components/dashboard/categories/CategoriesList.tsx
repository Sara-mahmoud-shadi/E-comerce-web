'use client';
import { apiFetch } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, Plus, FolderOpen, X, PackageX } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import AppPagination from '@/components/shared/AppPagination';
import DeleteConfirmDialog from '@/components/shared/DeleteConfirmDialog';
import { useTranslations, useLocale } from 'next-intl';
import LoaderIcon from '@/components/shared/LoaderIcon';
import { ShopBreadcrumb } from '@/components/shared/ShopBreadcrumb';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}categories`;

export default function CategoriesList() {
  const t = useTranslations('Dashboard');
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}categories/pagination`, window.location.origin);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', itemsPerPage.toString());
      if (searchTerm) {
        url.searchParams.append('search', searchTerm);
      }

      const token = localStorage.getItem('token');
      const res = await apiFetch(url.toString(), {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      console.log(data);
      const categoryList = Array.isArray(data) ? data : (data.data || []);
      setCategories(categoryList);
      setTotalItems(data.meta?.total || data.total || categoryList.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
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

      setCategories(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };



  return (
    <div className="space-y-8 container mx-auto">
      <ShopBreadcrumb
        items={[
          { label: t('dashboard'), href: '/dashboard' },
          { label: t('categories') }
        ]}
      />


      <div className="bg-white dark:bg-[#081640] rounded-[1rem] shadow border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex md:flex-row justify-between items-start w-full md:items-center gap-6">
            <div>
              <h1 className="text-xl font-black tracking-tighter dark:text-white mb-1">
                {t('categories')}
              </h1>
              <p className="text-[12px] font-bold text-gray-400 tracking-widest">
                {t('categoriesListDesc')}
              </p>
            </div>
            <div className="relative w-3xl">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 rounded-md py-3  px-6 text-sm outline-none transition-all ${isRtl ? 'pr-12 pl-10' : 'pl-12 pr-10'}`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer ${isRtl ? 'left-4' : 'right-4'}`}
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Link href="/dashboard/categories/new">
              <button className="flex items-center gap-3 px-8 py-4 bg-primary-500 text-white rounded-md font-black cursor-pointer tracking-widest text-[12px] shadow-lg hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
                {t('create')}
              </button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/20 hover:bg-transparent">
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{t('categoryName')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{t('productsCount')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 text-right h-auto">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10">
                      <LoaderIcon />
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-12 text-center">
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
                            {isRtl ? 'لا توجد أقسام حالياً' : 'No categories found'}
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                            {isRtl ? 'لم يتم العثور على أي أقسام مطابقة' : 'No matching categories were found'}
                          </p>
                        </motion.div>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ) : categories.map((category, index) => (
                  <TableRow
                    key={category.id}
                    className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                  >
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 dark:bg-blue-500/10 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform duration-500">
                          <FolderOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black dark:text-white uppercase tracking-tight mb-1">{isRtl ? category.name_ar : category.name_en}</h4>
                          <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-lg">
                            SLUG: {category.slug}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full bg-gray-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          {category.products.length} {t('products')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6 ">
                      <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/categories/${category.id}`}>
                          <button className="p-2.5 cursor-pointer rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-primary-500 hover:text-white transition-all">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteId(category.id)}
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
