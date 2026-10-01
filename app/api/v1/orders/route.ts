export function POST() {
  // Fail closed until authenticated ordering, durable inventory and payment are configured.
  return Response.json({ code: 'CHECKOUT_NOT_CONFIGURED', message: '正式认领尚未开放，目前仅支持本机演示。', data: null }, { status: 503 });
}
