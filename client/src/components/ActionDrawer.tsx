import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import StatusPill from "@/components/StatusPill";
import { ExternalLink, Edit } from "lucide-react";
import { format } from "date-fns";
import { updateActionStatus } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { Action, Status } from "@shared/schema";

interface ActionDrawerProps {
  action: Action | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export default function ActionDrawer({ action, isOpen, onClose, onStatusUpdated }: ActionDrawerProps) {
  const { toast } = useToast();
  
  if (!action) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-md" data-testid="action-drawer">
        <SheetHeader>
          <SheetTitle className="text-left">{action.actionName}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Location</span>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{action.city}</div>
                <div className="text-xs text-muted-foreground">{action.country}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Category</span>
              <StatusPill
                status={action.category}
                variant={action.category === "Mitigation" ? "success" : "info"}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Sector</span>
              <span className="text-sm text-foreground">{action.sector}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Cost Tier</span>
              <span className="text-sm text-foreground">{action.costTier}</span>
            </div>

            {action.investmentUSD && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Investment</span>
                <span className="text-sm text-foreground">
                  ${action.investmentUSD.toLocaleString()} USD
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <StatusPill status={action.status} />
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {action.description}
            </p>
          </div>

          {/* Impact Details */}
          <div className="space-y-4">
            {action.reductionPotentialPct && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Reduction Potential</span>
                <span className="text-sm font-medium text-foreground">{action.reductionPotentialPct}</span>
              </div>
            )}
            
            {action.implementationTimeYears && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Implementation Time</span>
                <span className="text-sm text-foreground">{action.implementationTimeYears}</span>
              </div>
            )}
            
            {action.owner && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Owner</span>
                <span className="text-sm text-foreground">{action.owner}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
              <span className="text-sm text-foreground">{formatDate(action.lastUpdated)}</span>
            </div>
          </div>

          {/* Status Timeline */}
          {action.status_history && action.status_history.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Status History</h4>
                <div className="space-y-3">
                  {action.status_history.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${
                            index === 0 ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {entry.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tags */}
          {action.tags && action.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {action.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-4 space-y-3">
            <Button 
              className="w-full" 
              onClick={async () => {
                try {
                  // For demo, cycle through statuses
                  const statuses: Status[] = ["Not started", "Ready to start", "In progress", "Completed", "On hold"];
                  const currentIndex = statuses.indexOf(action.status);
                  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                  
                  await updateActionStatus(action.id, nextStatus);
                  
                  toast({
                    title: "Status Updated",
                    description: `Action status changed to: ${nextStatus}`,
                  });
                  
                  if (onStatusUpdated) {
                    onStatusUpdated();
                  }
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to update status. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
              data-testid="button-update-status"
            >
              <Edit className="w-4 h-4 mr-2" />
              Update Status
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // TODO: Implement external link functionality
                console.log('View external details for:', action.id);
              }}
              data-testid="button-view-external"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
