'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {  Phone, MapPin, ArrowRight } from 'lucide-react'; 

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-gradient-to-br from-primary-500 via-[#1a4d3c] to-[#0a1c17] text-white">
      {/* Top CTA Section (Green Hero) */}
      <div className="py-10 border-b border-white/5 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2d6a4f]/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl italic font-black tracking-tight text-white leading-tight">
            {t('cta_title')}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium">
            {t('cta_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/products" 
              className="bg-[#f2a93b] hover:bg-[#d9922e] text-white font-black px-12 py-5 rounded-2xl transition-all shadow-2xl shadow-amber-500/20 flex items-center gap-2 group"
            >
              {t('cta_button_explore')}
              <ArrowRight className="w-6 h-6 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Brand & Description */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="text-4xl font-black tracking-tighter   flex items-center gap-2">
              GoShop 
            </Link>
            <p className="text-gray-300 text-lg leading-relaxed max-w-sm font-medium">
              {t('description')}
            </p>  
            <div className="flex gap-4">
               {/* Add social links back if needed, currently matching user's last manual edit */}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#f2a93b]">{t('services')}</h4>
            <ul className="space-y-5">
              <li><Link href="#" className="text-gray-00 hover:text-white transition-colors font-bold text-sm uppercase tracking-wide">{t('service_catering')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors font-bold text-sm uppercase tracking-wide">{t('service_maintenance')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors font-bold text-sm uppercase tracking-wide">{t('service_consultancy')}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#f2a93b]">{t('policies')}</h4>
            <ul className="space-y-5">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors font-bold text-sm uppercase tracking-wide">{t('policy_privacy')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors font-bold text-sm uppercase tracking-wide">{t('policy_terms')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors font-bold text-sm uppercase tracking-wide">{t('policy_returns')}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#f2a93b]">{t('contact_title')}</h4>
            <div className="space-y-6">
               <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#f2a93b] group-hover:text-[#0a1c17] transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white font-black uppercase tracking-widest mb-1">{t('contact_hq')}</p>
                    <p className="text-gray-300 font-bold">{t('hq_value')}</p>
                  </div>
               </div>
               <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#f2a93b] group-hover:text-[#0a1c17] transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white font-black uppercase tracking-widest mb-1">{t('contact_phone')}</p>
                    <p className="text-gray-300 font-bold ltr">+966 500 11 966</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
 
      </div>
    </footer>
  );
}
