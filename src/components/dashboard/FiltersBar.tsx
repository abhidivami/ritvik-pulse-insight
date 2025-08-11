import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Priority } from "@/data/mockData";

export interface Filters {
  range: "30d" | "90d" | "quarter";
  department?: string;
  project?: string;
  priority: Priority | "all";
}

export function FiltersBar({
  filters,
  onChange,
  hidden,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  hidden?: boolean;
}) {
  if (hidden) return null;

  return (
    <div className={cn("rounded-lg border bg-card p-3 shadow-sm")}
      aria-label="Dashboard filters"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={filters.range} onValueChange={(v) => onChange({ ...filters, range: v as Filters["range"] })}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="quarter">This quarter</SelectItem>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="hidden h-6 md:block" />

          <Select value={filters.priority} onValueChange={(v) => onChange({ ...filters, priority: v as Filters["priority"] })}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-muted-foreground">Click any card to drill down</div>
      </div>
    </div>
  );
}
