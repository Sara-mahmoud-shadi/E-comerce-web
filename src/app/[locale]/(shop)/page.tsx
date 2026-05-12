import { useTranslations } from 'next-intl';
import {Link} from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = [
  { id: 'serving', slug: 'serving', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop' },
  { id: 'electrical', slug: 'electrical', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=300&fit=crop' },
  { id: 'cooking', slug: 'cooking', image: 'https://cdn.salla.sa/form-builder/i24jD6kzhk2rH64IiqofemNYZ5Jow6MP6GkMGx85.png' },
  { id: 'coffee', slug: 'coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop' },
  { id: 'bakery', slug: 'bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=300&fit=crop' },
  { id: 'buffet', slug: 'buffet', image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=500&h=300&fit=crop' },
   { id: 'cleaning', slug: 'cleaning', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=300&fit=crop' },
  { id: 'basins', slug: 'basins', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=300&fit=crop' },
];

export default function HomePage() {
  const t = useTranslations('Home');
  const tc = useTranslations('Categories');

  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden text-white min-h-[500px] flex items-center shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent rtl:bg-gradient-to-l" />
        </div>

        <div className="relative z-10 p-8 md:p-16 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-lg font-medium opacity-90">
            {t('heroSubtitle')}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-accent-500 text-primary-950 px-8 py-4 rounded-full font-black hover:bg-accent-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:scale-95"
          >
            {t('shopNow')}
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* Featured Categories - Bento Grid Design */}
      <section className=" w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase text-gray-900 dark:text-white mb-2">
              {t('featuredCategories')}
            </h2>
            <div className="h-2 w-24 bg-accent-500 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">
          {/* Main Large Card */}
          <Link
            href={`/categories/${CATEGORIES[0].slug}`}
            className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1"
          >
            <Image src={CATEGORIES[0].image} alt={tc(CATEGORIES[0].id)} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-8 left-8 rtl:left-auto rtl:right-8">
              <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">{tc(CATEGORIES[0].id)}</h3>
             </div>
          </Link>

          {/* Medium Horizontal Card */}
          <Link
            href={`/categories/${CATEGORIES[1].slug}`}
            className="md:col-span-2 group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 transform hover:-translate-y-1"
          >
            <Image src={CATEGORIES[1].image} alt={tc(CATEGORIES[1].id)} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute z-10 top-6 left-6 rtl:left-auto rtl:right-6">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">{tc(CATEGORIES[1].id)}</h3>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent rtl:bg-gradient-to-l" />

          </Link>

          {/* Small Square Cards */}
          <Link
            href={`/categories/${CATEGORIES[2].slug}`}
            className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 transform hover:-translate-y-1"
          >
            <Image src={CATEGORIES[2].image} alt={tc(CATEGORIES[2].id)} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute z-10 inset-0 flex items-center justify-center p-4 text-center">
              <h3 className="text-lg font-black text-white uppercase tracking-widest">{tc(CATEGORIES[2].id)}</h3>
            </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent rtl:bg-gradient-to-l" />

          </Link>

          <Link
            href={`/categories/${CATEGORIES[3].slug}`}
            className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 transform hover:-translate-y-1"
          >
            <Image src={CATEGORIES[3].image} alt={tc(CATEGORIES[3].id)} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute z-10 inset-0 flex items-center justify-center p-4 text-center">
              <h3 className="text-lg font-black text-white uppercase tracking-widest">{tc(CATEGORIES[3].id)}</h3>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent rtl:bg-gradient-to-l" />

          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">

          {
            CATEGORIES.slice(4).map((category, index) => (
              <Link
                key={index}
                href={`/categories/${category.slug}`}
                className="group h-60 relative rounded-3xl  overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 transform hover:-translate-y-1"
              >
                <Image src={category.image} alt={tc(category.id)} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute z-10 inset-0 flex items-center justify-center p-4 text-center">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">{tc(category.id)}</h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent rtl:bg-gradient-to-l" />
              </Link>
            ))
          }
        </div>
      </section>
    </div>
  );
}
