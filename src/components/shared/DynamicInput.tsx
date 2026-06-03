'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicInputProps {
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onClearError?: () => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
}

export default function DynamicInput({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  onClearError,
  placeholder,
  required = false,
  className,
  error,
}: DynamicInputProps) {
  return (
    <div className={cn("space-y-2 group", className)}>
      <label className={cn(
        "text-[10px] font-black tracking-widest transition-colors",
        error ? "text-red-400" : "text-gray-500"
      )}>
        {label}
      </label>
      <div className="relative mt-2">
        <div className={cn(
          "absolute ltr:left-6 rtl:right-6 w-5 h-5 flex items-center justify-center transition-transform",
          type === 'textarea' ? "top-3.5" : "top-1/2 -translate-y-1/2"
        )}>
          <Icon className={cn(
            "w-4 h-4 transition-colors",
            error ? "text-red-400" : "text-gray-400 group-focus-within:text-primary-500"
          )} />
        </div>
        {type === 'textarea' ? (
          <textarea
            required={required}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (onClearError) onClearError();
            }}
            placeholder={placeholder}
            rows={4}
            className={cn(
              "w-full py-3 bg-gray-100/80 dark:bg-gray-900/50 rounded-md border rtl:pr-14 rtl:pl-6 ltr:pl-14 ltr:pr-6 text-sm placeholder:text-gray-400 transition-all outline-none dark:text-white resize-y min-h-[100px]",
              error
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 dark:border-white/5 focus:border-primary-500/30"
            )}
          />
        ) : (
          <input
            type={type}
            required={required}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (onClearError) onClearError();
            }}
            placeholder={placeholder}
            className={cn(
              "w-full py-3 bg-gray-100/80 dark:bg-gray-900/50 rounded-md border rtl:pr-14 rtl:pl-6 ltr:pl-14 ltr:pr-6 text-sm placeholder:text-gray-400 transition-all outline-none dark:text-white",
              error
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 dark:border-white/5 focus:border-primary-500/30"
            )}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 ml-1 text-[11px] text-red-400 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
