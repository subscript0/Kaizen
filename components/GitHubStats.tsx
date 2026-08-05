'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { drawIn, gsap, refreshTriggersWhenSettled, useReveal } from '@/lib/motion';
import CountUp from '@/components/motion/CountUp';
import { useSectionIntro } from '@/components/motion/useSectionIntro';
import SectionHead from '@/components/SectionHead';

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

interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContribResponse {
  total: Record<string, number>;
  contributions: Contribution[];
}

// Official github-linguist colors for the languages that show up most —
// falls back to the site's own primary color for anything not listed here,
// so an unusual language never renders as a blank/broken swatch.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', SCSS: '#c6538c',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
  PHP: '#4F5D95', Ruby: '#701516', Go: '#00ADD8', Rust: '#dea584',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
  Vue: '#41b883', Svelte: '#ff3e00', Dockerfile: '#384d54', Astro: '#ff5a03',
  MDX: '#fcb32c', Lua: '#000080', R: '#198CE7', Elixir: '#6e4a7e',
  Haskell: '#5e5086', Solidity: '#AA6746', Perl: '#0298c3', Scala: '#c22d40',
  Clojure: '#db5855', 'Objective-C': '#438eff',
};

function getLangColor(lang: string | null | undefined): string {
  if (lang && LANGUAGE_COLORS[lang]) return LANGUAGE_COLORS[lang];
  return 'hsl(var(--primary))';
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  return 'today';
}

