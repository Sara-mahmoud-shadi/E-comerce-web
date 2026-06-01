'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import DashboardHeader from './DashboardHeader';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const t = useTranslations('Dashboard'); 
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('DASHBOARD AUTH CHECK:', !!token);
    if (!token) {
      // router.push('/');
    }
  }, []);

  return (
    <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile/tablet) */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Sheet Drawer (lg:hidden) */}
        <SheetContent 
          side={isRtl ? 'right' : 'left'} 
          className="w-[280px] p-0 bg-white dark:bg-[#081640] border-gray-100 dark:border-white/5 flex flex-col h-full z-50"
        >
          <div className="sr-only">
            <SheetTitle>Admin Sidebar Menu</SheetTitle>
            <SheetDescription>Navigate across categories, products, orders, and dashboard configurations.</SheetDescription>
          </div>
          <Sidebar isMobile onMobileClose={() => setIsMobileSidebarOpen(false)} />
        </SheetContent>

        <main className="flex-grow flex flex-col h-screen overflow-hidden min-w-0">
          {/* Dashboard Header with toggle callback */}
          <DashboardHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
          
          {/* Dashboard Content */}
          <section className="flex-grow flex flex-col overflow-y-auto pt-4 sm:pt-5 px-3 sm:px-5 scrollbar-hide min-w-0">
            <div className="flex-grow">
              {children}
            </div>

            <footer className="mt-8 sm:mt-10 py-3 border-t text-center border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-center text-gray-400 text-xs sm:text-sm font-bold shrink-0">
              <p>{new Date().getFullYear()} © GoShop E-Commerce. {t('rights')}</p>
            </footer>
          </section>
        </main>
      </div>
    </Sheet>
  );
}
