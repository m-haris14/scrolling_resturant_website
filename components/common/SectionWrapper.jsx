'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import styles from './SectionWrapper.module.css';

/**
 * SectionWrapper — Shared wrapper for Sections 02–11.
 *
 * Responsibilities:
 * 1. Shows a small editorial section number label (e.g. "02") top-left.
 * 2. Adds consistent top/bottom breathing room so sections feel like
 *    one continuous page instead of separate screens.
 * 3. Applies a scroll-scrubbed fade-in so each section emerges
 *    smoothly from below — no sudden "new page" flash.
 */
export default function SectionWrapper({
  children,
  number,
  label,
  hideBadge = false,
  noAnimation = false,
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (noAnimation) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrap,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 95%',
            end: 'top 40%',
            scrub: 0.8,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [noAnimation]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrapper} ${noAnimation ? styles.wrapperNoAnim : ''}`}
    >
      {/* Editorial section number */}
      {!hideBadge && (
        <div className={styles.numBadge} aria-hidden="true">
          <span className={styles.numText}>{number}</span>
          {label && <span className={styles.numLabel}>{label}</span>}
          <span className={styles.numLine} />
        </div>
      )}

      {children}
    </div>
  );
}

