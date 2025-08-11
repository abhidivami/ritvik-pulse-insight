export function MetricMap() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between"><h3 className="text-base font-medium">Metric Map</h3><span className="text-xs text-muted-foreground">Leading vs Lagging</span></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-success">Leading (Predictive)</h4>
          <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-muted-foreground">
            <li>Lead Time per Task</li>
            <li>Cycle Time</li>
            <li>WIP Count</li>
            <li>Task Aging</li>
            <li>Handover Delays</li>
            <li>Wait Time vs Work Time</li>
            <li>Dependency Mapping</li>
            <li>Follow-up Frequency</li>
            <li>Self-Initiated Starts</li>
            <li>Deadline Adherence Trend</li>
            <li>Task Risk Score & Early Warnings</li>
            <li>Optimal Assignment Suggestions</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-warning">Lagging (Diagnostic)</h4>
          <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-muted-foreground">
            <li>Throughput</li>
            <li>Overdue Severity</li>
            <li>Completion Types</li>
            <li>Load Balancing Index</li>
            <li>Skill Utilization</li>
            <li>Reopen Rate</li>
            <li>Change Frequency</li>
            <li>Aggregate Efficiency Score</li>
            <li>Trend Charts</li>
            <li>Benchmarking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
