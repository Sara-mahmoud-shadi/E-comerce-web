'use client';
import { apiFetch } from '@/lib/api';

import React, { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
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
  Phone
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
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/'}orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) {
        throw new Error('Failed to update status');
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

  // Build dynamic timeline steps based on status_order
  const timelineSteps = [
    {
      status: 'status_pending',
      date: formatDate(order.createdAt),
      note: isRtl ? 'تم استلام الطلب ويتم تحضيره' : 'Order received and being prepared',
      active: true
    },
    {
      status: 'status_processing',
      date: ['processing', 'shipped', 'delivered'].includes(order.status_order) 
        ? formatDate(order.updatedAt || order.createdAt) 
        : '-',
      note: isRtl ? 'تم معالجة الدفع وبدأ العمل على الطلب' : 'Payment processed and order is in production',
      active: ['processing', 'shipped', 'delivered'].includes(order.status_order)
    },
    {
      status: 'status_shipped',
      date: ['shipped', 'delivered'].includes(order.status_order) 
        ? formatDate(order.updatedAt || order.createdAt) 
        : '-',
      note: isRtl ? 'تم تسليم الطلب لشركة الشحن' : 'Order picked up by courier',
      active: ['shipped', 'delivered'].includes(order.status_order)
    },
    {
      status: 'status_delivered',
      date: order.status_order === 'delivered' 
        ? formatDate(order.updatedAt) 
        : '-',
      note: isRtl ? 'تم توصيل الطلب للعميل' : 'Order delivered to customer',
      active: order.status_order === 'delivered'
    }
  ];

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
        
        <div className="flex items-center gap-4 w-full md:w-auto">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Items Section */}
          <section className="bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-bold dark:text-white">{to('orderItems')}</h2>
              </div>
              <span className="text-sm font-medium text-gray-500">{t('productsCount')}: {(order.items || []).length}</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    <th className="px-6 md:px-8 py-4 text-start text-xs font-bold text-gray-500">{to('product')}</th>
                    <th className="px-6 md:px-8 py-4 text-start text-xs font-bold text-gray-500">{to('qty')}</th>
                    <th className="px-6 md:px-8 py-4 text-start text-xs font-bold text-gray-500">{to('total')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {(order.items || []).map((item: any, index: number) => {
                    const product = item.product || {};
                    const productName = product.name || 'Unknown Product';
                    const categoryName = isRtl  ? product.category?.name_ar   : product.category?.name_en ;
                    const productImage = product.images?.[0] || 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=200&h=200&fit=crop';
                    
                    return (
                      <tr key={item.id || index} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 md:px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-900">
                              <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold dark:text-white">{productName}</h4>
                              <p className="text-xs font-medium text-gray-500 mt-0.5">{categoryName}</p>
                            </div>
                          </div>
                        </td> 
                        <td className="px-6 md:px-8 py-6">
                          <span className="text-sm font-bold dark:text-white">{item.quantity}</span>
                        </td>
                        <td className="px-6 md:px-8 py-6">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{Number(item.price * item.quantity).toFixed(2)} ر.س</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-500">{to('subtotal')}</span>
                <span className="font-bold dark:text-white">{subtotal.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-500">{to('shipping')}</span>
                <span className="font-bold text-emerald-500">{to('free')}</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200 dark:border-white/5">
                <span className="font-bold text-gray-900 dark:text-white">{to('total')}</span>
                <span className="text-xl font-black text-primary-500 dark:text-primary-400">{total.toFixed(2)} ر.س</span>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                {to('orderTimeline')}
              </h2>
            </div>
            <div className="p-6 md:p-8 space-y-8 relative before:absolute ltr:before:right-10 rtl:before:left-auto rtl:before:left-10 before:top-10 before:bottom-10 before:w-px before:bg-gray-200 dark:before:bg-white/10">
              {timelineSteps.map((item, index) => (
                <div key={index} className={`relative rtl:pl-12 ltr:pr-12 ${!item.active ? 'opacity-40' : ''}`}>
                  <div className={`absolute rtl:-left-1 ltr:-right-1 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 border-[3px] border-white dark:border-[#081640] ${item.active ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                    {item.active && index === timelineSteps.filter(s => s.active).length - 1 ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold dark:text-white">{to(item.status)}</h4>
                    <p className="text-xs font-medium text-gray-500 mt-1">{item.date}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Customer Card */}
          <section className="bg-white dark:bg-[#081640] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-500" />
                {to('customerDetails')}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <img src={`https://i.pravatar.cc/150?u=${order.email}`} className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-100 dark:border-white/5" alt="" />
                <div>
                  <h4 className="text-base font-bold dark:text-white">{order.name}</h4>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">ID: #CUST-{order.id}</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500">Email Address</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{order.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500">Phone Number</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{order.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500">Address</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{order.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
 
        </div>
      </div>
    </div> 
  );
}
