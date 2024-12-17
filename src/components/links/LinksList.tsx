import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Settings } from 'lucide-react';
import type { Link } from '@/types/links';

interface LinksListProps {
  links: Link[];
  onView: (link: Link) => void;
  onAssign?: () => void;
  onUpdateSEO?: () => void;
}

export function LinksList({ links, onView, onAssign, onUpdateSEO }: LinksListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {links.map((link, index) => (
        <Card key={link.id || index}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{link.path}</h3>
                <p className="text-sm text-gray-500">
                  {link.status === 'active' ? 'Active' : 'Available'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onView(link)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onUpdateSEO}>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Performance</span>
                <span className="font-medium">{link.performance_score}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Views</span>
                <span className="font-medium">{link.views_count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Clicks</span>
                <span className="font-medium">{link.whatsapp_clicks}</span>
              </div>
            </div>

            {link.product && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <img
                    src={link.product.images[0] || "/placeholder.svg"}
                    alt=""
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {link.product.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Intl.NumberFormat('fr-CM', {
                        style: 'currency',
                        currency: 'XAF'
                      }).format(link.product.price)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}