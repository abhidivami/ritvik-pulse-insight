import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { FiltersBar, Filters } from "@/components/dashboard/FiltersBar";
import { useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generateMockTasks, MockFilters, Task } from "@/data/mockData";
import { OverduePickupPanel } from "@/components/dashboard/OverduePickupPanel";
import { SegmentationCard } from "@/components/dashboard/SegmentationCard";
import { EfficiencyTrends } from "@/components/dashboard/EfficiencyTrends";
import { DependencyView } from "@/components/dashboard/DependencyView";
import { EarlyWarnings } from "@/components/dashboard/EarlyWarnings";
import { MetricMap } from "@/components/dashboard/MetricMap";

const Dashboard = () => {
  const [tab, setTab] = useState<"projects" | "departments">("projects");
  const [publicMode, setPublicMode] = useState(false);
  const [filters, setFilters] = useState<Filters>({ range: "30d", priority: "all" });

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

  const mockFilters: MockFilters = useMemo(() => ({ ...dateRange, priority: filters.priority }), [dateRange.from.toISOString(), dateRange.to.toISOString(), filters.priority]);
  const tasks: Task[] = useMemo(() => generateMockTasks(mockFilters), [mockFilters.from.toISOString(), mockFilters.to.toISOString(), mockFilters.priority]);

  const handleDrill = (metric: string, group: string) => {
    toast({
      title: `${metric} for ${group}`,
      description: "Drill-down view coming soon. We'll show task-level insights and trends.",
    });
  };

  return (
    <div>
      <Helmet>
        <title>RITVIK Metrics Dashboard – Projects & Departments</title>
        <meta name="description" content="Real-time leading and lagging indicators for projects and departments: throughput, cycle time, WIP, risk, and more." />
        <link rel="canonical" href="/dashboard" />
      </Helmet>

      <header className="mb-6">
        <div className="mb-3 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-semibold">RITVIK – Features & Metrics Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Proactive and diagnostic insights to drive organizational change.</p>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="public" className="text-sm">Public Display Mode</Label>
            <Switch id="public" checked={publicMode} onCheckedChange={setPublicMode} />
            <Button variant="secondary" onClick={() => window.print()}>Export</Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <main className="space-y-4">
        <MetricMap />
        <FiltersBar filters={filters} onChange={setFilters} hidden={publicMode} />
        <DashboardGrid mode={tab} filters={{ range: filters.range, priority: filters.priority }} publicMode={publicMode} onDrillDown={handleDrill} tasks={tasks} />
        <OverduePickupPanel tasks={tasks} />
        <SegmentationCard tasks={tasks} />
        <EfficiencyTrends tasks={tasks} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DependencyView tasks={tasks} />
          <EarlyWarnings tasks={tasks} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
