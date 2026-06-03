'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

interface DynamicSelectProps {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
}

export default function DynamicSelect({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  className,
  error
}: DynamicSelectProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className={cn("space-y-2 group", className)}>
      {label && (
        <label className="text-[10px] font-black tracking-widest text-gray-500 transition-colors">
          {label}
        </label>
      )}
      <div className="relative mt-2">
        {Icon && (
          <div className="absolute ltr:left-6 rtl:right-6 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center transition-transform z-10 pointer-events-none">
            <Icon className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
        )}
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger 
            dir={isRtl ? 'rtl' : 'ltr'}
            className={cn(
              "w-full h-[46px] bg-gray-100/80 dark:bg-gray-900/50 rounded-md border text-sm font-bold placeholder:text-gray-400 transition-all outline-none dark:text-white",
              error
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 dark:border-white/5 focus:border-primary-500/30",
              Icon ? "px-14" : "px-4"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent 
            dir={isRtl ? 'rtl' : 'ltr'}
            className="bg-white dark:bg-[#081640] border-gray-100 dark:border-white/5 rounded-2xl shadow-2xl z-50"
          >
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="font-bold text-xs uppercase tracking-widest py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <p className="text-[11px] font-bold text-red-400 flex items-center gap-1.5 mt-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
