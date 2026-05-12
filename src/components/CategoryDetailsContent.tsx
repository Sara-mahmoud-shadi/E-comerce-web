'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { ShoppingBag, Star, RefreshCcw, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing'; 
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductCard } from './products/ProductCard';

const CATEGORY_META = {
  serving: {
    name: 'Serving & Hospitality',
    description: 'Elevate every meal with our artisanal serving collection. From hand-glazed plates to sculptural platters.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80'
  },
  electrical: {
    name: 'Electrical Equipment',
    description: 'Professional-grade appliances designed for precision, reliability, and modern kitchen aesthetics.',
    image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=1600&q=80'
  },
  cooking: {
    name: 'Cooking Tools',
    description: 'The foundation of every great dish. Explore our range of high-performance cookware and chef tools.',
    image: 'https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=1600&q=80'
  },
  coffee: {
    name: 'Coffee Section',
    description: 'Artisan brewing equipment for the perfect cup. From precision grinders to designer espresso machines.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80'
  }
};

const PRODUCTS = [
  {
    id: 1,
    name: 'Artisan Plate',
    price: 45.00,
    discountPrice: 39.00,
    category: 'serving',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80',
    rating: 4.8,
    badge: 'luxury'
  },
  {
    id: 2,
    name: 'Espresso Master',
    price: 899.00,
    category: 'electrical',
    image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&q=80',
    rating: 4.9,
    badge: 'premium'
  },
  {
    id: 3,
    name: 'Copper Set',
    price: 350.00,
    discountPrice: 299.00,
    category: 'cooking',
    image: 'https://images.unsplash.com/photo-1584990344321-27662ef2049e?w=800&q=80',
    rating: 5.0,
    badge: 'premium'
  },
  {
    id: 4,
    name: 'Chef Knife',
    price: 120.00,
    category: 'cooking',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80',
    rating: 4.7,
    badge: 'luxury'
  },
];

export default function CategoryDetailsContent() {
  const { slug } = useParams();
  const t = useTranslations('Products');
  const tc = useTranslations('Categories');
  const tn = useTranslations('Navigation');
  const tp = useTranslations('PriceRange');
  
  const category = CATEGORY_META[slug as keyof typeof CATEGORY_META] || CATEGORY_META.serving;
  const filteredProducts = PRODUCTS.filter(p => p.category === slug);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#081640]">
      
      {/* Magazine Editorial Header */}
      <header className="relative pt-20 pb-40 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none overflow-hidden select-none whitespace-nowrap">
          <span className="text-[20vw] font-black text-black/5 dark:text-white/5 uppercase leading-none">
            {tc(slug as string)}
          </span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Breadcrumb className="mb-10">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href="/" className="font-bold uppercase text-[10px] tracking-[0.2em]">{tn('home')}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-black uppercase text-[10px] tracking-[0.2em] text-accent-500">{tc(slug as string)}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <h1 className="text-8xl md:text-9xl px-8 font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-[0.8] mb-8">
                  {tc(slug as string).split(' ').map((word: string, i: number) => (
                    <span key={i} className={cn("block", i === 1 ? "text-accent-500 ml-12" : "")}>
                      {word}
                    </span>
                  ))}
                </h1>
              </motion.div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative aspect-square w-full max-w-[500px] mx-auto group"
              >
                <div className="absolute inset-0 border-4 border-accent-500 rounded-[4rem] translate-x-6 translate-y-6 -z-10 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-700" />
                <div className="relative h-full w-full rounded-[3.5rem] overflow-hidden shadow-2xl">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-10 -left-10 bg-white dark:bg-[#0c1e50] p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 flex items-center gap-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-accent-500 flex items-center justify-center text-black">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="block text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{filteredProducts.length}</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('masterSelection')}</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Restructured to match Product Page (Sidebar + Grid) */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-40">
         
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar (from Product Page) */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="bg-white dark:bg-[#081640] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div className="text-center">
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">{t('filters')}</h4>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">{t('refineResults')}</p>
                </div>
                <motion.button
                  whileTap={{ rotate: 180 }}
                  onClick={() => window.location.reload()}
                  className="p-2 hover:bg-accent-500/10 rounded-xl transition-colors group/refresh"
                >
                  <RefreshCcw className="w-5 h-5 text-gray-500 group-hover:text-accent-500 transition-colors" />
                </motion.button>
              </div>

              <div className="space-y-8">
                {/* Rating Filter */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <Star className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{t('ratingTitle')}</span>
                  </div>
                  <div className="space-y-4">
                    {[5, 4, 3].map(rating => (
                      <label key={rating} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">{t('upAnd')}</span>
                            <span className="text-[9px] font-black text-accent-500/40">(15)</span>
                          </div>
                          <div className="flex text-orange-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-current' : ''}`} />
                            ))}
                          </div>
                        </div>
                        <div className="relative w-5 h-5 flex items-center justify-center">
                          <input type="checkbox" value={rating} className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                          <div className="absolute inset-0 border border-gray-200 dark:border-white/10 rounded-md peer-checked:border-accent-500 transition-all duration-300" />
                          <div className="w-2.5 h-2.5 bg-accent-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-300" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/5" />

                {/* Price Filter */}
                <div className="space-y-6">
                  <div className="flex gap-2 items-center group cursor-pointer">
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{t('priceRangeTitle')}</span>
                  </div>
                  <div className="space-y-4">
                    {['under50', '50-200', '200-500', 'over500'].map(range => (
                      <label key={range} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">{tp(range)}</span>
                          <span className="text-[9px] font-black text-accent-500/40">(8)</span>
                        </div>
                        <div className="relative w-5 h-5 flex items-center justify-center">
                          <input type="checkbox" value={range} className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                          <div className="absolute inset-0 border border-gray-200 dark:border-white/10 rounded-md peer-checked:border-accent-500 transition-all duration-300" />
                          <div className="w-2.5 h-2.5 bg-accent-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-300" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/5" />
 
              </div>
            </div>
          </aside>

          {/* Main Grid Area (from Product Page) */}
          <div className="flex-grow space-y-12">
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
 
          </div>
        </div>
      </div>
    </div>
  );
}
