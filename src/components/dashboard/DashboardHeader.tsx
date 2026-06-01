'use client';

import { Search, User } from 'lucide-react';
import React from 'react';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { SheetTrigger } from '@/components/ui/sheet';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const t = useTranslations('Dashboard'); 
  return (
    <header className="h-20 sm:h-24 shrink-0 bg-white dark:bg-[#081640] border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 sm:px-6 md:px-10 gap-4">
      <div className="flex items-center gap-3 sm:gap-4 flex-grow max-w-2xl">
        {/* Hamburger Menu for Mobile & Tablet Viewports */}
        <SheetTrigger asChild>
          <button
            onClick={(e) => { 
              if (onMenuClick) {
                onMenuClick();
              } else {
                console.warn("onMenuClick callback is undefined in DashboardHeader");
              }
            }}
            type="button"
            className="lg:hidden p-2 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors shrink-0 z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </SheetTrigger>

        {/* Dynamic Search Box */}
        <div className="relative w-full group">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder={t('search')}
            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-white/5 rounded-md py-2 sm:py-2.5 pl-9 sm:pl-11 pr-4 sm:pr-6 text-xs sm:text-sm outline-none transition-all focus:border-primary-500 dark:focus:border-primary-500 focus:bg-white dark:focus:bg-[#050b2e] focus:shadow-md"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <LanguageSwitcher /> 
        <div className="h-8 w-px bg-gray-300 dark:bg-white/5 hidden md:block" /> 
        <div className=" items-center gap-2 sm:gap-3 hidden md:flex">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-500/10 dark:bg-blue-500/10 flex items-center justify-center text-primary-500 dark:text-blue-400 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="">
            <p className="text-xs font-black text-primary-500 tracking-widest dark:text-white leading-none mb-0.5">{t('adminUser')}</p>
            <p className="text-[9px] font-bold text-gray-400 leading-none">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
