import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import KpiCards from "@/components/KpiCards";
import Filters from "@/components/Filters";
import DataTable from "@/components/DataTable";
import Charts from "@/components/Charts";
import ActionDrawer from "@/components/ActionDrawer";
import { loadActions, filterActions, calculateKpis, exportData } from "@/lib/data";
import { useFilters } from "@/hooks/use-filters";
import { useUrlState } from "@/hooks/use-url-state";
import { useIsMobile } from "@/hooks/use-mobile";
import { Filter, Download, Menu, X } from "lucide-react";
import type { Action } from "@shared/schema";

export default function Dashboard() {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  const { data: actions = [], isLoading, error } = useQuery({
    queryKey: ["/actions"],
    queryFn: loadActions,
  });

  const [filters, updateFilters] = useFilters();
  useUrlState(filters, updateFilters);

  const filteredActions = filterActions(actions, filters, searchQuery);
  const kpis = calculateKpis(filteredActions);

  const handleActionSelect = (action: Action) => {
    setSelectedAction(action);
    setIsDrawerOpen(true);
  };

  const handleExport = () => {
    exportData(filteredActions, 'csv');
  };

  const clearFilters = () => {
    updateFilters({});
    setSearchQuery("");
  };

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Card className="p-6 max-w-md">
          <h1 className="text-lg font-semibold text-destructive mb-2">Error Loading Data</h1>
          <p className="text-sm text-muted-foreground">
            Failed to load climate actions data. Please try refreshing the page.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" data-testid="dashboard">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">CityCatalyst</h1>
                <p className="text-sm text-muted-foreground">High-Impact Actions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden" 
                onClick={() => setIsMobileFiltersOpen(true)}
                data-testid="button-toggle-mobile-filters"
              >
                <Filter className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleExport}
                data-testid="button-export"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-shrink-0 w-80 bg-card border-r border-border">
          <div className="w-full p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                  Clear All
                </Button>
              </div>
              <Filters 
                filters={filters} 
                onFiltersChange={updateFilters}
                actions={actions}
                data-testid="desktop-filters"
              />
            </div>
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        {isMobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div 
              className="fixed inset-0 bg-black/80" 
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-80 bg-card shadow-xl">
              <div className="p-6 overflow-y-auto h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    data-testid="button-close-mobile-filters"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <Filters 
                  filters={filters} 
                  onFiltersChange={updateFilters}
                  actions={actions}
                  data-testid="mobile-filters"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* KPI Cards */}
            <KpiCards kpis={kpis} isLoading={isLoading} data-testid="kpi-cards" />

            {/* Charts */}
            <Charts kpis={kpis} isLoading={isLoading} data-testid="charts" />

            {/* Data Section */}
            <Card className="shadow-sm border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">High-Impact Actions</h3>
                    <p className="text-sm text-muted-foreground" data-testid="text-filtered-count">
                      Showing {filteredActions.length} of {actions.length} actions
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search actions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 pl-9"
                        data-testid="input-search"
                      />
                      <svg className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <DataTable 
                actions={filteredActions}
                onActionSelect={handleActionSelect}
                isLoading={isLoading}
                data-testid="data-table"
              />
            </Card>
          </div>
        </main>
      </div>

      {/* Action Detail Drawer */}
      <ActionDrawer 
        action={selectedAction}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedAction(null);
        }}
        data-testid="action-drawer"
      />
    </div>
  );
}
