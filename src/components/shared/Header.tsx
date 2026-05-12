'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ShoppingCart, Menu, Search, User } from 'lucide-react'; 
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
    <header className="fixed top-0 left-0 w-full z-50  bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-slate-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href="/" className="text-xl font-black tracking-tighter text-primary-600 dark:text-primary-400">
              E-comerce
            </Link>
          </div>

          <div className="hidden md:flex flex-grow justify-center max-w-md mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1 sm:gap-4  space-x-2 sm:space-x-4">
            <LanguageSwitcher />

            {/* <Link href="/orders" className="hidden md:block text-sm font-bold hover:text-primary-600 transition">
              {t('orders')}
            </Link> */}

            <CartDrawer />

            <button 
              onClick={() => setIsLoginOpen(true)}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 !m-0 text-gray-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110 active:scale-95"
            >
              <User className="w-5 h-5" />
            </button>

            <button className="md:hidden p-2">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}
