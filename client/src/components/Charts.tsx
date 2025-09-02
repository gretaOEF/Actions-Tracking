import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { KpiData } from "@shared/schema";

interface ChartsProps {
  kpis: KpiData;
  isLoading: boolean;
}

export default function Charts({ kpis, isLoading }: ChartsProps) {
  const sectorData = Object.entries(kpis.sectorCounts).map(([sector, count]) => ({
    sector,
    count,
  }));

  const categoryData = [
    { name: "Mitigation", value: kpis.mitigationActions, color: "hsl(142.1 76.2% 36.3%)" },
    { name: "Adaptation", value: kpis.adaptationActions, color: "hsl(221.2 83.2% 53.3%)" },
  ];

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="charts-loading">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="rounded-2xl p-6 shadow-sm border border-border">
            <CardContent className="p-0">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="charts">
      {/* Bar Chart - Actions by Sector */}
      <Card className="rounded-2xl shadow-sm border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Actions by Sector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="sector" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Donut Chart - Mitigation vs Adaptation */}
      <Card className="rounded-2xl shadow-sm border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Mitigation vs Adaptation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            {categoryData.map((entry) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
