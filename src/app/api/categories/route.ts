import { NextResponse } from 'next/server';
import { getDB, saveDB, resolveCollectionProducts } from '@/lib/db';

export async function GET() {
  const db = getDB();
  const collectionsWithProducts = db.collections.map((col) => ({
    ...col,
    resolvedProductsCount: resolveCollectionProducts(db, col).length,
  }));
  return NextResponse.json({
    categories: db.categories.slice().sort((a, b) => a.order - b.order),
    collections: collectionsWithProducts.sort((a, b) => a.order - b.order),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();
    const now = new Date().toISOString();

    if (body.entity === 'category') {
      if (body.action === 'create') {
        const slug = (body.slug || body.name || 'category')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-');
        if (db.categories.some((c) => c.slug === slug)) {
          return NextResponse.json({ error: 'Category slug already exists.' }, { status: 400 });
        }
        const parent = body.parentId
          ? db.categories.find((c) => c.id === body.parentId)
          : null;
        const newCat = {
          id: `cat_${Date.now()}`,
          slug,
          name: body.name,
          description: body.description || '',
          parentId: parent ? parent.id : null,
          ancestry: parent ? [...parent.ancestry, parent.id] : [],
          image: body.image || '/images/cat-clothing.svg',
          imageAlt: body.imageAlt || `${body.name} category`,
          order: db.categories.length + 1,
          archived: false,
          allowedFilters: body.allowedFilters || ['size', 'color', 'price'],
          seoTitle: `${body.name} | Whole/retail Name`,
          seoDescription: body.description || `Shop ${body.name} at Whole/retail Name`,
        };
        db.categories.push(newCat);
        db.auditLogs.unshift({
          id: `aud_${Date.now()}`,
          timestamp: now,
          actor: 'superadmin@store.com',
          action: 'category.create',
          entityType: 'category',
          entityId: newCat.id,
          summary: `Created category "${newCat.name}" (/${newCat.slug}).`,
        });
        saveDB(db);
        return NextResponse.json({ success: true, categories: db.categories });
      }

      if (body.action === 'update') {
        const idx = db.categories.findIndex((c) => c.id === body.category.id);
        if (idx === -1) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        // Cycle check: cannot make a category its own parent or descendant
        if (body.category.parentId === body.category.id) {
          return NextResponse.json({ error: 'A category cannot be its own parent.' }, { status: 400 });
        }
        db.categories[idx] = { ...db.categories[idx], ...body.category };
        saveDB(db);
        return NextResponse.json({ success: true, categories: db.categories });
      }

      if (body.action === 'toggle_archive') {
        const cat = db.categories.find((c) => c.id === body.categoryId);
        if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        cat.archived = !cat.archived;
        saveDB(db);
        return NextResponse.json({ success: true, categories: db.categories });
      }
    }

    if (body.entity === 'collection') {
      if (body.action === 'create') {
        const slug = (body.slug || body.title || 'collection')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-');
        const newCol = {
          id: `col_${Date.now()}`,
          slug,
          title: body.title,
          eyebrow: body.eyebrow || 'Curated Edit',
          description: body.description || '',
          campaignTerms: body.campaignTerms || 'Eligible for standard 7-day returns.',
          bannerImage: body.bannerImage || '/images/hero-desktop.svg',
          bannerAlt: body.bannerAlt || body.title,
          mode: (body.mode as 'manual' | 'automatic') || 'manual',
          matchType: (body.matchType as 'ALL' | 'ANY') || 'ALL',
          rules: body.rules || [],
          manualProductIds: body.manualProductIds || ['prod_1', 'prod_5'],
          excludedProductIds: body.excludedProductIds || [],
          enabled: true,
          startsAt: null,
          endsAt: null,
          order: db.collections.length + 1,
        };
        db.collections.push(newCol);
        saveDB(db);
        return NextResponse.json({ success: true, collections: db.collections });
      }

      if (body.action === 'update') {
        const idx = db.collections.findIndex((c) => c.id === body.collection.id);
        if (idx === -1) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        db.collections[idx] = { ...db.collections[idx], ...body.collection };
        saveDB(db);
        return NextResponse.json({ success: true, collections: db.collections });
      }
    }

    return NextResponse.json({ error: 'Invalid category/collection action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Operation failed' }, { status: 500 });
  }
}
