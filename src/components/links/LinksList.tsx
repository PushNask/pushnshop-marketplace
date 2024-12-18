import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { linkService } from '@/services/linkService';
import { LinkCard } from './LinkCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { Link } from '@/types/links';

interface LinksListProps {
  filters: {
    status?: string;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  };
}

export function LinksList({ filters }: LinksListProps) {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['links', filters],
    queryFn: ({ pageParam = 1 }) => linkService.getLinks({ 
      ...filters, 
      page: pageParam,
      perPage: 20 
    }),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages 
        ? lastPage.currentPage + 1 
        : undefined,
    retry: 2
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'error') {
    return <ErrorState error={error as Error} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.pages.map((page) =>
          page.links.map((link: Link) => (
            <LinkCard 
              key={link.id} 
              link={link}
              onView={() => {}}
              onAssign={() => {}}
              onUpdateSEO={() => {}}
            />
          ))
        )}
      </div>

      {hasNextPage && (
        <div
          ref={ref}
          className="flex justify-center p-4"
        >
          {isFetchingNextPage && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center p-8">
      <LoadingSpinner />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Loading...</span>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="text-center p-8">
      <p className="text-red-500 mb-4">{error.message}</p>
      <Button onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );
}

export function LinksListWithErrorBoundary(props: LinksListProps) {
  return (
    <ErrorBoundary>
      <LinksList {...props} />
    </ErrorBoundary>
  );
}