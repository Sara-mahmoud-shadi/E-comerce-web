'use client';

import { useTranslations } from 'next-intl';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ProductSortProps {
  value: string;
  onValueChange: (value: string) => void;
  isRtl: boolean;
}

export function ProductSort({ value, onValueChange, isRtl }: ProductSortProps) {
  const t = useTranslations('Products');

  return (
    <Select value={value} onValueChange={onValueChange} dir={isRtl ? 'rtl' : 'ltr'}>
      <SelectTrigger className="min-w-[180px] px-6 py-3 bg-gray-50 dark:bg-white/5 rounded-md border-gray-200 dark:border-white/5 text-[10px] font-black tracking-widest text-primary-500 cursor-pointer dark:text-white h-auto focus:ring-0 focus:ring-offset-0">
        <div className="flex items-center gap-2"> 
          <SelectValue placeholder={t('sortBy')} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-[#081640] border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl">
        <SelectItem value="sort-label" disabled className="text-[10px] font-black tracking-widest opacity-50">
          {t('sortBy')}
        </SelectItem>
        <SelectItem value="price_desc" className="text-[10px] font-black tracking-widest focus:bg-primary-500/10 focus:text-primary-500 cursor-pointer">
          {t('highToLow')}
        </SelectItem>
        <SelectItem value="price_asc" className="text-[10px] font-black tracking-widest focus:bg-primary-500/10 focus:text-primary-500 cursor-pointer">
          {t('lowToHigh')}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
