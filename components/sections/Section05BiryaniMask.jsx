'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './Section05BiryaniMask.module.css';

const PRIMARY_VIDEO = '/videos/Chicken Biryani-60fps.mp4';
const AMBIENT_VIDEO_LEFT = '/videos/Butter Chicken Makhani-60fps.mp4';
const AMBIENT_VIDEO_RIGHT = '/videos/Garlic Butter Nan-60fps.mp4';

/**
 * Section 05 — BIRYANI Video Typography Mask
 *
 * Requirements:
 * 1. Centered, dominant word "BIRYANI" with video visible through transparent letters
 *    on a deep black background.
 * 2. Three simultaneous videos: Primary Biryani in mask, flanked by Makhani & Naan.
 * 3. Size cycle: word starts small, grows larger, then smoothly shrinks back down,
 *    performing this complete cycle exactly ONCE across vertical scroll scrub.
 */
export default function Section05BiryaniMask() {
  const sectionRef = useRef(null);
  const maskTextRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const maskText = maskTextRef.current;
    if (!section || !maskText) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ─── Double Grow-and-Shrink Cycle (Small -> Big -> Small Twice) ───────
      // Cycle 1: starts small (0.70) -> grows big (1.35) -> shrinks small (0.75)
      // Cycle 2: grows big (1.38) -> shrinks small (0.75)
      tl.fromTo(
        maskText,
        { scale: 0.70, transformOrigin: 'center center' },
        { scale: 1.35, ease: 'power1.inOut', duration: 0.25 }
      )
        .to(maskText, { scale: 0.75, ease: 'power1.inOut', duration: 0.25 })
        .to(maskText, { scale: 1.38, ease: 'power1.inOut', duration: 0.25 })
        .to(maskText, { scale: 0.75, ease: 'power1.inOut', duration: 0.25 });

      // Flanking ambient cards subtle parallax & depth breathing
      if (leftCardRef.current && rightCardRef.current) {
        tl.fromTo(
          leftCardRef.current,
          { y: 30, opacity: 0.5, scale: 0.95 },
          { y: -20, opacity: 0.85, scale: 1.0, ease: 'none', duration: 0.5 },
          0
        ).to(
          leftCardRef.current,
          { y: -50, opacity: 0.45, scale: 0.92, ease: 'none', duration: 0.5 },
          0.5
        );

        tl.fromTo(
          rightCardRef.current,
          { y: 30, opacity: 0.5, scale: 0.95 },
          { y: -20, opacity: 0.85, scale: 1.0, ease: 'none', duration: 0.5 },
          0
        ).to(
          rightCardRef.current,
          { y: -50, opacity: 0.45, scale: 0.92, ease: 'none', duration: 0.5 },
          0.5
        );
      }

      // Editorial badge and subtext fade
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0.3, y: 15 },
          { opacity: 0.9, y: 0, duration: 0.4, ease: 'power2.out' },
          0.1
        ).to(
          subtitleRef.current,
          { opacity: 0.4, y: -10, duration: 0.4, ease: 'power2.in' },
          0.6
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Biryani Typography Mask">
      {/* ── Background Depth / Ambient Grain ── */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* ── Flanking Video 1: Left Ambient Pillar (Butter Chicken Makhani) ── */}
      <aside ref={leftCardRef} className={styles.flankCardLeft} aria-label="Makhani preview">
        <div className={styles.flankVideoWrap}>
          <video
            src={AMBIENT_VIDEO_LEFT}
            className={styles.flankVideo}
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
          />
          <div className={styles.flankVignette} aria-hidden="true" />
        </div>
        <div className={styles.flankLabel}>
        </div>
      </aside>

      {/* ── Flanking Video 2: Right Ambient Pillar (Garlic Butter Naan) ── */}
      <aside ref={rightCardRef} className={styles.flankCardRight} aria-label="Tandoori Naan preview">
        <div className={styles.flankVideoWrap}>
          <video
            src={AMBIENT_VIDEO_RIGHT}
            className={styles.flankVideo}
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
          />
          <div className={styles.flankVignette} aria-hidden="true" />
        </div>
        <div className={styles.flankLabel}>

        </div>
      </aside>

      {/* ── Center Video 3: Transparent Typography Mask (Chicken Biryani) ── */}
      <div className={styles.maskContainer}>
        {/* Hardware-accelerated base video */}
        <div className={styles.videoStage}>
          <video
            src={PRIMARY_VIDEO}
            className={styles.centerVideo}
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
          />
        </div>

        {/* Dark shade overlay — same as Section 01, sits between video and stencil */}
        <div className={styles.videoShadeOverlay} aria-hidden="true" />

        {/* Stencil Overlay: Black ground + White letters = transparent video window */}
        <div className={styles.stencilLayer} aria-hidden="true">
          <div ref={maskTextRef} className={styles.maskTextWrap}>
            <span className={styles.stencilText}>BIRYANI</span>
          </div>
        </div>
      </div>

      {/* ── Section Subtitle Indicator ── */}
      <div ref={subtitleRef} className={styles.indicatorWrap} aria-hidden="true">
        <span className={styles.indicatorEyebrow}>THE DUM PUKHT CRAFT</span>
      </div>
    </section>
  );
}
