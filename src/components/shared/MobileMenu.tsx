'use client';

import { Menu, ShoppingBag, User, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import SearchBar from './SearchBar';
import LanguageSwitcher from './LanguageSwitcher';
import { Link } from '@/i18n/routing';

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRtl: boolean;
  navItems: { label: string; path: string; icon: any }[];
  pathname: string;
  t: (key: string) => string;
  tAuth: (key: string) => string;
  locale: string;
  onLoginClick: () => void;
}

export default function MobileMenu({
  isOpen,
  onOpenChange,
  isRtl,
  navItems,
  pathname,
  t,
  tAuth,
  locale,
  onLoginClick
}: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent
        side={isRtl ? 'right' : 'left'}
        className="w-[300px] sm:w-[350px] p-0 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 flex flex-col h-full"
      >
        {/* Drawer Branding Header */}
        <SheetHeader className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 text-2xl font-black text-primary-500 select-none">
            <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-500" />
            </div>
            <span>Go<span className="text-black dark:text-white">Shop</span></span>
          </SheetTitle>
          <SheetClose asChild>
            <button className="p-2 rounded-md bg-primary-500/10 text-primary-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0">
              <X className="w-4 h-4" />
            </button>
          </SheetClose>
        </SheetHeader>

        {/* Mobile Search Bar */}
        <div className="px-2 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-center">
          <SearchBar />
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => onOpenChange(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-bold transition-all ${
                  active
                    ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-500 dark:text-gray-300 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${active ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`} />
                <span>{t(item.label)}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Drawer Footer with Language & Login */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
          {/* Language switch */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
              {locale === 'ar' ? 'English' : 'العربية'}
            </span>
          </div>

          {/* Login button */}
          <button
            onClick={() => {
              onOpenChange(false);
              onLoginClick();
            }}
            className="flex-grow flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span>{tAuth('login')}</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
