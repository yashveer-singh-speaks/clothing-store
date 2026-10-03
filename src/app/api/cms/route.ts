import { NextResponse } from 'next/server';
import { getDB, saveDB, validateCMSForPublication } from '@/lib/db';
import { CMSSection } from '@/lib/types';

export async function GET() {
  const db = getDB();
  const validation = validateCMSForPublication(db);
  return NextResponse.json({
    cms: db.cms,
    validation,
    products: db.products.map((p) => ({ id: p.id, title: p.title, price: p.price, status: p.status })),
    collections: db.collections.map((c) => ({ id: c.id, slug: c.slug, title: c.title })),
    categories: db.categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
    promotions: db.promotions.map((p) => ({ id: p.id, code: p.code, title: p.title })),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();
    const { action } = body;
    const now = new Date().toISOString();

    if (action === 'update_section') {
      const updated: CMSSection = body.section;
      const idx = db.cms.draftSections.findIndex((s) => s.id === updated.id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 });
      }
      db.cms.draftSections[idx] = {
        ...db.cms.draftSections[idx],
        ...updated,
        revision: (db.cms.draftSections[idx].revision || 1) + 1,
      };
      saveDB(db);
      return NextResponse.json({ success: true, cms: db.cms, validation: validateCMSForPublication(db) });
    }

    if (action === 'toggle_section') {
      const { sectionId } = body;
      const sec = db.cms.draftSections.find((s) => s.id === sectionId);
      if (!sec) return NextResponse.json({ error: 'Section not found' }, { status: 404 });
      sec.enabled = !sec.enabled;
      sec.revision = (sec.revision || 1) + 1;
      db.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: now,
        actor: 'superadmin@store.com',
        action: sec.enabled ? 'cms.section.show' : 'cms.section.hide',
        entityType: 'cms_section',
        entityId: sec.id,
        summary: `${sec.enabled ? 'Enabled' : 'Hidden'} homepage section "${sec.friendlyName}" in draft.`,
      });
      saveDB(db);
      return NextResponse.json({ success: true, cms: db.cms, validation: validateCMSForPublication(db) });
    }

    if (action === 'reorder_section') {
      const { sectionId, direction } = body;
      const sorted = db.cms.draftSections.slice().sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((s) => s.id === sectionId);
      if (index === -1) return NextResponse.json({ error: 'Section not found' }, { status: 404 });
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      if (swapIndex >= 0 && swapIndex < sorted.length) {
        const temp = sorted[index];
        sorted[index] = sorted[swapIndex];
        sorted[swapIndex] = temp;
        sorted.forEach((sec, idx) => {
          sec.order = idx + 1;
        });
        db.cms.draftSections = sorted;
        db.auditLogs.unshift({
          id: `aud_${Date.now()}`,
          timestamp: now,
          actor: 'superadmin@store.com',
          action: 'cms.section.reorder',
          entityType: 'cms_section',
          entityId: sectionId,
          summary: `Moved section "${temp.friendlyName}" ${direction} to position #${swapIndex + 1}.`,
        });
        saveDB(db);
      }
      return NextResponse.json({ success: true, cms: db.cms, validation: validateCMSForPublication(db) });
    }

    if (action === 'add_section') {
      const { type, friendlyName, heading } = body;
      const maxOrder = db.cms.draftSections.reduce((m, s) => Math.max(m, s.order), 0);
      const newSec: CMSSection = {
        id: `sec_${type}_${Date.now()}`,
        type: type || 'story_split',
        friendlyName: friendlyName || `${maxOrder + 1}. New ${type || 'Story'} Section`,
        enabled: true,
        order: maxOrder + 1,
        revision: 1,
        eyebrow: 'Featured Story',
        heading: heading || 'New Storefront Section Heading',
        subheading: 'Supporting subtitle for this section.',
        description: 'Describe your products, craft, or collection with verifiable facts.',
        desktopImage: '/images/story-workshop.svg',
        mobileImage: '/images/story-workshop.svg',
        imageAlt: 'Workshop and product photography',
        primaryCtaLabel: 'Explore Products',
        primaryCtaHref: '/products',
        collectionId: 'col_essentials',
        productIds: ['prod_1', 'prod_2', 'prod_5', 'prod_7'],
        categoryIds: ['cat_clothing', 'cat_footwear', 'cat_accessories'],
        backgroundTone: 'ivory',
        startsAt: null,
        endsAt: null,
        timezone: 'Asia/Kolkata',
      };
      db.cms.draftSections.push(newSec);
      db.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: now,
        actor: 'superadmin@store.com',
        action: 'cms.section.add',
        entityType: 'cms_section',
        entityId: newSec.id,
        summary: `Added new section "${newSec.friendlyName}" (${newSec.type}) to homepage draft.`,
      });
      saveDB(db);
      return NextResponse.json({ success: true, newSection: newSec, cms: db.cms, validation: validateCMSForPublication(db) });
    }

    if (action === 'duplicate_section') {
      const { sectionId } = body;
      const original = db.cms.draftSections.find((s) => s.id === sectionId);
      if (!original) return NextResponse.json({ error: 'Section not found' }, { status: 404 });
      const maxOrder = db.cms.draftSections.reduce((m, s) => Math.max(m, s.order), 0);
      const copy: CMSSection = {
        ...JSON.parse(JSON.stringify(original)),
        id: `${original.id}_copy_${Date.now()}`,
        friendlyName: `${original.friendlyName} (Copy)`,
        order: maxOrder + 1,
        revision: 1,
      };
      db.cms.draftSections.push(copy);
      saveDB(db);
      return NextResponse.json({ success: true, cms: db.cms, validation: validateCMSForPublication(db) });
    }

    if (action === 'remove_section') {
      const { sectionId } = body;
      const target = db.cms.draftSections.find((s) => s.id === sectionId);
      db.cms.draftSections = db.cms.draftSections
        .filter((s) => s.id !== sectionId)
        .sort((a, b) => a.order - b.order)
        .map((s, idx) => ({ ...s, order: idx + 1 }));
      if (target) {
        db.auditLogs.unshift({
          id: `aud_${Date.now()}`,
          timestamp: now,
          actor: 'superadmin@store.com',
          action: 'cms.section.remove',
          entityType: 'cms_section',
          entityId: sectionId,
          summary: `Removed section "${target.friendlyName}" from homepage draft.`,
        });
      }
      saveDB(db);
      return NextResponse.json({ success: true, cms: db.cms, validation: validateCMSForPublication(db) });
    }

    if (action === 'update_global_settings') {
      db.cms.globalDraft = {
        ...db.cms.globalDraft,
        ...body.globalSettings,
      };
      saveDB(db);
      return NextResponse.json({ success: true, cms: db.cms, validation: validateCMSForPublication(db) });
    }

    if (action === 'publish_release') {
      const validation = validateCMSForPublication(db);
      if (!validation.canPublish) {
        return NextResponse.json(
          { error: 'Publication blocked due to validation errors.', validation },
          { status: 400 }
        );
      }
      const nextVersion =
        db.cms.releases.reduce((max, r) => Math.max(max, r.versionNumber), 0) + 1;
      const releaseId = `rel_v${nextVersion}`;
      const sortedDraft = db.cms.draftSections.slice().sort((a, b) => a.order - b.order);

      const newManifest = {
        id: releaseId,
        versionNumber: nextVersion,
        publishedAt: now,
        publishedBy: 'superadmin@store.com',
        releaseNote: body.releaseNote || `Published Release v${nextVersion} from Super Admin CMS`,
        sectionsSnapshot: JSON.parse(JSON.stringify(sortedDraft)),
        globalSettingsSnapshot: JSON.parse(JSON.stringify(db.cms.globalDraft)),
      };

      db.cms.publishedSections = JSON.parse(JSON.stringify(sortedDraft));
      db.cms.globalPublished = JSON.parse(JSON.stringify(db.cms.globalDraft));
      db.cms.releases.unshift(newManifest);
      db.cms.activeReleaseId = releaseId;

      db.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: now,
        actor: 'superadmin@store.com',
        action: 'cms.publish',
        entityType: 'cms_release',
        entityId: releaseId,
        summary: `Published CMS Release v${nextVersion}: "${newManifest.releaseNote}"`,
      });

      saveDB(db);
      return NextResponse.json({
        success: true,
        release: newManifest,
        cms: db.cms,
        validation,
      });
    }

    if (action === 'rollback_release') {
      const { releaseId } = body;
      const targetRelease = db.cms.releases.find((r) => r.id === releaseId);
      if (!targetRelease) {
        return NextResponse.json({ error: 'Release manifest not found' }, { status: 404 });
      }
      db.cms.draftSections = JSON.parse(JSON.stringify(targetRelease.sectionsSnapshot));
      db.cms.publishedSections = JSON.parse(JSON.stringify(targetRelease.sectionsSnapshot));
      db.cms.globalDraft = JSON.parse(JSON.stringify(targetRelease.globalSettingsSnapshot));
      db.cms.globalPublished = JSON.parse(JSON.stringify(targetRelease.globalSettingsSnapshot));
      db.cms.activeReleaseId = targetRelease.id;

      db.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: now,
        actor: 'superadmin@store.com',
        action: 'cms.rollback',
        entityType: 'cms_release',
        entityId: targetRelease.id,
        summary: `Rolled back live storefront and draft to Release v${targetRelease.versionNumber} (${targetRelease.releaseNote}).`,
      });

      saveDB(db);
      return NextResponse.json({
        success: true,
        cms: db.cms,
        validation: validateCMSForPublication(db),
      });
    }

    return NextResponse.json({ error: 'Unsupported CMS action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'CMS operation failed' }, { status: 500 });
  }
}
