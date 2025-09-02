import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import type { Filters, Action, Category, Sector, CostTier, Status } from "@shared/schema";

interface FiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
  actions: Action[];
}

export default function Filters({ filters, onFiltersChange, actions }: FiltersProps) {
  const [citySearch, setCitySearch] = useState("");

  // Get unique cities for autocomplete
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(actions.map(a => a.city))).sort();
    return citySearch 
      ? uniqueCities.filter(city => city.toLowerCase().includes(citySearch.toLowerCase()))
      : uniqueCities;
  }, [actions, citySearch]);

  const categories: Category[] = ["Mitigation", "Adaptation"];
  const sectors: Sector[] = ["AFOLU", "Stationary Energy", "Transportation", "Waste", "IPPU"];
  const costTiers: CostTier[] = ["Low", "Medium", "High"];
  const statuses: Status[] = ["Not started", "Ready to start", "In progress", "Completed", "On hold"];

  const handleCategoryToggle = (category: Category) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    onFiltersChange({ categories: updated });
  };

  const handleSectorChange = (sector: Sector, checked: boolean) => {
    const current = filters.sectors || [];
    const updated = checked
      ? [...current, sector]
      : current.filter(s => s !== sector);
    onFiltersChange({ sectors: updated });
  };

  const handleCostChange = (cost: CostTier, checked: boolean) => {
    const current = filters.costTiers || [];
    const updated = checked
      ? [...current, cost]
      : current.filter(c => c !== cost);
    onFiltersChange({ costTiers: updated });
  };

  const handleStatusChange = (status: Status, checked: boolean) => {
    const current = filters.statuses || [];
    const updated = checked
      ? [...current, status]
      : current.filter(s => s !== status);
    onFiltersChange({ statuses: updated });
  };

  const handleCitySelect = (city: string) => {
    onFiltersChange({ city });
    setCitySearch("");
  };

  return (
    <div className="space-y-6" data-testid="filters">
      {/* City Filter */}
      <div className="space-y-2">
        <Label htmlFor="city-search" className="text-sm font-medium text-foreground">
          City
        </Label>
        <div className="relative">
          <Input
            id="city-search"
            type="text"
            placeholder="Search cities..."
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            className="pl-9"
            data-testid="input-city-search"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        </div>
        {filters.city && (
          <Badge 
            variant="secondary" 
            className="cursor-pointer"
            onClick={() => onFiltersChange({ city: undefined })}
            data-testid="badge-selected-city"
          >
            {filters.city} ×
          </Badge>
        )}
        {citySearch && cities.length > 0 && (
          <div className="border border-border rounded-md max-h-32 overflow-y-auto bg-background">
            {cities.slice(0, 5).map((city) => (
              <button
                key={city}
                className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                onClick={() => handleCitySelect(city)}
                data-testid={`option-city-${city.toLowerCase().replace(' ', '-')}`}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Category</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = filters.categories?.includes(category);
            return (
              <Button
                key={category}
                variant={isSelected ? "default" : "secondary"}
                size="sm"
                onClick={() => handleCategoryToggle(category)}
                className="text-xs"
                data-testid={`filter-category-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Sector Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Sector</Label>
        <div className="space-y-2">
          {sectors.map((sector) => (
            <div key={sector} className="flex items-center space-x-2">
              <Checkbox
                id={`sector-${sector}`}
                checked={filters.sectors?.includes(sector) || false}
                onCheckedChange={(checked) => handleSectorChange(sector, !!checked)}
                data-testid={`checkbox-sector-${sector.toLowerCase().replace(' ', '-')}`}
              />
              <Label htmlFor={`sector-${sector}`} className="text-sm text-foreground cursor-pointer">
                {sector}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Cost/Investment</Label>
        <div className="space-y-2">
          {costTiers.map((cost) => (
            <div key={cost} className="flex items-center space-x-2">
              <Checkbox
                id={`cost-${cost}`}
                checked={filters.costTiers?.includes(cost) || false}
                onCheckedChange={(checked) => handleCostChange(cost, !!checked)}
                data-testid={`checkbox-cost-${cost.toLowerCase()}`}
              />
              <Label htmlFor={`cost-${cost}`} className="text-sm text-foreground cursor-pointer">
                {cost}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Status</Label>
        <div className="space-y-2">
          {statuses.map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={filters.statuses?.includes(status) || false}
                onCheckedChange={(checked) => handleStatusChange(status, !!checked)}
                data-testid={`checkbox-status-${status.toLowerCase().replace(' ', '-')}`}
              />
              <Label htmlFor={`status-${status}`} className="text-sm text-foreground cursor-pointer">
                {status}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
