'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './Section06BiryaniReveal.module.css';

const VIDEO_SRC = '/videos/Chicken Biryani-60fps.mp4';

/**
 * Section 06 — Full Biryani Video Reveal
 *
 * Requirements:
 * 1. Directly continuous with Section 05 without reloading or resetting video.
 * 2. Unmasked, full cinematic presentation of the copper handi and rising steam.
 * 3. Tagline reveals gradually on scroll: "Opened at the table. Never before."
 *    with "Never before." in restrained gold (#f2ba3d).
 * 4. Pinned, scrubbed, and completely reversible with scroll.
 */
export default function Section06BiryaniReveal() {
  const sectionRef = useRef(null);
  const videoWrapRef = useRef(null);
  const taglineRef = useRef(null);
  const ambientSmokeRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const videoWrap = videoWrapRef.current;
    const tagline = taglineRef.current;
    if (!section || !videoWrap) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Video composition gently scales into full focus and rises slightly
      tl.fromTo(
        videoWrap,
        { scale: 0.95, y: 30, opacity: 0.8 },
        { scale: 1.0, y: 0, opacity: 1, ease: 'power2.out', duration: 0.4 }
      );

      // Tagline emerges with luxury fade & subtle upward rise
      if (tagline) {
        tl.fromTo(
          tagline,
          { opacity: 0, y: 45, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.4 },
          0.2
        );
      }

      // Gentle hold period in the middle for editorial digestion
      tl.to({}, { duration: 0.4 });

      // Smooth exit transition towards Section 07
      tl.to(
        [videoWrap, tagline],
        { opacity: 0.85, y: -20, ease: 'power1.in', duration: 0.3 }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Cinematic Biryani Reveal">
      {/* ── Ambient Radial Atmosphere ── */}
      <div ref={ambientSmokeRef} className={styles.ambientAtmosphere} aria-hidden="true" />

      {/* ── Unmasked Cinematic Handi Video ── */}
      <div ref={videoWrapRef} className={styles.videoWrap}>
        <div className={styles.videoMask}>
          <video
            src={VIDEO_SRC}
            className={styles.video}
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
          />
        </div>
        {/* Dark shade overlay identical to Section 01 to completely dissolve video boundaries */}
        <div className={styles.darkShadeOverlay} aria-hidden="true" />
      </div>

      {/* ── Editorial Tagline Overlay ── */}
      <div ref={taglineRef} className={styles.taglineContainer}>
        <p className={styles.tagline}>
          Opened at the table.{' '}
          <em className={styles.goldItalic}>Never before.</em>
        </p>
      </div>
    </section>
  );
}
