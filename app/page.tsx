import Storefront from './storefront';
import { catalog, journals } from '@/lib/storefront-data';

export default function HomePage() {
  return <Storefront initialCatalog={catalog} journals={journals} />;
}
