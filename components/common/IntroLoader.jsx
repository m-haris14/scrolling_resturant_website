'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './IntroLoader.module.css';

/**
 * IntroLoader — Pre-Experience Cinematic Intro
 *
 * Features:
 * 1. Simmering dish emoji with organic rising smoke wisps.
 * 2. Counter starting at 0 and climbing smoothly to 100 in gold display typography.
 * 3. Once 100 finishes, activates "Click to Progress" CTA and gentle vertical
 *    nudge animation, inviting the user to click and proceed into the website.
 * 4. Seamless exit transition revealing Section 01.
 */
export default function IntroLoader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const hasTriggeredExitRef = useRef(false);

  // Progressive status copy during the countdown
  const getStatusText = (val) => {
    if (val < 25) return 'TOASTING ELEVEN SPICES...';
    if (val < 55) return 'SIMMERING OVER OPEN FLAME...';
    if (val < 85) return 'SEALING THE HANDI WITH DOUGH...';
    if (val < 100) return 'RESTING TEN MINUTES OFF THE FIRE...';
    return 'PERFECTLY RESTED';
  };

  // ─── Smooth Counter (0 -> 100) ───────────────────────────────────────────
  useEffect(() => {
    let current = 0;
    let animationFrameId = null;
    let lastTime = performance.now();

    const updateCounter = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      // Dynamic pacing: rapid through early numbers, steady in middle, crisp finish
      let increment = 0.55;
      if (current < 35) increment = 0.85;
      else if (current < 75) increment = 0.65;
      else if (current < 94) increment = 0.5;
      else increment = 0.35;

      current = Math.min(100, current + increment * (delta / 16.6));
      setCount(Math.floor(current));

      if (current < 100) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setCount(100);
        setIsReady(true);
        // Automatically finish intro as soon as 100% is reached
        setTimeout(() => {
          if (!hasTriggeredExitRef.current) {
            hasTriggeredExitRef.current = true;
            setIsExiting(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 800);
          }
        }, 280);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  // ─── Proceed Action ──────────────────────────────────────────────────────
  const handleProceed = useCallback(() => {
    if (!isReady || hasTriggeredExitRef.current) return;
    hasTriggeredExitRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      if (onComplete) onComplete();
    }, 850);
  }, [isReady, onComplete]);

  // Support Enter or Spacebar keypress once ready
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isReady && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
        e.preventDefault();
        handleProceed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady, handleProceed]);

  return (
    <div
      className={`${styles.introOverlay} ${isExiting ? styles.introExiting : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Intro"
    >
      {/* Golden Warmth Backdrop */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* Brand Header */}
      <div className={styles.brandHeader} aria-hidden="true">
        <span>Mr. Biriyaniwala</span>
        <span className={styles.brandDot}>•</span>
        <span>The Dum Experience</span>
      </div>

      {/* Center Interactive Stage */}
      <div
        className={styles.centerStage}
        aria-label={`Loading ${count}%`}
      >
        {/* Cook Dish with Rising Smoke */}
        <div className={styles.dishVisualWrapper}>
          {/* Rising Smoke Wisps SVG */}
          <div className={styles.smokeArea} aria-hidden="true">
            <svg viewBox="0 0 100 120" style={{ display: 'none' }}>
              <defs>
                <linearGradient id="smokeGradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#fff7eb" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f1c775" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d4a359" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Three organic rising smoke paths */}
            <svg viewBox="0 0 40 80" className={`${styles.smokeWisp} ${styles.wisp1}`}>
              <path d="M 20 80 Q 10 50, 25 30 T 15 0" />
            </svg>
            <svg viewBox="0 0 40 80" className={`${styles.smokeWisp} ${styles.wisp2}`}>
              <path d="M 20 80 Q 30 55, 15 35 T 25 0" />
            </svg>
            <svg viewBox="0 0 40 80" className={`${styles.smokeWisp} ${styles.wisp3}`}>
              <path d="M 18 80 Q 12 55, 28 32 T 18 0" />
            </svg>
          </div>

          {/* Glowing Cooking Dish / Pot */}
          <div className={styles.potWrapper}>
            <span className={styles.potIcon} role="img" aria-label="Steaming handi">
              🍲
            </span>
          </div>
        </div>

        {/* Counter Display (0 to 100) */}
        <div className={styles.counterRow} aria-live="polite">
          <span className={styles.counterValue}>{count}</span>
          <span className={styles.counterPercent}>%</span>
        </div>

        {/* Golden Progress Line */}
        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressBar} style={{ width: `${count}%` }} />
        </div>

        {/* Status Message */}
        <div className={styles.statusMessage}>
          <span>{getStatusText(count)}</span>
        </div>
      </div>

      {/* Subtle Editorial Footer */}
      <div className={styles.footerScript} aria-hidden="true">
        "No handi leaves the kitchen until it has rested ten minutes off the fire."
      </div>
    </div>
  );
}

