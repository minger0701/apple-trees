import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/demo-orders.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { settleOrder, normalizeOrders } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const now = Date.parse('2026-09-21T00:00:00Z');
const order = { id: 'SL-test-order', planId: 2, planName: '家庭认领', amount: 49900, nickname: '小满', method: 'delivery', createdAt: new Date(now).toISOString(), expiresAt: new Date(now + 900000).toISOString(), status: 'pending' };
const paid = settleOrder(order, 'pay', now);
assert.equal(paid.status, 'paid');
assert.ok(paid.treeId.startsWith('DEMO-'));
assert.equal(order.status, 'pending', 'State transition must not mutate the input');
assert.deepEqual(settleOrder(paid, 'pay', now), paid, 'Duplicate payment is idempotent');
assert.deepEqual(settleOrder(paid, 'cancel', now), paid, 'Paid orders cannot be silently cancelled');
const cancelled = settleOrder(order, 'cancel', now);
assert.equal(cancelled.status, 'cancelled');
assert.equal(settleOrder(cancelled, 'pay', now).status, 'cancelled');
assert.equal(settleOrder(order, 'pay', now + 900000).status, 'expired', 'Expiry boundary is exclusive');
assert.equal(normalizeOrders([order], now + 900000)[0].status, 'expired');
assert.equal(normalizeOrders([null, {}, { ...order, amount: -1 }, { ...paid, treeId: undefined }], now).length, 0);
assert.throws(() => normalizeOrders({}), /格式/);
console.log('PASS: payment, cancellation, idempotency, expiry and corrupted-record validation');

const origin = process.argv[2];
if (origin) {
  for (const path of ['/', '/admin', '/orchard.jpg']) {
    const response = await fetch(new URL(path, origin));
    assert.equal(response.status, 200, `${path} must render`);
    await response.arrayBuffer();
  }
  const response = await fetch(new URL('/api/v1/home', origin));
  assert.equal(response.status, 200);
  const { code, data } = await response.json();
  assert.equal(code, 0);
  assert.equal(data.mode, 'demo');
  assert.deepEqual(data.plans.map(plan => plan.amount), [29900, 49900, 69900]);
  assert.equal(data.stats.total, 500);
  assert.equal(data.stats.adopted, 87);
  assert.equal(data.stats.families, 82);
  assert.equal(data.users, undefined);
  assert.doesNotMatch(JSON.stringify(data), /1380000|幸福路|wechat|address/);
  const disabled = await fetch(new URL('/api/v1/orders', origin), { method: 'POST' });
  assert.equal(disabled.status, 503);
  assert.equal((await disabled.json()).code, 'CHECKOUT_NOT_CONFIGURED');
  console.log('PASS: homepage, preserved admin, photo, public catalog privacy and closed live checkout');
}
