'use client';

import { apiFetch } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ShieldCheck, MapPin, User, Mail, CheckCircle2, Phone, ShoppingBag, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import DynamicInput from './shared/DynamicInput';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import Image from 'next/image';
import { getImageUrl } from './products/ProductCard';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { ShopBreadcrumb } from './shared/ShopBreadcrumb';

export default function CheckoutContent() {
  const t = useTranslations('Checkout');
  const tc = useTranslations('Cart');
  const tp = useTranslations('Products');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { items, clearCart, getTotalPrice } = useCartStore();
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    address: '',
    items: [],
    paymentMethod: 'card'
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'apple'>('card');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setFormData((prev: any) => ({ ...prev, paymentMethod }));
  }, [paymentMethod]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
      const res = await apiFetch(`${apiBase}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const resData = await res.json();
        const cart = Array.isArray(resData) ? resData[0] : resData;
        if (cart && cart.CartItems) {
          const mappedItems = cart.CartItems.map((item: any) => ({
            productId: item.product?.id || item.productId,
            quantity: item.quantity
          }));
          setFormData((prev: any) => ({
            ...prev,
            items: mappedItems
          }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch cart items:', err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (isHydrated && formData.items.length === 0 && items.length > 0) {
      const localMapped = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      }));
      setFormData((prev: any) => ({
        ...prev,
        items: localMapped
      }));
    }
  }, [items, formData.items.length, isHydrated]);

  const handleCompleteOrder = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error(t('shippingDetailsRequired'));
      return;
    }
    if (formData.items.length === 0) {
      toast.error(t('cartEmpty'));
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
      const res = await apiFetch(`${apiBase}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsCompleted(true);
        toast.success(t('orderSuccess'));
        clearCart();

        try {
          await apiFetch(`${apiBase}/cart`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
        } catch (dbErr) {
          console.error('Failed to clear cart in backend database:', dbErr);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || t('orderFailed'));
      }
    } catch (err) {
      console.error('Failed to complete order:', err);
      toast.error(t('somethingWentWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shippingCost = 0;
  const total = subtotal + shippingCost;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen  dark:to-[#0f172a] transition-colors duration-500">

      {/* Refined Modern Header */}
      <header className="relative pt-32 pb-20 overflow-hidden min-h-[500px] bg-gradient-to-b from-[#f3f7f2] via-[#e8efe7] to-white">
        {/* Soft Background Accent Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
          <div className="flex flex-col items-center justify-center text-center gap-6 max-w-3xl mx-auto">

            {/* Centered Content (Metadata & Titles) */}
            <div className="w-full flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 flex flex-col items-center"
              >
                {/* Shop Breadcrumb */}
                <ShopBreadcrumb
                  items={[{ label: t('title') }]}
                  className="justify-center"
                />

                {/* Subtitle Badge Row */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="bg-primary-500 text-white font-extrabold tracking-widest text-[10px] px-3.5 py-1.5 rounded-full shadow-sm uppercase">
                    {isRtl ? 'إتمام الدفع الآمن' : 'SECURE CHECKOUT'}
                  </span>
                  <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-primary-600 dark:text-primary-400 border border-primary-500/10 font-bold text-[10px] px-3.5 py-1.5 rounded-full shadow-sm animate-pulse">
                    {itemCount} {itemCount === 1 ? tc('item') : tc('items')}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-center text-gray-900 dark:text-white leading-[1.1] tracking-tight uppercase">
                  {t('title')}
                </h1>

                {/* Description */}
                <p className="text-base text-center sm:text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-xl mx-auto">
                  {t('subtitle')}
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Slide-Up HUD Content Container */}
      <div className="relative -top-20  dark:bg-[#0d1510] transition-colors duration-500 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left Side: Shipping & Checkout Form */}
            <div className="lg:col-span-7 space-y-8">
              <AnimatePresence>
                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  >
                    <Alert variant="success" className="rounded-[2.5rem] p-8 border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 shadow-2xl">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-inner">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <AlertTitle className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 mb-2">
                            {t('orderSuccessTitle')}
                          </AlertTitle>
                          <AlertDescription className="text-base font-bold text-emerald-600/70 dark:text-emerald-400/70">
                            {t('orderSuccessMessage')}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-gray-100 dark:border-slate-800/80 shadow-[0_30px_70px_rgba(0,0,0,0.02)] space-y-10"
                >
                  {/* Step 1: Shipping Address details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="text-left rtl:text-right">
                        <h2 className="text-xl font-black text-primary-500 dark:text-white tracking-tight leading-none mb-1">
                          {t('shipping')}
                        </h2>
                        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('shippingSub')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir={isRtl ? 'rtl' : 'ltr'}>
                      <DynamicInput
                        label={t('name')}
                        icon={User}
                        placeholder={t('namePlaceholder')}
                        value={formData.name}
                        onChange={(val) => setFormData({ ...formData, name: val })}
                      />

                      <DynamicInput
                        label={t('email')}
                        icon={Mail}
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        value={formData.email}
                        onChange={(val) => setFormData({ ...formData, email: val })}
                      />

                      <DynamicInput
                        label={t('phone')}
                        icon={Phone}
                        type="tel"
                        placeholder={t('phonePlaceholder')}
                        value={formData.phone}
                        onChange={(val) => setFormData({ ...formData, phone: val })}
                      />

                      <DynamicInput
                        label={t('address')}
                        icon={MapPin}
                        placeholder={t('addressPlaceholder')}
                        value={formData.address}
                        onChange={(val) => setFormData({ ...formData, address: val })}
                      />
                    </div>
                  </div>

                  {/* Complete Order Button */}
                  <button
                    onClick={handleCompleteOrder}
                    disabled={isLoading || isCompleted}
                    className="w-full h-16 bg-primary-500 hover:bg-primary-600 text-white rounded-[2rem] font-black tracking-[0.2em] text-[14px] shadow-2xl shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        {t('placeOrder')}
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Right Side: High-End Printed-Ticket Boarding-Pass Summary Card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-gray-100 dark:border-slate-800/80 rounded-3xl p-8 shadow-[0_30px_70px_rgba(0,0,0,0.02)] space-y-6 overflow-hidden"
              >
                {/* Visual Ticket Cutout Accents (Left & Right Side Holes) */}
                <div className="absolute top-[28%] -left-3.5 w-7 h-7 rounded-full bg-white dark:bg-[#0d1510] border border-gray-100 dark:border-slate-800/80 pointer-events-none z-10" />
                <div className="absolute top-[28%] -right-3.5 w-7 h-7 rounded-full bg-white dark:bg-[#0d1510] border border-gray-100 dark:border-slate-800/80 pointer-events-none z-10" />

                {/* Summary Header */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-accent-500/10 flex items-center justify-center text-accent-500">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-primary-500 dark:text-white tracking-tight leading-none">
                      {tc('summary')}
                    </h3>
                  </div>
                  <div className="bg-primary-500/10 text-primary-500 dark:text-primary-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                    {itemCount} {itemCount === 1 ? tc('item') : tc('items')}
                  </div>
                </div>

                {/* Items Showroom */}
                <div className="max-h-[350px] overflow-y-auto pr-1 space-y-4 scrollbar-none">
                  {items.length === 0 ? (
                    <div className="text-center py-10 space-y-4">
                      <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
                      <p className="text-sm font-bold text-gray-400 dark:text-gray-500">
                        {tc('empty')}
                      </p>
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-xs font-black text-primary-500 hover:text-primary-600"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                        {tc('continueShopping')}
                      </Link>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-300">
                        <div className="flex items-center gap-4">
                          {/* Image Thumbnail */}
                          <div className="relative w-16 h-16 rounded-2xl border border-gray-100 dark:border-slate-800/80 overflow-hidden shrink-0">
                            <Image
                              src={getImageUrl(item.images?.[0])}
                              alt={isRtl ? item.name_ar : item.name_en}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>

                          {/* Name & Quantity */}
                          <div className="text-left rtl:text-right">
                            <h4 className="text-sm font-black text-gray-800 dark:text-white line-clamp-1 leading-tight mb-1">
                              {isRtl ? item.name_ar : item.name_en}
                            </h4>
                            <span className="bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                              QTY: {item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <p className="font-black text-accent-500 text-sm tracking-tight shrink-0">
                          {tp('price', { price: (item.price_discount || item.price) * item.quantity })}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Dashed Printed Ticket Divider */}
                <div className="border-t-2 border-dashed border-gray-200 dark:border-slate-800 my-6 relative" />

                {/* Calculations & Invoice Matrix */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-bold text-gray-500 dark:text-gray-400">
                    <span>{tc('subtotal')}</span>
                    <span className="text-primary-500 dark:text-white font-black">
                      {tp('price', { price: subtotal })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-gray-500 dark:text-gray-400">
                    <span>{tc('shippingEstimate')}</span>
                    <span className="text-emerald-500 dark:text-emerald-400 font-extrabold text-[11px] tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {isRtl ? 'مجاني' : 'Free'}
                    </span>
                  </div>

                  {/* High-End Totals Capsule */}
                  <div className="bg-[#f1f4f1] dark:bg-slate-800/40 rounded-3xl p-5 flex items-center justify-between border border-primary-500/5 mt-6">
                    <div className="text-left rtl:text-right">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                        {isRtl ? 'المبلغ الإجمالي' : 'Total Amount'}
                      </span>
                      <span className="text-sm font-black text-gray-800 dark:text-white">
                        {tc('total')}
                      </span>
                    </div>
                    <span className="text-3xl font-black text-primary-500 tracking-tighter">
                      {tp('price', { price: total })}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
