'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicInputProps {
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function DynamicInput({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className
}: DynamicInputProps) {
  return (
    <div className={cn("space-y-2 group", className)}>
      <label className="text-[10px] font-black tracking-widest text-gray-500   transition-colors ">
        {label}
      </label>
      <div className="relative mt-2">
        <div className="absolute ltr:left-6 rtl:right-6 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center transition-transform  ">
          <Icon className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
        </div>
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3 bg-gray-100/80 dark:bg-gray-900/50 border-gray-200 dark:border-white/5 rounded-md border px-14 text-sm font-bold placeholder:text-gray-400   focus:border-primary-500/30 transition-all outline-none dark:text-white"
        />
        
        {/* Decorative inner glow for focus state */}
       </div>
    </div>
  );
}
