import { WhatsappIcon } from "lucide-react";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  isFeatured?: boolean;
  whatsappNumber?: string;
}

export const ProductCard = ({
  id,
  title,
  price,
  image,
  isFeatured,
  whatsappNumber,
}: ProductCardProps) => {
  return (
    <div className="product-card animate-fade-up">
      {isFeatured && <span className="featured-badge">Featured</span>}
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        <p className="mt-1 text-lg font-bold text-primary">
          ${price.toLocaleString()}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <a
            href={`/p${id}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View Details
          </a>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1.5 text-sm font-medium text-white transition-transform hover:scale-105"
            >
              <WhatsappIcon className="h-4 w-4" />
              Chat
            </a>
          )}
        </div>
      </div>
    </div>
  );
};