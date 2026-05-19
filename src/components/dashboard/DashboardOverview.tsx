'use client';
 
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import RecentProductsTable from './RecentProductsTable';
import RecentOrdersTable from './RecentOrdersTable'; 


function DashboardOverviewPage() {
  const t = useTranslations('Dashboard');
  const tc = useTranslations('Cart');
  const to = useTranslations('Orders');
  const params = useParams();
  const locale = params.locale as string;
  const isRtl = locale === 'ar';
 


  return (
    <div className="space-y-10"> 
     

      {/* Analysis Metrics Grid (Categories, Orders, Products) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div
        initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[1.5rem] bg-[linear-gradient(90deg,rgba(18,64,18,1)_0%,rgba(31,102,44,1)_43%,rgba(18,64,18,1)_100%)] border border-emerald-900/40 px-8 shadow-[0_20px_50px_rgba(16,185,129,0.06)] flex flex-col md:flex-row items-center justify-between gap-8"
        > 
        {/* Left Side Content */}
        <div className="space-y-3 relative z-10">
          <span className="text-[10px] font-black text-white  tracking-widest block">
            {isRtl ? 'لوحة التحكم' : 'Console Hub'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {isRtl ? 'مرحباً بك مجدداً يا مسؤول! 👋' : "Welcome back, Admin! 👋"}
          </h2>
          <p className="text-[9px] font-bold text-emerald-100/40  tracking-widest leading-none">
            {isRtl ? 'النظام متصل وآمن' : 'Admin Session Active'}
          </p>
        </div>
 
      </motion.div>
        {/* Card 1: Count of Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900/60 backdrop-blur-2xl p-7 rounded-[1.75rem] border border-gray-100 dark:border-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex items-center justify-between group hover:scale-[1.01] transition-transform duration-300"
        >
          <div className="space-y-2">
            <span className="text-xs font-black text-primary-500 dark:text-gray-500  tracking-wider block">
              {isRtl ? 'إجمالي الأقسام' : 'Total Categories'}
            </span>
            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight block">
              12
            </span>
             
          </div>
          
          {/* Right Visual: Upward Sparkline Chart */}
          <div className="relative rotate-12 text-gray-300 dark:text-slate-700 shrink-0">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="4" width="14" height="17" rx="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 9h6M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 2a2 2 0 012 2v1H10V4a2 2 0 012-2z" fill="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary-500 animate-pulse" />
          </div>
        </motion.div>

        {/* Card 2: Count of Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-slate-900/60 backdrop-blur-2xl p-7 rounded-[1.75rem] border border-gray-100 dark:border-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex items-center justify-between group hover:scale-[1.01] transition-transform duration-300"
        >
          <div className="space-y-2">
            <span className="text-xs font-black text-primary-500 dark:text-gray-500  tracking-wider block">
              {isRtl ? 'إجمالي الطلبات' : 'Total Orders'}
            </span>
            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight block">
              1,420
            </span>
            <span className="text-xs font-bold text-amber-500 block">
              12 {isRtl ? 'طلبات قيد المعالجة العاجلة' : 'priority pending orders'}
            </span>
          </div>

          {/* Right Visual: Clipboard + Clock Icon with Red Priority Dot */}
          <div className="relative rotate-12 text-gray-300 dark:text-slate-700 shrink-0">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="4" width="14" height="17" rx="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 9h6M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 2a2 2 0 012 2v1H10V4a2 2 0 012-2z" fill="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary-500 animate-pulse" />
          </div>
        </motion.div>

        {/* Card 3: Count of Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-slate-900/60 backdrop-blur-2xl p-7 rounded-[1.75rem] border border-gray-100 dark:border-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex items-center justify-between group hover:scale-[1.01] transition-transform duration-300"
        >
          <div className="space-y-2">
            <span className="text-xs font-black text-primary-500 dark:text-gray-500  tracking-wider block">
              {isRtl ? 'إجمالي المنتجات' : 'Total Products'}
            </span>
            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight block">
              480
            </span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 block">
              {isRtl ? 'موزعة على الأقسام النشطة' : 'Distributed across active sections'}
            </span>
          </div>

          {/* Right Visual: Circular Progress Ring (representing database fill/sentiments style) */}
        <div className="relative rotate-12 text-gray-300 dark:text-slate-700 shrink-0">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="4" width="14" height="17" rx="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 9h6M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 2a2 2 0 012 2v1H10V4a2 2 0 012-2z" fill="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary-500 animate-pulse" />
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