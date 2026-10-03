import { NextResponse } from 'next/server';
import { getDB, getAvailableToPromise } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const previewMode = searchParams.get('preview') === 'draft';
  const db = getDB();

  const sections = (previewMode ? db.cms.draftSections : db.cms.publishedSections)
    .slice()
    .sort((a, b) => a.order - b.order);

  const globalSettings = previewMode ? db.cms.globalDraft : db.cms.globalPublished;

  const products = db.products
    .filter((p) => p.status === 'published')
    .map((p) => ({
      ...p,
      totalAvailableStock: p.variants.reduce((sum, v) => sum + getAvailableToPromise(v), 0),
    }));

  const categories = db.categories
    .filter((c) => !c.archived)
    .sort((a, b) => a.order - b.order);

  const collections = db.collections
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order);

  const reviews = db.reviews.filter((r) => r.status === 'published');
  const promotions = db.promotions.filter((p) => p.enabled);

  return NextResponse.json({
    previewMode,
    activeReleaseId: db.cms.activeReleaseId,
    globalSettings,
    sections,
    products,
    categories,
    collections,
    reviews,
    promotions,
    synonyms: db.synonyms,
  });
}
