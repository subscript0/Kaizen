#!/usr/bin/env python3
"""Render the seven /skills discipline plates.

Usage: python3 scripts/build-skill-plates.py  (needs chromium + imagemagick)

Each plate is a typographic poster that names its own discipline in type big
enough to read at thumbnail size, so the plate beside "Frontend" says FRONTEND
instead of showing an unrelated screenshot.

Built as HTML, shot with headless chromium at 2x, written out as JPEG.

── Colour ──────────────────────────────────────────────────────────────────
Each discipline owns a hue, and the `hex` on each entry below must stay in step
with `PLATE` in components/skills/capabilities.ts — the page tints that
discipline's markless tools with the same value, so a mismatch reads as two
colour schemes inside one chapter. DisciplineChapters renders these plates
unfiltered; an earlier build pushed them through `grayscale(1)` and this script
drew them monochrome to suit, which is why nothing here is grey any more.

── Background ──────────────────────────────────────────────────────────────
No grid. The plates used to sit on a drafting mesh, which at the size the
column actually renders turned into visible moiré behind the letterforms and
fought the page's own hairline rules. What is left is a soft off-centre wash of
the discipline's colour plus a vignette — enough that the plate does not read
as a flat rectangle, with nothing competing with the word.
"""

import base64
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "skills"
# Intermediate HTML and PNG. Scratch only — the JPEGs under OUT are the output.
BUILD = pathlib.Path(tempfile.mkdtemp(prefix="skill-plates-"))

W, H = 1600, 1000  # 16:10, the aspect the plate frame is locked to

# Starting size for the word. A script in the page shrinks it until it clears
# the stack column, so this is a ceiling and not a per-word measurement.
SIZE_MAX = 260


def b64(rel: str) -> str:
    return base64.b64encode((ROOT / rel).read_bytes()).decode()


SANS = b64("node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2")
MONO = b64("node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2")

# id:    the filename, and the capability id in capabilities.ts
# word:  the thing the reader has to be able to see in the image
# hex:   the discipline's hue — mirrors PLATE in capabilities.ts
# stack: the ghosted list beside the word, one line per token
PLATES = [
    {
        "id": "frontend",
        "n": "01",
        "word": "FRONTEND",
        "label": "Interface",
        "hex": "4FD6FF",
        "stack": ["HTML5", "CSS3", "REACT", "NEXT.JS", "TAILWIND"],
    },
    {
        "id": "backend",
        "n": "02",
        "word": "BACKEND",
        "label": "Services",
        "hex": "6EE787",
        "stack": ["NODE.JS", "EXPRESS", "PYTHON", "PHP", "REST"],
    },
    {
        "id": "database",
        "n": "03",
        "word": "DATABASE",
        "label": "State",
        "hex": "7C9CFF",
        "stack": ["SQL", "MONGODB", "NEON", "SUPABASE", "FIREBASE"],
    },
    {
        "id": "tools",
        "n": "04",
        "word": "TOOLING",
        "label": "Delivery",
        "hex": "2FD9C0",
        "stack": ["GIT", "GITHUB", "DOCKER", "PNPM", "LINUX"],
    },
    {
        "id": "cloud",
        "n": "05",
        "word": "CLOUD",
        "label": "Infrastructure",
        "hex": "FF9E2C",
        "stack": ["AWS", "HOSTING", "STORAGE", "DELIVERY", "DNS"],
    },
    {
        "id": "design",
        "n": "06",
        "word": "DESIGN",
        "label": "Craft",
        "hex": "C084FC",
        "stack": ["FIGMA", "LAYOUT", "TYPE SCALE", "TOKENS", "STATES"],
    },
    {
        "id": "security",
        "n": "07",
        "word": "CYBERSECURITY",
        "label": "Defence",
        "hex": "FF5470",
        "stack": ["LINUX", "NETWORKING", "OSINT", "WEB SECURITY", "HARDENING"],
    },
]

TOTAL = len(PLATES)

