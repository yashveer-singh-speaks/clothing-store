import { NextResponse } from 'next/server';
import { getDB, saveDB, resetDBToSeed } from '@/lib/db';
import { getFirebaseConfigStatus } from '@/lib/firebase';

export async function GET() {
  const db = getDB();
  return NextResponse.json({
    firebaseStatus: getFirebaseConfigStatus(),
    staff: db.staff,
    approvals: db.approvals,
    automationRules: db.automationRules,
    auditLogs: db.auditLogs.slice(0, 80),
    synonyms: db.synonyms,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();
    const now = new Date().toISOString();

    if (body.action === 'resolve_approval') {
      const apr = db.approvals.find((a) => a.id === body.approvalId);
      if (!apr) return NextResponse.json({ error: 'Approval item not found' }, { status: 404 });
      apr.status = body.decision === 'approve' ? 'approved' : 'rejected';
      db.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: now,
        actor: 'superadmin@store.com',
        action: `approval.${body.decision}`,
        entityType: 'approval',
        entityId: apr.id,
        summary: `${body.decision === 'approve' ? 'Approved' : 'Rejected'} two-person request: "${apr.title}".`,
      });
      saveDB(db);
      return NextResponse.json({ success: true, approvals: db.approvals, auditLogs: db.auditLogs });
    }

    if (body.action === 'toggle_automation') {
      const rule = db.automationRules.find((r) => r.id === body.ruleId);
      if (!rule) return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
      rule.enabled = !rule.enabled;
      saveDB(db);
      return NextResponse.json({ success: true, automationRules: db.automationRules });
    }

    if (body.action === 'run_automation_now') {
      const rule = db.automationRules.find((r) => r.id === body.ruleId);
      if (rule) {
        rule.lastRunAt = now;
        rule.runsCount += 1;
      }
      db.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: now,
        actor: 'superadmin@store.com',
        action: 'automation.execute',
        entityType: 'automation_rule',
        entityId: body.ruleId || 'all',
        summary: `Executed automation rule "${rule?.name || 'Batch Sweep'}" cleanly.`,
      });
      saveDB(db);
      return NextResponse.json({ success: true, automationRules: db.automationRules, auditLogs: db.auditLogs });
    }

    if (body.action === 'add_staff') {
      const newStaff = {
        id: `stf_${Date.now()}`,
        name: body.name || 'New Staff Member',
        email: body.email || 'staff@karigarstore.in',
        role: body.role || 'Support',
        locationScope: body.locationScope || 'DEL-CP',
        mfaEnabled: true,
        active: true,
        permissions: ['order.view', 'ticket.reply'],
      };
      db.staff.push(newStaff);
      saveDB(db);
      return NextResponse.json({ success: true, staff: db.staff });
    }

    if (body.action === 'add_synonym') {
      const canonical = String(body.canonical || body.term || '').trim().toLowerCase();
      const rawTerms = body.terms || body.synonyms || [];
      const terms = (Array.isArray(rawTerms) ? rawTerms : String(rawTerms).split(','))
        .map((t: string) => t.trim().toLowerCase())
        .filter(Boolean);
      if (!canonical || terms.length === 0) {
        return NextResponse.json(
          { error: 'Both canonical term and synonym terms are required.' },
          { status: 400 }
        );
      }
      const existingIdx = db.synonyms.findIndex((s) => s.canonical === canonical);
      if (existingIdx >= 0) {
        db.synonyms[existingIdx].terms = Array.from(
          new Set([...db.synonyms[existingIdx].terms, ...terms])
        );
      } else {
        db.synonyms.push({ canonical, terms });
      }
      saveDB(db);
      return NextResponse.json({ success: true, synonyms: db.synonyms });
    }

    if (body.action === 'reset_seed') {
      const fresh = resetDBToSeed();
      return NextResponse.json({ success: true, db: fresh });
    }

    return NextResponse.json({ error: 'Invalid settings action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Settings operation failed' }, { status: 500 });
  }
}
