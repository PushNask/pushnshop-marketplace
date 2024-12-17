import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-[#002C5F]">
        {language.toUpperCase()}
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={toggleLanguage}>
          {language === 'en' ? 'Français' : 'English'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}