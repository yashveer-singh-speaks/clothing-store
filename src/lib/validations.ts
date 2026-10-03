import { z } from 'zod';

export const ProductSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  subtitle: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  productType: z.enum(['shirt', 'kurta', 'trousers', 'outerwear', 'jacket', 'skirt', 'coat', 'bomber', 'racer', 'trucker', 'footwear', 'accessory', 'gift']).optional(),
  categoryId: z.string().optional(),
  price: z.number().positive('Selling price must be positive'),
  mrp: z.number().positive().optional(),
  costPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  status: z.enum(['published', 'draft', 'archived', 'scheduled']).optional(),
});

export const OrderSchema = z.object({
  idempotencyKey: z.string().optional(),
  customer: z
    .object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Valid email is required'),
      phone: z.string().min(8, 'Valid phone number is required'),
      gstin: z.string().optional(),
      businessName: z.string().optional(),
    })
    .optional(),
  shippingAddress: z
    .object({
      recipientName: z.string().min(1),
      phone: z.string().min(8),
      line1: z.string().min(3),
      locality: z.string().min(2),
      landmark: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Valid 6-digit Indian PIN code required'),
      country: z.literal('India').optional(),
    })
    .optional(),
  paymentMethod: z.enum(['razorpay', 'manual_upi', 'cod']).optional(),
  couponCode: z.string().nullable().optional(),
  manualUpiClaim: z
    .object({
      utrReference: z.string().min(6, 'UTR / UPI Reference number is required'),
      paidAtClaimed: z.string().optional(),
      screenshotNote: z.string().optional(),
    })
    .optional(),
  items: z
    .array(
      z.object({
        id: z.string().optional(),
        productId: z.string().optional(),
        variantId: z.string().optional(),
        quantity: z.number().int().positive('Quantity must be at least 1'),
      })
    )
    .min(1, 'Order must contain at least one item'),
});