PAGE = """<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {{
    font-family: 'Geist';
    src: url(data:font/woff2;base64,{sans}) format('woff2');
    font-weight: 100 900;
  }}
  @font-face {{
    font-family: 'Geist Mono';
    src: url(data:font/woff2;base64,{mono}) format('woff2');
    font-weight: 100 900;
  }}

  * {{ margin: 0; padding: 0; box-sizing: border-box; }}

  html, body {{ width: {w}px; height: {h}px; overflow: hidden; }}

  body {{
    position: relative;
    background: #08080a;
    color: #e6e6dc;
    font-family: 'Geist', sans-serif;
    -webkit-font-smoothing: antialiased;
  }}

  .wash, .vignette {{ position: absolute; inset: 0; }}

  /* Light falls from the upper left in the discipline's own colour, so the
     word has somewhere to sit without a grid underneath it. */
  .wash {{
    background:
      radial-gradient(110% 85% at 20% 12%, #{hex}30, transparent 60%),
      radial-gradient(90% 80% at 86% 88%, #{hex}1a, transparent 62%);
  }}

  .vignette {{
    background: radial-gradient(125% 105% at 45% 45%, transparent 30%, rgba(0,0,0,.8) 100%);
  }}

  /* Everything below is inset: the plate is cropped on all four edges by the
     parallax layer in DisciplineChapters, and this clears the worst case. */
  .frame {{
    position: absolute;
    inset: 11% 8%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .rail {{
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 18px;
    border-bottom: 1px solid #{hex}3d;
  }}
  .rail--bottom {{
    padding: 18px 0 0;
    border: 0;
    border-top: 1px solid #{hex}3d;
  }}

  .micro {{
    font-family: 'Geist Mono', monospace;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: #{hex}c4;
    white-space: nowrap;
  }}
  .micro--dim {{ color: rgba(230,230,220,.5); }}

  .credit {{ display: flex; align-items: center; gap: 16px; }}
  .credit i {{ width: 6px; height: 6px; background: #{hex}; }}

  .stage {{
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
  }}

  /* The stack list is a ghost beside the word — it says what the discipline is
     made of without competing for the first read. */
  .stack {{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    text-align: right;
    font-family: 'Geist Mono', monospace;
    font-size: 26px;
    font-weight: 500;
    line-height: 2.05;
    letter-spacing: .2em;
    color: #{hex}45;
  }}

  .word {{
    position: relative;
    font-size: {size}px;
    font-weight: 800;
    letter-spacing: -.045em;
    line-height: .84;
    white-space: nowrap;
    color: #{hex};
  }}

  /* An outlined copy sits half a step behind the solid one. Same word twice,
     so the letterforms stay legible while the plate gains depth. */
  .word .ghost {{
    position: absolute;
    left: 18px;
    top: 20px;
    color: transparent;
    -webkit-text-stroke: 2px #{hex}59;
  }}

  .index {{
    font-family: 'Geist Mono', monospace;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: .16em;
    color: #{hex};
  }}
</style>

<div class="wash"></div>
<div class="vignette"></div>

<div class="frame">
  <div class="rail">
    <span class="micro">Discipline {n}</span>
    <span class="micro micro--dim">{label}</span>
  </div>

  <div class="stage">
    <div class="stack">{stack}</div>
    <div class="word"><span class="ghost">{word}</span>{word}</div>
  </div>

  <div class="rail rail--bottom">
    <div class="micro micro--dim credit"><i></i>Kaizen · Skills index</div>
    <span class="index">{n} / {total}</span>
  </div>
</div>

<script>
  /* Fit the word to the space left of the stack column.
     Measured rather than guessed: "CLOUD" and "CYBERSECURITY" have wildly
     different set widths at the same point size, and a hardcoded per-length
     table put FRONTEND's D straight through the stack list. */
  document.fonts.ready.then(() => {{
    const word = document.querySelector('.word');
    const limit = document.querySelector('.stage').getBoundingClientRect().width
                - document.querySelector('.stack').getBoundingClientRect().width
                - 72;                                   // gutter between the two

    for (let size = {size}; size > 80; size -= 2) {{
      word.style.fontSize = size + 'px';
      if (word.getBoundingClientRect().width <= limit) break;
    }}
    document.documentElement.dataset.ready = '1';
  }});
</script>
"""


def render(plate: dict) -> pathlib.Path:
    html = PAGE.format(
        sans=SANS,
        mono=MONO,
        w=W,
        h=H,
        n=plate["n"],
        total=f"{TOTAL:02d}",
        word=plate["word"],
        label=plate["label"],
        hex=plate["hex"],
        size=SIZE_MAX,
        stack="<br>".join(plate["stack"]),
    )

    src = BUILD / f"{plate['id']}.html"
    png = BUILD / f"{plate['id']}.png"
    src.write_text(html)

    subprocess.run(
        [
            "chromium",
            "--headless",
            "--no-sandbox",
            "--disable-gpu",
            "--hide-scrollbars",
            "--force-device-scale-factor=2",
            "--default-background-color=00000000",
            f"--window-size={W},{H}",
            "--virtual-time-budget=3000",
            f"--screenshot={png}",
            src.as_uri(),
        ],
        check=True,
        capture_output=True,
    )

    jpg = OUT / f"{plate['id']}.jpg"
    subprocess.run(
        ["magick", str(png), "-resize", f"{W}x{H}", "-quality", "90",
         "-strip", "-interlace", "Plane", str(jpg)],
        check=True,
    )
    return jpg


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for plate in PLATES:
        jpg = render(plate)
        print(f"{jpg.relative_to(ROOT)}  {jpg.stat().st_size // 1024} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
