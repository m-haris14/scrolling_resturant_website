'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './Section09Fire.module.css';

const FIRE_CARDS = [
  {
    id: 'fire-01',
    num: '01',
    title: 'Tandoori Char',
    subtitle: 'Roasted over glowing wood charcoal',
    video: '/videos/Chicken Tikka-60fps.mp4',
  },
  {
    id: 'fire-02',
    num: '02',
    title: 'Clay Tandoor',
    subtitle: 'Slapped against searing clay walls',
    video: '/videos/Garlic Butter Nan-60fps.mp4',
  },
  {
    id: 'fire-03',
    num: '03',
    title: 'Dum Flame',
    subtitle: 'Sealed handi rested over slow ember heat',
    video: '/videos/Chicken Biryani-60fps.mp4',
  },
];

/**
 * Section 09 — Fire Does the Talking
 *
 * Requirements:
 * 1. Heading: "Fire does the talking."
 * 2. Three horizontal food video cards using existing project videos.
 * 3. Horizontal motion scrubbed to vertical scroll with section pinning.
 * 4. Finishes immediately when card 3 reaches resting position (no long black gaps).
 * 5. Reverses naturally on scroll up.
 * 6. NO 480°C visual.
 */
export default function Section09Fire() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Calculate exact distance so animation finishes when the last card is fully in view
      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 1.0,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Fire does the talking">
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div ref={trackRef} className={styles.track}>
        {/* Left Editorial Headline Panel */}
        <div className={styles.headlinePanel}>
          <div className={styles.headlineInner}>
            <p className={styles.eyebrow}>THE QUALITY</p>
            <h2 className={styles.headline}>
              Fire does<br />
              <span className={styles.goldItalic}>the talking.</span>
            </h2>
            <p className={styles.description}>
              Every flame is measured. No shortcuts, no electric heat — only glowing
              wood charcoal, sealed clay, and absolute patience.
            </p>
          </div>
        </div>

        {/* Three Horizontal Cinematic Food Video Cards */}
        {FIRE_CARDS.map((card) => (
          <article key={card.id} className={styles.fireCard}>
            <div className={styles.cardVideoWrap}>
              <video
                src={card.video}
                className={styles.cardVideo}
                muted
                playsInline
                loop
                autoPlay
                preload="auto"
              />
              <div className={styles.cardOverlay} aria-hidden="true" />
            </div>

            <div className={styles.cardMeta}>
              <div className={styles.cardTopRow}>
                <span className={styles.cardNum}>{card.num}</span>
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
            </div>
          </article>
        ))}

        {/* Small breathing margin at end so card 3 comfortably sits at right edge */}
        <div className={styles.endBuffer} aria-hidden="true" />
      </div>
    </section>
  );
}
