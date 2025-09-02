import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatusPill from "./StatusPill";
import ActionCard from "./ActionCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Action } from "@shared/schema";

interface DataTableProps {
  actions: Action[];
  onActionSelect: (action: Action) => void;
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 20;

export default function DataTable({ actions, onActionSelect, isLoading }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  
  const totalPages = Math.ceil(actions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentActions = actions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="data-table-loading">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-border">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4 p-4" data-testid="data-table-mobile">
        {currentActions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            onClick={() => onActionSelect(action)}
            data-testid={`action-card-${action.id}`}
          />
        ))}
        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Desktop table view
  return (
    <>
      <div className="overflow-x-auto" data-testid="data-table-desktop">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                City
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Action
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sector
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Cost
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentActions.map((action) => (
              <TableRow
                key={action.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onActionSelect(action)}
                data-testid={`table-row-${action.id}`}
              >
                <TableCell>
                  <div className="text-sm font-medium text-foreground">{action.city}</div>
                  <div className="text-xs text-muted-foreground">{action.country}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-foreground max-w-xs truncate">
                    {action.actionName}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusPill
                    status={action.category}
                    variant={action.category === "Mitigation" ? "success" : "info"}
                  />
                </TableCell>
                <TableCell className="text-sm text-foreground">{action.sector}</TableCell>
                <TableCell className="text-sm text-foreground">{action.costTier}</TableCell>
                <TableCell>
                  <StatusPill status={action.status} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionSelect(action);
                    }}
                    data-testid={`button-view-${action.id}`}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Desktop Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground" data-testid="text-pagination-info">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{Math.min(endIndex, actions.length)}</span> of{" "}
              <span className="font-medium">{actions.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                data-testid="button-prev-page"
              >
                Previous
              </Button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8"
                      onClick={() => handlePageChange(pageNum)}
                      data-testid={`button-page-${pageNum}`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                data-testid="button-next-page"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
