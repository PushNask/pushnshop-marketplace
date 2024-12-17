import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { PlaceholderCard } from "@/components/PlaceholderCard";

interface FeaturedProductsProps {
  products: any[];
  language: string;
  loadingProducts: boolean;
  isAtFullCapacity: boolean;
  formatCurrency: (price: number, currency: string) => string;
}

export function FeaturedProducts({
  products,
  language,
  loadingProducts,
  isAtFullCapacity,
  formatCurrency,
}: FeaturedProductsProps) {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#002C5F]">
            {language === "en" ? "Featured Deals" : "Offres en vedette"}
          </h2>
          <Link to="/products" className="text-[#005BBB] flex items-center gap-1">
            {language === "en" ? "View all" : "Voir tout"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="text-center text-gray-500">
            {language === "en"
              ? "Loading featured products..."
              : "Chargement des produits en vedette..."}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, i) => {
              const linkNumber = i + 1;
              return product ? (
                <ProductCard
                  key={linkNumber}
                  product={product}
                  language={language}
                  formatCurrency={formatCurrency}
                  linkNumber={linkNumber}
                />
              ) : (
                <PlaceholderCard
                  key={`placeholder-featured-${i}`}
                  language={language}
                />
              );
            })}
          </div>
        )}

        {isAtFullCapacity && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {language === "en"
              ? "All spots are currently assigned to active products. New products are queued and will be listed as soon as an existing product expires."
              : "Tous les emplacements sont actuellement attribués à des produits actifs. Les nouveaux produits sont mis en file d'attente et seront listés dès qu'un produit existant expirera."}
          </div>
        )}
      </div>
    </section>
  );
}