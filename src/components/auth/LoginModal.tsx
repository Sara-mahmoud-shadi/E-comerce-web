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

import DynamicInput from '@/components/shared/DynamicInput';

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
         
            <DialogTitle className="text-3xl font-black text-primary-500 tracking-tighter text-center  dark:text-white mb-2">
              {t('welcomeBack')} 👋
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
              {t('loginSubtitle')}
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <DynamicInput
              label={t('email')}
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="admin@example.com"
              required
            />

            <DynamicInput
              label={t('password')}
              icon={Lock}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 cursor-pointer bg-accent-500 text-white rounded-md font-black tracking-widest shadow-lg  hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 mt-10"
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
