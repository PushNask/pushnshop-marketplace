import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Link as LinkIcon, 
  Search, 
  Filter,
  ArrowUpDown,
  Eye
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LinksList } from "@/components/links/LinksList";
import { MetricCard } from "@/components/links/MetricCard";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

export default function LinksManagement() {
  const { language } = useLanguage();
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    sortBy: "performance"
  });

  // Fetch links with their associated products and metrics
  const { data: links, isLoading } = useQuery({
    queryKey: ["permanent-links", filters],
    queryFn: async () => {
      let query = supabase
        .from("permanent_links")
        .select(`
          *,
          product:products (
            id,
            title,
            price,
            images,
            seller:profiles (
              name,
              whatsapp_number
            )
          )
        `);

      if (filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.search) {
        query = query.ilike("path", `%${filters.search}%`);
      }

      // Apply sorting
      const sortColumn = {
        performance: "performance_score",
        views: "views_count",
        clicks: "whatsapp_clicks",
        rotations: "rotation_count"
      }[filters.sortBy];

      if (sortColumn) {
        query = query.order(sortColumn, { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch metrics for overview cards
  const { data: metrics } = useQuery({
    queryKey: ["links-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permanent_links")
        .select("status, performance_score, views_count, whatsapp_clicks");

      if (error) throw error;

      const active = data.filter(l => l.status === "active").length;
      const available = data.filter(l => l.status === "available").length;
      const avgPerformance = data.reduce((acc, curr) => acc + (curr.performance_score || 0), 0) / data.length;
      const totalViews = data.reduce((acc, curr) => acc + (curr.views_count || 0), 0);

      return {
        activeLinks: active,
        availableLinks: available,
        averagePerformance: avgPerformance.toFixed(1),
        totalViews
      };
    }
  });

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={language === "en" ? "Active Links" : "Liens actifs"}
          value={metrics?.activeLinks || 0}
          icon={<LinkIcon className="h-5 w-5" />}
        />
        <MetricCard
          title={language === "en" ? "Available Links" : "Liens disponibles"}
          value={metrics?.availableLinks || 0}
          icon={<LinkIcon className="h-5 w-5" />}
        />
        <MetricCard
          title={language === "en" ? "Average Performance" : "Performance moyenne"}
          value={`${metrics?.averagePerformance || 0}%`}
          icon={<ArrowUpDown className="h-5 w-5" />}
        />
        <MetricCard
          title={language === "en" ? "Total Views" : "Vues totales"}
          value={metrics?.totalViews || 0}
          icon={<Eye className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "en" ? "Links Management" : "Gestion des liens"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder={language === "en" ? "Search links..." : "Rechercher des liens..."}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="max-w-xs"
            />
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
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
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
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
        </CardContent>
      </Card>

      {/* Links Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <LinksList 
          links={links || []}
          onView={(link) => console.log("View link", link)}
          onAssign={() => console.log("Assign link")}
          onUpdateSEO={() => console.log("Update SEO")}
        />
      )}
    </div>
  );
}