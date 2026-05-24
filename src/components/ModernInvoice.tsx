'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, User, MapPin, Sparkles, CheckCircle2, Package, Printer, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from './products/ProductCard';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

export default function ModernInvoice({ order }: { order: any }) {
  const tc = useTranslations('Cart');
  const tp = useTranslations('Products');
  const t = useTranslations('Checkout');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const handlePrint = () => {
    window.print();
  };

  if (!order) return null;

  return (
    <div>
      <div className="flex items-center justify-end my-6 print:hidden">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-black text-white bg-primary-500 px-5 py-2.5 rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-0.5 transition-all">
          {tc('continueShopping')}
        </Link>
        <button onClick={handlePrint} className="mx-3 cursor-pointer  inline-flex items-center gap-2 text-sm font-black text-slate-700 bg-white px-5 py-2.5 rounded-full shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all">
          <Printer className="w-4 h-4" />
          {isRtl ? 'طباعة' : 'Print'}
        </button>
      </div>
      <div className="max-w-4xl mx-auto w-full mb-20 print:mb-0 px-4 print:bg-none print:bg-white bg-gradient-to-b from-[#f3f7f2] rounded-xl pt-3 print:pt-0 to-white">
        <motion.div
          id="printable-invoice"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full p-8 sm:p-12 print:pt-20 print:px-2 rounded-2xl text-slate-900 dark:text-slate-100"
        >
          {/* Brand Logo */}
          <div className="mb-4 flex justify-end">
            <Link href="/" dir="ltr" className="flex items-center gap-2 text-4xl font-black tracking-tight text-primary-500">
              <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500 dark:text-primary-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span>Go<span className="text-2xl text-black dark:text-white">Shop</span></span>
            </Link>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl text-center font-bold mb-6 print:mb-2 print:text-black">
            {t('orderSuccessTitle')} ✨
          </h2>

          {/* Order Status Timeline Row */}
          <div className="flex items-start justify-between mb-12 mt-8 px-2 sm:px-8 print:text-black">
            {[
              { id: 'pending', label: isRtl ? 'قيد الانتظار' : 'Pending' },
              { id: 'processing', label: isRtl ? 'قيد المعالجة' : 'Processing' },
              { id: 'shipped', label: isRtl ? 'تم الشحن' : 'Shipped' },
              { id: 'delivered', label: isRtl ? 'تم التوصيل' : 'Delivered' }
            ].map((step, idx, arr) => {
              const statusScores: Record<string, number> = { pending: 1, processing: 2, shipped: 3, delivered: 4 };
              const currentScore = statusScores[order.status_order || 'pending'] || 1;
              const stepScore = statusScores[step.id];
              const isActive = currentScore >= stepScore;
              const isCurrent = currentScore === stepScore;
              const isPast = currentScore > stepScore;

              return (
                <React.Fragment key={idx}>
                  <div className="relative z-10 flex flex-col items-center gap-3 flex-shrink-0 w-16 sm:w-24">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-white dark:border-[#0d1510] print:border-white transition-colors duration-500 shadow-sm ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-gray-600 print:bg-gray-100'
                      }`}>
                      {isActive ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-bold text-center transition-colors ${isCurrent ? 'text-primary-500' : isActive ? 'text-slate-800 dark:text-slate-200 print:text-slate-800' : 'text-gray-400 dark:text-gray-500 print:text-gray-400'
                      }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="flex-1 mt-4 h-1 bg-gray-100 dark:bg-slate-800 print:bg-slate-100 rounded-full relative">
                      <div className={`absolute top-0 bottom-0 rtl:right-0 ltr:left-0 bg-primary-500 rounded-full transition-all duration-1000 ${isPast ? 'w-full' : 'w-0'
                        }`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Greeting & Message */}
          <div className="mb-10 text-slate-700 dark:text-slate-300 text-base leading-relaxed print:text-black">
            <p className="font-bold text-slate-900 dark:text-white mb-2 print:text-black">
              {isRtl ? 'مرحباً' : 'Hello'} {order.customer.name},
            </p>
            <p>
              {isRtl
                ? 'يتم معالجة طلبك وقريباً ستتمكن من الاستمتاع بمنتجاتك الجديدة.'
                : 'Your order is being processed and you will soon be able to enjoy your new products.'}
            </p>
            {/* <p>
              {isRtl
                ? 'سنرسل لك بريداً إلكترونياً آخر بمجرد شحن طلبك.'
                : "We'll send you another email once your order has shipped."}
            </p> */}
          </div>

          {/* Divider */}
          <hr className="border-t border-gray-200 dark:border-slate-800 mb-8 print:border-slate-200" />

          {/* Details Row */}
          <div className="flex justify-between flex-wrap gap-4 mb-8 text-sm print:text-black">
            <div>
              <p className="text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'تاريخ الطلب' : 'Order Date'}</p>
              <p className="font-bold">
                {new Date(order.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'رقم الطلب' : 'Order No,'}</p>
              <p className="font-bold">{order.order_number}</p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'عنوان التوصيل' : 'Shipping Address'}</p>
              <p className="font-bold leading-tight">{order.customer.address}</p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t border-gray-200 dark:border-slate-800 mb-8 print:border-slate-200" />

          {/* Items List */}
          <div className="space-y-6 print:space-y-2 mb-8 print:mb-4 print:text-black">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-row items-center justify-between gap-4">
                <div className="flex gap-6 items-center">
                  <div className="relative w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 flex-shrink-0 shadow-xs border border-[#eedcdd]/50 dark:border-slate-700 overflow-hidden p-2 print:border-slate-200">
                    {item.images?.[0] && (
                      <Image src={getImageUrl(item.images[0])} alt={item.name_en} fill className="object-contain p-2" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-bold text-slate-900 dark:text-white text-base print:text-black">
                      {isRtl ? item.name_ar || item.name_en : item.name_en}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      {isRtl ? 'الكمية' : 'Quantity'}: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-base print:text-black">
                  {tp('price', { price: (item.price_discount || item.price) * item.quantity })}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <hr className="border-t border-gray-200 dark:border-slate-800 mb-8 print:my-2 print:border-slate-200" />

          {/* Footer / Summary */}
          <div className="flex flex-col sm:flex-row justify-end items-start gap-8 print:gap-4 print:text-black">
            <div className="w-full sm:w-72 space-y-3 print:space-y-2 order-1 sm:order-2 print:break-inside-avoid">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">{tc('subtotal')}:</span>
                <span className="font-bold">{tp('price', { price: order.subtotal })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">{isRtl ? 'التوصيل' : 'Shipping'}:</span>
                <span className="font-bold">{order.shipping ? tp('price', { price: order.shipping }) : (isRtl ? 'مجاني' : 'Free')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                  <span>{isRtl ? 'الخصم' : 'Discount'}:</span>
                  <span className="font-bold">-{tp('price', { price: order.discount })}</span>
                </div>
              )}
              <hr className="border-t border-gray-200 dark:border-slate-800 my-4 print:border-slate-200" />
              <div className="flex justify-between text-base">
                <span className="font-bold text-primary-500 dark:text-white">{tc('total')}</span>
                <span className="font-bold text-slate-900 dark:text-white print:text-black">{tp('price', { price: order.total })}</span>
              </div>
            </div>
          </div>
        </motion.div>
        <style dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          header, footer, nav, aside {
            display: none !important;
          }
          html, body, main, .min-h-screen {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: 0 !important;
            display: block !important;
          }
          .pb-24 {
            padding-bottom: 0 !important;
          }
          .-top-10 {
            top: 0 !important;
          }
          #printable-invoice {
            margin: 0 auto !important;
            display: block !important;
            zoom: 0.9 !important;
          }
        }
      `}} />
      </div>
    </div>
  );
}

