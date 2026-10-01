import type { Catalog } from './storefront-data';

export async function loadCatalog(signal?: AbortSignal): Promise<Catalog> {
  const response = await fetch('/api/v1/home', { signal, cache: 'no-store' });
  if (!response.ok) throw new Error('果园资料暂时无法加载，请稍后重试。');
  const result = await response.json() as { code?: number; data?: Catalog };
  const data = result?.data;
  if (result?.code !== 0 || data?.mode !== 'demo' || !Array.isArray(data?.plans) || !Array.isArray(data?.records) ||
      !data.stats || ![data.stats.total, data.stats.adopted, data.stats.families].every(value => Number.isSafeInteger(value) && value >= 0) ||
      !data.plans.every(plan => Number.isSafeInteger(plan.id) && Number.isSafeInteger(plan.amount) && plan.amount > 0 &&
        typeof plan.name === 'string' && typeof plan.subtitle === 'string' && Array.isArray(plan.benefits) && plan.benefits.every(item => typeof item === 'string')) ||
      !data.records.every(record => typeof record.text === 'string' && typeof record.stage === 'string' && typeof record.date === 'string')) {
    throw new Error('果园资料格式异常，请稍后重试。');
  }
  return data;
}
