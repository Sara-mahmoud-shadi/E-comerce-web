'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppPagination from '@/components/shared/AppPagination';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Artisan Plate', price: 45.00, discountPrice: 35.00, category: 'serving', stock: 45, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&q=80' },
  { id: 2, name: 'Espresso Master', price: 899.00, discountPrice: null, category: 'electrical', stock: 12, image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=200&q=80' },
  { id: 3, name: 'Copper Set', price: 350.00, discountPrice: 299.00, category: 'cooking', stock: 8, image: 'https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=200&q=80' },
  { id: 4, name: 'Chef Knife', price: 120.00, discountPrice: 110.00, category: 'cooking', stock: 24, image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=200&q=80' },
  { id: 5, name: 'Glass Bowl', price: 25.00, discountPrice: null, category: 'serving', stock: 60, image: 'https://images.unsplash.com/photo-1574706196825-f2a632128c6a?w=200&q=80' },
  { id: 6, name: 'Electric Kettle', price: 75.00, discountPrice: 65.00, category: 'electrical', stock: 15, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?w=200&q=80' },
  { id: 7, name: 'Wooden Spoon Set', price: 15.00, discountPrice: null, category: 'cooking', stock: 100, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&q=80' },
  { id: 8, name: 'Ceramic Mug', price: 12.00, discountPrice: 10.00, category: 'serving', stock: 40, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed20?w=200&q=80' },
];

export default function ProductsList() {
  const t = useTranslations('Dashboard');
  const tc = useTranslations('Categories');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = MOCK_PRODUCTS.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentItems = MOCK_PRODUCTS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <button className="flex items-center cursor-pointer gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
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
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{t('productName')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{t('categories')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{t('price')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{t('status')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 text-right h-auto">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {currentItems.map((product, index) => (
                  <TableRow
                    key={product.id}
                    className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                  >
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/5 relative shadow-sm group-hover:scale-105 transition-transform duration-500">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-black dark:text-white uppercase tracking-tight mb-1">{product.name}</h4>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-lg">
                            SKU: PROD-{product.id.toString().padStart(4, '0')}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none">
                        {tc(product.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className={`text-sm font-black tracking-tighter ${product.discountPrice ? 'text-emerald-500' : 'dark:text-white'}`}>
                          ${(product.discountPrice || product.price).toFixed(2)}
                        </span>
                        {product.discountPrice && (
                          <span className="text-[10px] font-bold text-gray-400 line-through tracking-widest">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 10 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {product.stock > 10 ? 'Available' : 'Low Stock'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center  gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/products/${product.id}`}>
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
