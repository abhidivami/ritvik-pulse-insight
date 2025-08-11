export type Priority = "low" | "medium" | "high";

export type TaskStatus = "new" | "in_progress" | "blocked" | "done";

export interface Task {
  id: string;
  title: string;
  project: string;
  department: string;
  assigner: string;
  assignee: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  dueDate?: Date;
  priority: Priority;
  status: TaskStatus;
  overdueDays?: number;
  reopened?: boolean;
  changesCount?: number;
  followUps?: number;
  selfInitiated?: boolean;
  estimatedHours?: number;
  actualHours?: number;
}

const departments = ["Design", "Engineering", "QA"] as const;
const projects = ["RITVIK", "Apollo", "Nimbus", "Orion"] as const;
const people = [
  "Aarav",
  "Vihaan",
  "Diya",
  "Ishaan",
  "Anaya",
  "Kabir",
  "Advika",
  "Rhea",
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface MockFilters {
  from: Date;
  to: Date;
  department?: string;
  project?: string;
  priority?: Priority | "all";
}

export function generateMockTasks(filters: MockFilters): Task[] {
  const days = Math.max(
    7,
    Math.ceil((filters.to.getTime() - filters.from.getTime()) / (1000 * 3600 * 24))
  );
  const count = 80 + randomBetween(0, 80);
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const createdOffset = randomBetween(0, days);
    const createdAt = new Date(filters.from.getTime() + createdOffset * 86400000);
    const startDelayDays = randomBetween(0, 7);
    const startedAt = Math.random() > 0.15 ? new Date(createdAt.getTime() + startDelayDays * 86400000) : undefined;
    const cycleDays = startedAt ? randomBetween(1, 10) : undefined;
    const completedAt = startedAt && Math.random() > 0.2 ? new Date(startedAt.getTime() + (cycleDays || 0) * 86400000) : undefined;
    const dueDate = new Date(createdAt.getTime() + randomBetween(5, 20) * 86400000);

    const dept = filters.department ?? randomChoice(departments);
    const proj = filters.project ?? randomChoice(projects);
    const prio: Priority = filters.priority && filters.priority !== "all" ? filters.priority : randomChoice(["low", "medium", "high"]);

    const status: TaskStatus = completedAt
      ? "done"
      : startedAt
      ? randomChoice(["in_progress", "blocked"])
      : "new";

    const overdueDays = completedAt && completedAt > dueDate ? randomBetween(1, 8) : 0;

    tasks.push({
      id: `T-${i}`,
      title: `Task ${i + 1}`,
      project: proj,
      department: dept,
      assigner: randomChoice(people),
      assignee: randomChoice(people),
      createdAt,
      startedAt,
      completedAt,
      dueDate,
      priority: prio,
      status,
      overdueDays,
      reopened: Math.random() > 0.85,
      changesCount: randomBetween(0, 3),
      followUps: randomBetween(0, 3),
      selfInitiated: Math.random() > 0.6,
      estimatedHours: randomBetween(4, 24),
      actualHours: completedAt ? randomBetween(4, 28) : undefined,
    });
  }

  return tasks;
}
