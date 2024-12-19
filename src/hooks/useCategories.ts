import { useQuery } from '@tanstack/react-query';

interface Category {
  id: string;
  name: string;
  name_fr?: string;
}

// Temporary mock data until backend is ready
const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', name_fr: 'Électronique' },
  { id: '2', name: 'Fashion', name_fr: 'Mode' },
  { id: '3', name: 'Home', name_fr: 'Maison' },
];

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => Promise.resolve(mockCategories),
    staleTime: Infinity, // Categories don't change often
  });
}