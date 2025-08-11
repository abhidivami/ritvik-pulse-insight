import { Task } from "@/data/mockData";

export interface TaskRisk {
  id: string;
  title: string;
  assignee: string;
  project: string;
  department: string;
  dueInDays?: number; // negative if overdue
  riskScore: number; // 0-100
  reasons: string[];
}

function daysBetween(a?: Date, b?: Date) {
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function computeTaskRisk(tasks: Task[]): TaskRisk[] {
  const today = new Date();
  return tasks
    .filter((t) => t.status !== "done")
    .map((t) => {
      const dueInDays = t.dueDate ? daysBetween(today, t.dueDate) : undefined;
      const age = daysBetween(t.startedAt || t.createdAt, today);
      const wait = daysBetween(t.createdAt, t.startedAt);
      const reasons: string[] = [];
      let risk = 0;

      if (t.status === "blocked") {
        risk += 35;
        reasons.push("Blocked");
      }
      if (age > 7) {
        risk += Math.min(25, (age - 7) * 2);
        reasons.push(`Aging ${age}d`);
      }
      if (wait > 4) {
        risk += Math.min(15, (wait - 4) * 2);
        reasons.push(`Slow pickup ${wait}d`);
      }
      if (dueInDays !== undefined) {
        if (dueInDays < 0) {
          risk += Math.min(25, Math.abs(dueInDays) * 3);
          reasons.push(`${Math.abs(dueInDays)}d overdue`);
        } else if (dueInDays <= 2) {
          risk += 15;
          reasons.push(`Due soon (${dueInDays}d)`);
        }
      }
      if (t.dependsOn) {
        risk += 10;
        reasons.push("Has dependency");
      }

      return {
        id: t.id,
        title: t.title,
        assignee: t.assignee,
        project: t.project,
        department: t.department,
        dueInDays,
        riskScore: Math.min(100, Number(risk.toFixed(1))),
        reasons,
      } as TaskRisk;
    })
    .sort((a, b) => b.riskScore - a.riskScore);
}
