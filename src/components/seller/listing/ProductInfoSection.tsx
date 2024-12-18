import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormValues } from '@/types/products';

interface ProductInfoSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const DURATION_OPTIONS = [
  { hours: 24, price: 5000 },
  { hours: 48, price: 7500 },
  { hours: 72, price: 10000 },
  { hours: 96, price: 12500 },
  { hours: 120, price: 15000 }
] as const;

export function ProductInfoSection({ form }: ProductInfoSectionProps) {
  const { language } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {language === 'en' ? 'Title' : 'Titre'}
            </FormLabel>
            <FormControl>
              <Input {...field} maxLength={80} />
            </FormControl>
            <FormDescription>
              {field.value.length}/80 {language === 'en' ? 'characters' : 'caractères'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {language === 'en' ? 'Description' : 'Description'}
            </FormLabel>
            <FormControl>
              <Textarea {...field} maxLength={2000} />
            </FormControl>
            <FormDescription>
              {field.value.length}/2000 {language === 'en' ? 'characters' : 'caractères'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'en' ? 'Price' : 'Prix'}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'en' ? 'Currency' : 'Devise'}
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="XAF">XAF</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Duration Selection */}
      <FormField
        control={form.control}
        name="duration_hours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {language === 'en' ? 'Duration & Price' : 'Durée & Prix'}
            </FormLabel>
            <Select
              value={field.value?.toString()}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select duration' : 'Sélectionner la durée'} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {DURATION_OPTIONS.map(({ hours, price }) => (
                  <SelectItem key={hours} value={hours.toString()}>
                    {hours}h - {formatPrice(price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {language === 'en' 
                ? 'Select how long your listing will be active'
                : 'Sélectionnez la durée de votre annonce'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}