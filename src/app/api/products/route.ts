import { NextResponse } from 'next/server';
import { getDB, saveDB, getAvailableToPromise } from '@/lib/db';
import { ProductSchema } from '@/lib/validations';
import { ProductRecord } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get('admin') === 'true';
  const categorySlug = searchParams.get('category');
  const collectionSlug = searchParams.get('collection');
  const query = (searchParams.get('q') || '').trim().toLowerCase();

  const db = getDB();
  let products = includeAll
    ? db.products
    : db.products.filter((p) => p.status === 'published');

  if (categorySlug) {
    const cat = db.categories.find((c) => c.slug === categorySlug || c.id === categorySlug);
    if (cat) {
      products = products.filter(
        (p) => p.categoryId === cat.id || p.categoryAncestry.includes(cat.id)
      );
    }
  }

  if (collectionSlug) {
    const col = db.collections.find((c) => c.slug === collectionSlug || c.id === collectionSlug);
    if (col) {
      products = products.filter(
        (p) => p.collectionIds.includes(col.id) || col.manualProductIds.includes(p.id)
      );
    }
  }

  if (query) {
    // Expand query using synonym dictionary
    const expandedTerms = new Set<string>([query]);
    for (const syn of db.synonyms || []) {
      if (syn.canonical.includes(query) || syn.terms.some((t) => t.includes(query))) {
        expandedTerms.add(syn.canonical);
        syn.terms.forEach((t) => expandedTerms.add(t));
      }
    }
    products = products.filter((p) => {
      const searchable = `${p.title} ${p.subtitle} ${p.shortDescription} ${p.productType} ${p.tags.join(' ')} ${p.variants.map((v) => v.sku).join(' ')}`.toLowerCase();
      return Array.from(expandedTerms).some((term) => searchable.includes(term));
    });
  }

  const enriched = products.map((p) => ({
    ...p,
    stock: p.variants.reduce((sum, v) => sum + getAvailableToPromise(v), 0),
  }));

  return NextResponse.json(enriched);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();
    const now = new Date().toISOString();

    if (body.action === 'duplicate' && body.productId) {
      const orig = db.products.find((p) => p.id === body.productId);
      if (!orig) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      const newId = `prod_${Date.now()}`;
      const copy: ProductRecord = {
        ...JSON.parse(JSON.stringify(orig)),
        id: newId,
        slug: `${orig.slug}-copy-${Date.now().toString().slice(-4)}`,
        title: `${orig.title} (Copy)`,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        revision: 1,
        variants: orig.variants.map((v, i) => ({
          ...v,
          id: `var_${newId}_${i}`,
          sku: `${v.sku}-CPY-${Date.now().toString().slice(-3)}`,
        })),
        history: [
          {
            revision: 1,
            actor: 'superadmin@store.com',
            timestamp: now,
            summary: `Duplicated from ${orig.title} (${orig.id}).`,
          },
        ],
      };
      db.products.unshift(copy);
      saveDB(db);
      return NextResponse.json({
        ...copy,
        stock: copy.variants.reduce((s, v) => s + getAvailableToPromise(v), 0),
      });
    }

    if (body.action === 'csv_dry_run') {
      const rows = Array.isArray(body.rows) ? body.rows : [];
      const validationReport = rows.map((r: any, idx: number) => {
        const errors: string[] = [];
        if (!r.title || String(r.title).trim().length < 2) errors.push('Missing title');
        if (!r.price || Number(r.price) <= 0) errors.push('Selling price must be > 0');
        if (!r.hsnCode || String(r.hsnCode).trim().length < 4) errors.push('Missing 8-digit HSN code');
        return {
          rowNumber: idx + 1,
          sku: r.sku || `ROW-${idx + 1}`,
          title: r.title || 'Untitled',
          valid: errors.length === 0,
          errors,
        };
      });
      return NextResponse.json({
        success: true,
        totalRows: rows.length,
        validCount: validationReport.filter((r: any) => r.valid).length,
        invalidCount: validationReport.filter((r: any) => !r.valid).length,
        report: validationReport,
      });
    }

    const rawPrice = Number(body.price ?? body.sellingPrice ?? 999);
    const rawMrp = body.mrp ? Number(body.mrp) : rawPrice + 300;
    const validated = ProductSchema.parse({
      ...body,
      price: rawPrice,
      mrp: rawMrp,
      costPrice: body.costPrice ? Number(body.costPrice) : Math.round(rawPrice * 0.45),
      stock: body.stock !== undefined ? Number(body.stock) : 20,
    });

    const newId = `${Date.now()}`;
    const slug =
      body.slug ||
      `${validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${newId.slice(-4)}`;
    const initialStock = validated.stock ?? 20;

    const normalizedImages =
      Array.isArray(body.images) && body.images.length > 0
        ? body.images.map((img: any, idx: number) =>
            typeof img === 'string'
              ? {
                  id: `img_${newId}_${idx}`,
                  url: img,
                  alt: `${validated.title} product photograph`,
                  color: body.color || 'Charcoal',
                  focalPoint: { x: 0.5, y: 0.45 },
                }
              : img
          )
        : [
            {
              id: `img_${newId}`,
              url: body.image || '/images/prod-shirt-charcoal.svg',
              alt: `${validated.title} product photograph`,
              color: body.color || 'Charcoal',
              focalPoint: { x: 0.5, y: 0.45 },
            },
          ];

    const newProduct: ProductRecord = {
      id: newId,
      slug,
      title: validated.title,
      subtitle: validated.subtitle || '100% Combed Indian Cotton • Pre-Shrunk',
      shortDescription:
        validated.shortDescription ||
        'Crafted and wash-tested at our workshop with double-stitched seams.',
      description:
        validated.description ||
        'Designed for everyday Indian weather and daily commutes. Includes complete Legal Metrology declarations and 7-day easy returns.',
      productType: validated.productType || 'shirt',
      brand: body.brand || 'Whole/retail Name',
      supplierId: body.supplierId || 'sup_erode_mills',
      categoryId: validated.categoryId || 'cat_clothing',
      categoryAncestry: [validated.categoryId || 'cat_clothing'],
      collectionIds: body.collectionIds || ['col_essentials'],
      tags: body.tags || ['everyday', 'essentials'],
      status: validated.status || 'published',
      price: validated.price,
      mrp: validated.mrp || validated.price + 300,
      costPrice: validated.costPrice || Math.round(validated.price * 0.45),
      badge: body.badge || 'New',
      images: normalizedImages,
      variants: body.variants?.length
        ? body.variants
        : [
            {
              id: `var_${newId}_m`,
              sku: body.sku || `KRG-SKU-${newId.slice(-6)}-M`,
              barcode: `8904123${newId.slice(-6)}`,
              size: body.size || 'M',
              color: body.color || 'Charcoal',
              colorHex: '#18201B',
              price: validated.price,
              mrp: validated.mrp || validated.price + 300,
              costPrice: validated.costPrice || Math.round(validated.price * 0.45),
              weightGrams: 300,
              image: body.image || '/images/prod-shirt-charcoal.svg',
              onHand: initialStock,
              reserved: 0,
              allocated: 0,
              unavailable: 0,
              incoming: 0,
              lowStockThreshold: 5,
              enabled: true,
            },
          ],
      attributes: body.attributes || {
        fabric: '100% Long-Staple Indian Cotton',
        fit: 'Regular Indian Fit',
        weaveOrConstruction: '18 SPI Double-needle lockstitch',
        careInstructions: 'Machine wash cold gentle cycle. Line dry in shade.',
        packageContents: '1 Unit in reusable unbleached cotton bag',
        occasion: 'Everyday & Workwear',
        genderScope: 'Unisex',
        sizeSystem: 'Indian Standard Alpha (S, M, L, XL)',
        dimensionsCm: '32 x 24 x 3 cm',
      },
      legalMetrology: body.legalMetrology || {
        genericName: validated.title,
        manufacturerName: 'Whole/retail Name Pvt. Ltd.',
        manufacturerAddress: 'Plot 42, Okhla, New Delhi, Maharashtra 400013',
        packerName: 'Whole/retail Name Studio Fulfilment Centre, Connaught Place, New Delhi 110001',
        countryOfOrigin: 'India',
        netQuantity: '1 N',
        consumerCareEmail: 'care@karigarstore.in',
        consumerCarePhone: '+91 11 4123 9876',
        hsnCode: '62052000',
        gstRatePercent: 12,
      },
      returnPolicyClass: body.returnPolicyClass || '7_day_easy_return',
      returnWindowDays: 7,
      warrantySummary: '6-month seam and hardware repair guarantee.',
      seo: {
        title: `${validated.title} | Whole/retail Name`,
        description: validated.shortDescription || validated.title,
        canonicalSlug: slug,
        noindex: false,
      },
      relatedProductIds: ['prod_1', 'prod_5'],
      goesWellWithIds: ['prod_9', 'prod_10'],
      ratingAverage: 4.8,
      ratingCount: 1,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
      revision: 1,
      history: [
        {
          revision: 1,
          actor: 'superadmin@store.com',
          timestamp: now,
          summary: 'Created product record.',
        },
      ],
    };

    db.products.unshift(newProduct);
    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: now,
      actor: 'superadmin@store.com',
      action: 'product.create',
      entityType: 'product',
      entityId: newProduct.id,
      summary: `Created product "${newProduct.title}" at ₹${newProduct.price}.`,
    });
    saveDB(db);

    return NextResponse.json({
      ...newProduct,
      stock: initialStock,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.errors || error?.message || 'Invalid product payload' },
      { status: 400 }
    );
  }
}