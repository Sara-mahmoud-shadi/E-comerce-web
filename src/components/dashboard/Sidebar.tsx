'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { 
  LayoutDashboard, 
  Tag, 
  Package, 
  ShoppingCart, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'overview' },
  { href: '/dashboard/categories', icon: Tag, label: 'categories' },
  { href: '/dashboard/products', icon: Package, label: 'products' },
  { href: '/dashboard/orders', icon: ShoppingCart, label: 'orders' },
];

export default function Sidebar() {
  const t = useTranslations('Dashboard');
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        "relative h-screen bg-white dark:bg-[#081640] border-r border-gray-100 dark:border-white/5 transition-all duration-300 ease-in-out z-50 flex flex-col",
        isCollapsed ? "items-center" : "items-stretch"
      )}
    >
      {/* Header */}
      <div className="h-24 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/5">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase dark:text-white">Admin</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow py-8 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
              
              {!isCollapsed && (
                <span className="font-bold text-sm tracking-wide uppercase">
                  {t(item.label)}
                </span>
              )}

              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-white/5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all duration-300",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-bold text-sm tracking-wide uppercase">Exit Admin</span>}
        </Link>
      </div>
    </motion.aside>
  );
}
