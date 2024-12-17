import { Search } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function SearchBar() {
  const { language } = useLanguage();

  return (
    <div className="relative">
      <input
        type="search"
        placeholder={
          language === 'en'
            ? 'Search products...'
            : 'Rechercher des produits...'
        }
        className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-[#005BBB]"
      />
      <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
}