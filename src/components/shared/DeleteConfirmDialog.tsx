'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function DeleteConfirmDialog({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
  title,
  description
}: DeleteConfirmDialogProps) {
  const t = useTranslations('Dashboard');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-md md:rounded-[2rem] bg-white dark:bg-[#081640] border-gray-100 dark:border-white/5 p-10">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl mt-5 text-center font-black tracking-tight dark:text-white">
            {title || t('deleteConfirmTitle')}
          </DialogTitle> 
        </DialogHeader>
        <DialogFooter className="gap-3 md:mt-2 sm:!justify-center items-center w-full">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-md cursor-pointer font-black tracking-widest text-[10px] border border-gray-100 dark:border-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            {t('cancel')}
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-3 rounded-md cursor-pointer bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/30 transition-all disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('delete')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
