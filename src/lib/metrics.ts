import { Task } from "@/data/mockData";

export interface GroupMetrics {
  name: string; // project or department
  leadTimeDays: number;
  cycleTimeDays: number;
  wip: number;
  agingCount: number;
  handoverDelayDays: number; // approximated from start delay
  waitToWorkRatio: number;
  riskScore: number; // 0-100
  throughput: number; // completed in range
  overdueSeverityDays: number;
  reopenRatePct: number;
  changeFrequency: number;
  loadBalancingIndex: number; // lower is better
  efficiencyScore: number; // composite 0-100
  completionTypes: { label: string; value: number }[];
  trend: { date: string; throughput: number }[];
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2));
}

function stddev(nums: number[]) {
  if (nums.length <= 1) return 0;
  const mean = avg(nums);
  const variance = avg(nums.map((n) => (n - mean) ** 2));
  return Number(Math.sqrt(variance).toFixed(2));
}

function daysBetween(a?: Date, b?: Date) {
  if (!a || !b) return 0;
  return Math.max(0, (b.getTime() - a.getTime()) / 86400000);
}

export function groupBy<T extends keyof Task>(tasks: Task[], key: T) {
  const map = new Map<string, Task[]>();
  for (const t of tasks) {
    const k = String(t[key]);
    map.set(k, [...(map.get(k) || []), t]);
  }
  return map;
}

export function computeMetricsForGroup(name: string, tasks: Task[]): GroupMetrics {
  const leadTimes = tasks.map((t) => daysBetween(t.createdAt, t.startedAt));
  const cycleTimes = tasks.map((t) => daysBetween(t.startedAt, t.completedAt));
  const wip = tasks.filter((t) => t.status === "in_progress" || t.status === "blocked").length;
  const aging = tasks.filter((t) => {
    const age = daysBetween(t.startedAt || t.createdAt, new Date());
    return age > 7 && t.status !== "done"; // beyond team norm (7d)
  }).length;
  const handover = leadTimes; // approximation
  const waitToWork = avg(leadTimes) / Math.max(1, avg(cycleTimes));

  const completed = tasks.filter((t) => t.completedAt);
  const throughput = completed.length;
  const overdueSeverity = avg(completed.map((t) => t.overdueDays || 0));
  const reopenRate = (tasks.filter((t) => t.reopened).length / Math.max(1, throughput)) * 100;
  const changeFrequency = avg(tasks.map((t) => t.changesCount || 0));

  const assigneeBuckets = new Map<string, number>();
  for (const t of tasks) {
    assigneeBuckets.set(t.assignee, (assigneeBuckets.get(t.assignee) || 0) + 1);
  }
  const loadBalancingIndex = stddev(Array.from(assigneeBuckets.values()));

  const onTime = completed.filter((t) => !t.overdueDays || t.overdueDays <= 0).length;
  const timelinessScore = (onTime / Math.max(1, throughput)) * 100;
  const qualityScore = 100 - Math.min(100, reopenRate + changeFrequency * 10);
  const balanceScore = 100 - Math.min(100, loadBalancingIndex * 10);
  const efficiencyScore = Number(((timelinessScore * 0.5 + qualityScore * 0.3 + balanceScore * 0.2)).toFixed(1));

  const withoutFollow = completed.filter((t) => (t.followUps || 0) === 0).length;
  const withFollow = completed.filter((t) => (t.followUps || 0) > 0).length;
  const notCompleted = tasks.length - completed.length;

  // Simple trend: split by 4 weekly bins
  const trend: { date: string; throughput: number }[] = [];
  const bins = 4;
  const now = Date.now();
  const weekMs = 7 * 86400000;
  for (let i = bins - 1; i >= 0; i--) {
    const start = new Date(now - (i + 1) * weekMs);
    const end = new Date(now - i * weekMs);
    const count = completed.filter((t) => t.completedAt && t.completedAt >= start && t.completedAt < end).length;
    trend.push({ date: end.toLocaleDateString(), throughput: count });
  }

  // Risk score heuristic
  const riskScore = Number(
    (
      Math.min(100,
        wip * 2 +
        aging * 3 +
        overdueSeverity * 6 +
        (waitToWork > 1 ? (waitToWork - 1) * 15 : 0)
      )
    ).toFixed(1)
  );

  return {
    name,
    leadTimeDays: Number(avg(leadTimes).toFixed(1)),
    cycleTimeDays: Number(avg(cycleTimes).toFixed(1)),
    wip,
    agingCount: aging,
    handoverDelayDays: Number(avg(handover).toFixed(1)),
    waitToWorkRatio: Number(waitToWork.toFixed(2)),
    riskScore,
    throughput,
    overdueSeverityDays: Number(overdueSeverity.toFixed(1)),
    reopenRatePct: Number(reopenRate.toFixed(1)),
    changeFrequency: Number(changeFrequency.toFixed(2)),
    loadBalancingIndex: Number(loadBalancingIndex.toFixed(2)),
    efficiencyScore,
    completionTypes: [
      { label: "Without follow-up", value: withoutFollow },
      { label: "With follow-up", value: withFollow },
      { label: "Not completed", value: notCompleted },
    ],
    trend,
  };
}
