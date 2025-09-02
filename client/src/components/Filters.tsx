import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Filters, Action, Category, Sector, CostTier, Status } from "@shared/schema";

interface FiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
  actions: Action[];
}

export default function Filters({ filters, onFiltersChange, actions }: FiltersProps) {

  // Get unique cities for dropdown
  const allCities = useMemo(() => {
    return Array.from(new Set(actions.map(a => a.city))).sort();
  }, [actions]);

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
    if (city === "all") {
      onFiltersChange({ city: undefined });
    } else {
      onFiltersChange({ city });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" data-testid="filters">
      {/* City Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
          City
        </Label>
        <Select 
          value={filters.city || "all"} 
          onValueChange={handleCitySelect}
          data-testid="select-city"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {allCities.map((city) => (
              <SelectItem 
                key={city} 
                value={city}
                data-testid={`option-city-${city.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold tracking-wider uppercase text-gray-600">Category</Label>
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
        <Label className="text-xs font-semibold tracking-wider uppercase text-gray-600">Sector</Label>
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
        <Label className="text-xs font-semibold tracking-wider uppercase text-gray-600">Cost</Label>
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
        <Label className="text-xs font-semibold tracking-wider uppercase text-gray-600">Status</Label>
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
