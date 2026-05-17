'use client';

import React from 'react';
import { useTranslations } from 'next-intl'; 
import { Search, Eye, Clock, Trash2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppPagination from '@/components/shared/AppPagination';

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
      
      const res = await fetch(url.toString(), {
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

  React.useEffect(() => {
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
      const res = await fetch(`${API_URL}/${deleteId}`, {
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
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{to('orderId')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">Customer</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{to('date')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{to('status')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 h-auto">{to('total')}</TableHead>
                <TableHead className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400 text-right h-auto">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500 font-bold">
                    Loading...
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
                      <span className="font-black text-gray-900 dark:text-white">#{orderId}</span>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center font-black text-xs text-gray-400 uppercase">
                          {order.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{order.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {formatDate(order.createdAt  )}
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
