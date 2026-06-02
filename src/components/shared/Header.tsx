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
              className="hidden hover:bg-black/5 hover:scale-110  transition rounded-full  -mr-2   sm:flex p-2 text-gray-500 cursor-pointer hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
            >
              {/* <User className="w-6 h-6" /> */}
              <svg
                fill="#226a19"
                width="25px"
                height="25px"
                viewBox="0 -6.02 102.012 102.012"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M410.118,483.8c-1.7-.055-3.408-.238-5.1-.463a2.283,2.283,0,0,1-2.022-2.29c-.021-3.014.078-6.031.131-9.045,1.117-4.532,3.223-8.411,7.17-11.133a56.325,56.325,0,0,1,11.479-5.961c3.178-1.25,6.352-2.512,9.536-3.746a2.584,2.584,0,0,0,1.861-2.471c.114-2.914.276-5.832-.695-8.658-.582-1.709-1.266-3.39-1.73-5.131a3.788,3.788,0,0,0-2.522-3.019,4.546,4.546,0,0,1-2.556-2.832c-.438-1.123-.983-2.211-1.317-3.364a11.359,11.359,0,0,1-.019-6.251,4.625,4.625,0,0,1,3.29-3.622A1.468,1.468,0,0,0,428.9,414.4a27.1,27.1,0,0,1,6.084-14.207,16.2,16.2,0,0,1,14.286-6.283,15.283,15.283,0,0,1,6.308,1.893,9.915,9.915,0,0,1,3.76,3.824,26.238,26.238,0,0,1,3.505,11.113,34.9,34.9,0,0,0,.527,3.877,2.67,2.67,0,0,0,.727,1.254,4,4,0,0,1,1.138,3.01c-.006,1.509.115,3.02.049,4.524-.124,2.831-1.329,4.975-4.1,6.057a1.815,1.815,0,0,0-.779.826,5.835,5.835,0,0,0-.521,1.41,25.7,25.7,0,0,1-5.438,10.324,6.69,6.69,0,0,0-1.345,5.62,6.472,6.472,0,0,0,2.819,4.469,17.768,17.768,0,0,0,3.388,1.946c1.943.8,3.973,1.4,5.955,2.121,2.357.853,4.777,1.589,7.039,2.654a15.3,15.3,0,0,1,6.947,6.057,23.36,23.36,0,0,1,3.467,11.711c.025,2.711-1.182,4.062-3.942,4.146-.28.008-.56,0-.841,0a11.913,11.913,0,0,0-1.268.025c-3.5.321-7,.669-10.5,1.006-.4.041-.8.114-1.2.145-2.807.205-5.612.472-8.422.594-8.035.347-16.065.834-24.117.863-5.024.019-10.047.291-14.887.441-1.569,0-3.07.022-4.542.022C412.033,483.844,411.075,483.835,410.118,483.8Z"
                  transform="translate(-402.994 -393.867)"
                />
              </svg>
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
