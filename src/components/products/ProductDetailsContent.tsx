'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { ShoppingBag, Star, Heart, Share2, ShieldCheck, Truck, RefreshCcw, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
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

const PRODUCTS = [
  {
    id: 1,
    name: 'Artisan Plate',
    price: 45.00,
    discountPrice: 39.00,
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
  const addItem = useCartStore((state) => state.addItem);
  
  const product = PRODUCTS.find(p => p.id === Number(id)) || PRODUCTS[0];
  const [activeImage, setActiveImage] = useState(0);

  const nextImage = () => setActiveImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  const handleAddToCart = () => {
    addItem({
      ...product,
      image: product.images[0] // Adapt to CartItem interface
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="font-bold uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors">{tn('home')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/products" className="font-bold uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors">{tn('products')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-black uppercase text-[10px] tracking-widest text-blue-600">{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Modern Image Gallery Section */}
        <div className="w-full lg:w-1/2 space-y-10">
          <div className="relative group">
             {/* Architectural Stage Background */}
             <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 rounded-[5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             
             <div className="relative aspect-[4/5] w-full rounded-[4rem] overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none transition-all duration-700 group-hover:shadow-2xl">
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
                  "relative min-w-[130px] aspect-square rounded-[2.5rem] overflow-hidden transition-all duration-700 border-2",
                  activeImage === idx 
                    ? "border-blue-500 ring-8 ring-blue-500/10 shadow-2xl z-10" 
                    : "border-transparent opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                )}
              >
                <Image src={img} alt={product.name} fill className="object-cover" />
                {activeImage === idx && (
                  <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px]" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-6">
          <div className="space-y-12">
            {/* Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-5 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 rounded-full border border-blue-100 dark:border-blue-500/20">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="px-5 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 rounded-full border border-amber-100 dark:border-amber-500/20">
                    {product.badge}
                  </span>
                )}
              </div>
              <h1 className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
                {product.name}
              </h1>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 bg-white dark:bg-white/5 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-5 h-5", i < Math.floor(product.rating) ? "fill-current" : "text-gray-200 dark:text-gray-800")} />
                    ))}
                  </div>
                  <span className="text-base font-black text-gray-900 dark:text-white">{product.rating}</span>
                  <span className="text-sm font-bold text-gray-400">({product.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="p-10 bg-white dark:bg-[#081640] border border-gray-100 dark:border-white/5 rounded-[3.5rem] relative overflow-hidden group shadow-2xl dark:shadow-none">
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 blur-[100px] group-hover:bg-blue-500/10 transition-colors duration-1000" />
               <div className="relative">
                 <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">{t('basePrice')}</p>
                 <div className="flex items-baseline gap-6">
                   {product.discountPrice ? (
                     <>
                       <span className="text-7xl font-black text-blue-600 tracking-tighter">
                         {t('price', { price: product.discountPrice.toFixed(2) })}
                       </span>
                       <span className="text-3xl font-bold text-gray-300 line-through tracking-tighter decoration-gray-400/30">
                         {t('price', { price: product.price.toFixed(2) })}
                       </span>
                     </>
                   ) : (
                     <span className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter">
                       {t('price', { price: product.price.toFixed(2) })}
                     </span>
                   )}
                 </div>
               </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                 <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-900 dark:text-white">{t('description')}</h4>
               </div>
               <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed font-medium max-w-xl">
                 {product.description}
               </p>
            </div>

            {/* Icons Section */}
            <div className="grid grid-cols-2 gap-6 pb-4">
              <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">2 Year Global Warranty</span>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-grow cursor-pointer py-6 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black uppercase tracking-[0.3em] rounded-3xl flex items-center justify-center gap-6 transition-all group shadow-2xl shadow-blue-500/40 active:scale-[0.98]"
              >
                 <ShoppingBag className="w-7 h-7 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                 {t('addToCart')}
              </button>
              <button className="w-20 cursor-pointer h-20 rounded-3xl border-2 border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500/50 transition-all group active:scale-95">
                <Heart className="w-7 h-7 group-hover:fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
