export const i18n = {
  en: {
    app: {
      title: "CityCatalyst",
      subtitle: "High-Impact Actions",
    },
    filters: {
      title: "Filters",
      clearAll: "Clear All",
      city: "City",
      cityPlaceholder: "Search cities...",
      category: "Category",
      sector: "Sector", 
      cost: "Cost/Investment",
      status: "Status",
    },
    categories: {
      mitigation: "Mitigation",
      adaptation: "Adaptation",
    },
    sectors: {
      afolu: "AFOLU",
      stationaryEnergy: "Stationary Energy",
      transportation: "Transportation",
      waste: "Waste",
      ippu: "IPPU",
    },
    costTiers: {
      low: "Low",
      medium: "Medium", 
      high: "High",
    },
    statuses: {
      notStarted: "Not started",
      readyToStart: "Ready to start",
      inProgress: "In progress",
      completed: "Completed",
      onHold: "On hold",
    },
    kpis: {
      totalCities: "Total Cities",
      totalActions: "Total Actions",
      mitigation: "Mitigation",
      adaptation: "Adaptation",
    },
    charts: {
      actionsBySector: "Actions by Sector",
      mitigationVsAdaptation: "Mitigation vs Adaptation",
    },
    table: {
      city: "City",
      action: "Action",
      category: "Category",
      sector: "Sector", 
      cost: "Cost",
      status: "Status",
      actions: "Actions",
      view: "View",
      searchPlaceholder: "Search actions...",
      showingResults: "Showing {start} to {end} of {total} results",
      previous: "Previous",
      next: "Next",
    },
    drawer: {
      location: "Location",
      category: "Category",
      sector: "Sector",
      costTier: "Cost Tier",
      investment: "Investment",
      status: "Status",
      description: "Description",
      reductionPotential: "Reduction Potential",
      implementationTime: "Implementation Time",
      owner: "Owner",
      lastUpdated: "Last Updated",
      statusHistory: "Status History",
      tags: "Tags",
      updateStatus: "Update Status",
      viewDetails: "View Details",
    },
    buttons: {
      exportData: "Export Data",
      toggleFilters: "Toggle filters",
    },
    errors: {
      loadingFailed: "Failed to load climate actions data",
      dataNotFound: "No actions found matching your criteria",
    },
  },
  // Add pt/es translations as needed
};

export type Locale = keyof typeof i18n;
export type Translations = typeof i18n.en;

export function useTranslations(locale: Locale = 'en'): Translations {
  return i18n[locale];
}
