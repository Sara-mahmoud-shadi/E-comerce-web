'use client';

import { useTranslations } from 'next-intl';
import { ShoppingCart, Star, RefreshCcw, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/products/ProductCard';

const PRODUCTS = [
  {
    id: 1,
    name: 'Artisan Plate',
    price: 45.00,
    discountPrice: 39.00,
    category: 'serving',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    rating: 4.8,
    reviews: 88,
    badge: 'luxury',
    asset: 'Ceramic Pro',
    assetImg: 'https://images.unsplash.com/photo-1594913785162-e6785b42fbb1?w=200&q=80'
  },
  {
    id: 2,
    name: 'Espresso Master',
    price: 899.00,
    category: 'electrical',
    image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&q=80',
    rating: 4.9,
    reviews: 210,
    badge: 'premium',
    asset: 'Steam X-200',
    assetImg: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&q=80'
  },
  {
    id: 3,
    name: 'Copper Set',
    price: 350.00,
    discountPrice: 299.00,
    category: 'cooking',
    image: 'https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=800&q=80',
    rating: 5.0,
    reviews: 145,
    badge: 'premium',
    asset: 'HeatFlow v3',
    assetImg: 'https://images.unsplash.com/photo-1584990344321-27662ef2049e?w=200&q=80'
  },
  {
    id: 4,
    name: 'Chef Knife',
    price: 120.00,
    category: 'cooking',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80',
    rating: 4.7,
    reviews: 92,
    badge: 'luxury',
    asset: 'Edge Elite',
    assetImg: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80'
  },
];

export default function ProductsContent() {
  const t = useTranslations('Products');
  const tc = useTranslations('Categories');
  const tp = useTranslations('PriceRange');

  return (
    <div className="min-h-screen py-10 px-4 container mx-auto">

      {/* Top Navigation Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#081640] rounded-[2.5rem] p-8 mb-12 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-white/5"
      >
        <div className="flex items-center gap-6">
          <div className="text-right md:text-left">
            <h2 className="text-3xl font-black tracking-tighter uppercase text-gray-900 dark:text-white leading-none mb-1">{t('masterSelection')}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{t('selectionSubtitle')}</p>
          </div>
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xl shadow-inner">
            {PRODUCTS.length}
          </div>
        </div>
         
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#081640] rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl sticky top-24"
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-lg font-black uppercase tracking-tighter text-gray-900 dark:text-white">{t('filters')}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{t('refineResults')}</p>
              </div>
              <motion.button
                whileTap={{ rotate: 180 }}
                onClick={() => window.location.reload()}
                className="p-3 hover:bg-blue-500/10 rounded-2xl transition-colors group/refresh"
              >
                <RefreshCcw className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
              </motion.button>
            </div>

            <div className="space-y-10">
              {/* Rating Filter */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{t('ratingTitle')}</span>
                </div>
                <div className="space-y-4 px-1">
                  {[5, 4, 3].map(rating => (
                    <label key={rating} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{t('upAnd')}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-gray-200 dark:text-gray-800'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <input type="checkbox" value={rating} className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="absolute inset-0 border-2 border-gray-100 dark:border-white/5 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-500/5 transition-all duration-300" />
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-300" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-white/5 mx-2" />

              {/* Category Filter */}
              <div className="space-y-6">
                <div className="flex gap-3 items-center group cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{t('categoryTitle')}</span>
                </div>
                <div className="space-y-4 px-1">
                  {['luxurySets', 'premiumTools', 'eliteServing', 'economySeries'].map(cat => (
                    <label key={cat} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tc(cat)}</span>
                      </div>
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <input type="checkbox" value={cat} className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="absolute inset-0 border-2 border-gray-100 dark:border-white/5 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-500/5 transition-all duration-300" />
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-300" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-white/5 mx-2" />

              {/* Price Filter */}
              <div className="space-y-6">
                <div className="flex gap-3 items-center group cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{t('priceRangeTitle')}</span>
                </div>
                <div className="space-y-4 px-1">
                  {['under50', '50-200', '200-500', 'over500'].map(range => (
                    <label key={range} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tp(range)}</span>
                      </div>
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <input type="checkbox" value={range} className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="absolute inset-0 border-2 border-gray-100 dark:border-white/5 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-500/5 transition-all duration-300" />
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-300" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </aside>

        {/* Main Grid Area */}
        <div className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          
          {/* Pagination Placeholder */}
          <div className="mt-20 flex justify-center items-center gap-4">
             <button className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl">
               Load More Products
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
