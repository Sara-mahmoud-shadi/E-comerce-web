'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Save, Settings, Globe, Store, Search as SearchIcon, Share2, Type, Hash, Mail, Phone, MapPin, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import DynamicInput from '@/components/shared/DynamicInput';
import ImageUploadZone from '@/components/shared/ImageUploadZone';
import { ShopBreadcrumb } from '@/components/shared/ShopBreadcrumb';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { getApiBase } from '@/components/dashboard/categories/CategoriesList';
import { toast } from 'sonner';

type TabType = 'general' | 'store' | 'seo' | 'social';

const DEFAULT_FORM = {
  site_name: '',
  site_description: '',
  default_language: 'ar',
  logo: '',
  favicon: '',
  store_email: '',
  store_phone: '',
  store_address: '',
  support_email: '',
  meta_title: '',
  meta_description: '',
  keywords: '',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
};

export default function SettingsView() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [settingsExist, setSettingsExist] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(DEFAULT_FORM);

  // ── Fetch current settings on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      setIsFetching(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';
        const res = await apiFetch(`${getApiBase()}settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          // Backend may wrap in { data: {...} } or return flat object
          const settings = data?.data ?? data;
          setFormData({
            site_name:        settings.site_name        ?? '',
            site_description: settings.site_description ?? '',
            default_language: settings.default_language ?? 'ar',
            logo:             settings.logo             ?? '',
            favicon:          settings.favicon           ?? '',
            store_email:      settings.store_email      ?? '',
            store_phone:      settings.store_phone      ?? '',
            store_address:    settings.store_address    ?? '',
            support_email:    settings.support_email    ?? '',
            meta_title:       settings.meta_title       ?? '',
            meta_description: settings.meta_description ?? '',
            keywords:         settings.keywords         ?? '',
            facebook_url:     settings.facebook_url     ?? '',
            instagram_url:    settings.instagram_url    ?? '',
            twitter_url:      settings.twitter_url      ?? '',
          });
          setSettingsExist(true);
        } else if (res.status === 404) {
          // No settings yet — keep defaults, will POST on first save
          setSettingsExist(false);
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err?.message ?? (isRtl ? 'فشل في تحميل الإعدادات' : 'Failed to load settings'));
        }
      } catch {
        toast.error(isRtl ? 'تعذّر الاتصال بالخادم' : 'Could not connect to server');
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const tabs = [
    { id: 'general', label: t('generalSettings'), icon: Globe },
    { id: 'store',   label: t('storeSettings'),       icon: Store },
    { id: 'seo',     label: t('seoSettings'),          icon: SearchIcon },
    { id: 'social',  label: t('socialMediaSettings'),  icon: Share2 },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear that field's error as soon as user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const clearError = (field: string) => () => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  // ── Save: POST (first time) or PUT (update) ───────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';
      const method = settingsExist ? 'PUT' : 'POST';

      const res = await apiFetch(`${getApiBase()}settings`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));

        // ── Parse field-level validation errors ─────────────────────────────
        // Shape 1: { errors: [{ field: 'site_name', message: '...' }] }
        if (Array.isArray(errData?.errors) && errData.errors.length > 0) {
          const mapped: Record<string, string> = {};
          errData.errors.forEach((e: { field: string; message: string }) => {
            if (e.field) mapped[e.field] = e.message;
          });
          setFieldErrors(mapped);
        }
        // Shape 2: { errors: { site_name: 'Required', store_email: '...' } }
        else if (errData?.errors && typeof errData.errors === 'object') {
          setFieldErrors(errData.errors as Record<string, string>);
        }

        throw new Error(errData?.message ?? `Request failed (${res.status})`);
      }

      setSettingsExist(true);
      toast.success(isRtl ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (isRtl ? 'حدث خطأ ما' : 'Something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container 2xl:max-w-5xl mx-auto space-y-6 sm:space-y-8 mt-4 sm:mt-8">
      {/* Initial fetch spinner */}
      {isFetching ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
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
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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
                        <DynamicInput label={t('siteName')} icon={Type} value={formData.site_name} onChange={(v) => handleInputChange('site_name', v)} onClearError={clearError('site_name')} placeholder={t('siteName')} error={fieldErrors['site_name']} />
                        <DynamicInput label={t('defaultLanguage')} icon={Globe} value={formData.default_language} onChange={(v) => handleInputChange('default_language', v)} onClearError={clearError('default_language')} placeholder={t('defaultLanguage')} error={fieldErrors['default_language']} />

                        <div className="col-span-1 md:col-span-2">
                          <DynamicInput type="textarea" label={t('siteDescription')} icon={Type} value={formData.site_description} onChange={(v) => handleInputChange('site_description', v)} onClearError={clearError('site_description')} placeholder={t('siteDescription')} error={fieldErrors['site_description']} />
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
                        <DynamicInput label={t('storeEmail')} icon={Mail} value={formData.store_email} onChange={(v) => handleInputChange('store_email', v)} onClearError={clearError('store_email')} placeholder={t('storeEmail')} error={fieldErrors['store_email']} />
                        <DynamicInput label={t('storePhone')} icon={Phone} value={formData.store_phone} onChange={(v) => handleInputChange('store_phone', v)} onClearError={clearError('store_phone')} placeholder={t('storePhone')} error={fieldErrors['store_phone']} />
                        <DynamicInput label={t('storeAddress')} icon={MapPin} value={formData.store_address} onChange={(v) => handleInputChange('store_address', v)} onClearError={clearError('store_address')} placeholder={t('storeAddress')} error={fieldErrors['store_address']} />
                        <DynamicInput label={t('supportEmail')} icon={Mail} value={formData.support_email} onChange={(v) => handleInputChange('support_email', v)} onClearError={clearError('support_email')} placeholder={t('supportEmail')} error={fieldErrors['support_email']} />
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
                        <DynamicInput label={t('metaTitle')} icon={Type} value={formData.meta_title} onChange={(v) => handleInputChange('meta_title', v)} onClearError={clearError('meta_title')} placeholder={t('metaTitle')} error={fieldErrors['meta_title']} />
                        <DynamicInput type="textarea" label={t('metaDescription')} icon={Type} value={formData.meta_description} onChange={(v) => handleInputChange('meta_description', v)} onClearError={clearError('meta_description')} placeholder={t('metaDescription')} error={fieldErrors['meta_description']} />
                        <DynamicInput label={t('keywords')} icon={Hash} value={formData.keywords} onChange={(v) => handleInputChange('keywords', v)} onClearError={clearError('keywords')} placeholder={t('keywords')} error={fieldErrors['keywords']} />
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
                        <DynamicInput label="Facebook" icon={LinkIcon} value={formData.facebook_url} onChange={(v) => handleInputChange('facebook_url', v)} onClearError={clearError('facebook_url')} placeholder={t('facebookUrl')} error={fieldErrors['facebook_url']} />
                        <DynamicInput label="Instagram" icon={LinkIcon} value={formData.instagram_url} onChange={(v) => handleInputChange('instagram_url', v)} onClearError={clearError('instagram_url')} placeholder={t('instagramUrl')} error={fieldErrors['instagram_url']} />
                        <DynamicInput label="Twitter" icon={LinkIcon} value={formData.twitter_url} onChange={(v) => handleInputChange('twitter_url', v)} onClearError={clearError('twitter_url')} placeholder={t('twitterUrl')} error={fieldErrors['twitter_url']} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </form>
        </>
      )}
    </div>
  );
}
