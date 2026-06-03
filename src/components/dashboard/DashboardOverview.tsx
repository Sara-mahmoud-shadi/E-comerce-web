'use client';
 
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import RecentProductsTable from './RecentProductsTable';
import RecentOrdersTable from './RecentOrdersTable'; 
import { apiFetch } from '@/lib/api';
import { getApiBase } from './categories/CategoriesList';
import { useEffect, useState } from 'react';


function DashboardOverviewPage() { 
  const params = useParams();
  const locale = params.locale as string;
  const isRtl = locale === 'ar';
  const [stats, setStats] = useState<any>({}); 
   const fetchStatus = async () => {
      try { 
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        // Fetch latest 5 orders for overview
  
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '3');
        const res = await apiFetch(`${getApiBase()}dashboard/stats `);
  
        if (res.ok) {
          const data = await res.json(); 
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch', error);
      } 
    };
  
    useEffect(() => {
      fetchStatus();
    }, []);
 

  return (
    <div className="space-y-6 sm:space-y-10"> 
     

      {/* Analysis Metrics Grid (Categories, Orders, Products) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        
        {/* Card 1: Console Welcome Hub */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,rgba(18,64,18,1)_0%,rgba(31,102,44,1)_100%)] border border-emerald-900/40 p-5 sm:p-7 shadow-[0_20px_50px_rgba(16,185,129,0.06)] flex items-center justify-between gap-4 group hover:scale-[1.01] transition-transform duration-300"
        > 
          {/* Left Side Content */}
          <div className="space-y-2 relative z-10 min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black text-white/70 tracking-widest block uppercase">
              {isRtl ? 'لوحة التحكم' : 'Console Hub'}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
              {isRtl ? 'مرحباً بك مجدداً! 👋' : "Welcome back! 👋"}
            </h2>
            <p className="text-[9px] sm:text-[10px] font-bold text-emerald-100/60 tracking-wider block">
              {isRtl ? 'النظام متصل وآمن' : 'Session Active'}
            </p>
          </div>
          
          {/* Right Visual: Monitor Console Icon */}
          <div className="relative text-emerald-200/20 shrink-0">
            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
          </div>
        </motion.div>

        {/* Card 2: Count of Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900/60 backdrop-blur-2xl p-5 sm:p-7 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4 group hover:scale-[1.01] transition-transform duration-300"
        >
          <div className="space-y-2 min-w-0">
            <span className="text-[10px] sm:text-xs font-black text-primary-500 dark:text-gray-500 tracking-wider block uppercase">
              {isRtl ? 'إجمالي الأقسام' : 'Total Categories'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight block">
             {stats?.totalCategories || 0}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-500 block truncate">
              {isRtl ? 'أقسام نشطة بالكامل' : 'fully active categories'}
            </span>
          </div>
          
          {/* Right Visual: Folder/Grid Icon */}
          <div className="relative text-gray-300 dark:text-slate-700 group-hover:text-emerald-500/20 transition-colors shrink-0">
            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v1.75c0 .621-.504 1.125-1.125 1.125h-6A1.125 1.125 0 012.25 8.875v-1.75zM2.25 15.125c0-.621.504-1.125 1.125-1.125h6c.621 0 1.125.504 1.125 1.125v1.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-1.75zM13.5 7.125c0-.621.504-1.125 1.125-1.125h6c.621 0 1.125.504 1.125 1.125v1.75c0 .621-.504 1.125-1.125 1.125h-6A1.125 1.125 0 0113.5 8.875v-1.75zM13.5 15.125c0-.621.504-1.125 1.125-1.125h6c.621 0 1.125.504 1.125 1.125v1.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-1.75z" />
            </svg>
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </motion.div>

        {/* Card 3: Count of Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-slate-900/60 backdrop-blur-2xl p-5 sm:p-7 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4 group hover:scale-[1.01] transition-transform duration-300"
        >
          <div className="space-y-2 min-w-0">
            <span className="text-[10px] sm:text-xs font-black text-primary-500 dark:text-gray-500 tracking-wider block uppercase">
              {isRtl ? 'إجمالي الطلبات' : 'Total Orders'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight block">
              {stats?.totalOrders || 0}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-amber-500 block truncate">
              {isRtl ? '١٢ طلبات عاجلة' : '12 priority pending'}
            </span>
          </div>

          {/* Right Visual: Receipt/Clipboard List Icon */}
          <div className="relative text-gray-300 dark:text-slate-700 group-hover:text-amber-500/20 transition-colors shrink-0">
            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
        </motion.div>

        {/* Card 4: Count of Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-slate-900/60 backdrop-blur-2xl p-5 sm:p-7 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4 group hover:scale-[1.01] transition-transform duration-300"
        >
          <div className="space-y-2 min-w-0">
            <span className="text-[10px] sm:text-xs font-black text-primary-500 dark:text-gray-500 tracking-wider block uppercase">
              {isRtl ? 'إجمالي المنتجات' : 'Total Products'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight block">
              {stats?.totalProducts || 0}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 block truncate">
              {isRtl ? 'موزعة على الأقسام' : 'Across active sections'}
            </span>
          </div>

          {/* Right Visual: Package/Box Icon */}
          <div className="relative text-gray-300 dark:text-slate-700 group-hover:text-blue-500/20 transition-colors shrink-0">
            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
        </motion.div>

      </div>

      {/* Side-by-Side Modern Interactive Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10"> 
        {/* Products List Table Box */}
        <RecentProductsTable /> 
        {/* Orders List Table Box */}
        <RecentOrdersTable /> 
      </div>
    </div>
  );
}

export default DashboardOverviewPage;