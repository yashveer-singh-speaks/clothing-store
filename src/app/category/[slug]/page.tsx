import React from 'react';
import CatalogBrowser from '@/components/CatalogBrowser';

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CatalogBrowser initialCategorySlug={slug} />;
}
