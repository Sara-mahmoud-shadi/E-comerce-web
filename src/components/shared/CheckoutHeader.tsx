'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShopBreadcrumb } from './ShopBreadcrumb';

interface CheckoutHeaderProps {
  title: string;
  subtitle: string;
  itemCount: number;
}

export function CheckoutHeader({ title, subtitle, itemCount }: CheckoutHeaderProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const tc = useTranslations('Cart');

  return (
    <header className="relative pt-32 pb-20 overflow-hidden min-h-[500px] bg-gradient-to-b from-[#f3f7f2] via-[#e8efe7] to-white dark:from-[#111c12] dark:via-[#19241b] dark:to-[#080808]">
      {/* Soft Background Accent Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex flex-col justify-center gap-6 max-w-3xl">

            {/* Centered Content (Metadata & Titles) */}
            <div className="w-full flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 flex flex-col"
              >
                {/* Shop Breadcrumb */}
                <ShopBreadcrumb
                  items={[{ label: title }]}
                  className="justify-center"
                />

                {/* Subtitle Badge Row */}
                <div className="flex flex-wrap gap-3">
                  <span className="bg-primary-600 text-white font-extrabold tracking-widest text-[10px] px-3.5 py-1.5 rounded-full shadow-sm uppercase">
                    {isRtl ? 'إتمام الدفع الآمن' : 'SECURE CHECKOUT'}
                  </span>
                  <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-primary-600 dark:text-primary-400 border border-primary-500/10 font-bold text-[10px] px-3.5 py-1.5 rounded-full shadow-sm animate-pulse">
                    {itemCount} {itemCount === 1 ? tc('item') : tc('items')}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight uppercase">
                  {title}
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-xl">
                  {subtitle}
                </p>
              </motion.div>
            </div>

          </div>
          {/* Right Content (Modern 3D Interactive Framed Image Collage) */}
          <div className="flex-1 max-w-2xl text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
              animate={{ opacity: 1, scale: 1, rotate: isRtl ? -3 : 3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] group select-none cursor-pointer"
            >
              {/* Glowing Background Accent */}
              <div className="absolute inset-0 bg-primary-500/20 rounded-[2.5rem] blur-xl group-hover:scale-105 transition-transform duration-500 animate-pulse" />

              {/* Elegant White Outer Container with Glassmorphism */}
              <div className="absolute inset-0 bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden group-hover:rotate-0 transition-transform duration-700">
                <Image
                  src="https://pngimg.com/uploads/shopping_cart/shopping_cart_PNG73.png"
                  alt="allProducts"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  sizes="320px"
                  priority
                />
                {/* Subtle Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
              </div>

              {/* Ornamental Floating Shapes */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent-500 rounded-2xl shadow-lg -rotate-12 animate-float pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 border-4 border-primary-500 rounded-full shadow-lg rotate-45 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
