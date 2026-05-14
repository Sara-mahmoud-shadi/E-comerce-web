'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ShieldCheck, MapPin, User, Mail, CheckCircle2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import DynamicInput from './shared/DynamicInput';

export default function CheckoutContent() {
  const t = useTranslations('Checkout');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
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
    <div className="max-w-4xl mx-auto py-10 mt-12 px-4">
    
      <div className="space-y-8">
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            >
              <Alert variant="success" className="rounded-xl p-8 border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5">
                <AlertTitle className="text-xl flex items-center justify-center gap-4 font-black tracking-tight text-emerald-600 dark:text-emerald-400  mb-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  {t('orderSuccessTitle')}
                </AlertTitle>
                <AlertDescription className="text-sm flex items-center justify-center font-bold text-emerald-600/70 dark:text-emerald-400/70 ml-4">
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
          className="bg-white dark:bg-[#081640] rounded-xl p-10 border border-gray-100 dark:border-white/5 shadow"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-[#f1f4f1] dark:bg-blue-500/10 flex items-center justify-center text-primary-500 dark:text-blue-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary-500 tracking-tight dark:text-white leading-none mb-1">
                {t('shipping')}
              </h2>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest">{t('shippingSub')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
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

          <button 
            onClick={handleCompleteOrder}
            disabled={isLoading || isCompleted}
            className="w-full h-16 bg-accent-500 cursor-pointer text-white rounded-2xl font-black tracking-widest text-[14px] shadow-lg shadow-accent-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-12 disabled:opacity-50 disabled:hover:scale-100"
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
