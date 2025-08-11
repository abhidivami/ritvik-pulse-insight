import { MetricCard } from "./MetricCard";
import { computeMetricsForGroup, groupBy, GroupMetrics } from "@/lib/metrics";
import { generateMockTasks, MockFilters, Task } from "@/data/mockData";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useMemo } from "react";

export function DashboardGrid({
  mode,
  filters,
  publicMode,
  onDrillDown,
  tasks: externalTasks,
}: {
  mode: "projects" | "departments";
  filters: { range: "30d" | "90d" | "quarter"; priority: "low" | "medium" | "high" | "all" };
  publicMode?: boolean;
  onDrillDown?: (metric: string, group: string) => void;
  tasks?: Task[];
}) {
  const dateRange = useMemo(() => {
    const to = new Date();
    let from = new Date();
    if (filters.range === "30d") from = new Date(to.getTime() - 30 * 86400000);
    else if (filters.range === "90d") from = new Date(to.getTime() - 90 * 86400000);
    else {
      const month = to.getMonth();
      const quarterStartMonth = Math.floor(month / 3) * 3;
      from = new Date(to.getFullYear(), quarterStartMonth, 1);
    }
    return { from, to };
  }, [filters.range]);

  const mockFilters: MockFilters = {
    ...dateRange,
    priority: filters.priority,
  };

  const tasks = useMemo(() => externalTasks || generateMockTasks(mockFilters), [externalTasks, mockFilters.from.toISOString(), mockFilters.to.toISOString(), mockFilters.priority]);

  const grouped = useMemo(() => {
    const key = mode === "projects" ? "project" : "department";
    return groupBy(tasks, key as any);
  }, [tasks, mode]);

  const groupMetrics: GroupMetrics[] = useMemo(() => {
    return Array.from(grouped.entries()).map(([name, list]) => computeMetricsForGroup(name, list));
  }, [grouped]);

  const palette = ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section aria-label="Leading Indicators" className="space-y-4">
        <h2 className="text-lg font-semibold">Leading Indicators (Proactive Zone)</h2>
        {groupMetrics.map((gm) => (
          <div key={gm.name} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-medium">{gm.name}</h3>
              <span className="text-xs text-muted-foreground">Leading</span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <MetricCard title="Lead Time (d)" value={gm.leadTimeDays} onClick={() => onDrillDown?.("Lead Time", gm.name)} />
              <MetricCard title="Cycle Time (d)" value={gm.cycleTimeDays} onClick={() => onDrillDown?.("Cycle Time", gm.name)} />
              <MetricCard title="WIP" value={gm.wip} health={gm.wip > 12 ? "critical" : gm.wip > 7 ? "watch" : "healthy"} onClick={() => onDrillDown?.("WIP", gm.name)} />
              <MetricCard title="Task Aging" value={gm.agingCount} health={gm.agingCount > 6 ? "critical" : gm.agingCount > 3 ? "watch" : "healthy"} onClick={() => onDrillDown?.("Task Aging", gm.name)} />
              <MetricCard title="Handover Delay (d)" value={gm.handoverDelayDays} onClick={() => onDrillDown?.("Handover Delays", gm.name)} />
              <MetricCard title="Wait/Work Ratio" value={gm.waitToWorkRatio} onClick={() => onDrillDown?.("Wait vs Work", gm.name)} />
              <MetricCard title="Risk Score" value={gm.riskScore} health={gm.riskScore > 70 ? "critical" : gm.riskScore > 40 ? "watch" : "healthy"} onClick={() => onDrillDown?.("Risk", gm.name)} />
            </div>

            <div className="mt-4 h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gm.trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`colorT-${gm.name}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide={!publicMode} tick={{ fontSize: 12 }} />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Area type="monotone" dataKey="throughput" stroke="hsl(var(--primary))" fill={`url(#colorT-${gm.name})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </section>

      <section aria-label="Lagging Indicators" className="space-y-4">
        <h2 className="text-lg font-semibold">Lagging Indicators (Results Zone)</h2>
        {groupMetrics.map((gm) => (
          <div key={gm.name} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-medium">{gm.name}</h3>
              <span className="text-xs text-muted-foreground">Lagging</span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <MetricCard title="Throughput" value={gm.throughput} onClick={() => onDrillDown?.("Throughput", gm.name)} />
              <MetricCard title="Overdue Severity (d)" value={gm.overdueSeverityDays} health={gm.overdueSeverityDays > 3 ? "critical" : gm.overdueSeverityDays > 1 ? "watch" : "healthy"} onClick={() => onDrillDown?.("Overdue Severity", gm.name)} />
              <MetricCard title="Reopen Rate (%)" value={gm.reopenRatePct} onClick={() => onDrillDown?.("Reopen Rate", gm.name)} />
              <MetricCard title="Change Freq" value={gm.changeFrequency} onClick={() => onDrillDown?.("Change Frequency", gm.name)} />
              <MetricCard title="Load Balance idx" value={gm.loadBalancingIndex} onClick={() => onDrillDown?.("Load Balancing", gm.name)} />
              <MetricCard title="Efficiency Score" value={gm.efficiencyScore} health={gm.efficiencyScore > 75 ? "healthy" : gm.efficiencyScore > 55 ? "watch" : "critical"} onClick={() => onDrillDown?.("Efficiency", gm.name)} />
            </div>

            <div className="mt-4 h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={gm.completionTypes} dataKey="value" nameKey="label" innerRadius={40} outerRadius={70} paddingAngle={2}>
                    {gm.completionTypes.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={palette[idx % palette.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
