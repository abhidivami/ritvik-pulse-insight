import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>RITVIK Dashboard – Organizational Metrics</title>
        <meta name="description" content="RITVIK dashboard centralizes leading and lagging indicators across projects and departments." />
        <link rel="canonical" href="/" />
      </Helmet>

      <header className="bg-gradient-primary">
        <div className="container mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold tracking-tight">RITVIK – Features & Metrics Dashboard</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Your single source of truth for task execution health at Divami: transparency, predictive insights, and actionable analytics.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/dashboard">Open Dashboard</Link>
            </Button>
            <Button variant="secondary" asChild>
              <a href="#learn-more">Learn more</a>
            </Button>
          </div>
        </div>
      </header>

      <main id="learn-more" className="container mx-auto px-6 py-12">
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">What you'll get</h2>
          <ul className="mt-3 grid list-disc gap-2 pl-6 text-muted-foreground md:grid-cols-2">
            <li>Leading indicators: lead/cycle time, WIP, aging, handover delays</li>
            <li>Lagging indicators: throughput, overdue severity, reopen rate</li>
            <li>Predictive risk scoring and early warnings</li>
            <li>Projects and departments view with filters and public mode</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Index;
