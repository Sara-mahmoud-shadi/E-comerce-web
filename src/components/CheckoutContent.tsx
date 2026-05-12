'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, MapPin, User, Mail, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function CheckoutContent() {
  const t = useTranslations('Checkout');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteOrder = async () => {
    setIsLoading(true);
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter uppercase dark:text-white mb-4">
          {t('title')}
        </h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
          Secure your premium selection
        </p>
      </div> 
      
      <div className="space-y-8">
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            >
              <Alert variant="success" className="rounded-[2rem] p-8 border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <AlertTitle className="text-xl font-black uppercase tracking-tight text-emerald-600 dark:text-emerald-400 ml-4 mb-2">
                  {t('orderSuccessTitle')}
                </AlertTitle>
                <AlertDescription className="text-sm font-bold text-emerald-600/70 dark:text-emerald-400/70 ml-4">
                  {t('orderSuccessMessage')}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shipping Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#081640] rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight dark:text-white leading-none mb-1">
                {t('shipping')}
              </h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Where should we send it?</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[15px] font-black uppercase tracking-widest text-gray-600">
                {t('name')}
              </label>
              <div className="relative mt-4">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-gray-100/80 dark:bg-gray-900/50 border-transparent rounded-md px-14 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none" 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[15px] font-black uppercase tracking-widest text-gray-600">
                {t('email')}
              </label>
              <div className="relative mt-3">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-gray-100/80 dark:bg-gray-900/50 border-transparent rounded-md px-14 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none" 
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[15px] font-black uppercase tracking-widest text-gray-600">
                {t('address')}
              </label>
              <input 
                type="text" 
                placeholder="123 Luxury Ave, Suite 456"
                className="w-full bg-gray-100/80 dark:bg-gray-900/50 mt-4 border-transparent rounded-md px-8 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none" 
              />
            </div>
          </div>

          <button 
            onClick={handleCompleteOrder}
            disabled={isLoading || isCompleted}
            className="w-full h-16 bg-blue-600 cursor-pointer text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-12 disabled:opacity-50 disabled:hover:scale-100"
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
      </div>
    </div>
  );
}
