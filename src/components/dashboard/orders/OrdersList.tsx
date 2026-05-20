'use client';
import { apiFetch } from '@/lib/api';

import React, { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, Eye, Clock, Trash2, PackageX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppPagination from '@/components/shared/AppPagination';
import LoaderIcon from '@/components/shared/LoaderIcon';
import { ShopBreadcrumb } from '@/components/shared/ShopBreadcrumb';

import DeleteConfirmDialog from '@/components/shared/DeleteConfirmDialog';
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}orders`;
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.toISOString().split("T")[0]; // 2026-05-17

  const time = date.toTimeString().slice(0, 5); // 13:08

  return `${day} & ${time}`;
};
export default function OrdersList() {
  const t = useTranslations('Dashboard');
  const to = useTranslations('Orders');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [orders, setOrders] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [totalItems, setTotalItems] = React.useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const url = new URL(API_URL, window.location.origin);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', itemsPerPage.toString());
      if (searchTerm) {
        url.searchParams.append('search', searchTerm);
      }

      const res = await apiFetch(url.toString(), {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      if (res.ok) {
        const data = await res.json();
        const orderList = Array.isArray(data) ? data : (data.data || []);
        setOrders(orderList);
        setTotalItems(data.meta?.total || data.total || orderList.length || 0);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
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

      if (!res.ok) throw new Error('Failed to delete order');

      setOrders(prev => prev.filter(o => o.id !== deleteId));
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
          { label: t('orders') }
        ]}
      />
    
      {/* Table Container */}
      <div className="bg-white dark:bg-[#081640] rounded-[1rem] shadow border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col w-full md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-xl font-black tracking-tighter dark:text-white mb-1">
            {t('orders')}
          </h1>
          <p className="text-[12px] font-bold text-gray-400 tracking-widest">
            {t('ordersListDesc')}
          </p>
        </div>
  <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 rounded-md py-3  px-6 text-sm outline-none transition-all"
            />
          </div>
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
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <LoaderIcon />
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
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
                            {isRtl ? 'لا توجد طلبات حالياً' : 'No orders found'}
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                            {isRtl ? 'لم يتم العثور على أي طلبات مطابقة' : 'No matching orders were found'}
                          </p>
                        </motion.div>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ) : orders.map((order, index) => {
                  const customerName = order.user?.username || order.user?.name || order.customer || 'Unknown';
                  const orderId = order.id?.toString().padStart(4, '0') || '0000';

                  return (
                    <TableRow
                      key={order.id}
                      className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                    >
                      <TableCell className="px-8 py-6">
                        <span className="font-black text-gray-900 dark:text-white">{order.order_number  || order.id}</span>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-500 dark:bg-white/5 flex items-center justify-center font-black text-xs text-white uppercase">
                            {order.name.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">{order.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${order.status_order === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${order.status_order === 'delivered' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {to(`status_${order.status_order}`) || order.status_order || 'Pending'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        <span className="font-black text-gray-900 dark:text-white tracking-tighter">
                          {order.totalPrice}  ر.س
                        </span>
                      </TableCell>
                      <TableCell className="px-8 py-6 ">
                        <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-primary-500/10 hover:text-primary-500 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(order.id)}
                            className="p-2.5 cursor-pointer rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-red-600 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
