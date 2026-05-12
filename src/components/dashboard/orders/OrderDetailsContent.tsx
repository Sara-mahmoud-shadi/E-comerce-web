'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
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
  MoreVertical,
  Mail,
  Phone
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';

interface OrderDetailsContentProps {
  id: string;
}

const MOCK_ORDER = {
  id: '#ORD-8392',
  date: '2026-05-10 14:30',
  status: 'delivered',
  customer: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
  },
  shippingAddress: {
    street: '123 Luxury Ave',
    city: 'Dubai',
    country: 'United Arab Emirates',
    zip: '00000'
  },
  payment: {
    method: 'Credit Card',
    last4: '4242',
    status: 'Paid'
  },
  items: [
    { id: 1, name: 'Premium Coffee Set', category: 'coffee', price: 299.00, quantity: 1, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=200&h=200&fit=crop' },
    { id: 2, name: 'Elite Serving Tray', category: 'eliteServing', price: 199.00, quantity: 1, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&h=200&fit=crop' }
  ],
  subtotal: 498.00,
  shipping: 0.00,
  tax: 0.00,
  total: 498.00,
  history: [
    { status: 'status_pending', date: '2026-05-10 14:30', note: 'Order received and being prepared' },
    { status: 'status_processing', date: '2026-05-10 14:35', note: 'Payment processed successfully' },
    { status: 'status_shipped', date: '2026-05-10 16:00', note: 'Order picked up by courier' },
    { status: 'status_delivered', date: '2026-05-10 18:45', note: 'Order delivered to customer' }
  ]
};

export default function OrderDetailsContent({ id }: OrderDetailsContentProps) {
  const t = useTranslations('Dashboard');
  const to = useTranslations('Orders');
  const tc = useTranslations('Categories');
  const router = useRouter();

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
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white">
              {to('orderId')}: {MOCK_ORDER.id}
            </h1>
            <div className="px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {to(`status_${MOCK_ORDER.status}`)}
            </div>
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {MOCK_ORDER.date}
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-[#081640] border border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
            <Printer className="w-4 h-4" />
            {to('printInvoice')}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
            {to('updateStatus')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Items Section */}
          <section className="bg-white dark:bg-[#081640] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{to('orderItems')}</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{MOCK_ORDER.items.length} Items</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/20">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Qty</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {MOCK_ORDER.items.map((item) => (
                    <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-900">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">{item.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tc(item.category)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black dark:text-white">${item.price}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black dark:text-white">x{item.quantity}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400">${item.price * item.quantity}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-10 bg-gray-50/50 dark:bg-gray-900/20 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">{to('subtotal')}</span>
                <span className="font-black dark:text-white">${MOCK_ORDER.subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">{to('shipping')}</span>
                <span className="font-black text-emerald-500 uppercase tracking-widest text-[10px]">{to('free')}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-white/5">
                <span className="font-black uppercase tracking-widest dark:text-white">{to('total')}</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">${MOCK_ORDER.total}</span>
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
              {MOCK_ORDER.history.map((item, index) => (
                <div key={index} className="relative pl-12">
                  <div className={`absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 border-white dark:border-[#081640] ${index === MOCK_ORDER.history.length - 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-400'}`}>
                    {index === MOCK_ORDER.history.length - 1 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
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
              <img src={MOCK_ORDER.customer.avatar} className="w-16 h-16 rounded-2xl object-cover" alt="" />
              <div>
                <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">{MOCK_ORDER.customer.name}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer ID: #CUST-920</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Email Address</span>
                  <span className="text-xs font-bold truncate">{MOCK_ORDER.customer.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Phone Number</span>
                  <span className="text-xs font-bold">{MOCK_ORDER.customer.phone}</span>
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
                {MOCK_ORDER.shippingAddress.street}<br />
                {MOCK_ORDER.shippingAddress.city}, {MOCK_ORDER.shippingAddress.zip}<br />
                {MOCK_ORDER.shippingAddress.country}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3 text-emerald-500">
                <Truck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Express Shipping</span>
              </div>
            </div>
          </section>

          {/* Payment Card */}
          <section className="bg-white dark:bg-[#081640] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{to('paymentMethod')}</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-10 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-white/5">
                <CreditCard className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">{MOCK_ORDER.payment.method}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ending in {MOCK_ORDER.payment.last4}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{to('paymentStatus')}</span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                  {MOCK_ORDER.payment.status}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
