 
import ProductForm from '@/components/dashboard/products/ProductForm';
import {setRequestLocale} from 'next-intl/server';

export default async function ProductDetailsPage({
  params
}: {
  params: Promise<{ locale: string, id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ProductForm isEditing={true} productId={id} />;
}
