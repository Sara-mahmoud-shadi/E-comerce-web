import CategoryForm from '@/components/dashboard/categories/CategoryForm';
import {setRequestLocale} from 'next-intl/server';

export default async function EditCategoryPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  

  return <CategoryForm id={id} isEditing={true} />;
}
