import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function UserMenuContent() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { signOut } = useAuth();

  return (
    <>
      <DropdownMenuItem onClick={() => navigate("/seller/profile")}>
        <User className="h-4 w-4 mr-2" />
        {language === 'en' ? "Profile" : "Profil"}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/seller/settings")}>
        <Settings className="h-4 w-4 mr-2" />
        {language === 'en' ? "Settings" : "Paramètres"}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
        <LogOut className="h-4 w-4 mr-2" />
        {language === 'en' ? "Logout" : "Déconnexion"}
      </DropdownMenuItem>
    </>
  );
}