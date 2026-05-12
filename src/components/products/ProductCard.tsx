'use client';

import { useTranslations } from 'next-intl';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';

interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating: number;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const t = useTranslations('Products');
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-black rounded-[3rem] overflow-hidden shadow-2xl relative h-[500px]"
    >
      {/* Product Image Background */}
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1000ms]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Overlay Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        {/* Top Tool Section */}
        <div className="flex justify-between items-start">
          <Link 
            href={`/products/${product.id}`} 
            className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-accent-500 hover:text-black transition-all"
          >
            <Eye className="w-5 h-5" />
          </Link>

          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20">
            <div className="flex items-center gap-1">
              <span className="text-white text-[10px] font-black">{product.rating}</span>
              <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-3 h-3", i < Math.floor(product.rating) ? "fill-current" : "")} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Centered Identity Overlay */}
        <div className="flex flex-col justify-center items-center text-center">
          <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 group-hover:scale-110 transition-transform duration-700">
            {product.name}
          </h3>
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">{t('basePrice')}</p>
            <div className="flex flex-col">
              {product.discountPrice ? (
                <>
                  <p className="text-2xl font-black text-accent-500 tracking-tighter leading-none">
                    {t('price', { price: product.discountPrice.toFixed(2) })}
                  </p>
                  <p className="text-[10px] font-bold text-white/40 line-through tracking-tighter mt-1">
                    {t('price', { price: product.price.toFixed(2) })}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-black text-white tracking-tighter">
                  {t('price', { price: product.price.toFixed(2) })}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-white text-black px-6 py-4 cursor-pointer rounded-full flex items-center gap-3 hover:bg-accent-500 transition-all group/btn active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
