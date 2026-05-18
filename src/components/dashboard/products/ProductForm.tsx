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

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
  productId?: string;
}

export default function ProductForm({ initialData, isEditing, productId }: ProductFormProps) {
  const t = useTranslations('Dashboard');
  const tc = useTranslations('Categories');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
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
              name: product.name || '',
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
      submitData.append('name', formData.name);
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
            if (e.field === 'name')        mapped['name'] = e.message;
            if (e.field === 'description') mapped['description'] = e.message;
            if (e.field === 'price')       mapped['price'] = e.message;
            if (e.field === 'price_discount') mapped['price_discount'] = e.message;
            if (e.field === 'tax')         mapped['tax'] = e.message;
            if (e.field === 'categoryId')  mapped['categoryId'] = e.message;
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
    <form onSubmit={(e: any) => handleSubmit(e)} className="max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white mb-2">
            {isEditing ? t('edit') : t('create')} {t('products')}
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {isEditing ? t('productEditSubtitle') : t('productCreateSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="flex items-center gap-3 cursor-pointer px-6 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-3 cursor-pointer px-8 py-4 bg-primary-500 text-white rounded-md font-black tracking-widest text-[12px] shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isLoading ? '...' : t('save')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('productDetails')}</h3>
            </div>

            <DynamicInput
              label={t('productNameEn')}
              icon={Type}
              value={formData.name}
              onChange={(val) => handleInputChange('name', val)}
              onClearError={() => setFieldErrors(p => { const n={...p}; delete n['name']; return n; })}
              placeholder={t('productNameEn')}
              error={fieldErrors['name']}
            />

            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${
                fieldErrors['description'] ? 'text-red-400' : 'text-gray-500'
              }`}>{t('fullDescription')}</label>
              <textarea
                rows={6}
                dir={isRtl ? 'rtl' : 'ltr'}
                value={formData.description}
                onChange={(e) => {
                  handleInputChange('description', e.target.value);
                  if (fieldErrors['description']) setFieldErrors(p => { const n={...p}; delete n['description']; return n; });
                }}
                placeholder={t('fullDescription')}
                className={`w-full bg-gray-100/80 mt-2 dark:bg-gray-900/50 border rounded-md py-4 px-6 text-sm font-bold outline-none transition-all resize-none dark:text-white ${
                  fieldErrors['description']
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 dark:border-white/5 focus:border-primary-500/30'
                }`}
              />
              {fieldErrors['description'] && (
                <p className="ml-1 text-[11px] font-bold text-red-400 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {fieldErrors['description']}
                </p>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-black tracking-widest dark:text-white">{t('mediaAssets')}</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {formData.images.map((img: string, index: number) => (
                  <motion.div
                    key={`${img}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group relative aspect-square rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-white/5"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setMainImageIndex(index)}
                        className={`p-2 rounded-xl transition-all ${mainImageIndex === index ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                        title={t('setAsMain')}
                      >
                        <Star className={`w-4 h-4 ${mainImageIndex === index ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {mainImageIndex === index && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                        {t('main')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all group"
              >
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t('addImage')}</span>
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
          </section>

        </div>

        {/* Pricing & Stock */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('pricing')}</h3>
              </div>

              <DynamicInput
                label={t('basePrice')}
                icon={DollarSign}
                type="number"
                value={formData.price}
                onChange={(val) => handleInputChange('price', val)}
                onClearError={() => setFieldErrors(p => { const n={...p}; delete n['price']; return n; })}
                placeholder="0.00"
                error={fieldErrors['price']}
              />

              <DynamicInput
                label={t('discountPrice')}
                icon={DollarSign}
                type="number"
                value={formData.price_discount}
                onChange={(val) => handleInputChange('price_discount', val)}
                onClearError={() => setFieldErrors(p => { const n={...p}; delete n['price_discount']; return n; })}
                placeholder="0.00"
                error={fieldErrors['price_discount']}
              />

              <DynamicInput
                label="Tax"
                icon={Percent}
                type="number"
                value={formData.tax}
                onChange={(val) => handleInputChange('tax', val)}
                onClearError={() => setFieldErrors(p => { const n={...p}; delete n['tax']; return n; })}
                placeholder="0.00"
                error={fieldErrors['tax']}
              />
            </div>
          </section>

          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Box className="w-5 h-5 text-purple-500" />
                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('inventory')}</h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-transparent focus-within:border-blue-500/50 transition-all">
                <div className="space-y-0.5">
                  <label className="text-sm font-bold dark:text-white">In Stock</label>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available for purchase</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('instock', !formData.instock)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.instock ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                    animate={{ left: formData.instock ? '26px' : '2px' }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {categories.length > 0 ? (
                <DynamicSelect
                  label={t('category')}
                  value={formData.categoryId}
                  onChange={(val) => handleInputChange('categoryId', val)}
                  placeholder={t('selectCategory')}
                  options={categories}
                />
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-gray-500 transition-colors">
                    {t('category')}
                  </label>
                  <div className="w-full h-[46px] bg-gray-100/80 dark:bg-gray-900/50 rounded-md animate-pulse border border-gray-200 dark:border-white/5"></div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
