import { NextResponse } from 'next/server';
import { getDB, saveDB, checkPinServiceability } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin');
  const db = getDB();

  if (pin) {
    const result = checkPinServiceability(db, pin);
    return NextResponse.json(result);
  }

  return NextResponse.json({ pincodes: db.pincodes });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();

    if (body.action === 'upsert') {
      const entry = {
        pincode: String(body.pincode).trim(),
        city: body.city || 'City',
        state: body.state || 'Delhi',
        zone: body.zone || 'Standard Zone',
        prepaid: body.prepaid !== undefined ? Boolean(body.prepaid) : true,
        cod: body.cod !== undefined ? Boolean(body.cod) : true,
        reversePickup: body.reversePickup !== undefined ? Boolean(body.reversePickup) : true,
        maxWeightGrams: Number(body.maxWeightGrams) || 15000,
        transitDays: body.transitDays || '2–4 business days',
        codFee: Number(body.codFee) ?? 40,
        effectiveDate: new Date().toISOString().slice(0, 10),
      };
      const existingIdx = db.pincodes.findIndex((p) => p.pincode === entry.pincode);
      if (existingIdx >= 0) {
        db.pincodes[existingIdx] = entry;
      } else {
        db.pincodes.unshift(entry);
      }
      saveDB(db);
      return NextResponse.json({ success: true, pincodes: db.pincodes });
    }

    return NextResponse.json({ error: 'Invalid pincode action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'PIN update failed' }, { status: 500 });
  }
}
