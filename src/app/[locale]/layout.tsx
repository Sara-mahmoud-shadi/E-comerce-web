import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../globals.css";  
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/sonner';

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "Premium E-Commerce",
  description: "Modern E-Commerce platform with AR & EN support",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body
        className={`${cairo.variable} antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col font-sans`}
      >
        <NextIntlClientProvider messages={messages}> 
          <main className="">
            {children}
          </main> 
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
