import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, 
  MessageCircle, 
  Shield, 
  ChevronLeft,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function ProductDetails() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { trackProductView, trackWhatsAppClick } = useAnalytics();
  const linkNumber = parseInt(id?.replace('p', '') || '0');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', linkNumber],
    queryFn: async () => {
      const { data: links } = await supabase
        .from('permanent_links')
        .select(`
          *,
          product:products (
            *,
            seller:profiles (
              name,
              whatsapp_number
            )
          )
        `)
        .eq('path', `p${linkNumber}`)
        .single();

      if (!links?.product) {
        throw new Error('Product not found');
      }

      trackProductView(links.product.id);
      return links.product;
    }
  });

  const handleWhatsAppClick = () => {
    if (product?.id) {
      trackWhatsAppClick(product.id);
      if (product.seller?.whatsapp_number) {
        window.open(
          `https://wa.me/${product.seller.whatsapp_number}?text=${encodeURIComponent(
            `Hello, I'm interested in: ${product.title}`
          )}`,
          '_blank'
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">
          {language === 'en' ? 'Product Not Found' : 'Produit Non Trouvé'}
        </h1>
        <p className="text-gray-600 mb-4">
          {language === 'en' 
            ? 'The product you are looking for might have expired or been removed.'
            : 'Le produit que vous recherchez a peut-être expiré ou a été supprimé.'}
        </p>
        <Button onClick={() => window.history.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Go Back' : 'Retour'}
        </Button>
      </div>
    );
  }

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Back' : 'Retour'}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <div className="aspect-square bg-white rounded-lg overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-white rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${product.title} - ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </p>
            </div>

            {product.is_verified && (
              <div className="flex items-center gap-2 text-secondary">
                <Shield className="h-5 w-5" />
                <span className="font-medium">
                  {language === 'en' ? 'Verified Seller' : 'Vendeur Vérifié'}
                </span>
              </div>
            )}

            <div className="prose max-w-none">
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={handleWhatsAppClick}
                disabled={!product.seller?.whatsapp_number}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Contact Seller' : 'Contacter le Vendeur'}
              </Button>
            </div>

            {/* Seller Info */}
            <div className="border-t pt-6 mt-6">
              <h2 className="font-semibold mb-4">
                {language === 'en' ? 'Seller Information' : 'Information du Vendeur'}
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  {product.seller?.name || (language === 'en' ? 'Anonymous Seller' : 'Vendeur Anonyme')}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6">
              <h2 className="font-semibold mb-4">
                {language === 'en' ? 'Additional Information' : 'Informations Supplémentaires'}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {language === 'en' ? 'Listed on: ' : 'Publié le: '}
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}