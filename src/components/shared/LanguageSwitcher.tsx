'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // Determine the target language (the one to switch to)
  const targetLocale = locale === 'ar' ? 'en' : 'ar';
  
  const languages = {
    ar: { name: 'العربية', icon: '/ar.png' },
    en: { name: 'English', icon: '/en.png' }
  };

  const handleSwitch = () => {
    startTransition(() => {
      router.replace(pathname, { locale: targetLocale });
    });
  };

  return (
    <div className="flex !m-0 items-center">
      <button
        onClick={handleSwitch}
        disabled={isPending}
        className="group relative p-1 rounded-full !m-0 transition-all duration-500 hover:scale-110 active:scale-95 disabled:opacity-50"
        title={languages[targetLocale].name}
      >
        <div className="relative w-9 h-9 rounded-full overflow-hidden cursor-pointer transition-all duration-500">
          <AnimatePresence mode="wait">
            <motion.div
              key={locale}
              initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 20, scale: 1.2 }}
              transition={{ duration: 0.4, ease: "backOut" }}
              className="w-full h-full relative"
            >
              <Image
                src={languages[targetLocale].icon}
                alt={languages[targetLocale].name}
                fill
                sizes="(max-width: 768px) 32px, 40px"
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Subtle glowing ring */}
        {/* <div className="absolute inset-0 rounded-full bg-primary-500/0 group-hover:bg-primary-500/10 blur-md transition-all duration-500" /> */}
      </button>
    </div>
  );
}
