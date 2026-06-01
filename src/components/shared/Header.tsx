'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { ShoppingBag, User, Home, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { CartDrawer } from './CartDrawer';
import LanguageSwitcher from './LanguageSwitcher';
import LoginModal from '../auth/LoginModal';
import MobileMenu from './MobileMenu';

// --- Subcomponents ---

export function Logo() {
  return (
    <Link href="/" dir="ltr" className="flex items-center gap-2 text-4xl font-black tracking-tight text-primary-500 shrink-0 select-none">
      <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500 dark:text-primary-400">
        <ShoppingBag className="w-6 h-6" />
      </div>
      <span>Go<span className="text-2xl text-black dark:text-white">Shop</span></span>
    </Link>
  );
}


// --- Main Header Component ---

export default function Header() {
  const t = useTranslations('Navigation');
  const tAuth = useTranslations('Auth');
  const locale = useLocale();
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const [cartCount, setCartCount] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isRtl = locale === 'ar';

  // Handle hydration: only show count after client-side mount
  useEffect(() => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(count);
  }, [items]);

  const navItems = [
    { label: 'home', path: '/', icon: Home },
    { label: 'products', path: '/products', icon: Sparkles }, 
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Logo />
 

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md justify-center">
            <SearchBar />
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <button
              onClick={() => setIsLoginOpen(true)}
              className="hidden sm:flex p-2 text-gray-500 cursor-pointer hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
            >
              <User className="w-6 h-6" />
            </button>

            <CartDrawer />

            <MobileMenu
              isOpen={isMenuOpen}
              onOpenChange={setIsMenuOpen}
              isRtl={isRtl}
              navItems={navItems}
              pathname={pathname}
              t={t}
              tAuth={tAuth}
              locale={locale}
              onLoginClick={() => setIsLoginOpen(true)}
            />
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}
