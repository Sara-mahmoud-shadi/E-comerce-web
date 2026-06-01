'use client';
import { apiFetch } from '@/lib/api';

import React, { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Save, X, Package, DollarSign, Box, Image as ImageIcon, Plus, Trash2, ListTree, Star, Type, AlignLeft, Percent, Receipt } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { AnimatePresence } from 'framer-motion';
import DynamicInput from '@/components/shared/DynamicInput';
import DynamicSelect from '@/components/shared/DynamicSelect';
import { ShopBreadcrumb } from '@/components/shared/ShopBreadcrumb';

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
  productId?: string;
}

export default function ProductForm({ initialData, isEditing, productId }: ProductFormProps) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name_en: initialData?.name_en || '',
    name_ar: initialData?.name_ar || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    price_discount: initialData?.price_discount?.toString() || '',
    instock: initialData?.instock ?? true,
    images: initialData?.images || [],
    tax: initialData?.tax?.toString() || '',
    categoryId: initialData?.categoryId?.toString() || '',
  });
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [categories, setCategories] = React.useState<{ value: string; label: string }[]>([]);
  const [mainImageIndex, setMainImageIndex] = React.useState<number>(0);

  useEffect(() => {
    if (isEditing && productId && !initialData) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem('token');
          const res = await apiFetch(`/api/products/${productId}`, {
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          console.log(res);
          if (res.ok) {
            const data = await res.json();
            console.log(data);
            const product = data.data || data;
            setFormData({
              name_en: product.name_en || '',
              name_ar: product.name_ar || '',
              description: product.description || '',
              price: product.price?.toString() || '',
              price_discount: product.price_discount?.toString() || '',
              instock: product.instock ?? true,
              images: product.images || [],
              tax: product.tax?.toString() || '',
              categoryId: product.categoryId?.toString() || product.category?.id?.toString() || (typeof product.category === 'string' || typeof product.category === 'number' ? product.category.toString() : ''),
            });
          }
        } catch (err) {
          console.error("Failed to fetch product", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [isEditing, productId, initialData]);

  const fetchCategories = async () => {
    try {
      const res = await apiFetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        const categoryList = Array.isArray(data) ? data : (data.data || []);
        console.log(categoryList);
        setCategories(
          categoryList.map((c: any) => ({
            value: c.id.toString(),
            label: isRtl ? c.name_ar : c.name_en
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear the field error as soon as the user modifies the value
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[field as string]; return next; });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);

      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));

      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_: string, i: number) => i !== index) }));
    const initialImagesCount = initialData?.images?.length || 0;
    if (index >= initialImagesCount) {
      const fileIndex = index - initialImagesCount;
      setImageFiles(prev => prev.filter((_: File, i: number) => i !== fileIndex));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      setFieldErrors({});

      const submitData = new FormData();
      submitData.append('name_en', formData.name_en);
      submitData.append('name_ar', formData.name_ar);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      if (formData.price_discount) submitData.append('price_discount', formData.price_discount);
      submitData.append('instock', String(formData.instock));
      if (formData.categoryId) submitData.append('categoryId', formData.categoryId);
      if (formData.tax) submitData.append('tax', formData.tax);

      imageFiles.forEach(file => {
        submitData.append('images', file);
      });

      const token = localStorage.getItem('token');
      const url = isEditing && productId ? `/api/products/${productId}` : '/api/products';

      const response = await apiFetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        body: submitData,
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Map field-level errors from backend [{ field, message }] array
        if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
          const mapped: Record<string, string> = {};
          errorData.errors.forEach((e: { field: string; message: string }) => {
            if (e.field === 'name') mapped['name'] = e.message;
            if (e.field === 'description') mapped['description'] = e.message;
            if (e.field === 'price') mapped['price'] = e.message;
            if (e.field === 'price_discount') mapped['price_discount'] = e.message;
            if (e.field === 'tax') mapped['tax'] = e.message;
            if (e.field === 'categoryId') mapped['categoryId'] = e.message;
          });
          setFieldErrors(mapped);
        }
        throw new Error(
          errorData.message ||
          errorData.error ||
          'Failed to save product'
        );
      }

      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {

      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container 2xl:max-w-5xl mx-auto space-y-8 mt-8">
      <ShopBreadcrumb
        items={[
          { label: t('dashboard'), href: '/dashboard' },
          { label: t('products'), href: '/dashboard/products' },
          { label: isEditing ? t('edit') : t('create') }
        ]}
      />
      <form onSubmit={(e: any) => handleSubmit(e)}>
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase dark:text-white mb-2">
              {isEditing ? t('edit') : t('create')} {t('products')}
            </h1>
            <p className="text-sm font-bold text-gray-400 tracking-widest">
              {isEditing ? t('productEditSubtitle') : t('productCreateSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="flex items-center gap-2 cursor-pointer px-5 py-3 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 cursor-pointer px-6 py-3 bg-primary-500 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isLoading ? '...' : t('save')}
            </button>
          </div>
        </header>

        <div className="space-y-8">
          {/* Product Details Card */}
          <section className="bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 border-b border-red-100 dark:border-red-900/50 text-sm font-bold">
                {error}
              </div>
            )}

            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                {t('productDetails')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('productDetailsDesc')}
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Field Row: Name EN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">
                    {t('productNameEn')}
                  </label>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                    {t('productNameEnDesc')}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <DynamicInput
                    label=""
                    icon={Type}
                    value={formData.name_en}
                    onChange={(val) => handleInputChange('name_en', val)}
                    onClearError={() => setFieldErrors(p => { const n = { ...p }; delete n['name_en']; return n; })}
                    placeholder={t('productNameEn')}
                    error={fieldErrors['name_en']}
                    className="!mt-0"
                  />
                </div>
              </div>

              <hr className="border-gray-100 dark:border-white/5" />

              {/* Field Row: Name AR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">
                    {t('productNameAr')}
                  </label>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                    {t('productNameArDesc')}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <DynamicInput
                    label=""
                    icon={Type}
                    value={formData.name_ar}
                    onChange={(val) => handleInputChange('name_ar', val)}
                    onClearError={() => setFieldErrors(p => { const n = { ...p }; delete n['name_ar']; return n; })}
                    placeholder={t('productNameAr')}
                    error={fieldErrors['name_ar']}
                    className="text-right !mt-0"
                  />
                </div>
              </div>

              <hr className="border-gray-100 dark:border-white/5" />

              {/* Field Row: Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">
                    {t('fullDescription')}
                  </label>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                    {t('fullDescriptionDesc')}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <textarea
                    rows={6}
                    dir={isRtl ? 'rtl' : 'ltr'}
                    value={formData.description}
                    onChange={(e) => {
                      handleInputChange('description', e.target.value);
                      if (fieldErrors['description']) setFieldErrors(p => { const n = { ...p }; delete n['description']; return n; });
                    }}
                    placeholder={t('fullDescription')}
                    className={`w-full bg-gray-100/80 dark:bg-gray-900/50 border rounded-xl py-4 px-4 text-sm font-medium outline-none transition-all resize-none dark:text-white ${fieldErrors['description']
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 dark:border-white/5 focus:border-primary-500/30'
                      }`}
                  />
                  {fieldErrors['description'] && (
                    <p className="mt-1.5 text-[11px] font-bold text-red-400 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {fieldErrors['description']}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Media Assets Card */}
          <section className="bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-500" />
                {t('mediaAssets')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('mediaAssetsDesc')}
              </p>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence mode="popLayout">
                  {formData.images.map((img: string, index: number) => (
                    <motion.div
                      key={`${img}-${index}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={() => setMainImageIndex(index)}
                          className={`p-2.5 rounded-xl transition-all ${mainImageIndex === index ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white/20 text-white hover:bg-white/40'}`}
                          title={t('setAsMain')}
                        >
                          <Star className={`w-4 h-4 ${mainImageIndex === index ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-xl hover:scale-105 transition-all shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {mainImageIndex === index && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded border border-amber-400 shadow-sm">
                          {t('main')}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-500/5 transition-all group shadow-sm"
                >
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                    <Plus className="w-6 h-6 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </div>
                  <span className="text-xs font-bold">{t('addImage')}</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </section>
          {/* Pricing Card */}
          <section className="bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-500" />
                {t('pricing')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('pricingDesc')}
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-center">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">{t('basePrice')}</label>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{t('basePriceDesc')}</p>
                </div>
                <div className="md:col-span-2">
                  <DynamicInput
                    label=""
                    icon={DollarSign}
                    type="number"
                    value={formData.price}
                    onChange={(val) => handleInputChange('price', val)}
                    onClearError={() => setFieldErrors(p => { const n = { ...p }; delete n['price']; return n; })}
                    placeholder="0.00"
                    error={fieldErrors['price']}
                    className="!mt-0"
                  />
                </div>
              </div>

              <hr className="border-gray-100 dark:border-white/5" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-center">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">{t('discountPrice')}</label>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{t('discountPriceDesc')}</p>
                </div>
                <div className="md:col-span-2">
                  <DynamicInput
                    label=""
                    icon={DollarSign}
                    type="number"
                    value={formData.price_discount}
                    onChange={(val) => handleInputChange('price_discount', val)}
                    onClearError={() => setFieldErrors(p => { const n = { ...p }; delete n['price_discount']; return n; })}
                    placeholder="0.00"
                    error={fieldErrors['price_discount']}
                    className="!mt-0"
                  />
                </div>
              </div>

              <hr className="border-gray-100 dark:border-white/5" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-center">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">{t('tax')}</label>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{t('taxDesc')}</p>
                </div>
                <div className="md:col-span-2">
                  <DynamicInput
                    label=""
                    icon={Percent}
                    type="number"
                    value={formData.tax}
                    onChange={(val) => handleInputChange('tax', val)}
                    onClearError={() => setFieldErrors(p => { const n = { ...p }; delete n['tax']; return n; })}
                    placeholder="0.00"
                    error={fieldErrors['tax']}
                    className="!mt-0"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Inventory & Categorization Card */}
          <section className="bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-purple-500" />
                {t('inventoryCategorization')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('inventoryCategorizationDesc')}
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-center">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">{t('inStock')}</label>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{t('inStockDesc')}</p>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('instock', !formData.instock)}
                    className={`w-14 h-7 rounded-full transition-colors relative shadow-inner ${formData.instock ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <motion.div
                      className="w-6 h-6 bg-white rounded-full absolute top-0.5 shadow-sm"
                      animate={{ left: formData.instock ? '28px' : '2px' }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-white/5" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-start">
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">{t('category')}</label>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{t('categoryDesc')}</p>
                </div>
                <div className="md:col-span-2">
                  {categories.length > 0 ? (
                    <DynamicSelect
                      label=""
                      value={formData.categoryId}
                      onChange={(val) => handleInputChange('categoryId', val)}
                      placeholder={t('selectCategory')}
                      options={categories}
                    />
                  ) : (
                    <div className="w-full h-[50px] bg-gray-100/80 dark:bg-gray-900/50 rounded-lg animate-pulse border border-gray-200 dark:border-white/5"></div>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>
      </form>
    </div>
  );
}
