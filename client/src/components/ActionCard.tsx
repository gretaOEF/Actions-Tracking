import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusPill from "@/components/StatusPill";
import type { Action } from "@shared/schema";

interface ActionCardProps {
  action: Action;
  onClick: () => void;
}

export default function ActionCard({ action, onClick }: ActionCardProps) {
  return (
    <Card 
      className="rounded-2xl shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-foreground leading-tight">{action.actionName}</h3>
            <p className="text-sm text-muted-foreground">{action.city}, {action.country}</p>
          </div>
          <StatusPill status={action.status} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusPill
              status={action.category}
              variant={action.category === "Mitigation" ? "success" : "info"}
            />
            <Badge variant="outline" className="text-xs">
              {action.sector}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {action.costTier}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {action.description}
        </p>
      </CardContent>
    </Card>
  );
}
