import { ShoppingBag, BarChart, User, Plus } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { SidebarLink } from "@/components/seller/SidebarLink";

export function SellerNavLinks() {
  const { language } = useLanguage();
  
  const links = [
    {
      to: "/seller/dashboard",
      icon: <BarChart className="h-5 w-5" />,
      label: language === 'en' ? "Dashboard" : "Tableau de bord"
    },
    {
      to: "/seller/products/new",
      icon: <Plus className="h-5 w-5" />,
      label: language === 'en' ? "Create Listing" : "Créer une annonce"
    },
    {
      to: "/seller/products",
      icon: <ShoppingBag className="h-5 w-5" />,
      label: language === 'en' ? "My Products" : "Mes Produits"
    },
    {
      to: "/seller/profile",
      icon: <User className="h-5 w-5" />,
      label: language === 'en' ? "Profile" : "Profil"
    }
  ];

  return (
    <nav className="flex-1 space-y-1" aria-label="Seller sidebar navigation">
      {links.map((link) => (
        <SidebarLink
          key={link.to}
          to={link.to}
          icon={link.icon}
          label={link.label}
        />
      ))}
    </nav>
  );
}