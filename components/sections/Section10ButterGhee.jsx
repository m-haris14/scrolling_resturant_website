'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './Section10ButterGhee.module.css';

const HERO_VIDEO = '/videos/Chicken Biryani-60fps.mp4';
const SATELLITE_LEFT = '/videos/Butter Chicken Makhani-60fps.mp4';
const SATELLITE_RIGHT = '/videos/Chicken Tikka-60fps.mp4';

/**
 * Section 10 — Built in Layers. Finished with Fire.
 *
 * Clean 3-element composition:
 * 1. Dominant hero Chicken Biryani video in center with soft feathered edges.
 * 2. Left: Butter Chicken Makhani (subtle negative rotation, custom vertical offset).
 * 3. Right: Chicken Tikka (subtle positive rotation, staggered vertical position).
 * 4. Both flanking videos share the EXACT same CSS rendered height with natural aspect ratio.
 * 5. Clear negative space separating both flanking videos from the hero — zero overlap.
 * 6. Naan video completely removed.
 * 7. Smooth scroll-linked parallax with GSAP scrub, fully reversible on scroll up.
 */
export default function Section10ButterGhee() {
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);
  const textHeaderRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Central hero video gentle presence hold & scale
      tl.fromTo(
        heroRef.current,
        { scale: 0.96, opacity: 0.92 },
        { scale: 1.04, opacity: 1, duration: 1, ease: 'power1.out' },
        0
      );

      // Left Flanking Video (Butter Chicken Makhani):
      // Smooth upward parallax glide with organic deceleration
      if (leftVideoRef.current) {
        tl.fromTo(
          leftVideoRef.current,
          { y: 0, opacity: 0.82, scale: 1 },
          { y: -240, opacity: 0, scale: 0.9, ease: 'power2.inOut', duration: 0.88 },
          0.04
        );
      }

      // Right Flanking Video (Chicken Tikka):
      // Staggered upward parallax glide at slightly higher speed
      if (rightVideoRef.current) {
        tl.fromTo(
          rightVideoRef.current,
          { y: 0, opacity: 0.82, scale: 1 },
          { y: -270, opacity: 0, scale: 0.88, ease: 'power2.inOut', duration: 0.9 },
          0.08
        );
      }

      // Header subtle parallax
      if (textHeaderRef.current) {
        tl.fromTo(
          textHeaderRef.current,
          { y: 0, opacity: 1 },
          { y: -35, opacity: 0.85, ease: 'none', duration: 1 },
          0
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Built in layers">
      {/* Ambient background atmosphere */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.fireHalo} aria-hidden="true" />

      {/* Editorial Header */}
      <div ref={textHeaderRef} className={styles.headerBlock}>
        <p className={styles.eyebrow}>THE ARTISTRY</p>
        <h2 className={styles.title}>
          Built in layers.{' '}
          <span className={styles.goldItalic}>Finished with fire.</span>
        </h2>
        <p className={styles.description}>
          From the first marinade to the final rest, every detail earns its place.
        </p>
      </div>

      {/* Composition Stage with Clear Negative Space */}
      <div className={styles.stage}>
        {/* Left Flank Video: Butter Chicken Makhani */}
        <div ref={leftVideoRef} className={`${styles.flankVideoWrap} ${styles.flankLeft}`}>
          <div className={`${styles.videoInner} ${styles.innerRotateLeft}`}>
            <video
              src={SATELLITE_LEFT}
              className={styles.flankVideo}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
            />
            <div className={styles.flankAtmosphere} aria-hidden="true" />
          </div>
        </div>

        {/* Central Dominant Hero Video: Chicken Biryani */}
        <div ref={heroRef} className={styles.heroWrap}>
          <video
            src={HERO_VIDEO}
            className={styles.heroVideo}
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
          />
          <div className={styles.darkShadeOverlay} aria-hidden="true" />
        </div>

        {/* Right Flank Video: Chicken Tikka */}
        <div ref={rightVideoRef} className={`${styles.flankVideoWrap} ${styles.flankRight}`}>
          <div className={`${styles.videoInner} ${styles.innerRotateRight}`}>
            <video
              src={SATELLITE_RIGHT}
              className={styles.flankVideo}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
            />
            <div className={styles.flankAtmosphere} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
