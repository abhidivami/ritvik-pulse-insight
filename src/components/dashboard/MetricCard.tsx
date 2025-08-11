import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

export type Health = "healthy" | "watch" | "critical";

export interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: number; // positive better for green
  description?: string;
  health?: Health;
  onClick?: () => void;
}

export const TrendArrow = ({ delta }: { delta?: number }) => {
  if (delta === undefined || Math.abs(delta) < 0.01) {
    return <Minus className="h-4 w-4 text-muted-foreground" aria-hidden />;
  }
  const positive = delta > 0;
  return positive ? (
    <TrendingUp className="h-4 w-4 text-success" aria-hidden />
  ) : (
    <TrendingDown className="h-4 w-4 text-destructive" aria-hidden />
  );
};

export function MetricCard({ title, value, delta, description, health = "healthy", onClick }: MetricCardProps) {
  const ringClass =
    health === "healthy"
      ? "ring-success/30"
      : health === "watch"
      ? "ring-warning/30"
      : "ring-destructive/30";

  const topBar =
    health === "healthy"
      ? "bg-success/70"
      : health === "watch"
      ? "bg-warning/70"
      : "bg-destructive/70";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative group text-left rounded-lg border bg-card p-4 shadow-sm ring-1",
        ringClass,
        "transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ring"
      )}
      aria-label={`${title} metric card`}
    >
      <div className={cn("absolute inset-x-0 top-0 h-1 rounded-t-lg", topBar)} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="flex items-center gap-1">
          <TrendArrow delta={delta} />
          {delta !== undefined && (
            <span className={cn("text-sm", delta > 0 ? "text-success" : delta < 0 ? "text-destructive" : "text-muted-foreground")}>{delta > 0 ? `+${delta}` : delta}</span>
          )}
        </div>
      </div>
      {description && <p className="mt-2 text-xs text-muted-foreground">{description}</p>}
    </button>
  );
}
