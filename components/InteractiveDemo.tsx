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

export default function InteractiveDemo() {
  // Initialise with stable seed — no Math.random() at construction time
  const [data, setData] = useState(SEED_DATA);
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const mounted = useRef(false);

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
      id="demo"
      className="py-24 px-6 lg:px-12 max-w-7xl mx-auto"
      aria-labelledby="demo-heading"
    >
      <p className="section-number mb-4">Live Preview</p>
      <h2 id="demo-heading" className="section-title mb-4">
        See it in Action
      </h2>
      <p className="text-muted-foreground max-w-xl mb-12 leading-relaxed">
        A sample of the kind of real-time dashboards I build — interactive data
        visualisation with an AI insight layer.
      </p>

      <div className="demo-widget max-w-5xl">
        {/* Window chrome */}
        <div className="demo-widget__header">
          <div className="demo-dot bg-red-500/70" />
          <div className="demo-dot bg-yellow-500/70" />
          <div className="demo-dot bg-green-500/70" />
          <span className="ml-3 text-xs text-muted-foreground font-mono">
            analytics-dashboard.tsx — live
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {metricCards.map((m) => (
              <div
                key={m.label}
                className="bg-background rounded-lg border border-border p-3"
              >
                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                <p className="text-lg font-bold text-foreground">{m.value}</p>
                <p
                  className={`text-xs font-medium ${
                    m.positive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {m.delta}
                </p>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue (7-mo)</p>
                <p className="text-xl font-bold text-foreground">
                  ${(totalRevenue / 1000).toFixed(1)}k
                </p>
              </div>
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded font-mono">
                Tick #{tick}
              </span>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217,91%,60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217,91%,60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(220,13%,20%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(220,9%,65%)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(220,9%,65%)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(222,18%,12%)',
                      border: '1px solid hsl(220,13%,20%)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: 'hsl(220,13%,91%)',
                    }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(217,91%,60%)"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    animationDuration={600}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Prompt Input */}
          <div className="bg-background rounded-lg border border-border p-4">
            <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-3">
              AI Analyst
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
                placeholder='Ask the AI about your data… e.g. &quot;Why did churn drop?&quot;'
                className="flex-1 bg-background-light border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors min-h-[44px]"
                aria-label="AI query input"
              />
              <button
                onClick={handleAiSubmit}
                disabled={loading}
                className="btn-primary text-sm px-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="bg-primary/5 border border-primary/20 rounded px-4 py-3 text-sm text-foreground/90 leading-relaxed">
                <span className="text-primary font-semibold mr-2">↳</span>
                {aiOutput}
              </div>
            )}

            {!aiOutput && !loading && (
              <p className="text-xs text-muted-foreground">
                Try: &ldquo;What drove growth this month?&rdquo; or &ldquo;Identify churn risk&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
