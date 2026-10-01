import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'山里有棵树 · 和自然一起慢慢生活',description:'在山里认领一棵苹果树，陪伴四季生长，收获一份来自山野的心意。'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><body>{children}</body></html>}
