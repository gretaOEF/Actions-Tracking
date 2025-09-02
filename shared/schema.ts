import { z } from "zod";

// Climate action categories
export const categorySchema = z.enum(["Mitigation", "Adaptation"]);

// Climate action sectors
export const sectorSchema = z.enum([
  "AFOLU",
  "Stationary Energy", 
  "Transportation",
  "Waste",
  "IPPU"
]);

// Cost tiers
export const costTierSchema = z.enum(["Low", "Medium", "High"]);

// Action status
export const statusSchema = z.enum([
  "Not started",
  "Ready to start", 
  "In progress",
  "Completed",
  "On hold"
]);

// Status history entry
export const statusHistorySchema = z.object({
  date: z.string(),
  status: statusSchema,
});

// Main climate action schema
export const actionSchema = z.object({
  id: z.string(),
  city: z.string(),
  country: z.string(),
  actionName: z.string(),
  category: categorySchema,
  sector: sectorSchema,
  costTier: costTierSchema,
  investmentUSD: z.number().optional(),
  status: statusSchema,
  reductionPotentialPct: z.string().optional(),
  implementationTimeYears: z.string().optional(),
  description: z.string(),
  owner: z.string().optional(),
  lastUpdated: z.string(),
  status_history: z.array(statusHistorySchema).optional(),
  tags: z.array(z.string()).optional(),
});

// Filter state schema
export const filtersSchema = z.object({
  city: z.string().optional(),
  categories: z.array(categorySchema).optional(),
  sectors: z.array(sectorSchema).optional(),
  costTiers: z.array(costTierSchema).optional(),
  statuses: z.array(statusSchema).optional(),
  search: z.string().optional(),
});

// Export types
export type Action = z.infer<typeof actionSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Sector = z.infer<typeof sectorSchema>;
export type CostTier = z.infer<typeof costTierSchema>;
export type Status = z.infer<typeof statusSchema>;
export type StatusHistory = z.infer<typeof statusHistorySchema>;
export type Filters = z.infer<typeof filtersSchema>;

// KPI data type
export type KpiData = {
  totalCities: number;
  totalActions: number;
  mitigationActions: number;
  adaptationActions: number;
  sectorCounts: Record<Sector, number>;
  statusCounts: Record<Status, number>;
};
