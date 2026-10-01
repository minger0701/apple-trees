import { seed } from '../app/store';

export interface AdoptionPlan {
  id: number;
  name: string;
  subtitle: string;
  amount: number;
  benefits: string[];
}
export const catalog = {
  mode: 'demo' as const,
  stats: { total: seed.trees.length, adopted: seed.trees.filter(tree => tree.user).length, families: seed.users.length },
  plans: seed.plans.map((plan): AdoptionPlan => ({
    id: plan.id, name: plan.name, subtitle: plan.note,
    amount: plan.price * 100, benefits: plan.benefits.split('；'),
  })),
  records: seed.records.map(({ id, date, stage, text }) => ({ id, date, stage, text })),
};
export type Catalog = typeof catalog;
export const journals = [
  { season: '春', month: '03—05', title: '花开，是一年的来信', subtitle: '萌芽 / 开花 / 疏果', text: '春风吹过山坡，苹果树从冬眠中醒来。花期观察与疏果，让每一颗留下的果实获得充足的生长空间。' },
  { season: '夏', month: '06—08', title: '绿荫里，悄悄长大', subtitle: '套袋 / 养护 / 膨大', text: '给幼果套上保护袋，巡视果园、检查水分，在漫长的夏天里等待苹果慢慢长大。' },
  { season: '秋', month: '10月10日', title: '把山里的甜，寄给你', subtitle: '着色 / 成熟 / 采摘', text: '苹果在秋日阳光下慢慢着色。成熟后分批采摘、挑选、装箱，再把这一年的等待送到你手中。' },
  { season: '冬', month: '11—02', title: '休息，也是生长的一部分', subtitle: '落叶 / 修剪 / 休眠', text: '枝头安静下来。果农整理树形、养护土壤，为下一年的花开与收获做准备。' },
];