function formatDate(dateStr: string) {
  // Parsed as local time (not UTC) so the weekday lines up with getDay() below —
  // a bare "YYYY-MM-DD" is parsed as UTC midnight by Date, which getDay() then
  // reads back in the browser's local zone, silently shifting the day for
  // anyone west of UTC.
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

// GitHub's calendar always starts each column on Sunday — pad both ends so
// real days land in their correct weekday row instead of just chunking every
// 7 entries, which would drift the whole grid sideways.
function groupIntoWeeks(days: Contribution[]): (Contribution | null)[][] {
  if (days.length === 0) return [];
  const weeks: (Contribution | null)[][] = [];
  let week: (Contribution | null)[] = [];

  const firstDow = new Date(`${days[0].date}T00:00:00`).getDay(); // 0 = Sunday
  for (let i = 0; i < firstDow; i++) week.push(null);

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function cellColor(level: number) {
  if (level === 0) return 'hsl(var(--muted))';
  const alpha = [0, 0.3, 0.5, 0.75, 1][level];
  return `hsl(var(--primary) / ${alpha})`;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ForkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" />
    <path d="M18 9v2a2 2 0 01-2 2H8a2 2 0 01-2-2V9M12 12v3" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

// ── Main component ─────────────────────────────────────────────────────────────
export default function GitHubStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const USERNAME = 'meamkaizen'; // ← change to your GitHub username

  const [repos, setRepos] = useState<GHRepo[]>([]);
  const [user, setUser] = useState<GHUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Contribution data is fetched separately from repos/user — a hiccup on
  // this third-party service shouldn't blank out the repo grid, which comes
  // straight from GitHub's own API and is unrelated.
  const [contribData, setContribData] = useState<ContribResponse | null>(null);
  const [contribLoading, setContribLoading] = useState(true);
  const [contribError, setContribError] = useState(false);

  const [tab, setTab] = useState<'repos' | 'stats'>('repos');
  const [sort, setSort] = useState<'updated' | 'stars'>('updated');

  useEffect(() => {
    const ctrl = new AbortController();
    Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { signal: ctrl.signal }),
      fetch(`https://api.github.com/users/${USERNAME}`, { signal: ctrl.signal }),
    ])
      .then(async ([rRes, uRes]) => {
        if (!rRes.ok || !uRes.ok) throw new Error('API error');
        const [r, u] = await Promise.all([rRes.json(), uRes.json()]);
        setRepos((r as GHRepo[]).filter((repo) => !repo.fork));
        setUser(u as GHUser);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    // Real calendar data, no auth token needed — github-contributions-api.jogruber.de
    // scrapes the same public calendar GitHub's own profile page renders.
    // MIT licensed, used by react-github-calendar. Results are cached ~1hr on their end.
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`, { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Contribution API error');
        return res.json();
      })
      .then((data: ContribResponse) => setContribData(data))
      .catch(() => setContribError(true))
      .finally(() => setContribLoading(false));
    return () => ctrl.abort();
  }, []);

  const sorted = useMemo(
    () =>
      [...repos].sort((a, b) =>
        sort === 'stars'
          ? b.stargazers_count - a.stargazers_count
          : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      ),
    [repos, sort],
  );

  const { langList, langTotal } = useMemo(() => {
    const map: Record<string, number> = {};
    repos.forEach((r) => { if (r.language) map[r.language] = (map[r.language] ?? 0) + 1; });
    const list = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return { langList: list, langTotal: list.reduce((s, [, v]) => s + v, 0) };
  }, [repos]);

  const weeks = useMemo(
    () => (contribData ? groupIntoWeeks(contribData.contributions) : []),
    [contribData],
  );
  const totalContributions = useMemo(
    () => (contribData ? contribData.contributions.reduce((s, c) => s + c.count, 0) : null),
    [contribData],
  );

  useSectionIntro(sectionRef);

  // Cards rise as they arrive. `loading`, `tab` and `sort` are passed as deps
  // because every one of them swaps the contents of the panel — without them
  // the hook would only ever see the markup that existed on mount, and a
  // freshly rendered set of repo cards would pop in with no entrance at all.
  useReveal(
    sectionRef,
    '[data-reveal]',
    { y: 22, duration: 0.6, stagger: 0.06, start: 'top 92%' },
    [loading, tab, sort],
  );

  // The contribution calendar prints itself in, one week-column at a time,
  // left to right. `scaleY` from the bottom edge, so 53 columns cost 53
  // composited transforms and not a single layout pass — the naive version of
  // this (animating each of ~370 cells) is where a graph like this becomes a
  // jank generator on a phone.
  useEffect(() => {
    const scope = sectionRef.current;
    if (!scope || contribLoading || contribError) return;
    const ctx = gsap.context(() => {
      const stop = drawIn('[data-contrib-col]', {
        axis: 'y',
        duration: 0.45,
        stagger: 0.008,
        start: 'top 92%',
      });
      return stop;
    }, scope);
    refreshTriggersWhenSettled();
    return () => ctx.revert();
  }, [contribLoading, contribError, weeks.length]);

  // Language bars grow from their leading edge instead of appearing at full
  // width — the breakdown reads as a measurement being taken.
  useEffect(() => {
    const scope = sectionRef.current;
    if (!scope || tab !== 'stats') return;
    const ctx = gsap.context(() => {
      const stop = drawIn('[data-lang-bar]', {
        duration: 0.7,
        stagger: 0.06,
        start: 'top 95%',
      });
      return stop;
    }, scope);
    return () => ctx.revert();
  }, [tab, langList.length]);

  return (
    <section
      ref={sectionRef}
      id="github"
      /* `.measure` rather than a bespoke 980px column: every section on
         /projects is set in the same column, so the page has one left edge from
         the hero down to the last row.

         Ordinary section spacing, even though this is now the last thing on
         /projects: the site has no footer, and `main` already reserves the 80px
         fixed mobile tab bar in `app/globals.css`, so nothing lands under it. */
      className="measure pt-12 pb-16 md:pt-20 md:pb-24"
      aria-labelledby="github-heading"
    >
      <SectionHead
        index="05"
        label="Open source"
        id="github-heading"
        title="GitHub activity."
        className="mb-12"
        action={
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="micro micro--strong border-b border-[hsl(var(--foreground)_/0.35)] pb-1.5 transition-colors duration-200 hover:border-[hsl(var(--primary))] hover:!text-[hsl(var(--primary))]"
          >
            View profile <ExternalIcon />
          </a>
        }
      />

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-xl border border-border/30 border-t-primary/50 animate-spin" />
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground/80">
              Fetching from GitHub…
            </p>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="card p-8 text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground/80">
            Could not load GitHub data
          </p>
          <p className="mt-2 text-sm text-muted-foreground/80">
            API rate limit or network issue.
          </p>
          <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer"
            className="btn btn-outline mt-5 inline-flex items-center gap-2"
            data-magnetic
          >
            Visit GitHub directly <ExternalIcon />
          </a>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Stats row — mono ledger readout ── */}
          {user && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              {[
                // Live numbers, so the labels have to survive a value of 1 —
                // "1 FOLLOWERS" reads as a bug even though the figure is right.
                { label: user.public_repos === 1 ? 'Public Repo' : 'Public Repos', value: user.public_repos },
                { label: user.followers === 1 ? 'Follower' : 'Followers', value: user.followers },
                { label: 'Following', value: user.following },
                { label: 'Contributions (1yr)', value: totalContributions },
              ].map(({ label, value }) => (
                <div key={label} data-reveal className="card group p-4 sm:p-6">
                  {/* Four-figure counts ("1,404") at text-4xl measure ~108px, which
                      is wider than the 98px content box a half-width card has at
                      360px — the number spilled straight through the card's
                      hairline (.card is overflow: visible). Step the display size
                      down below `sm` instead of clipping it. */}
                  <p className="font-mono text-[1.625rem] leading-none sm:text-4xl sm:leading-none font-medium tabular-nums text-foreground/90 mb-2.5">
                    {/* Counts up on view. The real figure is in the DOM from the
                        first render and the animation only overlays it, so a
                        throttled tab or a dead ScrollTrigger still reads true. */}
                    <CountUp value={value} />
                  </p>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground/80">{label}</p>
                  {/* Hairline that wipes across the foot of the card on hover —
                      the one piece of feedback a stat tile needs. */}
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-px origin-left scale-x-0 bg-[hsl(var(--primary))] transition-transform duration-300 ease-[var(--ease-spring-2)] group-hover:scale-x-100"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Contribution graph — real data, or quietly absent if the source is down ── */}
          {!contribError && (
            <div data-reveal className="card p-6 mb-12">
              {/* Stacks below `sm`: two wide-tracked mono labels will not sit
                  side by side in a 264px content box — justify-between just made
                  both of them wrap into each other. */}
              <div className="flex flex-col gap-1 mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-foreground/80">
                  Contribution Activity
                </p>
                {totalContributions !== null && (
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] tabular-nums text-muted-foreground/80">
                    <CountUp value={totalContributions} duration={1.3} /> in the last year
                  </p>
                )}
              </div>

              {contribLoading ? (
                <div className="h-[94px] animate-pulse rounded-lg bg-muted/40" />
              ) : (
                <>
                  {/* The scroller and the track have to be SEPARATE boxes. A single
                      element carrying both `overflow-x-auto` and `min-w-max` can
                      never shrink — `min-width: max-content` wins over the flex/
                      block shrink, so the "scroller" just grows to the full 686px
                      of the 53-week calendar, drags the document's scroll width out
                      past the viewport, and the fixed mobile nav (which resolves
                      `inset-x-0` against that scroll width) gets half of its bar
                      pushed off-screen. Outer box clips + scrolls, inner box sizes
                      to content. */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-[3px] min-w-max">
                      {weeks.map((week, wi) => (
                        <div
                          key={wi}
                          data-contrib-col
                          className="flex origin-bottom flex-col gap-[3px] will-change-transform"
                        >
                          {week.map((day, di) =>
                            day ? (
                              <div
                                key={di}
                                className="w-[10px] h-[10px] rounded-none transition-transform duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:scale-[1.6]"
                                style={{ backgroundColor: cellColor(day.level) }}
                                title={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatDate(day.date)}`}
                              />
                            ) : (
                              <div key={di} className="w-[10px] h-[10px]" aria-hidden="true" />
                            ),
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 justify-end text-xs">
                    <span className="text-muted-foreground/80">Less</span>
                    {[0, 1, 2, 3, 4].map((l) => (
                      <div key={l} className="w-[10px] h-[10px] rounded-none" style={{ backgroundColor: cellColor(l) }} />
                    ))}
                    <span className="text-muted-foreground/80">More</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Tabs ── */}
          <div role="tablist" aria-label="GitHub views" className="flex gap-6 mb-8 border-b border-border/50">
            {(['repos', 'stats'] as const).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  id={`tab-${t}`}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${t}`}
                  onClick={() => setTab(t)}
                  className={`relative -mb-px pb-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${
                    active ? 'text-foreground' : 'text-muted-foreground/60 hover:text-foreground/80'
                  }`}
                >
                  {t === 'repos' ? `Repos (${repos.length})` : 'Languages'}
                  {/* The active marker was `bg-primary/20` — a 20%-opacity
                      hairline over a hairline border, which is to say
                      invisible. It is the only thing telling you which tab you
                      are on, so it gets the full accent. */}
                  <span
                    aria-hidden
                    className={`absolute left-0 right-0 -bottom-px h-[1px] bg-[hsl(var(--primary))] transition-transform duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] origin-left ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* ── Repos tab ── */}
          {tab === 'repos' && (
            <div id="panel-repos" role="tabpanel" aria-labelledby="tab-repos">
              <div className="flex items-center gap-2 mb-6">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground/80 mr-1">Sort</span>
                {(['updated', 'stars'] as const).map((s) => {
                  const active = sort === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSort(s)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] rounded-xl border border-border/30 transition-colors duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${
                        active
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-border text-muted-foreground/60 hover:text-foreground/80 hover:border-primary/30'
                      }`}
                    >
                      {s === 'updated' ? 'Recently Updated' : 'Most Stars'}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.slice(0, 9).map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-reveal
                    className="group relative flex flex-col overflow-hidden border border-border/30 bg-background-light/30 p-5 transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:border-primary/50"
                  >
                    {/* Accent hairline wipes the top edge on hover — the whole
                        hover state, no lift, no shadow, no radius. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[hsl(var(--primary))] transition-transform duration-300 ease-[var(--ease-spring-2)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-sans text-lg font-semibold leading-tight truncate text-foreground/80 transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group-hover:text-foreground">
                        {repo.name}
                      </h3>
                      <span className="mt-1 text-muted-foreground/80 transition-[color,transform] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary/90">
                        <ExternalIcon />
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed mb-4 flex-1 line-clamp-2 text-muted-foreground/80">
                      {repo.description ?? 'No description provided.'}
                    </p>

                    {repo.topics?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.topics.slice(0, 3).map((t) => (
                          <span key={t}
                            className="font-mono text-[0.58rem] uppercase tracking-[0.01em] px-2 py-0.5 rounded-xl border border-border/30 text-muted-foreground/80">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/50">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-muted-foreground/80">
                          <span className="w-2.5 h-2.5 rounded flex-shrink-0" style={{ backgroundColor: getLangColor(repo.language) }} />
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1 font-mono text-[0.65rem] tabular-nums text-muted-foreground/80">
                          <StarIcon />{repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1 font-mono text-[0.65rem] tabular-nums text-muted-foreground/80">
                          <ForkIcon />{repo.forks_count}
                        </span>
                      )}
                      <span className="ml-auto font-mono text-[0.6rem] uppercase tracking-[0.01em] tabular-nums text-muted-foreground/80">
                        {timeAgo(repo.updated_at)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {repos.length > 9 && (
                <div className="text-center mt-10">
                  <a
                    href={`https://github.com/${USERNAME}?tab=repositories`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline text-sm inline-flex items-center gap-2"
                    data-magnetic
                  >
                    View all {repos.length} repositories <ExternalIcon />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ── Languages tab ── */}
          {tab === 'stats' && (
            <div id="panel-stats" role="tabpanel" aria-labelledby="tab-stats" data-reveal className="card p-6">
              <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-foreground/80 mb-6">
                Language Breakdown
              </h3>
              <div className="flex overflow-hidden h-3 mb-6 gap-[1px]">
                {langList.map(([lang, count]) => (
                  <div
                    key={lang}
                    data-lang-bar
                    /* Width is the layout; `scaleX` is the animation. Growing
                       these by tweening `width` would relayout the whole row
                       on every frame — six flex siblings, sixty times a
                       second. The transform costs one composite. */
                    className="origin-left will-change-transform"
                    style={{ width: `${(count / langTotal) * 100}%`, backgroundColor: getLangColor(lang) }}
                    title={`${lang}: ${Math.round((count / langTotal) * 100)}%`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {langList.map(([lang, count]) => (
                  <div key={lang} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: getLangColor(lang) }} />
                    <span className="text-sm flex-1 truncate text-foreground/80">{lang}</span>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground/80">
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