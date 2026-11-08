'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import styles from './Section02FoodNames.module.css';

/**
 * Section 02 — Horizontal Food Typography Marquee
 *
 * Architecture:
 * - Pure GSAP + ScrollTrigger with scrub synchronization.
 * - Row 1 travels LEFT TO RIGHT when scrolling down.
 * - Row 2 travels RIGHT TO LEFT when scrolling down.
 * - Both rows move simultaneously in opposite directions on a single coordinated timeline.
 * - Travel distance is calculated dynamically from actual track and viewport widths.
 * - Scrolling stops = movement stops. Scrolling up = movement reverses.
 * - No SplitText, no CSS marquee, no independent animation loops.
 */

const ROW_1_SEQUENCE = [
  { text: 'Dum Pukht', type: 'white' },
  { text: 'Saffron', type: 'outline' },
  { text: 'Seale', type: 'white' },
];

const ROW_2_SEQUENCE = [
  { text: 'Ghee', type: 'gold' },
  { text: 'Kewra', type: 'outlineGold' },
  { text: 'Mirchi ka Salan', type: 'gold' },
  { text: 'Bura', type: 'outline' },
];

// 8 repetitions ensure the tracks are wide enough (>10,000px) so large travel
// distances never expose empty space on either side of the viewport.
const ROW_1_ITEMS = Array.from({ length: 8 }).flatMap(() => ROW_1_SEQUENCE);
const ROW_2_ITEMS = Array.from({ length: 8 }).flatMap(() => ROW_2_SEQUENCE);

function GoldStar() {
  return (
    <span className={styles.star} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor" className={styles.starSvg}>
        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
      </svg>
    </span>
  );
}

export default function Section02FoodNames() {
  const sectionRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!section || !r1 || !r2) return;

    let ctx = null;

    // Build coordinated GSAP timeline
    ctx = gsap.context(() => {
      // Dynamic calculation: compute actual travel distance based on element dimensions
      const getTravelDistance = () => {
        const vpWidth = window.innerWidth || 1440;
        const trackWidth = r1.scrollWidth || 10000;
        // Travel 1.3x of viewport width (minimum 1600px, maximum available overflow)
        return Math.max(1600, Math.min(vpWidth * 1.35, trackWidth - vpWidth - 400));
      };

      // Single coordinated timeline tied to vertical scroll via ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',    // Starts when Section 02 top enters the bottom of the screen
          end: 'bottom top',      // Completes when Section 02 bottom exits the top of the screen
          scrub: 0.85,            // Direct, smooth, snappy 1:1 scroll synchronization
          invalidateOnRefresh: true,
        },
      });

      // Row 1: LEFT TO RIGHT
      // Starts shifted to the left (-distance) and animates to 0 as user scrolls down
      tl.fromTo(
        r1,
        { x: () => -getTravelDistance() },
        { x: 0, ease: 'none', duration: 1 },
        0
      );

      // Row 2: RIGHT TO LEFT
      // Starts at 0 and animates to the left (-distance) as user scrolls down
      tl.fromTo(
        r2,
        { x: 0 },
        { x: () => -getTravelDistance(), ease: 'none', duration: 1 },
        0
      );
    }, section);

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Culinary terminology showcase"
    >
      {/* ── Row 1: Travels LEFT TO RIGHT ── */}
      <div className={styles.rowOuter}>
        <div ref={row1Ref} className={styles.row}>
          {ROW_1_ITEMS.map((item, idx) => (
            <div key={`r1-${idx}`} className={styles.item}>
              <span
                className={`${styles.wordText} ${styles[`word_${item.type}`]}`}
              >
                {item.text}
              </span>
              <GoldStar />
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 2: Travels RIGHT TO LEFT ── */}
      <div className={styles.rowOuter}>
        <div ref={row2Ref} className={styles.row}>
          <GoldStar />
          {ROW_2_ITEMS.map((item, idx) => (
            <div key={`r2-${idx}`} className={styles.item}>
              <span
                className={`${styles.wordText} ${styles[`word_${item.type}`]}`}
              >
                {item.text}
              </span>
              <GoldStar />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
