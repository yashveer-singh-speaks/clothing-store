import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  return NextResponse.json({
    analytics: db.analytics,
    recentEvents: (db.analyticsEvents || []).slice(0, 50),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();
    const now = new Date().toISOString();

    const eventRecord = {
      event_id: body.event_id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      schema_version: 1,
      event_name: body.event_name || 'page_view',
      occurred_at: body.occurred_at || now,
      received_at: now,
      session_id: body.session_id || 'sess_anon',
      consent_scope: body.consent_scope || 'analytics',
      page_id: body.page_id || 'home',
      section_id: body.section_id || null,
      entity_type: body.entity_type || null,
      entity_id: body.entity_id || null,
      position: body.position ?? null,
      properties: body.properties || {},
    };

    db.analyticsEvents = db.analyticsEvents || [];
    db.analyticsEvents.unshift(eventRecord);
    if (db.analyticsEvents.length > 300) {
      db.analyticsEvents = db.analyticsEvents.slice(0, 300);
    }

    // Update section rollup counters if section_impression or section_click
    if (eventRecord.section_id) {
      const secRollup = db.analytics.sectionPerformance.find(
        (s) => s.sectionId === eventRecord.section_id
      );
      if (secRollup) {
        if (eventRecord.event_name === 'section_impression') {
          secRollup.visibleImpressions += 1;
        } else if (
          eventRecord.event_name === 'section_click' ||
          eventRecord.event_name === 'cta_click' ||
          eventRecord.event_name === 'product_card_click'
        ) {
          secRollup.clicks += 1;
        }
        secRollup.ctrPercent = Number(
          ((secRollup.clicks / Math.max(1, secRollup.visibleImpressions)) * 100).toFixed(1)
        );
      }
    }

    if (eventRecord.event_name === 'cart_add_succeeded') {
      db.analytics.funnel.cartAdditions += 1;
    }

    saveDB(db);
    return NextResponse.json({ accepted: true, event_id: eventRecord.event_id });
  } catch (err: any) {
    return NextResponse.json({ accepted: false, error: err?.message }, { status: 400 });
  }
}
