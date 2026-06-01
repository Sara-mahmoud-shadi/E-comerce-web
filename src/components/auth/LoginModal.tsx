'use client';
import { apiFetch } from '@/lib/api';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
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

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/';
const API_LOGIN = baseUrl.endsWith('/') 
  ? `${baseUrl}auth/login` 
  : `${baseUrl}/auth/login`;

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const t = useTranslations('Auth');
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field: 'email' | 'password') => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await apiFetch(API_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message ?? `Login failed (${res.status})`);
      }

      console.log(data);
      // Persist token — API may return it as access_token or token
      const receivedToken = data?.access_token ?? data?.token;
      if (receivedToken) {
        localStorage.setItem('token', receivedToken);
        // Set cookie for server-side/middleware access
        document.cookie = `token=${receivedToken}; path=/; max-age=86400; SameSite=Lax`;
      }

      onClose();
      console.log('PUSHING TO:', `/dashboard`);
      router.push('/dashboard');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90%] sm:max-w-md bg-white dark:bg-[#081640] rounded-xl md:rounded-[2.5rem] border-white/20 dark:border-white/5 p-0 overflow-hidden shadow-2xl">
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

            {/* Error banner */}
            {errorMsg && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <DynamicInput
              label={t('email')}
              icon={Mail}
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="admin@example.com"
              required
            />

            <DynamicInput
              label={t('password')}
              icon={Lock}
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 cursor-pointer bg-accent-500 text-white rounded-md font-black tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 mt-10"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t('login')
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
