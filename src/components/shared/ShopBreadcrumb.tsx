'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbStep {
  label: string;
  href?: string;
}

interface ShopBreadcrumbProps {
  items: BreadcrumbStep[];
  className?: string;
}

export function ShopBreadcrumb({ items, className }: ShopBreadcrumbProps) {
  const tn = useTranslations('Navigation');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <nav className={cn("mb-8", className)} aria-label="Breadcrumb">
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">

        <Link
          href="/"
          className="font-bold text-[11px] text-gray-500 hover:text-primary-500 transition-colors"
        >
          {tn('home')}
        </Link>

        {items.map((item, index) => (
          <Fragment key={index}>
            <ChevronRight className={cn("w-3 h-3 text-gray-600", isRtl ? "rotate-180" : "rotate-0")} />
            <div className="flex items-center">
              {item.href ? (
                <Link
                  href={item.href}
                  className="font-bold text-[11px] text-gray-500 hover:text-primary-500 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-black text-[11px] text-primary-500">
                  {item.label}
                </span>
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
