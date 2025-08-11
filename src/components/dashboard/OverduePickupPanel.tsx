import { Task } from "@/data/mockData";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

function daysBetween(a?: Date, b?: Date) {
  if (!a || !b) return 0;
  return Math.max(0, (b.getTime() - a.getTime()) / 86400000);
}

export function OverduePickupPanel({ tasks }: { tasks: Task[] }) {
  const completed = tasks.filter((t) => t.completedAt);
  const avgOverdue = Number(
    (
      completed.reduce((acc, t) => acc + (t.overdueDays || 0), 0) /
      Math.max(1, completed.length)
    ).toFixed(2)
  );
  const leadTimes = tasks.map((t) => daysBetween(t.createdAt, t.startedAt));
  const avgPickup = Number(
    (
      leadTimes.reduce((a, b) => a + b, 0) / Math.max(1, leadTimes.length)
    ).toFixed(2)
  );

  // Build small histograms
  const overdueHist: { bucket: string; count: number }[] = [0,1,2,3,4,5,6,7,8].map((i) => ({ bucket: `${i}`, count: 0 }));
  completed.forEach((t) => {
    const d = Math.min(8, Math.max(0, t.overdueDays || 0));
    overdueHist[d].count += 1;
  });

  const pickupHist: { bucket: string; count: number }[] = [0,1,2,3,4,5,6,7,8,9,10].map((i) => ({ bucket: `${i}`, count: 0 }));
  leadTimes.forEach((d) => {
    const v = Math.min(10, Math.floor(d));
    pickupHist[v].count += 1;
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between"><h3 className="text-base font-medium">Overdue Severity</h3><span className="text-xs text-muted-foreground">Avg days overdue</span></div>
        <p className="text-2xl font-semibold">{avgOverdue}</p>
        <div className="mt-3 h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overdueHist}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Bar dataKey="count" fill="hsl(var(--destructive))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between"><h3 className="text-base font-medium">Pickup Latency</h3><span className="text-xs text-muted-foreground">Avg days to start</span></div>
        <p className="text-2xl font-semibold">{avgPickup}</p>
        <div className="mt-3 h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pickupHist}>
              <XAxis dataKey="bucket" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
