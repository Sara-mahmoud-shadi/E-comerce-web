import OrdersList from '@/components/dashboard/orders/OrdersList';
import {setRequestLocale} from 'next-intl/server';

export default async function DashboardOrdersPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <OrdersList />;
}
