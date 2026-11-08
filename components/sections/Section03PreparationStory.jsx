'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import styles from './Section03PreparationStory.module.css';

/**
 * Section 03 — The Dum Story
 *
 * Progressive word-by-word scroll reveal (opacity 0.18 → 1).
 * Built with pure React JSX word spans — NO GSAP SplitText.
 *
 * Architecture:
 * - Each word and inline illustration is mapped from an immutable token array.
 * - Each token element is collected into a ref array.
 * - A single GSAP ScrollTrigger timeline animates token opacity from 0.18 → 1
 *   in natural reading order.
 * - Normal words transition from dim grey to warm off-white.
 * - Gold words transition from dim gold to radiant gold (#f2ba3d).
 * - "alone" has gold italic styling.
 * - "dum" has gold bold-italic styling.
 * - Scroll up reverses the reveal; stopping the scroll stops the animation.
 */

// ─── Inline SVG Illustrations ────────────────────────────────────────────────

function MarinatedMeatIcon() {
  return (
    <svg
      viewBox="0 0 100 68"
      className={styles.svgIcon}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Platter of spiced marinated meat with mint and lime"
    >
      <defs>
        <radialGradient id="s3-meatGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2a1610" />
          <stop offset="85%" stopColor="#141010" />
          <stop offset="100%" stopColor="#080808" />
        </radialGradient>
        <linearGradient id="s3-chili" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="46" rx="46" ry="18" fill="url(#s3-meatGlow)" stroke="#3a2e28" strokeWidth="1.2" />
      <ellipse cx="50" cy="45" rx="41" ry="14" fill="#171210" />
      <path d="M22 44C20 38 27 31 36 33C43 35 44 42 38 46C32 49 23 48 22 44Z" fill="url(#s3-chili)" stroke="#450a0a" strokeWidth="0.8" />
      <path d="M26 36C28 35 32 37 31 39M24 41C27 40 31 42 30 44" stroke="#450a0a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M38 43C36 34 47 27 58 30C67 33 66 43 60 47C53 51 40 49 38 43Z" fill="url(#s3-chili)" stroke="#450a0a" strokeWidth="0.8" />
      <path d="M43 34C48 33 53 36 52 38M45 40C51 38 56 42 54 44" stroke="#3b0707" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M58 45C57 37 68 33 76 36C82 39 82 46 76 49C70 51 59 49 58 45Z" fill="url(#s3-chili)" stroke="#450a0a" strokeWidth="0.8" />
      <path d="M48 27C52 22 60 25 56 31C52 29 50 28 48 27Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.6" />
      <path d="M34 29C38 25 44 28 41 33C37 32 35 30 34 29Z" fill="#16a34a" />
      <path d="M64 31C68 28 73 31 70 35C67 34 65 32 64 31Z" fill="#4ade80" />
      <path d="M74 46C78 40 86 42 88 47C85 50 78 49 74 46Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.8" />
    </svg>
  );
}

function WholeSpicesIcon() {
  return (
    <svg
      viewBox="0 0 95 65"
      className={styles.svgIcon}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cluster of whole aromatic spices"
    >
      <defs>
        <linearGradient id="s3-chiliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="s3-cinnamon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
      </defs>
      <ellipse cx="48" cy="50" rx="38" ry="10" fill="rgba(0,0,0,0.55)" />
      <g transform="rotate(-20 35 38)">
        <rect x="18" y="32" width="38" height="9" rx="4" fill="url(#s3-cinnamon)" stroke="#451a03" strokeWidth="0.8" />
        <ellipse cx="18" cy="36.5" rx="2.5" ry="4.5" fill="#451a03" />
        <line x1="22" y1="35" x2="52" y2="35" stroke="#ca8a04" strokeWidth="0.6" strokeDasharray="3 2" />
      </g>
      <g transform="translate(42,28) scale(0.9)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <path
            key={i}
            d="M0 0 C-3 -10 3 -10 0 0"
            fill="#542810"
            stroke="#301507"
            strokeWidth="0.6"
            transform={`rotate(${a}) translate(0,-5)`}
          />
        ))}
        <circle cx="0" cy="0" r="4.5" fill="#78350f" stroke="#3b1506" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="1.8" fill="#d97706" />
      </g>
      <g transform="translate(24,43) rotate(35)">
        <ellipse cx="0" cy="0" rx="4.5" ry="8" fill="#65a30d" stroke="#365314" strokeWidth="0.8" />
        <line x1="0" y1="-7" x2="0" y2="7" stroke="#84cc16" strokeWidth="0.6" />
      </g>
      <g transform="translate(34,47) rotate(-45)">
        <ellipse cx="0" cy="0" rx="3.8" ry="7" fill="#4d7c0f" stroke="#365314" strokeWidth="0.8" />
      </g>
      <path
        d="M38 46 C48 38 64 34 78 40 C84 43 85 47 78 48 C66 49 50 49 38 46 Z"
        fill="url(#s3-chiliGrad)"
        stroke="#450a0a"
        strokeWidth="0.8"
      />
      <path d="M38 46 C34 47 31 45 30 42" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function SealedHandiIcon() {
  return (
    <svg
      viewBox="0 0 90 70"
      className={styles.svgIcon}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Traditional sealed handi pot with dough seal"
    >
      <defs>
        <radialGradient id="s3-copper" cx="40%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="35%" stopColor="#b45309" />
          <stop offset="85%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#3d1a08" />
        </radialGradient>
        <linearGradient id="s3-dough" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="30%" stopColor="#fde68a" />
          <stop offset="70%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path
        d="M38 12C36 8 40 5 38 2M52 14C50 10 54 7 52 4"
        stroke="rgba(245,215,160,0.55)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="45" cy="62" rx="32" ry="7" fill="rgba(0,0,0,0.65)" />
      <path
        d="M18 38 C14 52 25 61 45 61 C65 61 76 52 72 38 C68 34 22 34 18 38 Z"
        fill="url(#s3-copper)"
        stroke="#451a03"
        strokeWidth="1"
      />
      <ellipse cx="36" cy="46" rx="14" ry="7" fill="rgba(254,240,138,0.35)" />
      <path
        d="M15 36 C15 30 75 30 75 36 C75 40 15 40 15 36 Z"
        fill="url(#s3-dough)"
        stroke="#b45309"
        strokeWidth="1.2"
      />
      <path
        d="M22 34C24 37 26 34 28 37M36 34C38 37 40 34 42 37M52 34C54 37 56 34 58 37M64 34C66 37 68 34 70 37"
        stroke="#b45309"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path d="M22 32 C26 22 64 22 68 32 Z" fill="#92400e" stroke="#451a03" strokeWidth="1" />
      <ellipse cx="45" cy="22" rx="5" ry="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
    </svg>
  );
}

