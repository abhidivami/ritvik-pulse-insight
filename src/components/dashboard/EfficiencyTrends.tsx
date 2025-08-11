import { Task } from "@/data/mockData";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function lastNMonths(n: number) {
  const now = new Date();
  const months: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthKey(d));
  }
  return months;
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1));
}

export function EfficiencyTrends({ tasks }: { tasks: Task[] }) {
  const [months] = useState(() => lastNMonths(6));

  const byAssignee = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((t) => map.set(t.assignee, [...(map.get(t.assignee) || []), t]));
    return map;
  }, [tasks]);

  const byDepartment = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((t) => map.set(t.department, [...(map.get(t.department) || []), t]));
    return map;
  }, [tasks]);

  function efficiencyForBucket(list: Task[]) {
    const completed = list.filter((t) => t.completedAt);
    const onTime = completed.filter((t) => !t.overdueDays || t.overdueDays <= 0).length;
    const reopenRate = (list.filter((t) => t.reopened).length / Math.max(1, completed.length)) * 100;
    const changeFreq = avg(list.map((t) => t.changesCount || 0));
    const balance = 100; // single bucket
    const timeliness = (onTime / Math.max(1, completed.length)) * 100;
    return Number(((timeliness * 0.5 + (100 - reopenRate) * 0.3 + balance * 0.2)).toFixed(1));
  }

  function seriesForOrg() {
    const data = months.map((m) => {
      const inMonth = tasks.filter((t) => t.completedAt && monthKey(t.completedAt) === m);
      return { month: m, Organization: efficiencyForBucket(inMonth) };
    });
    return data;
  }

  function topKeys<K extends string>(map: Map<K, Task[]>, limit = 3) {
    return Array.from(map.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, limit)
      .map(([k]) => k);
  }

  function seriesForMap(name: string, map: Map<string, Task[]>) {
    const keys = topKeys(map, 3);
    const base = months.map((m) => ({ month: m } as Record<string, any>));
    keys.forEach((k) => {
      months.forEach((m, idx) => {
        const list = (map.get(k) || []).filter((t) => t.completedAt && monthKey(t.completedAt!) === m);
        base[idx][k] = efficiencyForBucket(list);
      });
    });
    return { keys, data: base };
  }

  const orgData = useMemo(seriesForOrg, [tasks]);
  const dept = useMemo(() => seriesForMap("Departments", byDepartment), [byDepartment]);
  const people = useMemo(() => seriesForMap("People", byAssignee), [byAssignee]);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between"><h3 className="text-base font-medium">Efficiency Trends</h3><span className="text-xs text-muted-foreground">Monthly</span></div>
      <Tabs defaultValue="org">
        <TabsList>
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="dept">Departments</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>
        <TabsContent value="org">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orgData}>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="Organization" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        <TabsContent value="dept">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dept.data}>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                {dept.keys.map((k) => (
                  <Line key={k} type="monotone" dataKey={k} stroke="hsl(var(--sidebar-primary))" strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        <TabsContent value="people">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={people.data}>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                {people.keys.map((k, i) => (
                  <Line key={k} type="monotone" dataKey={k} stroke={i % 2 === 0 ? "hsl(var(--success))" : "hsl(var(--warning))"} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
