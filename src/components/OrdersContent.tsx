'use client';

import { useTranslations } from 'next-intl';
import { Package, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const orders = [
  { id: '#ORD-8392', date: '2026-05-10', status: 'Delivered', total: 498 },
  { id: '#ORD-8393', date: '2026-05-11', status: 'Processing', total: 299 },
];

export default function OrdersContent() {
  const t = useTranslations('Orders');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 dark:text-white tracking-tight">
          {t('title')}
        </h1>
      </motion.div>
      
      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">{t('orderId')}: {order.id}</h3>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm font-medium">{t('date')}: {order.date}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-8 md:gap-16 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 border-gray-100 dark:border-gray-800">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('status')}</span>
                <div className="flex items-center gap-2">
                  {order.status === 'Delivered' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  <span className={`font-bold ${order.status === 'Delivered' ? 'text-green-500' : 'text-amber-500'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('total')}</span>
                <span className="font-black text-2xl text-gray-900 dark:text-white tracking-tighter">${order.total}</span>
              </div>

              <div className="hidden md:block">
                <button className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No orders found yet. Time to start shopping!</p>
        </div>
      )}
    </div>
  );
}
