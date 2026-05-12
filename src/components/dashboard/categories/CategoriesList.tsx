'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, Plus, FolderOpen } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import AppPagination from '@/components/shared/AppPagination';

const MOCK_CATEGORIES = [
  { id: 1, name: 'Serving & Hospitality', count: 12, slug: 'SERVING' },
  { id: 2, name: 'Electrical Equipment', count: 8, slug: 'ELECTRICAL' },
  { id: 3, name: 'Cooking Tools', count: 15, slug: 'COOKING' },
  { id: 4, name: 'Coffee Section', count: 6, slug: 'COFFEE' },
  { id: 5, name: 'Bakery & Sweets', count: 10, slug: 'BAKERY' },
  { id: 6, name: 'Kitchen Appliances', count: 22, slug: 'KITCHEN' },
  { id: 7, name: 'Home Decor', count: 45, slug: 'DECOR' },
  { id: 8, name: 'Tableware', count: 30, slug: 'TABLEWARE' },
  { id: 9, name: 'Furniture', count: 5, slug: 'FURNITURE' },
  { id: 10, name: 'Lighting', count: 18, slug: 'LIGHTING' },
];

export default function CategoriesList() {
  const t = useTranslations('Dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = MOCK_CATEGORIES.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentItems = MOCK_CATEGORIES.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white mb-2">
            {t('categories')}
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Organize your products into meaningful sections
          </p>
        </div>

        <Link href="/dashboard/categories/new">
          <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
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
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-xl py-3 pl-12 pr-6 text-sm outline-none transition-all"
            />
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
                {currentItems.map((category, index) => (
                  <TableRow
                    key={category.id}
                    className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                  >
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                          <FolderOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black dark:text-white uppercase tracking-tight mb-1">{category.name}</h4>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-lg">
                            SLUG: {category.slug}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full bg-gray-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          {category.count} {t('products')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6 ">
                      <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/categories/${category.id}`}>
                          <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-red-600 hover:text-white transition-all">
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
    </div>
  );
}
