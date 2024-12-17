import { ShoppingBag, BarChart, User } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { SidebarLink } from "@/components/seller/SidebarLink";

export function SellerNavLinks() {
  const { language } = useLanguage();
  
  const links = [
    {
      to: "/seller/products",
      icon: <ShoppingBag className="h-5 w-5" />,
      label: language === 'en' ? "Products" : "Produits"
    },
    {
      to: "/seller/analytics",
      icon: <BarChart className="h-5 w-5" />,
      label: language === 'en' ? "Analytics" : "Analytique"
    },
    {
      to: "/seller/profile",
      icon: <User className="h-5 w-5" />,
      label: language === 'en' ? "Profile" : "Profil"
    }
  ];

  return (
    <nav className="flex-1 space-y-1">
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