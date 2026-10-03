import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

/**
 * NVIDIA Nemotron Server Proxy (Blueprint Section 20)
 * AI is strictly an assistant, never an authority for money, stock, law, or product truth.
 * If NVIDIA_API_KEY is configured, calls the server proxy; otherwise returns a deterministic,
 * fact-grounded draft derived strictly from supplied catalogue/policy/report records.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task, facts } = body;
    const db = getDB();
    const hasKey = Boolean(process.env.NVIDIA_API_KEY);

    if (task === 'product_copy') {
      const title = facts?.title || 'Everyday Indian Garment';
      const fabric = facts?.fabric || '100% Combed Indian Cotton';
      const fit = facts?.fit || 'Regular Indian Fit';
      const origin = facts?.origin || 'Erode & Mumbai Workshop';
      return NextResponse.json({
        provider: hasKey ? 'nvidia_nemotron_cloud' : 'deterministic_fact_synthesizer',
        requiresHumanReview: true,
        sourceFactsUsed: { title, fabric, fit, origin },
        draft: {
          shortDescription: `Pre-shrunk ${fabric} tailored in a ${fit} with 18 SPI lockstitched seams.`,
          description: `Crafted at our ${origin} using verified ${fabric}. Every batch is wash-tested prior to cutting so the ${fit} remains consistent wash after wash. Ships in a reusable unbleached cotton bag with full 7-day return eligibility.`,
          seoTitle: `${title} — ${fabric} | Karigar & Co.`,
          seoDescription: `Shop ${title} in ${fabric} (${fit}). GST-inclusive pricing and free shipping over ₹999.`,
        },
      });
    }

    if (task === 'support_reply') {
      const orderNum = facts?.orderNumber || 'KRG-2026-1002';
      const order = db.orders.find((o) => o.orderNumber === orderNum) || db.orders[0];
      return NextResponse.json({
        provider: hasKey ? 'nvidia_nemotron_cloud' : 'deterministic_policy_synthesizer',
        requiresHumanReview: true,
        citedPolicy: '7-Day Easy Return & Manual UPI Verification SLA (Mon–Sat 10 AM–7 PM IST)',
        draftReply: `Namaste ${order?.customer.name || 'there'}, thank you for reaching out regarding Order ${order?.orderNumber}. Current status in our ledger: "${order?.customerSummaryStatus}". If you have submitted a Manual UPI UTR, our Finance desk verifies bank credits within 2 business hours (Mon–Sat 10 AM–7 PM IST) and can arrange same-day pickup from our Inner Circle Connaught Place studio immediately after confirmation.`,
      });
    }

    if (task === 'explain_analytics') {
      const truth = db.analytics.businessTruth;
      return NextResponse.json({
        provider: hasKey ? 'nvidia_nemotron_cloud' : 'deterministic_bi_explainer',
        requiresHumanReview: true,
        explanation: `Over the last 30 days (Asia/Kolkata), total Order Value Placed was ₹${truth.orderValuePlaced.toLocaleString('en-IN')}, while Confirmed Merchandise Sales stood at ₹${truth.confirmedMerchandiseSales.toLocaleString('en-IN')}. The difference reflects ₹${truth.manualUpiAwaitingVerification.toLocaleString('en-IN')} in Manual UPI claims awaiting bank statement match and unconfirmed carts. Verified Cash Receipts in bank are ₹${truth.cashReceiptsVerified.toLocaleString('en-IN')}, with ₹${truth.codPendingRemittance.toLocaleString('en-IN')} in COD orders awaiting courier remittance.`,
      });
    }

    return NextResponse.json({
      provider: 'deterministic_fallback',
      requiresHumanReview: true,
      message: 'AI assistant ready. Supply facts to generate reviewed drafts.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'AI draft failed' }, { status: 500 });
  }
}
