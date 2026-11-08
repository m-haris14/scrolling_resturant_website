'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './Section11LiftTheLid.module.css';

const STATS = [
  { id: 'stat-20', number: '20', unit: '', label: 'Hours of preparation' },
  { id: 'stat-11', number: '11', unit: '', label: 'Whole spices' },
  { id: 'stat-480', number: '480', unit: '°', label: 'Degrees of heat' },
  { id: 'stat-12', number: '12', unit: '', label: 'Hours of marination' },
];

const CLOSING_STATEMENT =
  '"No handi leaves the kitchen until it has rested ten minutes off the fire."';

/**
 * Section 11 — Come Lift the Lid (Finale)
 *
 * Requirements:
 * 1. Heading: "Come lift the lid." with "lid" highlighted in gold.
 * 2. Four numerical highlights:
 *    - 20: Hours of preparation
 *    - 11: Whole spices
 *    - 480: Degrees of heat
 *    - 12: Hours of marination
 * 3. Closing statement:
 *    "No handi leaves the kitchen until it has rested ten minutes off the fire."
 * 4. Dark background, off-white typography, subtle gold accents.
 * 5. Memorable, polished closing aesthetic.
 */
export default function Section11LiftTheLid() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const statsGridRef = useRef(null);
  const quoteRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Stats numbers stagger reveal
      if (statsGridRef.current) {
        const items = statsGridRef.current.querySelectorAll('[data-stat-card]');
        gsap.fromTo(
          items,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsGridRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Final quote reveal
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Come lift the lid">
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Main Heading */}
        <div ref={headerRef} className={styles.headerBlock}>
          <p className={styles.eyebrow}>FINALE —— THE DUM PUKHT TRADITION</p>
          <h2 className={styles.heading}>
            Come lift the <span className={styles.goldItalic}>lid.</span>
          </h2>
          <p className={styles.subtext}>
            Every handi is slow-cooked in its own steam, sealed with dough, and opened
            only when you sit down.
          </p>
        </div>

        {/* Four Numerical Highlights */}
        <div ref={statsGridRef} className={styles.statsGrid}>
          {STATS.map((stat) => (
            <div key={stat.id} data-stat-card className={styles.statCard}>
              <div className={styles.numberRow}>
                <span className={styles.number}>{stat.number}</span>
                {stat.unit && <span className={styles.unit}>{stat.unit}</span>}
              </div>
              <div className={styles.cardDivider} aria-hidden="true" />
              <p className={styles.label}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Prominent Closing Statement */}
        <div ref={quoteRef} className={styles.closingBlock}>
          <div className={styles.ornamentLine}>
            <span className={styles.ornamentDot}>✦</span>
          </div>
          <blockquote className={styles.statement}>
            {CLOSING_STATEMENT}
          </blockquote>
          <p className={styles.signature}>
            MR. BIRIYANIWALA · THE ROYAL DUM EXPERIENCE
          </p>
        </div>
      </div>
    </section>
  );
}
