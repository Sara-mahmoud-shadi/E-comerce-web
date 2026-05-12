import CategoryForm from '@/components/dashboard/categories/CategoryForm';
import {setRequestLocale} from 'next-intl/server';

export default async function EditCategoryPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const mockData = {
    name: 'Serving & Hospitality',
    nameAr: 'التقديم والضيافة',
    slug: 'serving',
    description: 'Premium serving tools and hospitality equipment.'
  };

  return <CategoryForm initialData={mockData} isEditing={true} />;
}
