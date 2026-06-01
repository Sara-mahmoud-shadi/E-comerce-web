import { Suspense } from 'react';
import ProductsContent from '@/components/products/ProductsContent';
import LoaderIcon from '@/components/shared/LoaderIcon';

export default function ProductsPage() {
  return ( 
    <Suspense fallback={<LoaderIcon />}>
      <ProductsContent />
    </Suspense>
  );
}
