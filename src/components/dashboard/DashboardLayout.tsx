'use client';
 
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import { Search, Bell, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
 
interface DashboardLayoutProps {
  children: React.ReactNode;
}
 
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const t = useTranslations('Dashboard');
  const router = useRouter();
 
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
        <header className="h-24 shrink-0 bg-white dark:bg-[#081640] border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-10">
          <div className="flex items-center gap-8 flex-grow max-w-2xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder={t('search')}
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <LanguageSwitcher />
           
            <div className="h-10 w-px bg-gray-300 dark:bg-white/5" />

            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-500/10 dark:bg-blue-500/10 flex items-center justify-center text-primary-500 dark:text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <div className="text-right hidden md:block">
                <p className="text-xs font-black uppercase tracking-widest dark:text-white">Admin User</p>
                <p className="text-[10px] font-bold text-gray-400">Super Admin</p>
              </div>
           
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="flex-grow overflow-y-auto p-10 scrollbar-hide">
          {children}
        </section>
      </main>
    </div>
  );
}
