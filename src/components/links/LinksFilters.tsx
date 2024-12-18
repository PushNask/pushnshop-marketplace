import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';

interface LinksFiltersProps {
  filters: {
    status: string;
    sortBy: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function LinksFilters({ filters, onFiltersChange }: LinksFiltersProps) {
  const { language } = useLanguage();

  return (
    <div className="flex gap-4 mb-6">
      <Input
        placeholder={language === "en" ? "Search links..." : "Rechercher des liens..."}
        value={filters.search}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        className="max-w-xs"
      />
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {language === "en" ? "All Status" : "Tous les statuts"}
          </SelectItem>
          <SelectItem value="active">
            {language === "en" ? "Active" : "Actif"}
          </SelectItem>
          <SelectItem value="available">
            {language === "en" ? "Available" : "Disponible"}
          </SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.sortBy}
        onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="performance">
            {language === "en" ? "Performance Score" : "Score de performance"}
          </SelectItem>
          <SelectItem value="views">
            {language === "en" ? "Views" : "Vues"}
          </SelectItem>
          <SelectItem value="clicks">
            {language === "en" ? "WhatsApp Clicks" : "Clics WhatsApp"}
          </SelectItem>
          <SelectItem value="rotations">
            {language === "en" ? "Rotation Count" : "Nombre de rotations"}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}