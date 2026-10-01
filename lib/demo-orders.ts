export interface DemoOrder {
  id: string;
  planId: number;
  planName: string;
  amount: number;
  nickname: string;
  method: 'delivery' | 'visit';
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'paid' | 'cancelled' | 'expired';
  treeId?: string;
}
export function settleOrder(order: DemoOrder, action: 'pay' | 'cancel', now = Date.now()): DemoOrder {
  if (order.status !== 'pending') return order;
  if (now >= Date.parse(order.expiresAt)) return { ...order, status: 'expired' };
  if (action === 'cancel') return { ...order, status: 'cancelled' };
  return { ...order, status: 'paid', treeId: `DEMO-${order.id.slice(-8)}` };
}
export function normalizeOrders(value: unknown, now = Date.now()): DemoOrder[] {
  if (!Array.isArray(value)) throw new Error('演示订单格式不正确');
  return value.filter((item): item is DemoOrder => {
    if (!item || typeof item !== 'object') return false;
    return typeof item.id === 'string' && typeof item.planName === 'string' &&
      Number.isSafeInteger(item.planId) && Number.isSafeInteger(item.amount) && item.amount > 0 &&
      typeof item.nickname === 'string' && ['delivery', 'visit'].includes(item.method) &&
      ['pending', 'paid', 'cancelled', 'expired'].includes(item.status) &&
      Number.isFinite(Date.parse(item.createdAt)) && Number.isFinite(Date.parse(item.expiresAt)) &&
      (item.status !== 'paid' || typeof item.treeId === 'string');
  }).map(order => order.status === 'pending' && now >= Date.parse(order.expiresAt) ? { ...order, status: 'expired' as const } : order);
}
