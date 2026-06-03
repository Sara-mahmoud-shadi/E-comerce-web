import { LayoutGrid } from 'lucide-react'
import { useLocale } from 'next-intl';
import React, { useState } from 'react'

export default function LoadingState() {
    const locale = useLocale();
      const isRtl = locale === 'ar';
    const [dots, setDots] = useState('');
  return (
     <div className="w-full h-full flex flex-col items-center justify-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-gray-100 border-t-primary-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-primary-400 animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 tabular-nums">
            {isRtl ? `جارٍ التحميل${dots}` : `Loading${dots}`}
          </p>
        </div>
  )
}
