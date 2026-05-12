import ProductDetailsContent from '@/components/dashboard/products/ProductDetailsContent';
import {setRequestLocale} from 'next-intl/server';

export default async function ProductDetailsPage({
  params
}: {
  params: Promise<{ locale: string, id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ProductDetailsContent id={id} />;
}
