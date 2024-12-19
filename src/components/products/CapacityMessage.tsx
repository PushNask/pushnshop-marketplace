import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface CapacityMessageProps {
  isAtCapacity: boolean;
  language: string;
}

export function CapacityMessage({ isAtCapacity, language }: CapacityMessageProps) {
  if (!isAtCapacity) return null;

  return (
    <Alert className="mt-4 bg-yellow-50 border-yellow-200">
      <Shield className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        {language === 'en'
          ? 'All spots are currently assigned to active products. New products are queued and will be listed as soon as an existing product expires.'
          : 'Tous les emplacements sont actuellement attribués à des produits actifs. Les nouveaux produits sont mis en file d\'attente et seront listés dès qu\'un produit existant expirera.'}
      </AlertDescription>
    </Alert>
  );
}