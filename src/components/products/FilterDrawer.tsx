'use client';

import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import SidebarFilters from './SidebarFilters';

interface FilterDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRtl: boolean;
  selectedPriceRanges: string[];
  handlePriceChange: (range: string) => void;
  handleReset: () => void;
  fetchData: () => void;
}

export default function FilterDrawer({
  isOpen,
  onOpenChange,
  isRtl,
  selectedPriceRanges,
  handlePriceChange,
  handleReset,
  fetchData,
}: FilterDrawerProps) {
  const t = useTranslations('Products');

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button className="lg:hidden p-3 bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center transition-all cursor-pointer">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side={isRtl ? 'right' : 'left'}
        className="w-[300px] sm:w-[350px] p-0 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 flex flex-col h-full"
      >
        <SheetHeader className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 text-2xl font-black text-primary-500 select-none">
            {t('filters')}
          </SheetTitle>
          <SheetClose asChild>
            <button className="p-2 rounded-md bg-primary-500/10 text-primary-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0">
              <X className="w-4 h-4" />
            </button>
          </SheetClose>
        </SheetHeader>
        <div className="space-y-6">
          <SidebarFilters
            selectedPriceRanges={selectedPriceRanges}
            handlePriceChange={handlePriceChange}
            handleReset={handleReset}
            fetchData={fetchData}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
