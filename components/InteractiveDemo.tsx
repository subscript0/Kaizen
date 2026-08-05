'use client';
import { useState, useEffect, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useReveal } from '@/lib/motion';

// ── Stable seed data (identical on server + client first render) ──
const SEED_DATA = [
  { month: 'Jan', revenue: 48200, users: 512 },
  { month: 'Feb', revenue: 53100, users: 584 },
  { month: 'Mar', revenue: 61400, users: 631 },
  { month: 'Apr', revenue: 57800, users: 598 },
  { month: 'May', revenue: 72300, users: 710 },
  { month: 'Jun', revenue: 79100, users: 768 },
  { month: 'Jul', revenue: 84320, users: 821 },
];

// Only called client-side after mount — never on the server
const randomiseRevenue = () =>
  SEED_DATA.map((d) => ({
    ...d,
    revenue: Math.floor(Math.random() * 60000) + 40000,
    users: Math.floor(Math.random() * 800) + 400,
  }));

const metricCards = [
  { label: 'MRR', value: '$84,320', delta: '+12.4%', positive: true },
  { label: 'Active Users', value: '4,821', delta: '+8.1%', positive: true },
  { label: 'Churn Rate', value: '1.8%', delta: '-0.3%', positive: true },
  { label: 'Avg LTV', value: '$1,240', delta: '+5.6%', positive: true },
];

// ── AI prompt simulation ──────────────────────────────
const aiResponses = [
  'Revenue increased 12.4% MoM driven by enterprise tier upgrades. Recommend upsell campaign to mid-tier accounts showing high usage.',
  'Churn risk detected in 3 accounts. Two have not logged in for 14 days. Trigger re-engagement sequence within 48 hours.',
  'Top acquisition channel this month: LinkedIn organic (+34%). Paid search ROI declined to 2.1x — consider budget reallocation.',
];

// Chart palette resolves against the live CSS tokens so it tracks
// the paper/ink theme instead of a hardcoded blue.
const PRIMARY = 'hsl(var(--primary))';
const GRID = 'hsl(var(--border))';
const AXIS = 'hsl(var(--muted-foreground))';

export default function InteractiveDemo() {
  // Initialise with stable seed — no Math.random() at construction time
  const [data, setData] = useState(SEED_DATA);
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const mounted = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Editorial rise-and-fade on the header/widget. Reduced-motion safe
  // and scoped so it never touches the live-ticking chart internals.
  useReveal(sectionRef, '[data-reveal]', { start: 'top 85%' });

  // Start live updates only after hydration is complete
  useEffect(() => {
    mounted.current = true;
    // Small delay so first client paint matches server HTML exactly
    const timeout = setTimeout(() => {
      setData(randomiseRevenue());
    }, 500);

    const interval = setInterval(() => {
      setData(randomiseRevenue());
      setTick((t) => t + 1);
    }, 4000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const handleAiSubmit = async () => {
    if (!aiInput.trim()) return;
    setLoading(true);
    setAiOutput('');
    // Simulate latency
    await new Promise((r) => setTimeout(r, 1200));
    const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    setAiOutput(response);
    setLoading(false);
  };

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="py-24 px-6 lg:px-12 max-w-96 mx-auto"
      aria-labelledby="demo-heading"
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary" data-reveal>
        04 — Interactive Demo
      </p>
      <h2
        id="demo-heading"
        className="mb-6 text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold leading-none text-foreground"
        data-reveal
      >
        See it in Action
      </h2>
      <p
        className="text-muted-foreground max-w-xl mb-12 leading-relaxed"
        data-reveal
      >
        A sample of the kind of real-time dashboards I build — interactive data
        visualisation with an AI insight layer.
      </p>

      <div className="demo-widget max-w-5xl" data-reveal>
        {/* Window chrome — toned to the paper palette */}
        <div className="demo-widget__header flex items-center gap-2">
          <div className="demo-dot w-2 h-2 bg-primary/70" />
          <div className="demo-dot w-2 h-2 bg-secondary" />
          <div className="demo-dot w-2 h-2 bg-muted-foreground/40" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            analytics-dashboard.tsx
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-primary">
            <span className="w-1.5 h-1.5 rounded bg-primary animate-pulse" />
            Live
          </span>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Metric cards — hairline tiles with mono readouts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricCards.map((m) => (
              <div
                key={m.label}
                className="card p-4 hover:border-primary/30 hover:shadow-sm"
              >
                <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-2">
                  {m.label}
                </p>
                <p className="font-mono text-xl font-medium text-foreground tabular-nums">
                  {m.value}
                </p>
                <p
                  className={`font-mono text-xs mt-1 tabular-nums ${
                    m.positive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {m.delta}
                </p>
              </div>
            ))}
          </div>

          {/* Revenue chart — vermilion on paper */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-1">
                  Total Revenue · 7-mo
                </p>
                <p className="font-mono text-2xl font-medium text-foreground tabular-nums">
                  ${(totalRevenue / 1000).toFixed(1)}k
                </p>
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded tabular-nums">
                Tick #{tick}
              </span>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={GRID}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: AXIS, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: AXIS, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    cursor={{ stroke: GRID }}
                    contentStyle={{
                      background: 'hsl(var(--background-light))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      fontSize: '12px',
                      color: 'hsl(var(--foreground))',
                    }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={PRIMARY}
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    animationDuration={600}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Prompt Input — crisp field with vermilion submit */}
          <div className="card p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-primary mb-3">
              AI Analyst
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
                placeholder='Ask the AI about your data… e.g. "Why did churn drop?"'
                className="flex-1 input w-full placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="AI query input"
              />
              <button
                onClick={handleAiSubmit}
                disabled={loading}
                className="btn btn-primary btn-fx-sweep text-sm px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Submit AI query"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="30"
                        strokeLinecap="round"
                      />
                    </svg>
                    Thinking
                  </span>
                ) : (
                  'Ask AI'
                )}
              </button>
            </div>

            {aiOutput && (
              <div className="alert alert-info text-sm">
                <span className="font-serif text-primary mr-2">↳</span>
                {aiOutput}
              </div>
            )}

            {!aiOutput && !loading && (
              <p className="text-xs text-muted-foreground">
                Try: &apos;What drove growth this month?&apos; or &apos;Identify churn risk&apos;
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}