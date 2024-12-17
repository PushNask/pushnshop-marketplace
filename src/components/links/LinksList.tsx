import React from 'react';
import { LinkCard } from './LinkCard';
import type { Link } from '@/types/links';

interface LinksListProps {
  links: Link[];
  onView: (link: Link) => void;
}

export function LinksList({ links, onView }: LinksListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          onView={onView}
          onAssign={() => {}}
          onUpdateSEO={() => {}}
        />
      ))}
    </div>
  );
}