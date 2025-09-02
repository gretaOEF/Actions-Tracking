import { useEffect } from "react";
import { useLocation } from "wouter";
import type { Filters } from "@shared/schema";

export function useUrlState(
  filters: Filters,
  updateFilters: (filters: Partial<Filters>) => void
) {
  const [location, setLocation] = useLocation();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.city) {
      params.set('city', filters.city);
    }
    
    if (filters.categories && filters.categories.length > 0) {
      params.set('category', filters.categories.join(','));
    }
    
    if (filters.sectors && filters.sectors.length > 0) {
      params.set('sector', filters.sectors.join(','));
    }
    
    if (filters.costTiers && filters.costTiers.length > 0) {
      params.set('cost', filters.costTiers.join(','));
    }
    
    if (filters.statuses && filters.statuses.length > 0) {
      params.set('status', filters.statuses.join(','));
    }
    
    if (filters.search) {
      params.set('search', filters.search);
    }

    const queryString = params.toString();
    const newPath = queryString ? `/?${queryString}` : '/';
    
    if (location !== newPath) {
      setLocation(newPath, { replace: true });
    }
  }, [filters, location, setLocation]);

  // Load filters from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters: Partial<Filters> = {};

    const city = params.get('city');
    if (city) {
      urlFilters.city = city;
    }

    const categories = params.get('category');
    if (categories) {
      urlFilters.categories = categories.split(',') as any;
    }

    const sectors = params.get('sector');
    if (sectors) {
      urlFilters.sectors = sectors.split(',') as any;
    }

    const costs = params.get('cost');
    if (costs) {
      urlFilters.costTiers = costs.split(',') as any;
    }

    const statuses = params.get('status');
    if (statuses) {
      urlFilters.statuses = statuses.split(',') as any;
    }

    const search = params.get('search');
    if (search) {
      urlFilters.search = search;
    }

    if (Object.keys(urlFilters).length > 0) {
      updateFilters(urlFilters);
    }
  }, []); // Only run on mount
}
