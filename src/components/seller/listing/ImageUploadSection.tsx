import React from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormValues } from '@/types/products';

interface ImageUploadSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

export function ImageUploadSection({ form }: ImageUploadSectionProps) {
  const { toast } = useToast();
  const { language } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {field.value.map((file, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => {
                      const newImages = [...field.value];
                      newImages.splice(index, 1);
                      field.onChange(newImages);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {field.value.length < 7 && (
                <label className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size <= 2 * 1024 * 1024) {
                        field.onChange([...field.value, file]);
                      } else {
                        toast({
                          title: language === 'en' ? 'Error' : 'Erreur',
                          description: language === 'en'
                            ? 'Image must be less than 2MB'
                            : 'L\'image doit être inférieure à 2 Mo',
                          variant: 'destructive'
                        });
                      }
                    }}
                  />
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                </label>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}