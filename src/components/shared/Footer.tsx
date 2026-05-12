'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Globe, Mail, Phone, ArrowRight, Send, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="mt-20 bg-black text-white overflow-hidden">
      {/* Newsletter Section */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left rtl:md:text-right">
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">
                {t('newsletter_title')}
              </h3>
              <p className="text-gray-400 text-sm">
                {t('newsletter_subtitle')}
              </p>
            </div>
            <div className="w-full max-w-md">
              <form className="relative flex items-center">
                <input
                  type="email"
                  placeholder={t('newsletter_placeholder')}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-sm outline-none focus:border-accent-500 transition-colors"
                />
                <button type="button" className="absolute right-2 rtl:right-auto rtl:left-2 bg-accent-500 hover:bg-accent-600 text-primary-950 p-2 rounded-full transition-all group">
                  <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black tracking-tighter uppercase text-white">
              E-comerce<span className="text-accent-500">.</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
            <div className="flex gap-4">
              {[Send, Share2, Globe].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-500 hover:text-primary-950 transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent-500 mb-8">{t('about')}</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{t('about')}</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent-500 mb-8">{t('privacy')}</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{t('terms')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent-500 mb-8">{t('contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-accent-500" />
                hello@cyberluxe.com
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-accent-500" />
                +1 (555) 000-0000
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Globe className="w-4 h-4 text-accent-500" />
                www.cyberluxe.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} E-comerce. {t('rights')}.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
