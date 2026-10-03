import { NextResponse } from 'next/server';
import { getDB, calculateServerQuote } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();
    const quote = calculateServerQuote(db, {
      items: body.items || [],
      pincode: body.pincode,
      couponCode: body.couponCode,
      paymentMethod: body.paymentMethod,
    });
    return NextResponse.json(quote);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Quote calculation failed' }, { status: 400 });
  }
}
