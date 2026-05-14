'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { ShoppingBag, Star, ChevronLeft, ChevronRight, Maximize2, Minus, Plus, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ShopBreadcrumb } from '../shared/ShopBreadcrumb';

const PRODUCTS = [
  {
    id: 1,
    name: 'Artisan Plate',
    price: 45.00,
    discountPrice: 39.00,
    inStock: true,
    category: 'cooking',
    description: 'Elevate your dining experience with our hand-glazed Artisan Plate. Each piece is unique, featuring subtle variations in texture and color that reflect its handcrafted origin. Perfect for both everyday use and special occasions.',
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
      'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800&q=80',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80',
      'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800&q=80',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80',
      'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800&q=80',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80',
      'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800&q=80',
    ],
    rating: 4.8,
    reviews: 88,
    badge: 'luxury',
    type: 'Ceramic Pro'
  },
  {
    id: 2,
    name: 'Espresso Master',
    price: 899.00,
    inStock: false,
    category: 'electrical',
    description: 'The ultimate espresso machine for coffee connoisseurs. Features precision temperature control, a professional-grade steam wand, and a high-pressure pump to deliver café-quality espresso in the comfort of your home.',
    images: [
      'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
      'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=800&q=80'
    ],
    rating: 4.9,
    reviews: 210,
    badge: 'premium',
    type: 'Steam X-200'
  },
  {
    id: 3,
    name: 'Copper Set',
    price: 350.00,
    inStock: true,
    discountPrice: 299.00,
    category: 'cooking',
    description: 'Professional-grade copper cookware set. Copper provides superior heat conductivity for precise temperature control, while the stainless steel lining ensures durability and ease of cleaning. A must-have for any serious chef.',
    images: [
      'https://images.unsplash.com/photo-1584990344321-27662ef2049e?w=800&q=80',
      'https://images.unsplash.com/photo-1594913785162-e6785b42fbb1?w=200&q=80',
      'https://images.unsplash.com/photo-1584990344321-27662ef2049e?w=800&q=80'
    ],
    rating: 5.0,
    reviews: 145,
    badge: 'premium',
    type: 'HeatFlow v3'
  },
  {
    id: 4,
    name: 'Chef Knife',
    price: 120.00,
    inStock: true,
    category: 'cooking',
    description: 'Expertly balanced and razor-sharp, this professional chef knife is forged from high-carbon Japanese steel. The ergonomic handle provides a comfortable grip for effortless slicing, dicing, and chopping.',
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80',
      'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=800&q=80',
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80'
    ],
    rating: 4.7,
    reviews: 92,
    badge: 'luxury',
    type: 'Edge Elite'
  },
];

export default function ProductDetailsContent() {
  const { id } = useParams();
  const t = useTranslations('Products');
  const tn = useTranslations('Navigation');
  const { addItem, updateQuantity, items } = useCartStore();

  const product = PRODUCTS.find(p => p.id === Number(id)) || PRODUCTS[0];
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const nextImage = () => setActiveImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  const syncQuantity = (newQty: number) => {
    const qty = Math.max(1, newQty);
    setQuantity(qty);
    
    // If the product is already in the cart, update its quantity there too
    // const isInCart = items.some(item => item.id === product.id);
    // if (isInCart) {
    //   updateQuantity(product.id, qty);
    // }
  };

  const handleAddToCart = (customProduct?: any, customQuantity?: number) => {
    // Check if called via event handler (first arg would be an event object)
    const isEvent = customProduct && 'nativeEvent' in customProduct;
    const p = !isEvent && customProduct ? customProduct : product;
    const q = typeof customQuantity === 'number' ? customQuantity : quantity;

    addItem({
      ...p,
      image: p.images[0], // Adapt to CartItem interface
      quantity: q
    }, q);
  };

  const breadcrumbSteps = [
    { label: tn('products'), href: '/products' },
    { label: product.name }
  ];

  return (
    <section className="bg-linear-to-br to-white from-[#f1f4f1]">
      <div className="min-h-screen py-12 px-4 max-w-7xl mt-6 mx-auto ">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ShopBreadcrumb items={breadcrumbSteps} />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Modern Image Gallery Section */}
          <div className="w-full lg:w-1/2 space-y-10">
            <div className="relative group">
              {/* Architectural Stage Background */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 rounded-[5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              <div className="relative aspect-[4/5] w-full rounded-[2rem] h-[500px] overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none transition-all duration-700 group-hover:shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[activeImage]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button
                    onClick={prevImage}
                    className="w-16 h-16 rounded-full cursor-pointer bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-2xl"
                  >
                    <ChevronLeft className="w-7 h-7 rtl:rotate-180 ltr:rotate-0" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="w-16 h-16 rounded-full cursor-pointer bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-2xl"
                  >
                    <ChevronRight className="w-7 h-7 rtl:rotate-180 ltr:rotate-0" />
                  </button>
                </div>

                <div className="absolute top-8 right-8 flex gap-3">
                  <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Modern Progress Indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        activeImage === idx ? "w-8 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" : "w-1.5 bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Staggered Interactive Thumbnails */}
            <div className="flex gap-5 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth px-2">
              {product.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative min-w-[130px] cursor-pointer aspect-square rounded-[2.5rem] overflow-hidden transition-all duration-700 border-2",
                    activeImage === idx
                      ? "border-accent-500 ring-8 ring-accent-500/10 shadow-2xl z-10"
                      : "border-transparent opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                  )}
                >
                  <Image src={img} alt={product.name} fill className="object-cover" />
                  {activeImage === idx && (
                    <div className="absolute inset-0 bg-accent-500/10 backdrop-blur-[2px]" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Side: Product Details */}

          <div className="space-y-6 w-full lg:w-1/2 flex flex-col items-around">
            <div className="p-6 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
              {/* Title & Category */}
              <div className="space-y-1">
                <div className='flex items-center gap-2'>

                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                    {product.name}
                  </h1>
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                    product.inStock
                      ? "bg-accent-500 text-white"
                      : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                  )}>
                    {product.inStock ? t('inStock') : t('outOfStock')}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  {product.category}
                </p>

              </div>


              {/* Pricing Section */}
              <div className="space-y-1 mt-3">
                {product.discountPrice && (
                  <p className="text-lg font-medium text-gray-300 dark:text-gray-600 line-through tracking-tight">
                    {t('price', { price: product.price.toFixed(2) })}
                  </p>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-bold text-[#F5A623] tracking-tight">
                    {t('price', { price: (product.discountPrice || product.price).toFixed(2) })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-100 dark:border-white/10 py-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
                  {product.description}
                </p>

              </div>

              {/* Selectors */}
              <div className="flex flex-col items-center gap-4 border-t mb-4 border-gray-100 dark:border-white/10 pt-6">

                <div className="flex items-center justify-between w-[200px] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-6 py-1">
                  <button
                    onClick={() => syncQuantity(quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#FF4F2D] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold w-12 text-center text-gray-600 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => syncQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#FF4F2D] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 border-t border-gray-100 dark:border-white/10 pt-6">
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={cn(
                      "flex-grow h-14 rounded-full text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98]",
                      product.inStock
                        ? "bg-accent-500 cursor-pointer hover:bg-accent-600 text-white shadow-accent-500/20"
                        : "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed shadow-none"
                    )}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {t('addToCart')}
                  </button>
                </div>


              </div>

            </div>


          </div>
        </div>
      </div> 
    </section>
  );
}
