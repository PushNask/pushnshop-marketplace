import { useQuery } from '@tanstack/react-query';
import { categoryService, type Category } from '@/services/categoryService';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}