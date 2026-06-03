'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ClipboardList, ChevronRight, PackageX } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import LoaderIcon from '../shared/LoaderIcon';
import { getApiBase } from './categories/CategoriesList';
import LoadingState from '../shared/LoadingState';
export const getRelativeTime = (dateString: string, isRtl: boolean) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) {
    return isRtl ? 'الآن' : 'just now';
  }
  if (diffMin < 60) {
    return isRtl ? `منذ ${diffMin} دقيقة` : `${diffMin}m ago`;
  }
  if (diffHr < 24) {
    return isRtl ? `منذ ${diffHr} ساعة` : `${diffHr}h ago`;
  }
  if (diffDay < 7) {
    return isRtl ? `منذ ${diffDay} يوم` : `${diffDay}d ago`;
  }
  return date.toISOString().split('T')[0];
};

export default function RecentOrdersTable() {
  const locale = useLocale();
  const isRtl = locale === 'ar'; 
  const tc = useTranslations('Cart');

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentOrders = async () => {
    try {
      setIsLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // Fetch latest 5 orders for overview

      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '3');
      const res = await apiFetch(`${getApiBase()}orders?${params.toString()} `, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data || []);
        setOrders(list);
      }
    } catch (error) {
      console.error('Failed to fetch recent orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[1rem] border border-gray-100 dark:border-slate-800/80 shadow space-y-6"
    >
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800/80 pb-6">
        <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">
            {isRtl ? 'أحدث الطلبات' : 'Recent Orders'}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest">
            {isRtl ? 'مراقبة صفقات المبيعات الواردة' : 'Monitor incoming business pipeline'}
          </p>
        </div>
      </div>

      {/* Deliveries List Area */}
      <div className="flex flex-col gap-6">
        {isLoading ? (
           <LoadingState />
        ) : orders.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-2"
            >
              <PackageX className="w-8 h-8" strokeWidth={1.5} />
            </motion.div>
            {isRtl ? 'لا توجد عمليات تسليم حالياً' : 'No deliveries found'}
          </div>
        ) : (
          orders.map((order) => {
            const orderIdStr = order?.order_number;
            const customerName = order.name || 'Guest Customer';
            const customerInitials = customerName.charAt(0).toUpperCase() || 'C';
            const itemCount = order.items?.length || 1;

            return (
              <div
                key={order.id}
                className="   group bg-gray-100/60 dark:hover:bg-slate-800/20 p-4 -mx-4 rounded-[1.5rem] transition-all duration-300"
              >
                <div className="flex  gap-4">
                  {/* Status Indicator Dot */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
                    {customerInitials}
                  </div>
                  <div className='flex-1'>
                    <h4 className="font-extrabold text-gray-900 dark:text-white text-base font-mono tracking-tight leading-none">
                      #{orderIdStr}
                    </h4>
                    <div className="text-xs flex flex-col font-bold text-primary-500 dark:text-gray-500 mt-1.5 capitalize">

                      <p>  {customerName}</p>
                      <p className="py-1 font-bold text-gray-500 dark:text-gray-400">
                        {order.createdAt}
                      </p>
                      <p className='flex gap-2 justify-between items-center'>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block">
                          {itemCount} {itemCount === 1 ? tc('item') : tc('items')}
                        </span>
                        <span className="font-black text-primary-500 dark:text-white block">
                          {order.totalPrice} ر.س
                        </span>

                      </p>
                    </div>
                  </div>
                </div>


              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
