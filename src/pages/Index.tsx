import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/home/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { SafetyBanner } from "@/components/SafetyBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OtherListings } from "@/components/home/OtherListings";
import { Categories } from "@/components/home/Categories";

// Temporary mock data and functions until backend is integrated
const useLanguage = () => ({ language: "en", toggleLanguage: () => {} });
const useCategories = () => ({ data: [], isLoading: false });
const linkService = { getActivePermanentLinks: async () => [] };
const formatCurrency = (price: number, currency: string) => `${currency} ${price}`;

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: activeProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ["active-products"],
    queryFn: () => linkService.getActivePermanentLinks(),
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
      <Header language={language} toggleLanguage={toggleLanguage} />
      <SafetyBanner />
      <HeroSection language={language} />
      
      <FeaturedProducts
        products={top12Featured}
        language={language}
        loadingProducts={loadingProducts}
        isAtFullCapacity={isAtFullCapacity}
        formatCurrency={formatCurrency}
      />

      <OtherListings
        products={otherProducts}
        language={language}
        featuredCount={FEATURED_COUNT}
        formatCurrency={formatCurrency}
      />

      <Categories
        categories={categories}
        language={language}
        isLoading={categoriesLoading}
      />
    </div>
  );
}