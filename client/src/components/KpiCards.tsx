import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, ClipboardList, TrendingUp, Shield } from "lucide-react";
import type { KpiData } from "@shared/schema";

interface KpiCardsProps {
  kpis: KpiData;
  isLoading: boolean;
}

export default function KpiCards({ kpis, isLoading }: KpiCardsProps) {
  const cards = [
    {
      title: "Total Cities",
      value: kpis.totalCities,
      icon: Building,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Total Actions", 
      value: kpis.totalActions,
      icon: ClipboardList,
      color: "bg-chart-1/10 text-chart-1",
    },
    {
      title: "Mitigation",
      value: kpis.mitigationActions,
      subtitle: `${Math.round((kpis.mitigationActions / kpis.totalActions) * 100)}% of total`,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Adaptation",
      value: kpis.adaptationActions, 
      subtitle: `${Math.round((kpis.adaptationActions / kpis.totalActions) * 100)}% of total`,
      icon: Shield,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="kpi-cards-loading">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-2xl p-6 shadow-sm border border-border">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="kpi-cards">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="rounded-2xl p-6 shadow-sm border border-border">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold text-foreground" data-testid={`kpi-${card.title.toLowerCase().replace(' ', '-')}`}>
                    {card.value}
                  </p>
                  {card.subtitle && (
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
