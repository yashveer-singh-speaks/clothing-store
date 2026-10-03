'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';
import { OrderRecord, OrderLineSnapshot } from '@/lib/types';

export default function GSTInvoicePage() {
  const params = useParams();
  const orderId = String(params?.id || '');
  const [order, setOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) setOrder(data);
        else if (data?.order) setOrder(data.order);
      })
      .catch(() => {});
  }, [orderId]);

  if (!order) {
    return (
      <div className="p-10 text-center">
        <p className="font-story text-xl">Loading GST Tax Invoice...</p>
      </div>
    );
  }

  const taxableTotal = Math.max(0, order.subtotal - order.discountTotal - order.taxTotal);

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#18201B] p-4 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Non-print toolbar */}
        <div className="flex items-center justify-between print:hidden border-b border-[#18201B]/15 pb-4">
          <Link
            href={`/order-confirmation/${order.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Order Summary</span>
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#B28A50]" />
            <span>Print / Save as PDF</span>
          </button>
        </div>

        {/* Official Tax Invoice Sheet */}
        <div className="p-6 sm:p-10 border-2 border-[#18201B] bg-[#F8F5ED] space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b-2 border-[#18201B] pb-5">
            <div>
              <h1 className="font-story text-2xl font-bold">
                TAX INVOICE (ORIGINAL FOR RECIPIENT)
              </h1>
              <p className="font-bold text-sm mt-1">
                Karigar Everyday Apparel & Goods Pvt. Ltd.
              </p>
              <p>123, Inner Circle, Connaught Place, Connaught Place, New Delhi, Delhi – 110001</p>
              <p className="font-mono mt-1">
                GSTIN: <strong>07AABCK4829L1Z5</strong> • State Code: 29 (Delhi)
              </p>
              <p>Email: care@karigarstore.in • Phone: +91 11 4123 9876</p>
            </div>

            <div className="sm:text-right space-y-1 font-mono">
              <p>
                <strong>Invoice No:</strong> {order.invoiceNumber || `INV-${order.orderNumber}`}
              </p>
              <p>
                <strong>Order No:</strong> {order.orderNumber}
              </p>
              <p>
                <strong>Invoice Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </p>
              <p>
                <strong>Place of Supply:</strong> {order.shippingAddress.state}
              </p>
              <p>
                <strong>Payment Mode:</strong> {order.paymentMethod.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-[#18201B]/20 pb-5">
            <div>
              <p className="font-bold uppercase tracking-wider text-[#18201B]/65 mb-1">
                Billed & Shipped To
              </p>
              <p className="font-bold text-sm">{order.shippingAddress.recipientName}</p>
              <p>
                {order.shippingAddress.line1}, {order.shippingAddress.locality}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} –{' '}
                {order.shippingAddress.pincode}
              </p>
              <p>Phone: {order.shippingAddress.phone}</p>
              {order.customer.gstin && (
                <p className="font-mono mt-1">
                  <strong>Buyer GSTIN:</strong> {order.customer.gstin}
                </p>
              )}
            </div>

            <div className="sm:text-right">
              <p className="font-bold uppercase tracking-wider text-[#18201B]/65 mb-1">
                Dispatch & Fulfilment Details
              </p>
              <p>Dispatch Warehouse: New Delhi Main Studio ({order.warehouseId})</p>
              <p>Courier Partner: {order.shipment?.carrierName || 'BlueDart Express'}</p>
              {order.shipment?.awbNumber && (
                <p className="font-mono">AWB: {order.shipment.awbNumber}</p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[#18201B] price-num">
              <thead>
                <tr className="bg-[#18201B] text-[#F8F5ED]">
                  <th className="p-2 text-left">Item Description</th>
                  <th className="p-2 text-left">HSN</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">Taxable (₹)</th>
                  <th className="p-2 text-right">GST %</th>
                  <th className="p-2 text-right">CGST/SGST/IGST (₹)</th>
                  <th className="p-2 text-right">Line Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18201B]/25">
                {order.lines.map((item: OrderLineSnapshot, idx: number) => (
                  <tr key={item.lineId || idx}>
                    <td className="p-2 font-sans">
                      <strong>{item.title}</strong>
                      <div className="text-[11px] text-[#18201B]/70">
                        {item.color} / {item.size} • SKU: {item.sku}
                      </div>
                    </td>
                    <td className="p-2 font-mono">{item.hsnCode}</td>
                    <td className="p-2 text-right">{item.qtyOrdered}</td>
                    <td className="p-2 text-right">
                      {item.taxableValue.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-right">{item.gstRatePercent}%</td>
                    <td className="p-2 text-right">
                      {(
                        item.cgstAmount +
                        item.sgstAmount +
                        item.igstAmount
                      ).toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-right font-bold">
                      ₹{item.lineTotalPayable.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-1.5 price-num">
              <div className="flex justify-between">
                <span>Total Taxable Value</span>
                <span>₹{taxableTotal.toLocaleString('en-IN')}</span>
              </div>
              {order.cgstTotal > 0 ? (
                <>
                  <div className="flex justify-between">
                    <span>CGST Total</span>
                    <span>₹{order.cgstTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST Total</span>
                    <span>₹{order.sgstTotal.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span>IGST Total</span>
                  <span>₹{order.igstTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span>₹{order.shippingCharge}</span>
              </div>
              {order.codFee > 0 && (
                <div className="flex justify-between">
                  <span>COD Fee</span>
                  <span>₹{order.codFee}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t-2 border-[#18201B] pt-2">
                <span>Grand Total (Incl. GST)</span>
                <span>₹{order.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#18201B]/20 flex justify-between items-end text-[11px] text-[#18201B]/75">
            <p>
              Certified that the particulars given above are true and correct. Subject to New Delhi Jurisdiction.
            </p>
            <p className="font-bold">
              For Karigar Everyday Apparel & Goods Pvt. Ltd. (Authorised Signatory)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
