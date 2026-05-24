'use client';
import { apiFetch } from '@/lib/api';

import React, { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Clock,
  CheckCircle2,
  Printer,
  Mail,
  Phone,
  ShoppingBag
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { toast } from 'sonner';
import DynamicSelect from '@/components/shared/DynamicSelect';
import { ShopBreadcrumb } from '@/components/shared/ShopBreadcrumb';

interface OrderDetailsContentProps {
  id: string;
}

export default function OrderDetailsContent({ id }: OrderDetailsContentProps) {
  const t = useTranslations('Dashboard');
  const to = useTranslations('Orders');
  const tc = useTranslations('Categories');
  const tch = useTranslations('Checkout');
  const router = useRouter();
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [order, setOrder] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isEditingStatus, setIsEditingStatus] = React.useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState<boolean>(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.toISOString().split("T")[0];
      const time = date.toTimeString().slice(0, 5);
      return `${day} & ${time}`;
    } catch (e) {
      return dateString || '';
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/'}orders/${id}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const token = localStorage.getItem('token');
      let res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/'}orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: newStatus, status_order: newStatus })
      });
      
      // Fallback if the endpoint is actually /orders/:id instead of /orders/:id/status
      if (res.status === 404) {
        res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/'}orders/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ status_order: newStatus, status: newStatus })
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || `Failed to update status (${res.status})`);
      }
      const updatedOrder = await res.json();
      setOrder(updatedOrder);
      toast.success(to('statusUpdated') || 'Order status updated successfully');
      setIsEditingStatus(false);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-500/210 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800 max-w-6xl mx-auto">
        <p className="text-red-500 font-bold mb-4">Error: {error || 'Order not found'}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-primary-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
        >
          {to('backToOrders')}
        </button>
      </div>
    );
  }

  // Calculate pricing breakdown
  const subtotal = (order.items || []).reduce((sum: number, item: any) => sum + Number(item.price) * item.quantity, 0);
  const shipping = 0.00; // Free shipping
  const total = subtotal + shipping;


  const getStatusColors = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500';
      case 'shipped':
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500';
      case 'processing':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500';
      default:
        return 'bg-gray-50 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="container 2xl:max-w-5xl mx-auto mt-4 pb-20">
      <ShopBreadcrumb
        items={[
          { label: t('dashboard'), href: '/dashboard' },
          { label: t('orders'), href: '/dashboard/orders' },
          { label: `#${order.order_number?.replace('ORD-', '') || order.id}` }
        ]}
      />
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {to('backToOrders')}
          </button>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl font-black tracking-tighter uppercase dark:text-white">
              {to('orderId')}: #{order.order_number || order.id}
            </h1>
            <div className={`px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-bold flex items-center gap-2 ${getStatusColors(order.status_order)}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${order.status_order === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              {to(`status_${order.status_order}`) || order.status_order || 'Pending'}
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
          {isEditingStatus ? (
            <div className="flex items-end gap-2 w-full md:w-auto">
              <DynamicSelect
                label={to('status')}
                value={order.status_order}
                onChange={handleStatusChange}
                options={[
                  { value: 'pending', label: to('status_pending') },
                  { value: 'processing', label: to('status_processing') },
                  { value: 'shipped', label: to('status_shipped') },
                  { value: 'delivered', label: to('status_delivered') }
                ]}
                className="w-48"
              />
              <button
                onClick={() => setIsEditingStatus(false)}
                className="px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-lg cursor-pointer font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-colors h-[46px] flex items-center justify-center"
              >
                {t('cancel')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingStatus(true)}
              className="flex-1 md:flex-none flex items-center cursor-pointer justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {to('updateStatus')}
            </button>
          )}
        </div>
      </header>

        {/* Main Content */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-10 shadow-sm">
               <div className="mb-6 flex justify-between  px-2 sm:px-8">
            <Link href="/" dir="ltr" className="flex items-center gap-2 text-4xl font-black tracking-tight text-primary-500">
              <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500 dark:text-primary-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span>Go<span className="text-2xl text-black dark:text-white">Shop</span></span>
            </Link>
 <div>
                 <p className="text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'تاريخ الطلب' : 'Order Date'}</p>
                 <p className="font-bold dark:text-white">
                   {new Date(order.createdAt || order.date || new Date()).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                 </p>
               </div>
          </div>

             {/* Title */}
             <h2 className="text-2xl sm:text-3xl text-center font-bold mb-6 dark:text-white">
                 {to('orderId')}: #{order.order_number || order.id} ✨
             </h2> 
             {/* Order Status Timeline Row */}
             <div className="flex items-start justify-between mb-12 mt-8 px-2 sm:px-8">
                {[
                  { id: 'pending', label: to('status_pending') },
                  { id: 'processing', label: to('status_processing') },
                  { id: 'shipped', label: to('status_shipped') },
                  { id: 'delivered', label: to('status_delivered') }
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-white dark:border-[#081640] transition-colors duration-500 shadow-sm ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600'}`}>
                          {isActive ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold text-center transition-colors ${isCurrent ? 'text-primary-500' : isActive ? 'text-slate-800 dark:text-slate-200' : 'text-gray-400 dark:text-gray-500'}`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="flex-1 mt-4 h-1 bg-gray-100 dark:bg-white/5 rounded-full relative">
                          <div className={`absolute top-0 bottom-0 rtl:right-0 ltr:left-0 bg-primary-500 rounded-full transition-all duration-1000 ${isPast ? 'w-full' : 'w-0'}`} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
             </div>

             {/* Greeting & Message */}
             <div className="mb-10 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
               <p className="font-bold text-slate-900 dark:text-white mb-2">
                 {isRtl ? 'مرحباً' : 'Hello'} {order.name},
               </p>
               <p>
                 {isRtl
                   ? 'يتم معالجة طلبك وقريباً ستتمكن من الاستمتاع بمنتجاتك الجديدة.'
                   : 'Your order is being processed and you will soon be able to enjoy your new products.'}
               </p>
             </div>

             <hr className="border-t border-gray-200 dark:border-white/10 mb-8" />

             {/* Customer Details Row */}
             <div className="flex justify-between flex-wrap gap-4 mb-8 text-sm">
                  <div>
                   <p className="text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'العميل' : 'Customer'}</p>
                   <p className="font-bold dark:text-white">{order.name}</p>
                 </div> 
               <div>
                 <p className="text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</p>
                 <p className="font-bold dark:text-white">{order.email}</p>
               </div>
               <div>
                 <p className="text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</p>
                 <p className="font-bold dark:text-white">{order.phone}</p>
               </div>
                 <div>
                 <p className="text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'عنوان التوصيل' : 'Shipping Address'}</p>
                 <p className="font-bold leading-tight dark:text-white max-w-[200px] truncate">{order.address}</p>
               </div>
             </div>

             <hr className="border-t border-gray-200 dark:border-white/10 mb-8" /> 
             {/* Items List */}
             <div className="space-y-6 mb-8">
                {(order.items || []).map((item: any, index: number) => {
                  const product = item.product || {};
                  const productName = isRtl ? product.name_ar || product.name || 'Unknown Product' : product.name_en || product.name || 'Unknown Product';
                  const productImage = product.images?.[0] || 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=200&h=200&fit=crop';
                  return (
                    <div key={item.id || index} className="flex flex-row items-center justify-between gap-4">
                      <div className="flex gap-6 items-center">
                        <div className="relative w-20 h-20 rounded-2xl bg-white dark:bg-white/5 flex-shrink-0 border border-gray-100 dark:border-white/5 overflow-hidden p-2">
                          <img src={productImage} alt={productName} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-bold text-slate-900 dark:text-white text-base">
                            {productName}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            {isRtl ? 'الكمية' : 'Quantity'}: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-base">
                        {Number(item.price * item.quantity).toFixed(2)} ر.س
                      </div>
                    </div>
                  );
                })}
             </div>

             <hr className="border-t border-gray-200 dark:border-white/10 mb-8" />

             {/* Footer / Summary */}
             <div className="flex flex-col sm:flex-row justify-end items-start gap-8">
                <div className="w-full sm:w-72 space-y-3 order-1 sm:order-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{to('subtotal')}:</span>
                    <span className="font-bold dark:text-white">{subtotal.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{isRtl ? 'التوصيل' : 'Shipping'}:</span>
                    <span className="font-bold dark:text-white">{shipping === 0 ? (isRtl ? 'مجاني' : 'Free') : `${shipping} ر.س`}</span>
                  </div>
                  <hr className="border-t border-gray-200 dark:border-white/10 my-4" />
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-primary-500 dark:text-white">{to('total')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{total.toFixed(2)} ر.س</span>
                  </div>
                </div>
             </div>
          </section>
        </div> 
    </div>
  );
}
