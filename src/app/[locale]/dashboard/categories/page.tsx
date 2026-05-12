import CategoriesList from '@/components/dashboard/categories/CategoriesList';
import {setRequestLocale} from 'next-intl/server';

export default async function DashboardCategoriesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CategoriesList />;
}
