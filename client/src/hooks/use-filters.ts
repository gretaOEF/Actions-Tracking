import { useState, useCallback } from "react";
import type { Filters } from "@shared/schema";

export function useFilters(initialFilters: Filters = {}) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters(current => ({
      ...current,
      ...newFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const resetFilters = useCallback((resetTo: Filters) => {
    setFilters(resetTo);
  }, []);

  return [filters, updateFilters, clearFilters, resetFilters] as const;
}
