'use client';

import { useEffect, useState } from 'react';
import { Apple, ArrowRight, Check, ChevronDown, ClipboardList, Heart, Leaf, Menu, Mountain, Package, Search, ShieldCheck, Sprout, Sun, Trees, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { AdoptionPlan, Catalog } from '@/lib/storefront-data';
import { loadCatalog } from '@/lib/storefront-api';
import Checkout from './storefront-checkout';
import './storefront.css';
import './storefront-refinements.css';

type Journal = { season: string; month: string; title: string; subtitle: string; text: string };
export default function Storefront({ initialCatalog, journals }: { initialCatalog: Catalog; journals: Journal[] }) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [menu, setMenu] = useState(false);
  const [plan, setPlan] = useState<AdoptionPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(initialCatalog.plans.find(item => item.name.includes('家庭'))?.id ?? initialCatalog.plans[1]?.id ?? null);
  const [account, setAccount] = useState(false);
  const [article, setArticle] = useState<{ title: string; text: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function refresh(signal?: AbortSignal) {
    setLoading(true);
    try { setCatalog(await loadCatalog(signal)); setError(''); }
    catch (err) { if (!signal?.aborted) setError(err instanceof Error ? err.message : '加载失败'); }
    finally { if (!signal?.aborted) setLoading(false); }
  }
  useEffect(() => { const controller = new AbortController(); void refresh(controller.signal); return () => controller.abort(); }, []);
  const recommendedPlanId = catalog.plans.find(item => item.name.includes('家庭'))?.id ?? catalog.plans[1]?.id;
  const navigation = [['首页', 'top'], ['认领计划', 'plans'], ['果园日记', 'journal'], ['树主人故事', 'stories'], ['乡村生活', 'seasons'], ['关于我们', 'about']];
  const storyItems = [
    { name: '给家人的四季', label: '陪伴 · FAMILY', text: '让孩子知道，一个苹果不是从货架上长出来的。从第一朵花到第一颗果子，一起记录、一起等待，再一起分享收获。' },
    { name: '留一点时间给自然', label: '日常 · SLOW LIFE', text: '在繁忙的工作间隙，打开果树档案，看一片新叶、一颗慢慢变红的果实。生活的节奏，有时可以交给一棵树。' },
    { name: '一份会生长的礼物', label: '心意 · A GROWING GIFT', text: '把一年的期待送给在意的人。它会经历花开与落叶，也会在每一个不同的季节，带来一点新的惊喜。' },
    { name: '记下山里的每一个变化', label: '记录 · ORCHARD NOTES', text: '用相机和果树档案，留住花开、结果与成熟的日常。每次回看，都会发现这一年又多了一些新的风景。' },
  ];
  const storyPhotos = [
    { src: '/images/story-woman.png', alt: '在苹果树下感受山野时光的年轻女性' },
    { src: '/images/story-camera.png', alt: '带着相机记录果园变化的年轻男性' },
    { src: '/images/story-hat.png', alt: '在果园里品尝苹果的草帽女孩' },
    { src: '/images/story-glasses.png', alt: '在山地果园漫步的眼镜男士' },
  ];
  return <div className='orchard-site'>
    <a className='site-skip' href='#plans'>跳到认领计划</a>
    <header className='site-header'>
      <a className='site-logo' href='#top'><Trees size={38} strokeWidth={1.35} /><span><strong>山里有棵树</strong><small>让城市的你，也有一片山野</small></span></a>
      <nav className={menu ? 'site-nav is-open' : 'site-nav'} aria-label='主导航'>{navigation.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}</nav>
      <div className='site-header-actions'><button className='site-search' aria-label='搜索' onClick={() => setArticle({ title: '正在整理山里的故事', text: '搜索、果园日记和树主人故事会在内容后台接入后开放。你可以先从认领计划或四季日记开始。' })}><Search size={19} /></button><a className='site-btn site-btn-small' href='#plans'>立即认领 <ArrowRight size={15} /></a><button className='site-menu' aria-label={menu ? '关闭菜单' : '打开菜单'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div>
    </header>

    <section className='site-hero' id='top'>
      <img className='site-hero-image' src='/hero-orchard-v2.png' alt='山景苹果园中采摘苹果的场景' fetchPriority='high' />
      <div className='site-hero-wash' />
      <div className='site-hero-copy'><span className='site-eyebrow'><Leaf size={14} /> A TREE. A BETTER YOU.</span><h1>山里，<br />给你留了一棵树<span>。</span></h1><p>在城市生活的你，也可以拥有一棵属于自己的树。<br className='desktop-break' />看得见生长，等得到收获。</p><div className='site-actions'><a className='site-btn' href='#plans'>开启我的认领 <ArrowRight size={17} /></a><a className='site-btn site-btn-outline' href='#about'>走进山里 <Mountain size={17} /></a></div><div className='site-stats'><div><strong>{catalog.stats.total}<small>棵</small></strong><span>示例果园果树</span></div><div><strong>{catalog.stats.adopted}<small>棵</small></strong><span>示例已认领</span></div><div><strong>{catalog.stats.families}<small>户</small></strong><span>示例认领家庭</span></div></div></div>
      <div className='site-hero-note'>把日子种进山里<br /><span>等一棵树的回信</span><small>LIVE CLOSER TO NATURE</small></div><div className='site-hero-stamp'>山野来信<br /><span>VOL. 01 / 2026</span></div><a className='site-scroll' href='#about'><ChevronDown size={20} /><span>慢一点，走进自然</span></a>
    </section>

    <section className='site-intro site-container' id='about'>
      <div className='site-editorial-photo'><img src='/images/apple-closeup.png' alt='暖阳下挂在枝头的近景苹果' loading='lazy' decoding='async' /><div>山里的四季<br /><span>藏着你的名字</span></div><small>NATURE, A KINDER YOU</small></div>
      <div className='site-intro-copy'><span className='site-eyebrow'>01 / MEET YOUR ORCHARD</span><h2>不只是一棵果树<br />而是一种更松弛的生活方式</h2><p>在钢筋水泥的城市里，<br />我们依然可以拥有一片属于自己的自然。<br />认领一棵树，在四季的流转中，<br />收获真实的期待与喜悦。</p><div className='site-mountain-line' aria-hidden='true'><Mountain size={86} strokeWidth={.65} /><Mountain className='site-mountain-ridge' size={48} strokeWidth={.6} /><span>LIVE CLOSER<br />TO NATURE</span></div><a className='site-text-link' href='#seasons'>认识一棵树的一年 <ArrowRight size={16} /></a><div className='site-trust'><span><ShieldCheck size={19} /> 一树一档</span><span><Leaf size={19} /> 生长记录</span><span><Package size={19} /> 收获可追踪</span></div></div>
      <div className='site-phone-scene'><div className='site-intro-handnote' aria-hidden='true'>把四季，慢慢收进生活<small>FROM THE MOUNTAINS · 2026</small></div><div className='site-polaroid'><img src='/images/orchard-polaroid.png' alt='苹果园拍立得照片' loading='lazy' /><span>秋天，等你来</span></div><Trees className='site-intro-botanical' size={110} strokeWidth={.6} aria-hidden='true' /><div className='site-phone'><div className='site-phone-top'>9:41 <span>● ● ▰</span></div><small>我的果树 · 示例档案</small><h3>小满 · A001</h3><img src='/intro-orchard-editorial.png' alt='示例果树照片' loading='lazy' decoding='async' /><div className='site-phone-state'><span><Sprout size={22} /></span><div>健康生长中<small>最近更新 2026.09.10</small></div></div>{[['开花', '4月'], ['结果', '6月'], ['着色', '9月'], ['收获', '10月']].map(([label, month]) => <div className='site-phone-stage' key={label}><i />{label}<span>{month}</span></div>)}<button onClick={() => setAccount(true)}>查看我的果树 <ArrowRight size={14} /></button></div></div>
    </section>

    <section className='site-plans-band' id='plans'><div className='site-container site-plans-layout'><div className='site-section-aside'><span className='site-eyebrow'>02 / ADOPT A TREE</span><h2>认领计划</h2><p>不论住城市，或隐于美好。<br />选择一种适合你的方式，<br />与山里的树相遇。</p><small>价格与权益沿用现有后台示例配置。<br />正式开放前将确认配送与认领条款。</small><a className='site-text-link' href='#process'>了解认领流程 <ArrowRight size={16} /></a></div><div className='site-plan-grid'>{catalog.plans.map((item, index) => {
      const isSelected = selectedPlan === item.id;
      const isRecommended = item.id === recommendedPlanId;
      return <article className={`site-plan${isRecommended ? ' recommended' : ''}${isSelected ? ' is-selected' : ''}`} key={item.id} tabIndex={0} aria-label={`选择${item.name}`} onClick={() => setSelectedPlan(item.id)} onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedPlan(item.id); } }}>
        {isRecommended && <span className='site-recommend'>家庭之选</span>}
        <div className='site-plan-name'><h3>{item.name}</h3>{index < 2 ? <img className='site-plan-art' src={index === 0 ? '/images/plan-apple-299.png' : '/images/plan-branch-499.png'} alt='' aria-hidden='true' loading='lazy' /> : <Trees className='site-plan-botanical' size={66} strokeWidth={.65} aria-hidden='true' />}</div>
        <p>{item.subtitle}</p><div className='site-price'><small>¥</small>{item.amount / 100}<span>/ 年</span></div><ul>{item.benefits.map(benefit => <li key={benefit}><Check size={15} />{benefit}</li>)}</ul>
        <button className={isSelected ? 'site-btn' : 'site-btn site-btn-outline'} onClick={event => { event.stopPropagation(); setSelectedPlan(item.id); setPlan(item); }}>选择此计划 <ArrowRight size={16} /></button>
      </article>;
    })}</div></div>{error && <div className='site-api-error' role='status'>{error} 当前展示初始示例数据。<button onClick={() => void refresh()} disabled={loading}>{loading ? '重试中…' : '重试加载'}</button></div>}</section>

    <section className='site-container site-process' id='process'><div className='site-section-aside'><span className='site-eyebrow'>A SIMPLE BEGINNING</span><h2>认领，只需几步</h2><p>从一个小小的决定，<br />开启一段与自然的长久陪伴。</p></div><div className='site-steps'>{[{ icon: ClipboardList, name: '选择计划', note: '找到适合你的认领方式' }, { icon: Sprout, name: '完成认领', note: '确认权益与专属果树' }, { icon: Sun, name: '见证生长', note: '看看山里的新变化' }, { icon: Apple, name: '收获果实', note: '把自然的心意带回家' }, { icon: Heart, name: '继续陪伴', note: '明年，我们还在这里相见' }].map(({ icon: Icon, name, note }, index) => <article key={name}><div><Icon size={26} strokeWidth={1.4} /></div><small>0{index + 1}</small><h3>{name}</h3><p>{note}</p></article>)}</div></section>

    <section className='site-seasons-band' id='seasons'><div className='site-container site-seasons-inner'><div><span className='site-eyebrow'>GROW AT NATURE’S PACE</span><h2>一年的等待，<br />每一步都有回响。</h2><p>关键生长节点，果农定期记录。<br />你不在山里，也不会错过它的变化。</p><button className='site-text-link' onClick={() => setAccount(true)}>查看成长档案 <ArrowRight size={16} /></button></div><div className='site-season-timeline'>{[...catalog.records].reverse().map((record, index) => <article key={record.id}><span>{record.date.slice(5, 7)}月</span><i className={index === catalog.records.length - 1 ? 'current' : ''} /><div><h3>{record.stage}</h3><p>{record.text}</p></div></article>)}</div></div></section>

    <section className='site-container site-stories' id='stories'><div className='site-section-top'><div><span className='site-eyebrow'>03 / PEOPLE & TREES</span><h2>树主人的故事，从这里开始</h2></div><p>来自不同城市的人，在山里拥有同一种牵挂。<br /><small>以下为认领生活场景，非真实用户评价。</small></p></div><div className='site-story-grid'>{storyItems.map((story, index) => <button className={`site-story story-${index}`} key={story.name} onClick={() => setArticle({ title: story.name, text: story.text })}><span className='site-story-photo'><img src={storyPhotos[index].src} alt={storyPhotos[index].alt} width={1536} height={1024} loading='lazy' decoding='async' /><span className='site-story-number'>0{index + 1}</span></span><small>{story.label}</small><h3>{story.name}</h3><p>{story.text}</p><span className='site-story-link'>读一段山里的生活 <ArrowRight size={17} /></span></button>)}<button className='site-story-more' onClick={() => setArticle({ title: '更多树主人的故事', text: '更多来自不同城市的树主人故事，正在慢慢收集。每一棵树的四季，也都藏着一段独特的生活。' })}><span>不同时候<br />相同的山里</span><small>MORE STORIES</small><ArrowRight size={20} /></button></div></section>

    <section className='site-journal-band' id='journal'><div className='site-container site-journal-layout'><div className='site-section-aside'><span className='site-eyebrow'>04 / ORCHARD JOURNAL</span><h2>果园日记<br />山里的四季</h2><p>从一朵花开，到一颗果实；<br />记录时间，也记录生命的温柔。</p><small>四季农事介绍 · 示例内容</small></div><div className='site-journal-grid'>{journals.map((journal, index) => <button key={journal.season} className={`site-journal season-${index}`} onClick={() => setArticle({ title: journal.title, text: journal.text })}><small>{journal.month}</small><strong>{journal.season}</strong><h3>{journal.title}</h3><span>{journal.subtitle} <ArrowRight size={15} /></span></button>)}</div></div></section>

    <section className='site-final'><img className='site-final-image' src='/cta-orchard-warm.png' alt='' loading='lazy' decoding='async' /><div className='site-final-copy'><span className='site-eyebrow'>THERE IS A TREE WAITING FOR YOU</span><h2>现在，认领一棵属于你的树</h2><p>在山里，种下期待，收获更好的自己。</p><a className='site-btn' href='#plans'>让故事开始 <ArrowRight size={17} /></a></div></section>
    <footer className='site-footer site-container'><a className='site-logo' href='#top'><Trees size={34} strokeWidth={1.3} /><span><strong>山里有棵树</strong><small>让城市的你，也有一片山野</small></span></a><div className='site-footer-nav'>{navigation.slice(1).map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div><div className='site-footer-note'>自然，让生活更好<small>NATURE, A KINDER YOU</small></div><div className='site-footer-bottom'><span>© 2026 山里有棵树 · 官网体验版</span><div><button onClick={() => setArticle({ title: '演示数据与隐私说明', text: '本体验版不收集手机号、地址或支付信息。演示订单只保存在当前浏览器，不会发送给果园或与运营后台同步。清理浏览器数据会删除这些记录。正式隐私政策需在真实服务上线前由运营方提供。' })}>数据与隐私</button><button onClick={() => setArticle({ title: '认领须知（演示）', text: '当前套餐来自已有运营后台示例。所有认领和支付操作均为模拟，不扣款、不预留真实库存，也不形成真实认领权益。正式交易开放前，需要确认果园资质、服务周期、果实数量、运费、退款及自然风险处理条款。' })}>认领须知</button><a href='/admin'>运营后台 ↗</a></div></div></footer>
    <div className='site-mobile-bar'><button onClick={() => setAccount(true)}><Trees size={18} />我的果树</button><a className='site-btn' href='#plans'>选择认领计划 <ArrowRight size={16} /></a></div>
    <Checkout plan={plan} onClose={() => setPlan(null)} accountOpen={account} onAccountChange={setAccount} records={catalog.records} />
    <Dialog open={!!article} onOpenChange={open => { if (!open) setArticle(null); }}><DialogContent className='site-dialog'><DialogTitle>{article?.title}</DialogTitle><DialogDescription>{article?.text}</DialogDescription><button className='site-btn' onClick={() => setArticle(null)}>读完了 <Check size={16} /></button></DialogContent></Dialog>
  </div>;
}
