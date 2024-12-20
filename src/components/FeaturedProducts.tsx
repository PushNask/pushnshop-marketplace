import { ProductCard } from "./ProductCard";

const FEATURED_PRODUCTS = [
  {
    id: "1",
    title: "Premium Wireless Headphones",
    price: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    isFeatured: true,
    seller_whatsapp: "1234567890",
    seller_id: "1",
    status: "active" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_verified: true
  },
  {
    id: "2",
    title: "Smart Watch Series 5",
    price: 399,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    isFeatured: true,
    seller_whatsapp: "1234567890",
    seller_id: "1",
    status: "active" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_verified: true
  },
];

export const FeaturedProducts = () => {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="mb-8 text-3xl font-bold">Featured Deals</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FEATURED_PRODUCTS.map((product, index) => {
            return (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  images: [product.image],
                }}
                language="en"
                formatCurrency={(price, currency) => `${currency} ${price}`}
                linkNumber={index + 1}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};