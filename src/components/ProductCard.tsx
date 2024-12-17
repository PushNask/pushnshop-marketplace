import { Link } from "react-router-dom";
import { MessageCircle, Shield } from "lucide-react";

interface Product {
  title: string;
  price: number;
  currency?: string;
  images?: string[];
  description?: string;
  time_remaining?: number;
  is_verified?: boolean;
  seller_whatsapp?: string;
}

interface ProductCardProps {
  product: Product;
  language: string;
  formatCurrency: (price: number, currency: string) => string;
  linkNumber: number;
}

export function ProductCard({
  product,
  language,
  formatCurrency,
  linkNumber,
}: ProductCardProps) {
  const price = formatCurrency(product.price, product.currency || "XAF");
  const productLink = `/p${linkNumber}`;
  const detailsLink = `/p${linkNumber}/details`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <Link to={productLink} className="block aspect-square bg-gray-100 relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        {product.time_remaining && (
          <span className="absolute top-2 right-2 bg-[#005BBB] text-white text-xs px-2 py-1 rounded">
            {product.time_remaining}h left
          </span>
        )}
        {product.is_verified && (
          <span className="absolute top-2 left-2 bg-[#F7941D] text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {language === "en" ? "Verified" : "Vérifié"}
          </span>
        )}
      </Link>
      <div className="p-4">
        <h3 className="font-medium mb-2 truncate">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-2 truncate">
          {product.description ||
            (language === "en" ? "No description" : "Pas de description")}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-[#002C5F]">{price}</span>
          {product.seller_whatsapp ? (
            <a
              href={`https://wa.me/${
                product.seller_whatsapp
              }?text=${encodeURIComponent(
                `Hello, I'm interested in: ${product.title}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F7941D] hover:text-[#005BBB] transition-colors"
              aria-label="Contact seller on WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          ) : (
            <MessageCircle
              className="h-5 w-5 text-gray-300"
              title="WhatsApp not available"
            />
          )}
        </div>
        <Link
          to={detailsLink}
          className="text-sm text-[#005BBB] underline hover:no-underline"
        >
          {language === "en" ? "View Details" : "Voir les détails"}
        </Link>
      </div>
    </div>
  );
}