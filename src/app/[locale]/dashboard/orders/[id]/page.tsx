import React from 'react';
import OrderDetailsContent from '@/components/dashboard/orders/OrderDetailsContent';

export default async function OrderPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return <OrderDetailsContent id={id} />;
}
