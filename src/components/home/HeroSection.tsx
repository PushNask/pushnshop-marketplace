import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  language: string;
}

export function HeroSection({ language }: HeroSectionProps) {
  const { user } = useAuth();

  return (
    <section className="bg-[#005BBB] text-white py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Snap, Sell, Smile
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          {language === "en"
            ? "Quick Local Deals Await!"
            : "Des offres locales rapides vous attendent !"}
        </p>
        <Button
          onClick={() =>
            (window.location.href = user ? "/seller/dashboard" : "/auth/login")
          }
          className="bg-[#F7941D] text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors"
        >
          {language === "en" ? "Start Selling" : "Commencer à vendre"}
        </Button>
      </div>
    </section>
  );
}