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
  
  const { data: actions = [], isLoading, error, refetch } = useQuery({
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
    <div className="min-h-screen" data-testid="dashboard">
      {/* Institutional Header */}
      <header className="blue-section sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CityCatalyst</h1>
                <p className="text-sm text-white/80">Climate Action Dashboard</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#overview" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Overview</a>
              <a href="#data" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Data</a>
              <a href="#methodology" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Methodology</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden text-white hover:bg-white/10" 
                onClick={() => setIsMobileFiltersOpen(true)}
                data-testid="button-toggle-mobile-filters"
              >
                <Filter className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleExport}
                variant="secondary"
                data-testid="button-export"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Project Overview */}
      <section className="neutral-section py-16 lg:py-24" id="overview">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <p className="section-header">PROJECT OVERVIEW</p>
                <h2 className="institutional-title mb-6">
                  Scaling high-impact climate actions across global cities
                </h2>
                <p className="policy-text mb-6">
                  This platform supports municipalities worldwide in developing and tracking 
                  foundational climate diagnostics and priority actions. By aligning local action 
                  with national climate commitments, CityCatalyst strengthens coordination between 
                  subnational and national governments on climate action.
                </p>
                <p className="policy-text">
                  At the heart of this initiative is the principle of multi-scale alignment: 
                  ensuring that local climate action contributes to achieving national climate goals 
                  while addressing the unique needs and capabilities of each city.
                </p>
              </div>
              
              {/* KPI Cards */}
              <div className="space-y-4">
                <p className="section-header">IMPACT METRICS</p>
                <KpiCards kpis={kpis} isLoading={isLoading} data-testid="kpi-cards" />
              </div>
            </div>
            
            <div className="space-y-6">
              <Charts kpis={kpis} isLoading={isLoading} data-testid="charts" />
            </div>
          </div>
        </div>
      </section>

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

      {/* Filters & Data Section - Clean White Background */}
      <section className="neutral-section py-16 bg-gray-50" id="data">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-header">DATA EXPLORATION</p>
            <h2 className="institutional-title text-gray-900 mb-6">
              Explore Climate Actions
            </h2>
            <p className="policy-text max-w-3xl mx-auto">
              Filter and analyze high-impact climate actions across cities, sectors, and implementation stages. 
              Each action represents a critical intervention for urban climate resilience.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 space-y-8">
            {/* Filters */}
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Filter Actions</h3>
                  <p className="text-sm text-gray-600" data-testid="text-filtered-count">
                    Showing {filteredActions.length} of {actions.length} actions
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search actions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 pl-9"
                      data-testid="input-search"
                    />
                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="lg:hidden">
                <Button 
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="w-full"
                  variant="outline"
                  data-testid="button-show-filters"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Show Filters
                </Button>
              </div>
              
              <div className="hidden lg:block">
                <Filters 
                  filters={filters} 
                  onFiltersChange={updateFilters}
                  actions={actions}
                  data-testid="desktop-filters"
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <DataTable 
                actions={filteredActions}
                onActionSelect={handleActionSelect}
                isLoading={isLoading}
                data-testid="data-table"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Action Detail Drawer */}
      <ActionDrawer 
        action={selectedAction}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedAction(null);
        }}
        onStatusUpdated={() => {
          // Refresh data when status is updated
          refetch();
        }}
        data-testid="action-drawer"
      />
    </div>
  );
}
