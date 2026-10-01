'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Sprout, Trees } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { AdoptionPlan, Catalog } from '@/lib/storefront-data';
import { normalizeOrders, settleOrder, type DemoOrder } from '@/lib/demo-orders';

const storageKey = 'shanli-storefront-demo-v2';
const labels = { pending: '待模拟支付', paid: '演示认领成功', expired: '已超时关闭', cancelled: '已取消' };
export default function Checkout({ plan, onClose, accountOpen, onAccountChange, records }: {
  plan: AdoptionPlan | null; onClose: () => void; accountOpen: boolean; onAccountChange: (open: boolean) => void; records: Catalog['records'];
}) {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  function readOrders() { return normalizeOrders(JSON.parse(localStorage.getItem(storageKey) || '[]')); }
  useEffect(() => {
    function sync() { try { setOrders(readOrders()); setError(''); } catch { setError('无法读取本机订单，请检查浏览器存储权限。已有记录不会被自动覆盖。'); } setReady(true); }
    sync();
    const timer = window.setInterval(sync, 15000);
    window.addEventListener('storage', sync);
    return () => { window.clearInterval(timer); window.removeEventListener('storage', sync); };
  }, []);
  function writeOrders(next: DemoOrder[]) {
    localStorage.setItem(storageKey, JSON.stringify(next));
    setOrders(next); setError('');
  }
  function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!plan || busy) return; setBusy(true);
    try {
      const fields = new FormData(event.currentTarget);
      const nickname = String(fields.get('nickname') || '').trim();
      if (!nickname) throw new Error('请给果树起个名字。');
      const now = Date.now();
      const order: DemoOrder = { id: `SL-${crypto.randomUUID()}`, planId: plan.id, planName: plan.name, amount: plan.amount, nickname, method: fields.get('method') === 'visit' ? 'visit' : 'delivery', createdAt: new Date(now).toISOString(), expiresAt: new Date(now + 15 * 60 * 1000).toISOString(), status: 'pending' };
      writeOrders([order, ...readOrders()]); setSelected(order.id); onClose(); onAccountChange(true);
    } catch (err) { setError(err instanceof Error ? err.message : '保存失败，请检查浏览器存储权限。'); }
    finally { setBusy(false); }
  }
  function action(id: string, next: 'pay' | 'cancel') {
    try { writeOrders(readOrders().map(order => order.id === id ? settleOrder(order, next) : order)); }
    catch { setError('操作未保存，请检查浏览器存储权限后重试。'); }
  }
  const detail = orders.find(order => order.id === selected);
  return <>
    <Dialog open={!!plan} onOpenChange={open => { if (!open) onClose(); }}><DialogContent className='site-dialog'>
      <DialogTitle>开启一段与树的故事</DialogTitle><DialogDescription>本机体验 · 无需登录，不填写真实个人信息，不会产生扣款。</DialogDescription>
      {plan && <><div className='checkout-plan'><Sprout size={30} /><div><strong>{plan.name}</strong><small>{plan.subtitle}</small></div><b>¥{plan.amount / 100}<small>/ 年</small></b></div>
        <form onSubmit={create} className='checkout-form'><label>给果树起个名字<input autoComplete='off' name='nickname' required maxLength={20} placeholder='例如：小满' /></label><label>收获方式（演示）<select name='method'><option value='delivery'>成熟后配送</option><option value='visit'>预约到园采摘</option></select></label><label className='checkout-consent'><input type='checkbox' required />我已了解：这是本机演示，不会占用真实果树库存。</label><p>示例周期：模拟支付日起一年。正式权益、果实数量和运费须以上线后的认领协议为准。</p>{error && <p className='checkout-error' role='alert'>{error}</p>}<button className='site-btn' disabled={!ready || busy} type='submit'>{busy ? '正在保存…' : '创建演示订单'}<ArrowRight size={16} /></button></form></>}
    </DialogContent></Dialog>
    <Dialog open={accountOpen} onOpenChange={open => { onAccountChange(open); if (!open) setSelected(null); }}><DialogContent className='site-dialog site-account-dialog'>
      <DialogTitle>我的果树与订单</DialogTitle><DialogDescription>仅保存于本浏览器 · 模拟支付不扣款 · 与运营后台示例数据独立</DialogDescription>
      {error && <p className='checkout-error' role='alert'>{error}</p>}
      {!ready ? <p role='status'>正在读取本机记录…</p> : orders.length === 0 ? <div className='checkout-empty'><Trees size={46} /><h3>还没有属于你的树</h3><p>选一个认领计划，体验从下单到陪伴生长的过程。</p><button className='site-btn' onClick={() => { onAccountChange(false); document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }); }}>去选择计划 <ArrowRight size={16} /></button></div> : <>
        <div className='checkout-orders'>{orders.map(order => <article key={order.id} className={selected === order.id ? 'selected' : ''}><div><strong>{order.nickname}</strong><span className={`checkout-status status-${order.status}`}>{labels[order.status]}</span></div><p>{order.planName} · ¥{order.amount / 100} · {order.method === 'visit' ? '到园采摘' : '成熟后配送'}</p><small>创建于 {new Date(order.createdAt).toLocaleString('zh-CN')}</small>{order.status === 'pending' && <><p>15 分钟内可模拟支付，超时自动关闭。</p><div className='checkout-actions'><button className='site-btn' onClick={() => { action(order.id, 'pay'); setSelected(order.id); }}>模拟支付（不扣款）</button><button className='site-text-link' onClick={() => action(order.id, 'cancel')}>取消订单</button></div></>}{order.status === 'paid' && <button className='site-text-link' onClick={() => setSelected(order.id)}>查看专属档案 <ArrowRight size={15} /></button>}</article>)}</div>
        {detail?.status === 'paid' && <section className='checkout-tree'><div className='checkout-tree-heading'><Check size={22} /><div><h3>{detail.nickname} · 演示果树</h3><small>{detail.treeId}</small></div></div><img src='/orchard.jpg' alt='演示果树示意照片' /><p>收获状态：等待果实成熟。物流与采摘预约将在真实后端接入后开放。</p><h4>生长时间线 · 示例记录</h4><p>以下展示通用成长示例，并非本次认领果树的实拍记录。</p>{records.map(record => <article className='checkout-record' key={record.id}><time>{record.date}</time><strong>{record.stage}</strong><p>{record.text}</p></article>)}</section>}
      </>}
    </DialogContent></Dialog>
  </>;
}
