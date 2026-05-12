'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const stats = [
  { 
    label: 'Total Revenue', 
    value: '$128,430', 
    change: '+12.5%', 
    isPositive: true, 
    icon: DollarSign,
    color: 'blue'
  },
  { 
    label: 'Total Orders', 
    value: '1,240', 
    change: '+8.2%', 
    isPositive: true, 
    icon: ShoppingBag,
    color: 'emerald'
  },
  { 
    label: 'Active Customers', 
    value: '842', 
    change: '-2.4%', 
    isPositive: false, 
    icon: Users,
    color: 'purple'
  },
  { 
    label: 'Sales Growth', 
    value: '24.8%', 
    change: '+4.3%', 
    isPositive: true, 
    icon: TrendingUp,
    color: 'amber'
  },
];

export default function DashboardOverview() {
  const t = useTranslations('Dashboard');

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white mb-2">
          {t('overview')}
        </h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Welcome back to your business command center
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-[#081640] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-500`} />
            
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</h3>
              <p className="text-3xl font-black dark:text-white tracking-tighter">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for charts/recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#081640] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl h-96 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-500/5 flex items-center justify-center mb-6">
            <TrendingUp className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-black dark:text-white mb-2">Revenue Analytics</h3>
          <p className="text-sm text-gray-400 max-w-xs">Detailed revenue charts and trend analysis will be displayed here.</p>
        </div>

        <div className="bg-white dark:bg-[#081640] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl h-96 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-500/5 flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-purple-500" />
          </div>
          <h3 className="text-xl font-black dark:text-white mb-2">Recent Orders</h3>
          <p className="text-sm text-gray-400 max-w-xs">Live feed of incoming orders and their status updates.</p>
        </div>
      </div>
    </div>
  );
}
