import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserMenuContent } from "@/components/shared/navigation/UserMenuContent";
import { useLanguage } from "@/hooks/useLanguage";

interface SellerHeaderProps {
  profile?: {
    name?: string;
    avatar?: string | null;
  };
  onMenuClick: () => void;
}

export function SellerHeader({ profile, onMenuClick }: SellerHeaderProps) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/placeholder.svg"
                alt="PushNshop"
                className="h-8 w-8"
              />
              <span className="hidden lg:block font-semibold text-gray-900">
                PushNshop Seller
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              {language.toUpperCase()}
            </Button>

            <NotificationsDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {profile?.name?.charAt(0) || "S"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <UserMenuContent />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}