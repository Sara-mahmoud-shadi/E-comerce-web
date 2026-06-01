'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Save, Settings, Globe, Store, Search as SearchIcon, Share2, Type, Hash, Mail, Phone, MapPin, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import DynamicInput from '@/components/shared/DynamicInput';
import ImageUploadZone from '@/components/shared/ImageUploadZone';
import { ShopBreadcrumb } from '@/components/shared/ShopBreadcrumb';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'general' | 'store' | 'seo' | 'social';

export default function SettingsView() {
  const t = useTranslations('Dashboard'); 
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    siteName: 'My Store',
    siteDescription: 'Best online shopping store',
    defaultLanguage: 'en',  
    logo: "",
    favicon: "",
    storeEmail: 'info@store.com',
    storePhone: '+966500000000',
    storeAddress: 'Riyadh, Saudi Arabia',
    supportEmail: 'support@store.com',
    metaTitle: 'Best E-Commerce Store',
    metaDescription: 'Online shopping website',
    keywords: 'shop, ecommerce, store',
    facebookUrl: 'https://facebook.com/store',
    instagramUrl: 'https://instagram.com/store',
    twitterUrl: 'https://twitter.com/store',
  });

  const tabs = [
    { id: 'general', label: t('generalSettings'), icon: Globe },
    { id: 'store', label: t('storeSettings'), icon: Store },
    { id: 'seo', label: t('seoSettings'), icon: SearchIcon },
    { id: 'social', label: t('socialMediaSettings'), icon: Share2 },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, toast success message here
    }, 1000);
  };

  return (
    <div className="container 2xl:max-w-5xl mx-auto space-y-6 sm:space-y-8 mt-4 sm:mt-8">
      <ShopBreadcrumb
        items={[
          { label: t('dashboard'), href: '/dashboard' },
          { label: t('settings') }
        ]}
      />

      <form onSubmit={handleSubmit}>
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase dark:text-white mb-2 flex items-center gap-3">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500" />
              {t('settings')}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-gray-400 tracking-widest">
              {t('settingsSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto px-6 py-3 bg-primary-500 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isLoading ? t('saving') : t('save')}
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs Sidebar */}
          <div className="flex flex-row lg:flex-col overflow-x-auto mx-auto  overflow-visible w-72 md:w-full lg:w-72 p-4 lg:p-5 shrink-0 gap-2 bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/5 rounded-xl shadow-sm scrollbar-hide px-4 sm:px-5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`whitespace-nowrap shrink-0 lg:w-full cursor-pointer border border-gray-200 dark:border-white/5 flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-start
                    ${isActive
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="flex-grow">
            <section className="bg-white dark:bg-[#081640] border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 md:p-8 space-y-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'general' && (
                    <motion.div
                      key="general"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <h2 className="text-lg sm:text-xl font-bold dark:text-white mb-4 sm:mb-6 border-b pb-3 sm:pb-4 border-gray-100 dark:border-white/5">{t('generalSettings')}</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DynamicInput label={t('siteName')} icon={Type} value={formData.siteName} onChange={(v) => handleInputChange('siteName', v)} placeholder={t('siteName')} />
                        <DynamicInput label={t('defaultLanguage')} icon={Globe} value={formData.defaultLanguage} onChange={(v) => handleInputChange('defaultLanguage', v)} placeholder={t('defaultLanguage')} />

                        <div className="col-span-1 md:col-span-2">
                          <DynamicInput type="textarea" label={t('siteDescription')} icon={Type} value={formData.siteDescription} onChange={(v) => handleInputChange('siteDescription', v)} placeholder={t('siteDescription')} />
                        </div>
                        <ImageUploadZone label={t('logo')} value={formData.logo} onChange={(v) => handleInputChange('logo', v)} />
                        <ImageUploadZone label={t('favicon')} value={formData.favicon} onChange={(v) => handleInputChange('favicon', v)} />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'store' && (
                    <motion.div
                      key="store"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <h2 className="text-lg sm:text-xl font-bold dark:text-white mb-4 sm:mb-6 border-b pb-3 sm:pb-4 border-gray-100 dark:border-white/5">{t('storeSettings')}</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DynamicInput label={t('storeEmail')} icon={Mail} value={formData.storeEmail} onChange={(v) => handleInputChange('storeEmail', v)} placeholder={t('storeEmail')} />
                        <DynamicInput label={t('storePhone')} icon={Phone} value={formData.storePhone} onChange={(v) => handleInputChange('storePhone', v)} placeholder={t('storePhone')} />
           
                          <DynamicInput label={t('storeAddress')} icon={MapPin} value={formData.storeAddress} onChange={(v) => handleInputChange('storeAddress', v)} placeholder={t('storeAddress')} />
                   
                        <DynamicInput label={t('supportEmail')} icon={Mail} value={formData.supportEmail} onChange={(v) => handleInputChange('supportEmail', v)} placeholder={t('supportEmail')} />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'seo' && (
                    <motion.div
                      key="seo"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <h2 className="text-lg sm:text-xl font-bold dark:text-white mb-4 sm:mb-6 border-b pb-3 sm:pb-4 border-gray-100 dark:border-white/5">{t('seoSettings')}</h2>

                      <div className="grid grid-cols-1 gap-6">
                        <DynamicInput label={t('metaTitle')} icon={Type} value={formData.metaTitle} onChange={(v) => handleInputChange('metaTitle', v)} placeholder={t('metaTitle')} />
                        <DynamicInput type="textarea" label={t('metaDescription')} icon={Type} value={formData.metaDescription} onChange={(v) => handleInputChange('metaDescription', v)} placeholder={t('metaDescription')} />
                        <DynamicInput label={t('keywords')} icon={Hash} value={formData.keywords} onChange={(v) => handleInputChange('keywords', v)} placeholder={t('keywords')} />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'social' && (
                    <motion.div
                      key="social"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <h2 className="text-lg sm:text-xl font-bold dark:text-white mb-4 sm:mb-6 border-b pb-3 sm:pb-4 border-gray-100 dark:border-white/5">{t('socialMediaSettings')}</h2>

                      <div className="grid grid-cols-1 gap-6">
                        <DynamicInput label="Facebook" icon={LinkIcon} value={formData.facebookUrl} onChange={(v) => handleInputChange('facebookUrl', v)} placeholder={t('facebookUrl')} />
                        <DynamicInput label="Instagram" icon={LinkIcon} value={formData.instagramUrl} onChange={(v) => handleInputChange('instagramUrl', v)} placeholder={t('instagramUrl')} />
                        <DynamicInput label="Twitter" icon={LinkIcon} value={formData.twitterUrl} onChange={(v) => handleInputChange('twitterUrl', v)} placeholder={t('twitterUrl')} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}