// ─── Paragraph tokens definition ──────────────────────────────────────────────
// type: 'word' | 'icon'
// style: 'n'(normal off-white) | 'g'(gold) | 'gi'(gold italic) | 'gbi'(gold bold italic)
const TOKENS = [
  { type: 'word', style: 'n', text: 'Every ' },
  { type: 'word', style: 'n', text: 'handi ' },
  { type: 'word', style: 'n', text: 'starts ' },
  { type: 'word', style: 'n', text: 'the ' },
  { type: 'word', style: 'g', text: 'night ' },
  { type: 'word', style: 'g', text: 'before. ' },
  { type: 'word', style: 'n', text: 'Meat ' },
  { type: 'word', style: 'n', text: 'rests ' },
  { type: 'word', style: 'n', text: 'in ' },
  { type: 'icon', id: 'meat' },
  { type: 'word', style: 'n', text: 'yoghurt ' },
  { type: 'word', style: 'n', text: 'and ' },
  { type: 'word', style: 'n', text: 'red ' },
  { type: 'word', style: 'n', text: 'chilli, ' },
  { type: 'word', style: 'n', text: 'basmati ' },
  { type: 'word', style: 'n', text: 'is ' },
  { type: 'word', style: 'n', text: 'washed ' },
  { type: 'word', style: 'n', text: 'until ' },
  { type: 'word', style: 'n', text: 'the ' },
  { type: 'word', style: 'n', text: 'water ' },
  { type: 'word', style: 'n', text: 'runs ' },
  { type: 'word', style: 'n', text: 'clear, ' },
  { type: 'word', style: 'n', text: 'and ' },
  { type: 'icon', id: 'spices' },
  { type: 'word', style: 'g', text: 'eleven ' },
  { type: 'word', style: 'g', text: 'whole ' },
  { type: 'word', style: 'g', text: 'spices ' },
  { type: 'word', style: 'n', text: 'are ' },
  { type: 'word', style: 'g', text: 'toasted ' },
  { type: 'word', style: 'n', text: 'until ' },
  { type: 'word', style: 'n', text: 'the ' },
  { type: 'word', style: 'n', text: 'kitchen ' },
  { type: 'word', style: 'n', text: 'smells ' },
  { type: 'word', style: 'n', text: 'like ' },
  { type: 'word', style: 'n', text: 'a ' },
  { type: 'word', style: 'n', text: 'wedding. ' },
  { type: 'word', style: 'n', text: 'Then ' },
  { type: 'word', style: 'n', text: 'we ' },
  { type: 'word', style: 'n', text: 'layer ' },
  { type: 'word', style: 'n', text: 'it, ' },
  { type: 'word', style: 'n', text: 'seal ' },
  { type: 'word', style: 'n', text: 'the ' },
  { type: 'word', style: 'n', text: 'lid ' },
  { type: 'word', style: 'n', text: 'with ' },
  { type: 'word', style: 'n', text: 'dough, ' },
  { type: 'word', style: 'n', text: 'and ' },
  { type: 'word', style: 'n', text: 'leave ' },
  { type: 'word', style: 'n', text: 'it ' },
  { type: 'word', style: 'gi', text: 'alone ' },   // Gold Italic
  { type: 'word', style: 'n', text: 'on ' },
  { type: 'word', style: 'n', text: 'low ' },
  { type: 'word', style: 'n', text: 'fire. ' },
  { type: 'icon', id: 'handi' },
  { type: 'word', style: 'n', text: 'That ' },
  { type: 'word', style: 'n', text: 'is ' },
  { type: 'word', style: 'gbi', text: 'dum ' },     // Gold Bold Italic
  { type: 'word', style: 'n', text: '— ' },       // Em dash
  { type: 'word', style: 'n', text: 'the ' },
  { type: 'word', style: 'n', text: 'oldest ' },
  { type: 'word', style: 'n', text: 'trick ' },
  { type: 'word', style: 'n', text: 'in ' },
  { type: 'word', style: 'n', text: 'Hyderabad, ' },
  { type: 'word', style: 'n', text: 'and ' },
  { type: 'word', style: 'n', text: 'the ' },
  { type: 'word', style: 'n', text: 'only ' },
  { type: 'word', style: 'n', text: 'one ' },
  { type: 'word', style: 'n', text: 'we ' },
  { type: 'word', style: 'n', text: 'use.' },
];

