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

export function ProductInfoSection({ form }: ProductInfoSectionProps) {
  const { language } = useLanguage();

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
    </div>
  );
}