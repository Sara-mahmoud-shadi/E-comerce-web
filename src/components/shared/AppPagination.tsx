'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from '@/components/ui/pagination';

interface AppPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    showPageInfo?: boolean;
}

export default function AppPagination({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    showPageInfo = true,
}: AppPaginationProps) {
    const t = useTranslations('pagination');

    if (totalPages <= 1) return null;

    const handlePage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange(page);
    };

    // Build page number list with ellipsis
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        for (let i = 1; i <= totalPages; i++) {
            const isFirst = i === 1;
            const isLast = i === totalPages;
            const isNear = Math.abs(i - currentPage) <= 1;
            if (isFirst || isLast || isNear) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== 'ellipsis') {
                pages.push('ellipsis');
            }
        }
        return pages;
    };

    return (
        <div className="mt-10 space-y-3">
            <Pagination>
                <PaginationContent>
                    {/* Previous */}
                    <PaginationItem>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePage(currentPage - 1); }}
                            aria-disabled={currentPage === 1}
                            aria-label={t('previous')}
                            className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${currentPage === 1
                                    ? 'pointer-events-none text-muted-foreground opacity-40'
                                    : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'}`}
                        >
                            <ChevronLeftIcon className="w-4 h-4 rtl:rotate-180" /> 
                        </a>
                    </PaginationItem>

                    {/* Page numbers */}
                    {getPageNumbers().map((page, idx) =>
                        page === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handlePage(page); }}
                                    isActive={page === currentPage}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}

                    {/* Next */}
                    <PaginationItem>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePage(currentPage + 1); }}
                            aria-disabled={currentPage === totalPages}
                            aria-label={t('next')}
                            className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${currentPage === totalPages
                                    ? 'pointer-events-none text-muted-foreground opacity-40'
                                    : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'}`}
                        > 
                            <ChevronRightIcon className="w-4 h-4 rtl:rotate-180" />
                        </a>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            {/* Page info */}
            {showPageInfo && (
                <p className="text-center text-sm text-muted-foreground">
                    {t('pageInfo', { current: currentPage, total: totalPages, count: totalItems })}
                </p>
            )}
        </div>
    );
}
