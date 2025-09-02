import { z } from "zod";
import { actionSchema, type Action, type Filters, type KpiData, type Sector, type Status } from "@shared/schema";

export async function loadActions(): Promise<Action[]> {
  try {
    // Try to load from Google Sheets API first
    const response = await fetch("/api/actions");
    if (!response.ok) {
      throw new Error(`Failed to load actions: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Validate the data structure
    const actionsArray = z.array(actionSchema).parse(data);
    return sortActions(actionsArray);
  } catch (error) {
    console.error("Error loading actions:", error);
    throw new Error("Failed to load climate actions data. Please check your Google Sheets configuration.");
  }
}

export function filterActions(actions: Action[], filters: Filters, searchQuery: string = ""): Action[] {
  return actions.filter((action) => {
    // City filter
    if (filters.city && action.city !== filters.city) {
      return false;
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(action.category)) {
        return false;
      }
    }

    // Sector filter
    if (filters.sectors && filters.sectors.length > 0) {
      if (!filters.sectors.includes(action.sector)) {
        return false;
      }
    }

    // Cost tier filter
    if (filters.costTiers && filters.costTiers.length > 0) {
      if (!filters.costTiers.includes(action.costTier)) {
        return false;
      }
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      if (!filters.statuses.includes(action.status)) {
        return false;
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const searchFields = [
        action.city,
        action.actionName,
        action.description,
        ...(action.tags || [])
      ].join(" ").toLowerCase();
      
      if (!searchFields.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function sortActions(actions: Action[]): Action[] {
  const statusOrder: Record<Status, number> = {
    "Ready to start": 1,
    "In progress": 2,
    "Completed": 3,
    "Not started": 4,
    "On hold": 5,
  };

  return [...actions].sort((a, b) => {
    // First by status priority
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    // Then by city
    const cityDiff = a.city.localeCompare(b.city);
    if (cityDiff !== 0) return cityDiff;

    // Finally by action name
    return a.actionName.localeCompare(b.actionName);
  });
}

export function calculateKpis(actions: Action[]): KpiData {
  const totalCities = new Set(actions.map(a => a.city)).size;
  const totalActions = actions.length;
  const mitigationActions = actions.filter(a => a.category === "Mitigation").length;
  const adaptationActions = actions.filter(a => a.category === "Adaptation").length;

  const sectorCounts: Record<Sector, number> = {
    "AFOLU": 0,
    "Stationary Energy": 0,
    "Transportation": 0,
    "Waste": 0,
    "IPPU": 0,
  };

  const statusCounts: Record<Status, number> = {
    "Not started": 0,
    "Ready to start": 0,
    "In progress": 0,
    "Completed": 0,
    "On hold": 0,
  };

  actions.forEach(action => {
    sectorCounts[action.sector]++;
    statusCounts[action.status]++;
  });

  return {
    totalCities,
    totalActions,
    mitigationActions,
    adaptationActions,
    sectorCounts,
    statusCounts,
  };
}

export function exportData(actions: Action[], format: 'csv' | 'json' = 'csv'): void {
  if (format === 'json') {
    const dataStr = JSON.stringify(actions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `climate-actions-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } else {
    // CSV format
    const headers = [
      'ID', 'City', 'Country', 'Action Name', 'Category', 'Sector', 
      'Cost Tier', 'Investment USD', 'Status', 'Reduction Potential', 
      'Implementation Time', 'Description', 'Owner', 'Last Updated', 'Tags'
    ];
    
    const csvContent = [
      headers.join(','),
      ...actions.map(action => [
        action.id,
        `"${action.city}"`,
        `"${action.country}"`,
        `"${action.actionName}"`,
        action.category,
        `"${action.sector}"`,
        action.costTier,
        action.investmentUSD || '',
        `"${action.status}"`,
        `"${action.reductionPotentialPct || ''}"`,
        `"${action.implementationTimeYears || ''}"`,
        `"${action.description.replace(/"/g, '""')}"`,
        `"${action.owner || ''}"`,
        action.lastUpdated,
        `"${(action.tags || []).join('; ')}"`,
      ].join(','))
    ].join('\n');
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `climate-actions-${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}

// Update action status via API
export async function updateActionStatus(actionId: string, newStatus: Status): Promise<void> {
  try {
    const response = await fetch('/api/update-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ actionId, newStatus }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update status: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Status updated successfully:', result.message);
  } catch (error) {
    console.error('Error updating status:', error);
    throw new Error('Failed to update action status. Please try again.');
  }
}

// Legacy function for backwards compatibility
export function onStatusUpdate(actionId: string, newStatus: Status): void {
  updateActionStatus(actionId, newStatus).catch(console.error);
}
