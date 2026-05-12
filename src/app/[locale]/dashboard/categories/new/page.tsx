import CategoryForm from '@/components/dashboard/categories/CategoryForm';
import {setRequestLocale} from 'next-intl/server';

export default async function NewCategoryPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CategoryForm />;
}
