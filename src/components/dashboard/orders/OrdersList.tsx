'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, Eye, CheckCircle2, Clock, Package, Filter, Trash2, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppPagination from '@/components/shared/AppPagination';

const MOCK_ORDERS = [
  { id: '#ORD-8392', customer: 'John Doe', date: '2026-05-10', status: 'delivered', total: 498.00 },
  { id: '#ORD-8393', customer: 'Sarah Smith', date: '2026-05-11', status: 'processing', total: 299.00 },
  { id: '#ORD-8394', customer: 'Michael Brown', date: '2026-05-12', status: 'pending', total: 150.00 },
  { id: '#ORD-8395', customer: 'Emma Wilson', date: '2026-05-12', status: 'shipped', total: 890.00 },
  { id: '#ORD-8396', customer: 'David Jones', date: '2026-05-13', status: 'delivered', total: 120.00 },
  { id: '#ORD-8397', customer: 'Linda Taylor', date: '2026-05-13', status: 'processing', total: 550.00 },
];

export default function OrdersList() {
  const t = useTranslations('Dashboard');
  const to = useTranslations('Orders');
  
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const totalItems = MOCK_ORDERS.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentItems = MOCK_ORDERS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white mb-2">
            {t('orders')}
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Track and manage customer purchases
          </p>
        </div>
 
      </div>

      {/* Table Container */}
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
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{to('orderId')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">Customer</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{to('date')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{to('status')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{to('total')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 text-right h-auto">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((order, index) => (
                <TableRow
                  key={order.id}
                  className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                >
                  <TableCell className="px-8 py-6">
                    <span className="font-black text-gray-900 dark:text-white">{order.id}</span>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center font-black text-xs text-gray-400">
                        {order.customer.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{order.customer}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{order.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {to(`status_${order.status}`)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <span className="font-black text-gray-900 dark:text-white tracking-tighter">${order.total.toFixed(2)}</span>
                  </TableCell>
                  <TableCell className="px-8 py-6 ">
                    <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/dashboard/orders/${order.id.replace('#', '')}`}
                        className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-red-600 hover:text-white transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
