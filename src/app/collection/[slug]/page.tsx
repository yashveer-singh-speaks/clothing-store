import React from 'react';
import CatalogBrowser from '@/components/CatalogBrowser';

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CatalogBrowser initialCollectionSlug={slug} />;
}
