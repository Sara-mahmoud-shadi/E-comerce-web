'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Heart, Star, Headphones } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'serving', slug: 'serving', image: 'https://cdn.salla.sa/form-builder/i24jD6kzhk2rH64IiqofemNYZ5Jow6MP6GkMGx85.png' },
  { id: 'electrical', slug: 'electrical', image: 'https://cdn.salla.sa/form-builder/Kshmj9yWRFLy81cQ2U7j4demNI8pj6LYie9qyMRV.png' },
  { id: 'cooking', slug: 'cooking', image: 'https://cdn.salla.sa/form-builder/IArkAep6Y9gApOA0ZqAwvMP3xuDOM07FYwnSFwY7.jpg' },
  { id: 'coffee', slug: 'coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop' },
  { id: 'bakery', slug: 'bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=300&fit=crop' },
  { id: 'buffet', slug: 'buffet', image: 'https://cdn.salla.sa/form-builder/1wHkaHd13tnEQsriki8TUNrrYcD2dh97FY74lQaF.jpg' },
  { id: 'cleaning', slug: 'cleaning', image: 'https://cdn.salla.sa/form-builder/LrAVdN9Qo4CdQMSOhEsEpZRqqzsN1gd5wKArFBu5.png' },
  { id: 'basins', slug: 'basins', image: 'https://cdn.salla.sa/form-builder/wvVcZILPBsOHY2QbAdE8j3j4NKt7LK7mgdOQAzuw.png' },
];
const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=800&fit=crop", // Woman cooking lifestyle
    title: "Refresh Your Lifestyle",
    subtitle: "HEALTHY LIVING"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=300&fit=crop",
    title: "Next Gen Computing",
    subtitle: "POWERFUL TECH"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=300&fit=crop",
    title: "Pure Sound Experience",
    subtitle: "AUDIO ELITE"
  }
];

export default function HomePage() {
  const t = useTranslations('Home');
  const tc = useTranslations('Categories');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex flex-col py-12">
      {/* Hero Section - TRUE Full Width & Height */}
      <section className="relative w-full h-[700px] lg:h-[60vh] bg-linear-to-br to-white from-[#f1f4f1] overflow-hidden flex flex-col lg:flex-row items-center  ">
        <div className="flex-1 z-10 p-8 2xl:p-32 rtl:2xl:mr-20 ltr:2xl:ml-20 2xl:max-w-4xl">
          <span className="text-primary-500 font-bold bg-[#e6ece6] tracking-widest text-sm mt-9 mb-5 shadow inline-block px-6 py-2 rounded-full">
            {t('newCollection')}
          </span>
          <h1 className="text-6xl italic lg:text-7xl font-black text-gray-900 mb-10 leading-tight tracking-tighter">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-wrap gap-6 mb-10">
            <Link
              href="/products"
              className="bg-primary-500 text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-primary-600 transition-all shadow-2xl shadow-primary-500/20 active:scale-95"
            >
              {t('shopNow')}
              <ArrowRight className="w-6 h-6 rtl:rotate-180" />
            </Link>
          </div>


        </div>

        <div className="flex-1 relative w-full h-full min-h-[500px] lg:min-h-0 flex items-center justify-center group">
          <div className="relative w-full h-full overflow-hidden">
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentSlide ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-105 translate-x-10'
                  }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover z-10"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/5 z-20" />
              </div>
            ))}

            <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-[#e2e7e2] dark:from-slate-950 to-transparent z-30 pointer-events-none" />

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white dark:from-slate-950 to-transparent z-30 pointer-events-none" />
          </div>


          {/* Features Badge - Localized & Robust */}
          <div className="absolute bottom-12 right-12 z-40 bg-white/80 backdrop-blur-xl p-4 rounded-[1rem] flex items-center gap-6 border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-bounce-slow">
            <div className="flex items-center divide-x-2 rtl:divide-x-reverse divide-gray-100">
              {[
                { icon: ShieldCheck, title: t('featuredProducts'), sub: t('freeShippingSub') }, 
              ].map((f, i) => (
                <div key={i} className={`flex items-center gap-2 ${i === 0 ? 'pr-8 rtl:pr-0 rtl:pl-8' : 'px-8'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-[#e2e7e2] flex items-center justify-center text-primary-500 shrink-0">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div className="whitespace-nowrap">
                    <h4 className="font-black text-gray-900 text-sm leading-tight uppercase tracking-tight">{f.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> 
        </div>
      </section>

      {/* Main Grid Content - Contained */}
      <section className="container mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase text-gray-900 dark:text-white mb-2">
              {t('featuredCategories')}
            </h2>
            <div className="h-2 w-32 bg-accent-500 rounded-full" />
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
