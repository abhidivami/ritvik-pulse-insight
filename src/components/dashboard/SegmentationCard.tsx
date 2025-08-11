import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Task } from "@/data/mockData";

export function SegmentationCard({ tasks }: { tasks: Task[] }) {
  const completed = tasks.filter((t) => t.completedAt);
  const withoutFollow = completed.filter((t) => (t.followUps || 0) === 0).length;
  const withFollow = completed.filter((t) => (t.followUps || 0) > 0).length;
  const notCompleted = tasks.length - completed.length;

  const data = [
    { label: "Without follow-up", value: withoutFollow },
    { label: "With follow-up", value: withFollow },
    { label: "Not completed", value: notCompleted },
  ];

  const palette = ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-medium">Completion Segmentation</h3>
        <span className="text-xs text-muted-foreground">Org-wide</span>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={45} outerRadius={80} paddingAngle={2}>
              {data.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={palette[idx % palette.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
