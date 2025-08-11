import { Task } from "@/data/mockData";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function DependencyView({ tasks }: { tasks: Task[] }) {
  const indegree = new Map<string, number>();
  tasks.forEach((t) => {
    if (t.dependsOn) indegree.set(t.dependsOn, (indegree.get(t.dependsOn) || 0) + 1);
  });
  const data = Array.from(indegree.entries())
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between"><h3 className="text-base font-medium">Top Blockers</h3><span className="text-xs text-muted-foreground">Most depended-on tasks</span></div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="id" width={70} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="count" fill="hsl(var(--warning))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
