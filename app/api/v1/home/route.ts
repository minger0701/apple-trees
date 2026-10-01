import { catalog } from '@/lib/storefront-data';

export function GET() {
  // Public fixture projection only. Never return user/phone/address records.
  return Response.json({ code: 0, message: 'success', data: catalog }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
