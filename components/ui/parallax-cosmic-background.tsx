'use client';

import React, { useEffect, useState } from 'react';

interface CosmicParallaxBgProps {
  /**
   * Main heading text (displayed large in the center).
   * Omit to run the component as a pure background layer.
   */
  head?: string;

  /**
   * Subtitle text (displayed below the heading).
   * Comma-separated string that will be split into animated parts.
   * Omit to run the component as a pure background layer.
   */
  text?: string;

  /**
   * Whether the text animations should loop
   * @default true
   */
  loop?: boolean;

  /**
   * `full` renders the starfield plus the horizon glow, earth curve and
   * animated title — the standalone hero treatment.
   *
   * `ambient` renders the starfield only, fixed behind page content. Use this
   * when the component is a backdrop rather than the subject of the page.
   * @default 'full'
   */
  variant?: 'full' | 'ambient';

  /**
   * Custom class name for additional styling
   */
  className?: string;
}

/**
 * A cosmic parallax background with three parallax star layers.
 *
 * Stars are drawn as `box-shadow` spots on three 1–3px elements, each scrolling
 * at a different speed. Positions are generated on the client only (inside
 * `useEffect`) because `Math.random()` during render would produce different
 * markup on server and client and trip a hydration mismatch.
 *
 * The generated shadows deliberately omit a colour, so each spot falls back to
 * `currentColor`. That lets the stylesheet re-colour the whole field from a
 * single `color` declaration — which is what keeps the field visible in the
 * light theme, where white stars would vanish against a near-white page.
 */
const CosmicParallaxBg: React.FC<CosmicParallaxBgProps> = ({
  head,
  text,
  loop = true,
  variant = 'full',
  className = '',
}) => {
  const [smallStars, setSmallStars] = useState<string>('');
  const [mediumStars, setMediumStars] = useState<string>('');
  const [bigStars, setBigStars] = useState<string>('');

  const textParts = text ? text.split(',').map((part) => part.trim()) : [];
  const showCopy = variant === 'full' && Boolean(head || text);

  useEffect(() => {
    // Colourless shadows — see the note in the component doc comment.
    const generateStarBoxShadow = (count: number): string => {
      const shadows: string[] = [];
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        shadows.push(`${x}px ${y}px`);
      }
      return shadows.join(', ');
    };

    // The ambient backdrop is decorative and sits under every page, so it runs
    // a lighter field. 1000 box-shadow spots is a real paint cost to repeat on
    // every route.
    const density = variant === 'ambient' ? 0.45 : 1;
    setSmallStars(generateStarBoxShadow(Math.round(700 * density)));
    setMediumStars(generateStarBoxShadow(Math.round(200 * density)));
    setBigStars(generateStarBoxShadow(Math.round(100 * density)));
  }, [variant]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--animation-iteration',
      loop ? 'infinite' : '1',
    );
  }, [loop]);

  return (
    <div
      className={`cosmic-parallax-container ${
        variant === 'ambient' ? 'cosmic-parallax-container--ambient' : ''
      } ${className}`}
      // Decorative in ambient mode: it must never be announced or focusable,
      // and must not swallow clicks meant for the page underneath.
      {...(variant === 'ambient' ? { 'aria-hidden': true } : {})}
    >
      <div style={{ boxShadow: smallStars }} className="cosmic-stars" />
      <div style={{ boxShadow: mediumStars }} className="cosmic-stars-medium" />
      <div style={{ boxShadow: bigStars }} className="cosmic-stars-large" />

      {variant === 'full' && (
        <>
          <div className="cosmic-horizon">
            <div className="cosmic-glow" />
          </div>
          <div className="cosmic-earth" />
        </>
      )}

      {showCopy && (
        <>
          {head ? <div className="cosmic-title">{head.toUpperCase()}</div> : null}
          {textParts.length > 0 && (
            <div className="cosmic-subtitle">
              {textParts.map((part, index) => (
                <React.Fragment key={part}>
                  <span className={`subtitle-part-${index + 1}`}>{part.toUpperCase()}</span>
                  {index < textParts.length - 1 && ' '}
                </React.Fragment>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { CosmicParallaxBg };
