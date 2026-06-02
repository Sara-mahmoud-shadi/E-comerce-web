'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ShoppingBag, Trash2, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';
import { Link } from '@/i18n/routing';
import { getImageUrl } from '../products/ProductCard';

export function CartDrawer() {
  const t = useTranslations('Cart');
  const tp = useTranslations('Products');
  const locale = useLocale();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const isRtl = locale === 'ar';

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = getTotalPrice();

  if (!isHydrated) return null;

  const direction = locale === 'ar' ? 'right' : 'left';

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={direction}>
      <DrawerTrigger asChild>
        <button className="relative cursor-pointer p-2 rounded-full !m-0 hover:bg-black/5 hover:scale-110 dark:hover:bg-white/10 transition group">
           <svg
            width={25}
            height={25}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.83179 4.38657H3.34341C4.20256 4.38657 4.96125 4.94691 5.21392 5.76808L8.27786 15.7259C8.53053 16.547 9.28921 17.1074 10.1484 17.1074H17.1114C17.9373 17.1074 18.6743 16.5889 18.9534 15.8116L20.9925 10.1312C21.679 8.21867 20.2616 6.20383 18.2295 6.20383H10.66"
              stroke="#226a19"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <circle
              cx="10.1707"
              cy="20.5322"
              r="1.46779"
              fill="#226a19"
            />
            <circle
              cx="17.0204"
              cy="20.5322"
              r="1.46779"
              fill="#226a19"
            />
          </svg>
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-500 rounded-full border-2 border-white dark:border-black"
            >
              {itemCount}
            </motion.span>
          )}
        </button>
      </DrawerTrigger>

      <DrawerContent className="h-full !w-full sm:!max-w-md md:!max-w-lg lg:!max-w-xl overflow-hidden bg-white dark:bg-[#050b2e] border-white/10 backdrop-blur-3xl">
        <div className="flex flex-col h-full w-full">
          <DrawerHeader className="p-4 sm:p-6 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg sm:text-xl md:text-2xl text-primary-500 font-black tracking-tighter flex items-center gap-1.5 sm:gap-3">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-accent-500" />
                {t('title')}
              </DrawerTitle>
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="bg-accent-500 text-white px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent-500/20">
                  {itemCount} {itemCount === 1 ? t('item') : t('items')}
                </div>
                <DrawerClose asChild>
                  <button className="p-1 sm:p-1.5 hover:bg-black/5 cursor-pointer dark:hover:bg-white/10 rounded-full transition-colors group/close">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400 group-hover/close:text-gray-900 dark:group-hover/close:text-white transition-colors" />
                  </button>
                </DrawerClose>
              </div>
            </div>
            <div className="sr-only">
              <DrawerDescription>Manage your shopping bag contents and proceed to checkout.</DrawerDescription>
            </div>
          </DrawerHeader>

          {/* Scrollable Items Area */}
          <div className="flex-grow overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-5 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-20"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <ShoppingBag className="w-20 h-20 text-gray-200 dark:text-white/10 relative z-10" strokeWidth={1} />
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 font-medium max-w-[200px] uppercase text-[10px] tracking-widest">
                    {t('empty')}
                  </p>
                </motion.div>
              ) : (
                items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative flex items-center gap-3 sm:gap-5 bg-gray-50 dark:bg-white/5 p-2.5 sm:p-4 rounded-xl border border-transparent hover:border-accent-500/20 transition-all shadow-sm"
                  >
                    <div className="relative w-16 h-16 min-[380px]:w-20 min-[380px]:h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 shadow-sm">
                      <Image
                        src={getImageUrl(item?.images?.[0])}
                        alt={item?.name_en || 'Product image'}
                        fill
                        sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <div className="flex-grow space-y-1.5 sm:space-y-3 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-black text-xs sm:text-sm uppercase tracking-tight text-gray-900 dark:text-white line-clamp-2">
                          {isRtl ? item.name_ar : item.name_en}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 sm:p-2 text-gray-400 cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-black/40 p-0.5 sm:p-1 rounded-full border border-gray-100 dark:border-white/10 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center cursor-pointer justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <span className="w-5 sm:w-8 text-center font-black text-xs sm:text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center cursor-pointer justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                        <p className="font-black text-accent-500 text-sm min-[380px]:text-base sm:text-lg tracking-tighter shrink-0">
                          {tp('price', { price: (item?.price_discount || item?.price) * item.quantity || 0 })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <DrawerFooter className="p-4 sm:p-6 pb-6 sm:pb-8 space-y-4 sm:space-y-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 rounded-t-[1.75rem] sm:rounded-t-[2.5rem]">
              <div className="flex items-center justify-between w-full px-2">
                <span className="text-xs sm:text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('subtotal')}</span>
                <span className="text-lg sm:text-xl md:text-2xl font-black text-accent-500 tracking-tighter">
                  {tp('price', { price: subtotal })}
                </span>
              </div>
              <div className="space-y-4 w-full">
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block text-center w-full py-3 sm:py-4 bg-primary-500 text-white font-black rounded-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-accent-500/30 group",
                    isRtl ? "tracking-normal" : "tracking-[0.2em] sm:tracking-[0.3em]"
                  )}
                >
                  {t('checkout')}
                </Link>
              </div>
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

