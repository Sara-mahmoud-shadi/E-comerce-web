'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ShoppingBag, Menu, Search, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { CartDrawer } from './CartDrawer';
import LanguageSwitcher from './LanguageSwitcher';
import LoginModal from '../auth/LoginModal';

export default function Header() {
  const t = useTranslations('Navigation');
  const items = useCartStore((state) => state.items);
  const [cartCount, setCartCount] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Handle hydration: only show count after client-side mount
  useEffect(() => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(count);
  }, [items]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
            <Link href="/" dir="ltr" className="flex items-center gap-2 text-4xl font-black tracking-tight text-primary-500">
              <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500 dark:text-primary-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span>Go<span className="text-2xl text-black dark:text-white">Shop</span></span>
            </Link> 

          <nav className="hidden lg:flex w-full justify-center items-center gap-8">
            <SearchBar />
          </nav>

          <div className="flex items-center gap-1">

            <LanguageSwitcher />

            <button
              onClick={() => setIsLoginOpen(true)}
              className="p-2 text-gray-500 cursor-pointer hover:text-primary-500 transition-colors"
            >
              <User className="w-6 h-6" />
            </button>

            <CartDrawer />

            <button className="lg:hidden p-2 text-gray-900">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}
