import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {setRequestLocale} from 'next-intl/server';

export default async function DashboardRootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
