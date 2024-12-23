import { ProductCard } from "@/components/ProductCard";
import { PlaceholderCard } from "@/components/PlaceholderCard";

interface OtherListingsProps {
  products: any[];
  language: string;
  featuredCount: number;
  formatCurrency: (price: number, currency: string) => string;
}

export function OtherListings({
  products,
  language,
  featuredCount,
  formatCurrency,
}: OtherListingsProps) {
  const MAX_LINKS = 120;
  const remainingCount = MAX_LINKS - featuredCount;

  // Create a consistent array of length 120 (products + placeholders)
  const filledProducts = [
    ...products.slice(0, remainingCount),
    ...Array(remainingCount - products.length).fill(null)
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#002C5F] mb-6">
          {language === "en" ? "All Listings" : "Toutes les annonces"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filledProducts.map((product, i) => {
            const linkNumber = featuredCount + i + 1;
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
                key={`placeholder-other-${i}`}
                language={language}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}