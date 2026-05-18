'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingCart, Zap, X } from 'lucide-react';
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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const subtotal = getTotalPrice();
  console.log(items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  if (!isHydrated) return null;

  const direction = locale === 'ar' ? 'right' : 'left';

  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>
        <button className="relative cursor-pointer p-2 rounded-full !m-0 hover:bg-black/5 dark:hover:bg-white/10 transition group">
          <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent-500 rounded-full border-2 border-white dark:border-black"
            >
              {itemCount}
            </motion.span>
          )}
        </button>
      </DrawerTrigger>

      <DrawerContent className="h-full !w-full lg:!max-w-xl bg-white dark:bg-[#050b2e] border-white/10 backdrop-blur-3xl">
        <div className="flex flex-col h-full w-full">
          <DrawerHeader className="p-8 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl text-primary-500 font-black tracking-tighter flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-accent-500" />
                {t('title')}
              </DrawerTitle>
              <div className="flex items-center gap-4">
                <div className="bg-accent-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent-500/20">
                  {itemCount} {itemCount === 1 ? t('item') : t('items')}
                </div>
                <DrawerClose asChild>
                  <button className="p-2 hover:bg-black/5 cursor-pointer dark:hover:bg-white/10 rounded-full transition-colors group/close">
                    <X className="w-6 h-6 text-gray-400 group-hover/close:text-gray-900 dark:group-hover/close:text-white transition-colors" />
                  </button>
                </DrawerClose>
              </div>
            </div>
            <div className="sr-only">
              <DrawerDescription>Manage your shopping bag contents and proceed to checkout.</DrawerDescription>
            </div>
          </DrawerHeader>


          {/* Scrollable Items Area */}
          <div className="flex-grow overflow-y-auto px-8 py-6 space-y-6 scrollbar-hide">
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
                    className="group relative flex items-center gap-6 bg-gray-50 dark:bg-white/5 p-5 rounded-lg border border-transparent hover:border-accent-500/20 transition-all shadow-sm"
                  >
                    <div className="relative w-24 h-24 shrink-0 rounded-[1.5rem] overflow-hidden bg-black/5 dark:bg-black/40 shadow-sm">
                      <Image
                        src={getImageUrl(item?.images?.[0])}
                        alt={item?.name || 'Product image'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <div className="flex-grow space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-sm uppercase tracking-tight text-gray-900 dark:text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-white dark:bg-black/40 p-1.5 rounded-full border border-gray-100 dark:border-white/10 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center font-black text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="font-black text-accent-500 text-lg tracking-tighter">
                          {tp('price', { price: (item?.price_discount || item?.price) * item.quantity ||0})}
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
            <DrawerFooter className="p-8 space-y-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 rounded-t-[3rem]">

              <div className="space-y-6 w-full">
                <Link href="/checkout" className="block text-center w-full  py-5 bg-accent-500 text-white font-black tracking-[0.3em] rounded-md hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-accent-500/30 group">
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
