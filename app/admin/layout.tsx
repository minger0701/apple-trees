import type { Metadata } from 'next';

export const metadata: Metadata = { title: '山里有棵树 · 运营工作台（演示）' };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><a href='/' style={{ display: 'block', padding: '8px 20px', background: '#34452e', color: 'white', fontSize: 14 }}>← 返回认领官网 · 运营工作台为本机演示，未接入生产后台</a>{children}</>;
}
