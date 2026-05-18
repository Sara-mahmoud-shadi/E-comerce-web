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
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            {to('backToOrders')}
          </button>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white">
              {to('orderId')}: #{order.order_number?.replace('ORD-', '') || order.id}
            </h1>
            <div className={`px-4 py-1.5 bg-primary-500/10  text-primary-500 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 shadow ${getStatusColors(order.status_order)}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${order.status_order === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              {to(`status_${order.status_order}`) || order.status_order || 'Pending'}
            </div>
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
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
                className="px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-md cursor-pointer font-black text-[10px] hover:bg-gray-200 dark:hover:bg-white/10 transition-colors h-[46px] flex items-center justify-center"
              >
                {t('cancel')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingStatus(true)}
              className="flex-1 md:flex-none flex items-center cursor-pointer justify-center gap-3 px-8 py-4 bg-primary-500 text-white rounded-md font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
            >
              {to('updateStatus')}
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Items Section */}
          <section className="bg-white dark:bg-[#081640] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary-500" />
                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{to('orderItems')}</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('productsCount')}: {(order.items || []).length}</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/20">
                    <th className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400">{to('product')}</th>
                    <th className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400">{to('qty')}</th>
                    <th className="px-8 py-6 text-start text-[10px] font-black uppercase tracking-widest text-gray-400">{to('total')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {(order.items || []).map((item: any, index: number) => {
                    const product = item.product || {};
                    const productName = product.name || 'Unknown Product';
                    const categoryName = isRtl  ? product.category?.name_ar   : product.category?.name_en ;
                    const productImage = product.images?.[0] || 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=200&h=200&fit=crop';
                    
                    return (
                      <tr key={item.id || index} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-900">
                              <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">{productName}</h4>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{categoryName}</p>
                            </div>
                          </div>
                        </td> 
                        <td className="px-8 py-6">
                          <span className="text-sm font-black dark:text-white"> {item.quantity}</span>
                        </td>
                        <td className="px-8 py-6 flex gap-2 items-center">
                          <span className="text-sm font-black text-primary-500 dark:text-blue-400"> {Number(item.price * item.quantity).toFixed(2)} ر.س</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-10 bg-gray-50/50 dark:bg-gray-900/20 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">{to('subtotal')}</span>
                <span className="font-black dark:text-white"> {subtotal.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">{to('shipping')}</span>
                <span className="font-black text-emerald-500 uppercase tracking-widest text-[10px]">{to('free')}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-white/5">
                <span className="font-black uppercase tracking-widest dark:text-white">{to('total')}</span>
                <span className="text-2xl font-black text-primary-500 dark:text-blue-400 tracking-tighter">{total.toFixed(2)} ر.س</span>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-10">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{to('orderTimeline')}</h3>
            </div>
            
            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-white/5">
              {timelineSteps.map((item, index) => (
                <div key={index} className={`relative pl-12 ${!item.active ? 'opacity-50' : ''}`}>
                  <div className={`absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 border-white dark:border-[#081640] ${item.active ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-400'}`}>
                    {item.active && index === timelineSteps.filter(s => s.active).length - 1 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black dark:text-white uppercase tracking-widest">{to(item.status)}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.date}</p>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-2">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          {/* Customer Card */}
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{to('customerDetails')}</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <img src={`https://i.pravatar.cc/150?u=${order.email}`} className="w-16 h-16 rounded-2xl object-cover" alt="" />
              <div>
                <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">{order.name}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer ID: #CUST-{order.id}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Email Address</span>
                  <span className="text-xs font-bold truncate">{order.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Phone Number</span>
                  <span className="text-xs font-bold">{order.phone}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Card */}
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{to('shippingAddress')}</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-bold dark:text-white leading-relaxed">
                {order.address}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3 text-emerald-500">
                <Truck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Express Shipping</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
