import { useQuery } from '@tanstack/react-query';
import { linkService } from '@/services/linkService';

export function useActivePermanentLinks() {
  return useQuery({
    queryKey: ['active-permanent-links'],
    queryFn: () => linkService.getActivePermanentLinks(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}