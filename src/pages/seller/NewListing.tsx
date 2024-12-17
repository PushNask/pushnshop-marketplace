import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { 
  ImagePlus, 
  X, 
  Loader2, 
  ArrowLeft,
  Info
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

// Form validation schema
const productSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(80, 'Title must be less than 80 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters'),
  price: z.number()
    .min(100, 'Price must be at least 100 XAF')
    .max(10000000, 'Price must be less than 10,000,000 XAF'),
  currency: z.enum(['XAF']),
  duration_hours: z.number()
    .int()
    .min(24)
    .max(120),
  images: z.array(z.any())
    .min(1, 'At least one image is required')
    .max(7, 'Maximum 7 images allowed'),
  whatsapp_number: z.string()
    .regex(/^\+?\d{9,15}$/, 'Invalid WhatsApp number'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewListing() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      currency: 'XAF',
      duration_hours: 24,
      images: [],
      whatsapp_number: ''
    }
  });

  const createProduct = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload images first
      const imageUrls = await Promise.all(
        data.images.map(async (img) => {
          const fileName = `${crypto.randomUUID()}.${img.name.split('.').pop()}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, img);

          if (uploadError) throw uploadError;
          return uploadData.path;
        })
      );

      // Create product
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          title: data.title,
          description: data.description,
          price: data.price,
          images: imageUrls,
          seller_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      toast({
        title: language === 'en' ? 'Product Created' : 'Produit Créé',
        description: language === 'en' 
          ? 'Your listing has been created successfully'
          : 'Votre annonce a été créée avec succès'
      });
      navigate('/seller/products');
    },
    onError: (error) => {
      toast({
        title: language === 'en' ? 'Error' : 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const durations = [
    { hours: 24, price: 5000 },
    { hours: 48, price: 7500 },
    { hours: 72, price: 10000 },
    { hours: 96, price: 12500 },
    { hours: 120, price: 15000 }
  ];

  const onSubmit = (data: ProductFormValues) => {
    createProduct.mutate(data);
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
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Product Information' : 'Informations Produit'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Duration and Contact */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Listing Details' : 'Détails de l\'Annonce'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="duration_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === 'en' ? 'Duration' : 'Durée'}
                    </FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durations.map(({ hours, price }) => (
                          <SelectItem key={hours} value={hours.toString()}>
                            {hours}h - {price.toLocaleString()} XAF
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        {language === 'en' ? 'WhatsApp Number' : 'Numéro WhatsApp'}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {language === 'en'
                                ? 'Include country code (e.g., +237)'
                                : 'Inclure l\'indicatif pays (ex: +237)'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+237" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
