'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import {
  LayoutDashboard,
  Tag,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  X,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Logo } from '../shared/Header';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'overview' },
  { href: '/dashboard/categories', icon: Tag, label: 'categories' },
  { href: '/dashboard/products', icon: Package, label: 'products' },
  { href: '/dashboard/orders', icon: ShoppingCart, label: 'orders' },
  { href: '/dashboard/settings', icon: Settings, label: 'settings' },
];

interface SidebarProps {
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ isMobile = false, onMobileClose }: SidebarProps) {
  const t = useTranslations('Dashboard');
  const pathname = usePathname();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const initialPathname = React.useRef(pathname);

  // Auto-close mobile sidebar drawer ONLY when the active route changes from initial mount
  React.useEffect(() => {
    if (isMobile && onMobileClose && pathname !== initialPathname.current) {
      onMobileClose();
    }
  }, [pathname, isMobile, onMobileClose]);

  const asideContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#081640]">
      {/* Header */}
      <div className={cn(
        "h-20 sm:h-24 flex items-center border-b border-gray-100 dark:border-white/5 px-6",
        (isCollapsed && !isMobile) ? "flex-col justify-center gap-2 py-4 h-auto px-0" : "justify-between"
      )}>
        <div className={` ${isCollapsed && !isMobile ? "hidden" : "justify-between"}`}>
          <Logo />
        </div>


        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors shrink-0"
          >
            {isCollapsed ? (
              isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
            ) : (
              isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        )}
        {
          isMobile && (
            <button onClick={() => onMobileClose?.()} className="p-2 rounded-md bg-primary-500/10 text-primary-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0">
              <X className="w-4 h-4" />
            </button>
          )
        }
      </div>

<div className="relative flex gap-1 items-center mx-4 group lg:hidden mt-3 px-3 
 border border-gray-200 rounded-md bg-gray-50 py-2 sm:py-2.5 pl-9 sm:pl-11 pr-4 sm:pr-6 text-xs sm:text-sm outline-none transition-all focus:border-primary-500 dark:focus:border-primary-500 focus:bg-white dark:focus:bg-[#050b2e] focus:shadow-md">
          <Search className=" w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder={t('search')}
            className="w-full  "
          />
        </div>
      {/* Navigation */}
      <nav className="flex-grow py-6 sm:py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 sm:py-3.5 rounded-lg transition-all duration-300 group relative",
                isActive
                  ? "bg-primary-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />

              {(!isCollapsed || isMobile) && (
                <span className="font-bold text-sm tracking-wide uppercase">
                  {t(item.label)}
                </span>
              )}

              {isActive && (!isCollapsed || isMobile) && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Premium Banner */}
      {(!isCollapsed || isMobile) && (
        <div className="mx-4 mb-4 relative overflow-hidden min-h-[140px] sm:min-h-[180px] shrink-0">
          <Image
            src="https://pngimg.com/uploads/shopping_cart/shopping_cart_PNG73.png"
            alt="Premium Features"
            fill
            className="object-contain object-bottom"
          />
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-white/5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-4 px-4 py-3 sm:py-3.5 rounded-lg text-red-500 bg-red-50 dark:bg-red-500/5 dark:hover:bg-red-500/10 transition-all duration-300",
            (isCollapsed && !isMobile) && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(!isCollapsed || isMobile) && <span className="font-bold text-sm tracking-wide">{t('exitAdmin')}</span>}
        </Link>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full h-full">
        {asideContent}
      </div>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        "relative h-screen bg-white dark:bg-[#081640] border-gray-100 dark:border-white/5 transition-colors duration-300 z-50 flex flex-col shrink-0",
        isRtl ? "border-l" : "border-r",
        isCollapsed ? "items-center" : "items-stretch"
      )}
    >
      {asideContent}
    </motion.aside>
  );
}
