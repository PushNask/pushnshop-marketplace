import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ImageUploadSection } from '@/components/seller/listing/ImageUploadSection';
import { ProductInfoSection } from '@/components/seller/listing/ProductInfoSection';
import { productSchema, type ProductFormValues } from '@/types/products';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function NewListing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      currency: 'XAF',
      duration_hours: 24,
      images: [],
    }
  });

  const createProduct = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      if (!user) throw new Error('Not authenticated');

      try {
        console.log('Starting product creation with data:', data);
        
        // Upload images first
        const imageUrls = await Promise.all(
          data.images.map(async (img) => {
            const fileName = `${crypto.randomUUID()}.${img.name.split('.').pop()}`;
            console.log('Uploading image:', fileName);
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('product-images')
              .upload(fileName, img);

            if (uploadError) {
              console.error('Image upload error:', uploadError);
              throw uploadError;
            }
            
            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(uploadData.path);
              
            return publicUrl;
          })
        );

        console.log('Images uploaded successfully:', imageUrls);

        // Create product
        const { data: product, error } = await supabase
          .from('products')
          .insert({
            title: data.title,
            description: data.description,
            price: data.price,
            currency: data.currency,
            duration_hours: data.duration_hours,
            images: imageUrls,
            seller_id: user.id,
            status: 'pending'
          })
          .select()
          .single();

        if (error) {
          console.error('Product creation error:', error);
          throw error;
        }

        console.log('Product created successfully:', product);
        return product;
      } catch (error) {
        console.error('Error in product creation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: language === 'en' ? 'Product Created' : 'Produit Créé',
        description: language === 'en' 
          ? 'Your listing has been created successfully'
          : 'Votre annonce a été créée avec succès'
      });
      navigate('/seller/dashboard');
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log('Form submitted with data:', data);
    try {
      await createProduct.mutateAsync(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Back' : 'Retour'}
        </Button>
        <h1 className="text-2xl font-bold">
          {language === 'en' ? 'Create New Listing' : 'Créer une Nouvelle Annonce'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Images Upload */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Product Images' : 'Images du Produit'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Upload up to 7 images (2MB max per image)'
                  : 'Téléchargez jusqu\'à 7 images (2 Mo max par image)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadSection form={form} />
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Product Information' : 'Informations Produit'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductInfoSection form={form} />
            </CardContent>
          </Card>

          {/* Submit */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {language === 'en'
                    ? 'Your listing will be reviewed before being published'
                    : 'Votre annonce sera examinée avant d\'être publiée'}
                </div>
                <Button
                  type="submit"
                  disabled={createProduct.isPending}
                >
                  {createProduct.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {language === 'en' ? 'Create Listing' : 'Créer l\'Annonce'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}