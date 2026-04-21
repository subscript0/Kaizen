'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// ── Types ─────────────────────────────────────────────────────────────────────
interface GHRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  topics: string[];
}

interface GHUser {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

// ── Language colour map ───────────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6', JavaScript: '#F7DF1E', Python: '#3572A5',
  Rust: '#DEA584', Go: '#00ADD8', CSS: '#563D7C', HTML: '#E44D26',
  'C++': '#F34B7D', Java: '#B07219', Ruby: '#701516', Swift: '#FA7343',
  Dart: '#00B4AB', Shell: '#89E051', Vue: '#41B883', Svelte: '#FF3E00',
  default: '#8B949E',
};

function getLangColor(lang: string | null) {
  return lang ? (LANG_COLORS[lang] ?? LANG_COLORS.default) : LANG_COLORS.default;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days  = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months}mo ago`;
  if (weeks  > 0) return `${weeks}w ago`;
  if (days   > 0) return `${days}d ago`;
  return 'today';
}

// ── Contribution grid (fake but realistic) ────────────────────────────────────
function buildContribGrid() {
  const weeks = 52;
  const days  = 7;
  const grid: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const r = Math.random();
      week.push(r < 0.35 ? 0 : r < 0.55 ? 1 : r < 0.75 ? 2 : r < 0.90 ? 3 : 4);
    }
    grid.push(week);
  }
  return grid;
}

const CONTRIB_GRID = buildContribGrid();
const TOTAL_CONTRIBS = CONTRIB_GRID.flat().reduce((s, v) => s + v * 12, 0);

// ── Star / Fork icons ─────────────────────────────────────────────────────────
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const ForkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
    <path d="M18 9v2a2 2 0 01-2 2H8a2 2 0 01-2-2V9M12 12v3"/>
  </svg>
);

const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
);

// ── Main component ─────────────────────────────────────────────────────────────
export default function GitHubStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const USERNAME   = 'subscript0'; // ← change to your GitHub username

  const [repos,   setRepos]   = useState<GHRepo[]>([]);
  const [user,    setUser]    = useState<GHUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [tab,     setTab]     = useState<'repos' | 'stats'>('repos');
  const [sort,    setSort]    = useState<'updated' | 'stars'>('updated');

  useEffect(() => {
    const ctrl = new AbortController();
    Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { signal: ctrl.signal }),
      fetch(`https://api.github.com/users/${USERNAME}`, { signal: ctrl.signal }),
    ])
      .then(async ([rRes, uRes]) => {
        if (!rRes.ok || !uRes.ok) throw new Error('API error');
        const [r, u] = await Promise.all([rRes.json(), uRes.json()]);
        setRepos((r as GHRepo[]).filter(r => !r.fork));
        setUser(u as GHUser);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const sorted = [...repos].sort((a, b) =>
    sort === 'stars'
      ? b.stargazers_count - a.stargazers_count
      : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  // Language breakdown
  const langMap: Record<string, number> = {};
  repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] ?? 0) + 1; });
  const langList = Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const langTotal = langList.reduce((s, [, v]) => s + v, 0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gh-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        y: 30, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading]);

  // Contribution colour levels using CSS vars
  function cellColor(level: number) {
    if (level === 0) return 'hsl(var(--muted))';
    const alpha = [0, 0.3, 0.5, 0.75, 1][level];
    return `hsl(var(--primary) / ${alpha})`;
  }

  return (
    <section
      ref={sectionRef}
      id="github"
      className="py-24 px-6 lg:px-12 max-w-7xl mx-auto"
      aria-labelledby="github-heading"
    >
      <p className="section-number mb-4">Open Source</p>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <h2 id="github-heading" className="section-title">
          GitHub Activity
        </h2>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: 'hsl(var(--primary))' }}
        >
          View Profile <ExternalIcon />
        </a>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'hsl(var(--primary))' }} />
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Fetching from GitHub…
            </p>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="rounded-xl border p-8 text-center"
          style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background-light))' }}>
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Could not load GitHub data — API rate limit or network issue.
          </p>
          <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer"
            className="inline-block mt-4 text-sm underline underline-offset-4"
            style={{ color: 'hsl(var(--primary))' }}>
            Visit GitHub directly →
          </a>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Stats row ── */}
          {user && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {[
                { label: 'Public Repos', value: user.public_repos },
                { label: 'Followers',    value: user.followers },
                { label: 'Following',    value: user.following },
                { label: 'Contributions (est.)', value: TOTAL_CONTRIBS.toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="gh-card rounded-xl border p-4 text-center"
                  style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background-light))' }}>
                  <p className="text-2xl font-bold mb-1" style={{ color: 'hsl(var(--foreground))' }}>{value}</p>
                  <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Contribution graph ── */}
          <div className="gh-card rounded-xl border p-5 mb-10 overflow-x-auto"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background-light))' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                Contribution Activity
              </p>
              <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {TOTAL_CONTRIBS.toLocaleString()} contributions in the last year
              </p>
            </div>
            <div className="flex gap-[3px] min-w-max">
              {CONTRIB_GRID.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((level, di) => (
                    <div
                      key={di}
                      className="w-[10px] h-[10px] rounded-[2px] transition-transform hover:scale-125"
                      style={{ backgroundColor: cellColor(level) }}
                      title={`Level ${level}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-1.5 mt-3 justify-end">
              <span className="text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>Less</span>
              {[0,1,2,3,4].map(l => (
                <div key={l} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: cellColor(l) }} />
              ))}
              <span className="text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>More</span>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit"
            style={{ backgroundColor: 'hsl(var(--muted))' }}>
            {(['repos', 'stats'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all duration-150"
                style={{
                  backgroundColor: tab === t ? 'hsl(var(--background-light))' : 'transparent',
                  color: tab === t ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                  boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                }}>
                {t === 'repos' ? `Repos (${repos.length})` : 'Languages'}
              </button>
            ))}
          </div>

          {/* ── Repos tab ── */}
          {tab === 'repos' && (
            <>
              {/* Sort */}
              <div className="flex gap-2 mb-5">
                {(['updated', 'stars'] as const).map(s => (
                  <button key={s} onClick={() => setSort(s)}
                    className="px-3 py-1.5 text-xs rounded-full border capitalize transition-all duration-150"
                    style={{
                      borderColor: sort === s ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                      backgroundColor: sort === s ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                      color: sort === s ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    }}>
                    {s === 'updated' ? 'Recently Updated' : 'Most Stars'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sorted.slice(0, 9).map(repo => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gh-card group flex flex-col p-4 rounded-xl border transition-all duration-200"
                    style={{
                      borderColor: 'hsl(var(--border))',
                      backgroundColor: 'hsl(var(--background-light))',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--primary) / 0.5)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--border))';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Repo header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold truncate transition-colors"
                        style={{ color: 'hsl(var(--primary))' }}>
                        {repo.name}
                      </h3>
                      <ExternalIcon />
                    </div>

                    {/* Description */}
                    <p className="text-xs leading-relaxed mb-4 flex-1 line-clamp-2"
                      style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {repo.description ?? 'No description provided.'}
                    </p>

                    {/* Topics */}
                    {repo.topics?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {repo.topics.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'hsl(var(--primary) / 0.1)',
                              color: 'hsl(var(--primary))',
                            }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-3 mt-auto">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 text-[11px]"
                          style={{ color: 'hsl(var(--muted-foreground))' }}>
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: getLangColor(repo.language) }} />
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1 text-[11px]"
                          style={{ color: 'hsl(var(--muted-foreground))' }}>
                          <StarIcon />{repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1 text-[11px]"
                          style={{ color: 'hsl(var(--muted-foreground))' }}>
                          <ForkIcon />{repo.forks_count}
                        </span>
                      )}
                      <span className="ml-auto text-[10px]"
                        style={{ color: 'hsl(var(--muted-foreground))' }}>
                        {timeAgo(repo.updated_at)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {repos.length > 9 && (
                <div className="text-center mt-8">
                  <a
                    href={`https://github.com/${USERNAME}?tab=repositories`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-outline text-sm inline-flex items-center gap-2"
                  >
                    View all {repos.length} repositories <ExternalIcon />
                  </a>
                </div>
              )}
            </>
          )}

          {/* ── Languages tab ── */}
          {tab === 'stats' && (
            <div className="gh-card rounded-xl border p-6"
              style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background-light))' }}>
              <h3 className="text-sm font-semibold mb-6" style={{ color: 'hsl(var(--foreground))' }}>
                Language Breakdown
              </h3>
              {/* Bar */}
              <div className="flex rounded-full overflow-hidden h-3 mb-6 gap-px">
                {langList.map(([lang, count]) => (
                  <div
                    key={lang}
                    className="transition-all duration-700"
                    style={{
                      width: `${(count / langTotal) * 100}%`,
                      backgroundColor: getLangColor(lang),
                    }}
                    title={`${lang}: ${Math.round((count / langTotal) * 100)}%`}
                  />
                ))}
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {langList.map(([lang, count]) => (
                  <div key={lang} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getLangColor(lang) }} />
                    <span className="text-sm flex-1 truncate" style={{ color: 'hsl(var(--foreground))' }}>
                      {lang}
                    </span>
                    <span className="text-xs tabular-nums" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {Math.round((count / langTotal) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
