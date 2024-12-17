import { Link } from "react-router-dom";
import { Search, Menu, ChevronDown } from "lucide-react";

interface HeaderProps {
  language: string;
  toggleLanguage: () => void;
}

export function Header({ language, toggleLanguage }: HeaderProps) {
  return (
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

        <div className="py-3">
          <div className="relative">
            <input
              type="search"
              placeholder={
                language === "en"
                  ? "Search products..."
                  : "Rechercher des produits..."
              }
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-[#005BBB]"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}