const STYLE_CLASS = {
  n: 'wordNormal',
  g: 'wordGold',
  gi: 'wordGoldItalic',
  gbi: 'wordGoldBoldItalic',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Section03PreparationStory() {
  const sectionRef = useRef(null);
  const paragraphRef = useRef(null);
  const tokenRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const paragraph = paragraphRef.current;
    if (!section || !paragraph) return;

    const els = tokenRefs.current.filter(Boolean);
    if (els.length === 0) return;

    let ctx = null;

    ctx = gsap.context(() => {
      // Single coordinated timeline tied to the reading position of the paragraph
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: paragraph,
          start: 'top 80%',       // Begins revealing as paragraph enters the reading zone
          end: 'bottom 42%',      // Fully revealed by the time paragraph center is read
          scrub: 0.85,            // Direct, responsive scroll synchronization
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        els,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.045,
          ease: 'none',
          duration: 1,
        }
      );
    }, section);

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="The Dum Story">
      <div className={styles.container}>

        {/* ── Header Badge: 01 —— THE DUM ── */}
        <div className={styles.headerBadge}>
          <span className={styles.badgeLabel}>THE DUM</span>
        </div>

        {/* ── Editorial Paragraph (Pure React JSX Word Spans) ── */}
        <p ref={paragraphRef} className={styles.storyParagraph}>
          {TOKENS.map((token, i) => {
            const setRef = (el) => {
              tokenRefs.current[i] = el;
            };

            if (token.type === 'icon') {
              return (
                <span
                  key={`token-icon-${token.id}`}
                  ref={setRef}
                  className={styles.inlineIcon}
                  role="img"
                  aria-label={
                    token.id === 'meat'
                      ? 'marinated meat platter'
                      : token.id === 'spices'
                        ? 'whole spices cluster'
                        : 'sealed handi pot'
                  }
                >
                  {token.id === 'meat' && <MarinatedMeatIcon />}
                  {token.id === 'spices' && <WholeSpicesIcon />}
                  {token.id === 'handi' && <SealedHandiIcon />}
                </span>
              );
            }

            return (
              <span
                key={`token-word-${i}`}
                ref={setRef}
                className={styles[STYLE_CLASS[token.style]]}
              >
                {token.text}
              </span>
            );
          })}
        </p>

      </div>
    </section>
  );
}
