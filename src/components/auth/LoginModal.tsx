'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { User, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onClose();
    router.push('/dashboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#081640] rounded-[2.5rem] border-white/20 dark:border-white/5 p-0 overflow-hidden shadow-2xl">
        <div className="p-10">
          {/* Header */}
          <DialogHeader className="mb-5 text-center space-y-0">
         
            <DialogTitle className="text-3xl font-black tracking-tighter text-center  dark:text-white mb-2">
              {t('welcomeBack')}
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
              {t('loginSubtitle')}
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-4">
                {t('email')}
              </label>
              <div className="relative mt-4">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full h-14 bg-gray-50 dark:bg-gray-900/50 border-transparent rounded-2xl px-14 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                  {t('password')}
                </label>
                {/* <button type="button" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors">
                  {t('forgotPassword')}
                </button> */}
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-gray-50 dark:bg-gray-900/50 border-transparent rounded-2xl px-14 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-accent-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 mt-10"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t('login')} 
                </>
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
