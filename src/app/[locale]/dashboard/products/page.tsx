import ProductsList from '@/components/dashboard/products/ProductsList';
import {setRequestLocale} from 'next-intl/server';

export default async function DashboardProductsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProductsList />;
}
