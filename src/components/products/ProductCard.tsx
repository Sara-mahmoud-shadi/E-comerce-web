'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useCartStore } from '@/store/useCartStore';
import { useEffect } from 'react';

export interface Product {
  id: number;
  slug: string;
  description: string;
  name_en: string;
  name_ar: string;
  price: number;
  price_discount?: number;
  images: string[];
  tax: number;
  category: Category;
  instock?: boolean;
}
interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}
export const getImageUrl = (url?: string) => {
  if (!url) return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop';
  return url.replace(/^https?:\/\/(localhost|192\.168\.0\.195):\d+/, '');
};
export function ProductCard({ product, index }: ProductCardProps) {
  const t = useTranslations('Products');
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const locale = useLocale();
  const isRtl = locale === 'ar';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-black rounded-[1rem] overflow-hidden shadow-2xl relative h-[400px]"
    >
      {/* Product Image Background - Clickable Overlay */}
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-0">
        <Image
          src={getImageUrl(product.images?.[0])}
          alt={product.name_en}
          fill
          className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1000ms]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </Link>

      {/* Overlay Content - Interaction Layer */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-10">
        {/* Top Tool Section */}
        <div className="flex justify-between items-start pointer-events-auto">  </div>

        {/* Centered Identity Overlay */}
        <div className="flex flex-col justify-center items-center text-center">
          <h3 className="text-2xl font-black text-white tracking-tighter text-shadow-2xs mb-2 group-hover:scale-110 transition-transform duration-700">
            {isRtl ? product?.name_ar : product?.name_en}
          </h3>
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex items-center justify-between pointer-events-auto">
          <div>
            <p className="text-[8px] font-black text-white/90 text-shadow-2xs tracking-widest mb-1">{t('basePrice')}</p>
            <div className="flex flex-col">
              {product.price_discount ? (
                <>
                  <p className="text-2xl font-black text-white tracking-tighter leading-none">
                    {t('price', { price: product.price_discount })}
                  </p>
                  <p className="text-[10px] font-bold text-white/60 line-through tracking-tighter mt-1">
                    {t('price', { price: product.price })}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-black text-white tracking-tighter">
                  {t('price', { price: product.price })}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-primary-500 text-white w-10 h-10 cursor-pointer rounded-full flex items-center justify-center gap-3 hover:bg-accent-500 hover:text-white transition-all group/btn active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
