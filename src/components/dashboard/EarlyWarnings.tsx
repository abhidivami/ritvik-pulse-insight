import { computeTaskRisk } from "@/lib/taskRisk";
import { Task } from "@/data/mockData";

export function EarlyWarnings({ tasks }: { tasks: Task[] }) {
  const risks = computeTaskRisk(tasks).slice(0, 6);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between"><h3 className="text-base font-medium">Early Warning Alerts</h3><span className="text-xs text-muted-foreground">Top at-risk tasks</span></div>
      <ul className="space-y-2">
        {risks.map((r) => (
          <li key={r.id} className="flex items-start justify-between gap-3 rounded-md border p-2">
            <div>
              <p className="text-sm font-medium">{r.title} <span className="text-xs text-muted-foreground">({r.project} – {r.assignee})</span></p>
              <p className="text-xs text-muted-foreground">{r.reasons.join(" • ")}</p>
            </div>
            <span className={r.riskScore > 70 ? "text-destructive" : r.riskScore > 40 ? "text-warning" : "text-success"}>{r.riskScore}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
