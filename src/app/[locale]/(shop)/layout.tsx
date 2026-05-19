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
      <main className="flex-grow  pt-8 w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
