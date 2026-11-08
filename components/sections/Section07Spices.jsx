'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { SPICES } from '@/data/spices';
import styles from './Section07Spices.module.css';

const TIKKA_VIDEO = '/videos/Chicken Tikka-60fps.mp4';

/**
 * Section 07 — The Spice Foundation
 *
 * Requirements:
 * 1. Left column: Indicator "03 —— IN THE HANDI", heading "Eleven spices. Toasted every morning.",
 *    description, and Chicken Tikka video (/videos/Chicken Tikka-60fps.mp4) with badge "04/11".
 * 2. Right column: Vertical list of 11 authentic spices with number, serif name, Hindi script,
 *    and description.
 * 3. Interactive hover: smoothly enlarges, adds warm glow / border, brightens text, returns smoothly on leave.
 */
export default function Section07Spices() {
  const sectionRef = useRef(null);
  const leftStickyRef = useRef(null);
  const rightListRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Reveal left sticky editorial block
      if (leftStickyRef.current) {
        gsap.fromTo(
          leftStickyRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Stagger reveal of spice list items
      const items = section.querySelectorAll('[data-spice-item]');
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, x: 25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rightListRef.current,
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
    <section ref={sectionRef} className={styles.section} aria-label="Eleven Spices Foundation">
      <div className={styles.container}>
        {/* ── Left Column: Sticky Editorial Showcase & Tikka Video ── */}
        <aside ref={leftStickyRef} className={styles.leftColumn}>
          {/* Eyebrow indicator */}

          <h2 className={styles.heading}>
            Eleven spices.<br />
            <span className={styles.goldSerif}>Toasted</span> every<br />
            morning.
          </h2>

          <p className={styles.description}>
            No spice blend is made in advance. Each batch is dry-roasted, ground,
            and used within the hour.
          </p>

          {/* Chicken Tikka Cinematic Video Card */}
          <div className={styles.videoCard}>
            <video
              src={TIKKA_VIDEO}
              className={styles.videoEl}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
            />
            <div className={styles.videoOverlay} aria-hidden="true" />

          </div>
        </aside>

        {/* ── Right Column: 11 Spices Interactive List ── */}
        <div ref={rightListRef} className={styles.rightColumn}>
          <ul className={styles.spiceList} aria-label="List of eleven authentic spices">
            {SPICES.map((spice) => (
              <li
                key={spice.id}
                data-spice-item
                className={styles.spiceItem}
                tabIndex={0}
              >
                <div className={styles.itemMeta}>
                  <span className={styles.itemNumber}>{spice.number}</span>
                  <div className={styles.nameBlock}>
                    <h3 className={styles.itemName}>{spice.name}</h3>
                    {spice.hindi && (
                      <span className={styles.itemHindi}>{spice.hindi}</span>
                    )}
                  </div>
                </div>

                <div className={styles.descBlock}>
                  <p className={styles.itemDesc}>{spice.description}</p>
                </div>

                {/* Subtle border shine effect */}
                <div className={styles.itemGlow} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
