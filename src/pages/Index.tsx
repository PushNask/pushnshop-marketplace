import { Button } from "@/components/ui/button";
import { SafetyBanner } from "@/components/SafetyBanner";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SafetyBanner />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent to-background py-20">
        <div className="container relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="animate-fade-down text-4xl font-bold tracking-tight sm:text-6xl">
              Your Local Marketplace
            </h1>
            <p className="animate-fade-up mt-6 text-lg leading-8 text-muted-foreground">
              Buy and sell with confidence in your local community. Verified
              transactions, secure payments, and instant communication.
            </p>
            <div className="animate-slide-up mt-10 flex items-center justify-center gap-4">
              <Button size="lg" className="gap-2">
                Start Selling <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Browse Deals
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  );
};

export default Index;