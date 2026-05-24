'use client';

import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import { Search, Bell, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const t = useTranslations('Dashboard'); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('DASHBOARD AUTH CHECK:', !!token);
    if (!token) {
      // router.push('/');
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      <Sidebar />

      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Dashboard Header */}
        <DashboardHeader/>
        {/* Dashboard Content */}
        <section className="flex-grow  overflow-y-auto pt-5 px-5 scrollbar-hide">
          <div className="flex-grow">
            {children}
          </div>

          <footer className="mt-10 py-3 border-t text-center border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-center text-gray-400 text-sm font-bold">
            <p>{new Date().getFullYear()} ©  E-Commerce. {t('rights')}</p>
          </footer>
        </section>
      </main>
    </div>
  );
}
