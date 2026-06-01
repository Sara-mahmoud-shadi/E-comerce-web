'use client';
import { apiFetch } from '@/lib/api';

import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { ShoppingBag, Star, ChevronLeft, ChevronRight, Maximize2, Minus, Plus, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react'; 
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore'; 
import { ShopBreadcrumb } from '../shared/ShopBreadcrumb';
import { Product } from './ProductCard';  
import LoaderIcon from '../shared/LoaderIcon';
export default function ProductDetailsContent() {
  const { id } = useParams();
  const t = useTranslations('Products');
  const tn = useTranslations('Navigation');
  const { addItem, items } = useCartStore();
 const locale = useLocale();
  const isRtl = locale === 'ar';
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const getImageUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80';
    return url.replace(/^https?:\/\/(localhost|192\.168\.0\.195):\d+/, '');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? '/api/').replace(/\/?$/, '/');
        const res = await apiFetch(`${apiBase}products/${id}`);
        if (res.ok) {
          const resData = await res.json();
          if (resData) {
            // Assume the API returns the product directly, or wrapped in a data object
            setProduct(resData.data || resData);
          }
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const nextImage = () => {
    if (!product?.images) return;
    setActiveImage((prev) => (prev + 1) % product.images.length);
  };
  const prevImage = () => {
    if (!product?.images) return;
    setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const syncQuantity = (newQty: number) => {
    const qty = Math.max(1, newQty);
    setQuantity(qty);
     
  };

  const handleAddToCart = (customProduct?: any, customQuantity?: number) => {
    if (!product) return;
    const isEvent = customProduct && typeof customProduct.preventDefault === 'function';
    const p = (!customProduct || isEvent) ? product : customProduct;
    const q = typeof customQuantity === 'number' ? customQuantity : quantity;
    console.log(p)
    addItem({
     ...p,
      quantity: q
    }, q);
  };

  const breadcrumbSteps = product ? [
    { label: tn('products'), href: '/products' },
    { label:  isRtl ? product.name_ar : product.name_en }
  ] : [];

  if (isLoading || !product) {
    return (
      <LoaderIcon/>
    );
  }

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
                      src={getImageUrl(product.images?.[activeImage] || '')}
                      alt={product.name_en}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                      className="object-contain transition-transform duration-[3000ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between items-center duration-500">
                  <button
                    onClick={prevImage}
                    className="w-14 h-14 rounded-full cursor-pointer bg-primary-500 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white hover:bg-primary-500/80 hover:text-white transition-all shadow-2xl"
                  >
                    <ChevronLeft className="w-7 h-7 rtl:rotate-180 ltr:rotate-0" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="w-14 h-14 rounded-full cursor-pointer bg-primary-500 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white hover:bg-primary-500/80 hover:text-white transition-all shadow-2xl"
                  >
                    <ChevronRight className="w-7 h-7 rtl:rotate-180 ltr:rotate-0" />
                  </button>
                </div>
 

                {/* Modern Progress Indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        activeImage === idx ? "w-8 bg-primary-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" : "w-1.5 bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Staggered Interactive Thumbnails */}
            <div className="flex gap-5 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth px-2">
              {product.images.map((img, idx: number) => (
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
                      ? "border-accent-500 ring-8 ring-accent-500/10 shadow-md z-10"
                      : "border border-gray-200  hover:opacity-100 grayscale hover:grayscale-0"
                  )}
                >
                  <Image src={getImageUrl(img || '')} alt={product.name_en} fill sizes="130px" className="object-cover" />
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
                <div className='flex items-center flex-wrap gap-2'> 
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                     {isRtl ? product.name_ar : product.name_en}
                  </h1>
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-sm",
                    product.instock
                      ? "bg-accent-500 text-white"
                      : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                  )}>
                    {product.instock ? t('inStock') : t('outOfStock')}
                  </span>
                <p className="text-[10px] font-black shadow-sm text-primary-500 bg-primary-500/10 inline-block px-3 py-1.5 rounded-full tracking-wider">
                  {isRtl? product.category.name_ar : product.category.name_en}
                </p>
                </div> 
              </div>


              {/* Pricing Section */}
              <div className="space-y-1 mt-3">
                {product.price_discount && (
                  <p className="text-lg font-medium text-gray-300 dark:text-gray-600 line-through tracking-tight">
                    {t('price', { price: product.price })}
                  </p>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-bold text-[#F5A623] tracking-tight">
                    {t('price', { price: (product.price_discount || product.price) })}
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
              <div className="flex  lg:flex-row flex-col items-center gap-4 border-t mb-4 border-gray-100 dark:border-white/10 pt-6">

                <div className="flex items-center justify-between w-[200px] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-6 py-1">
                  <button
                    onClick={() => syncQuantity(quantity - 1)}
                    className="w-8 h-8 cursor-pointer flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold w-12 text-center text-gray-600 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => syncQuantity(quantity + 1)}
                    className="w-8 h-8 cursor-pointer flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                  <div className="flex w-full gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.instock}
                    className={cn(
                      "flex-grow p-3 rounded-full text-sm font-bold tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98]",
                      product.instock
                        ? "bg-primary-500 cursor-pointer hover:bg-accent-600 text-white shadow-accent-500/20"
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
