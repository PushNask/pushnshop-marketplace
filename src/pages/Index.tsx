import { useQuery } from "@tanstack/react-query";
import { Search, Menu, ChevronDown, ArrowRight, Shield, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SafetyBanner } from "@/components/SafetyBanner";

// Temporary mock data and functions until backend is integrated
const useLanguage = () => ({ language: "en", toggleLanguage: () => {} });
const useCategories = () => ({ data: [], isLoading: false });
const linkService = { getActivePermanentLinks: async () => [] };
const useUser = () => null;
const formatCurrency = (price: number, currency: string) => `${currency} ${price}`;

export default function Index() {
  const { language, toggleLanguage } = useLanguage();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: activeProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ["active-products"],
    queryFn: () => linkService.getActivePermanentLinks(),
  });

  const user = useUser();

  const MAX_CAPACITY = 120;
  const FEATURED_COUNT = 12;

  // Create a consistent array of length 120 (products + placeholders)
  const allProducts = activeProducts || [];
  const filledProducts = [
    ...allProducts.slice(0, MAX_CAPACITY),
    ...Array(MAX_CAPACITY - allProducts.length).fill(null),
  ];

  const top12Featured = filledProducts.slice(0, FEATURED_COUNT);
  const otherProducts = filledProducts.slice(FEATURED_COUNT);

  const isAtFullCapacity = allProducts.length >= MAX_CAPACITY;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button className="lg:hidden" aria-label="Menu">
                <Menu className="h-6 w-6 text-[#002C5F]" />
              </button>
              <Link to="/">
                <img src="/placeholder.svg" alt="PushNshop" className="h-10 w-10" />
              </Link>
            </div>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm text-[#002C5F]"
            >
              {language.toUpperCase()}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="py-3">
            <div className="relative">
              <input
                type="search"
                placeholder={
                  language === "en" ? "Search products..." : "Rechercher des produits..."
                }
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-[#005BBB]"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      <SafetyBanner />

      {/* Hero Section */}
      <section className="bg-[#005BBB] text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Snap, Sell, Smile</h1>
          <p className="text-xl md:text-2xl mb-8">
            {language === "en"
              ? "Quick Local Deals Await!"
              : "Des offres locales rapides vous attendent !"}
          </p>
          <Button
            onClick={() =>
              (window.location.href = user ? "/seller/dashboard" : "/auth/register")
            }
            className="bg-[#F7941D] text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors"
          >
            {language === "en" ? "Start Selling" : "Commencer à vendre"}
          </Button>
        </div>
      </section>

      {/* Featured Products (Top 12) */}
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
              {top12Featured.map((product, i) => {
                const linkNumber = i + 1; // p1 through p12
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

          {/* Capacity Message */}
          {isAtFullCapacity && (
            <div className="mt-4 text-center text-sm text-gray-600">
              {language === "en"
                ? "All spots are currently assigned to active products. New products are queued and will be listed as soon as an existing product expires."
                : "Tous les emplacements sont actuellement attribués à des produits actifs. Les nouveaux produits sont mis en file d'attente et seront listés dès qu'un produit existant expirera."}
            </div>
          )}
        </div>
      </section>

      {/* Other Listings (Remaining Up To 108) */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#002C5F] mb-6">
            {language === "en" ? "All Listings" : "Toutes les annonces"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherProducts.map((product, i) => {
              const linkNumber = FEATURED_COUNT + i + 1; // p13 through p120
              return product ? (
                <ProductCard
                  key={linkNumber}
                  product={product}
                  language={language}
                  formatCurrency={formatCurrency}
                  linkNumber={linkNumber}
                />
              ) : (
                <PlaceholderCard key={`placeholder-other-${i}`} language={language} />
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#002C5F] mb-6">
            {language === "en" ? "Browse Categories" : "Parcourir les catégories"}
          </h2>

          {categoriesLoading ? (
            <div className="text-center text-gray-500">
              {language === "en"
                ? "Loading categories..."
                : "Chargement des catégories..."}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="p-4 text-center border border-gray-200 rounded-lg hover:border-[#005BBB] hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 mx-auto mb-2 opacity-70 group-hover:opacity-100">
                    <img
                      src="/placeholder.svg"
                      alt=""
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-[#002C5F]">
                    {language === "fr" ? category.name_fr : category.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PlaceholderCard({ language }: { language: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
      <div className="aspect-square bg-gray-100 mb-2" />
      <p className="text-sm font-medium">
        {language === "en" ? "New Deal's Coming Here" : "De nouvelles offres arrivent ici"}
      </p>
    </div>
  );
}

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

function ProductCard({ product, language, formatCurrency, linkNumber }: ProductCardProps) {
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
          {/* WhatsApp Chat Button */}
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
        {/* View Details Link */}
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
