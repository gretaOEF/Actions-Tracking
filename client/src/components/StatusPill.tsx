import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Status, Category } from "@shared/schema";

interface StatusPillProps {
  status: Status | Category | string;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
  className?: string;
}

export default function StatusPill({ status, variant, className }: StatusPillProps) {
  const getVariantFromStatus = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In progress":
        return "info";
      case "Ready to start":
        return "warning";
      case "On hold":
        return "destructive";
      case "Not started":
        return "default";
      case "Mitigation":
        return "success";
      case "Adaptation":
        return "info";
      default:
        return "default";
    }
  };

  const finalVariant = variant || getVariantFromStatus(status);
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    success: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    destructive: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
  };

  return (
    <Badge 
      className={cn(
        "text-xs font-medium",
        variantClasses[finalVariant],
        className
      )}
      data-testid={`status-pill-${status.toLowerCase().replace(' ', '-')}`}
    >
      {status}
    </Badge>
  );
}
