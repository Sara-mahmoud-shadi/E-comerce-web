import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 container mx-auto w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
