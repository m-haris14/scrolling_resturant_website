'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { DISHES } from '@/data/dishes';
import Section02FoodNames from '@/components/sections/Section02FoodNames';
import Section03PreparationStory from '@/components/sections/Section03PreparationStory';
import Section04StoryProgression from '@/components/sections/Section04StoryProgression';
import Section05BiryaniMask from '@/components/sections/Section05BiryaniMask';
import Section06BiryaniReveal from '@/components/sections/Section06BiryaniReveal';
import Section07Spices from '@/components/sections/Section07Spices';
import Section08Menu from '@/components/sections/Section08Menu';
import Section09Fire from '@/components/sections/Section09Fire';
import Section10ButterGhee from '@/components/sections/Section10ButterGhee';
import Section11LiftTheLid from '@/components/sections/Section11LiftTheLid';
import SectionWrapper from '@/components/common/SectionWrapper';
import IntroLoader from '@/components/common/IntroLoader';
import styles from './page.module.css';

// Approximate fallback duration per video (6.037s for all 5 clips)
const DEFAULT_VIDEO_DURATION = 6.037333;

// Scrub progress windows across overall Section 01 progress [0, 1]
const DISH_SCRUB_WINDOWS = [
  { start: 0.0, end: 0.24 },
  { start: 0.18, end: 0.44 },
  { start: 0.38, end: 0.64 },
  { start: 0.58, end: 0.84 },
  { start: 0.78, end: 1.0 },
];

// Target progress centers for menu click navigation
const DISH_CLICK_TARGETS = [0.08, 0.31, 0.51, 0.71, 0.92];

/**
 * FoodShowcase — 5-Dish Cinematic Scroll Experience
 *
 * Section 01: Pinned 5-video cinematic showcase with smooth crossfades,
 * non-blocking scroll scrubbing, title & description transitions,
 * vertical course menu, and continuous bottom progress bar.
 *
 * Sections 02–11: Editorial magazine flow below.
 */
export default function FoodShowcase() {
  const containerRef = useRef(null);
  const pinWrapperRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const progressFillRef = useRef(null);

  // 5 individual video refs
  const videoRefs = useRef([null, null, null, null, null]);

  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);

  // 1-Second Initial Video Motion Preview & Synchronized Scroll
  const isAutoMovingRef = useRef(false);
  const autoTweenRef = useRef(null);
  const hasStartedPreviewRef = useRef(false);

  const playInitialPreview = useCallback(() => {
    // Prevent double-trigger (once from handleIntroComplete + once from fallback useEffect)
    if (hasStartedPreviewRef.current) return;
    hasStartedPreviewRef.current = true;

    const v0 = videoRefs.current[0];
    if (!v0) return;

    // Video 0 must be fully visible before playing
    gsap.set('.dish-video-0', { autoAlpha: 1 });

    const runMotion = () => {
      // Always start strictly from zero — no cutting
      v0.currentTime = 0;
      isAutoMovingRef.current = true;

      const st = scrollTriggerRef.current;
      const dur = videoDurationsRef.current[0] || DEFAULT_VIDEO_DURATION;
      const previewDuration = 1.0; // 1-second auto motion
      const dish0Window = DISH_SCRUB_WINDOWS[0];
      const fraction = previewDuration / dur;
      const targetProgress = dish0Window.start + fraction * (dish0Window.end - dish0Window.start);
      const totalDist = st ? (st.end - st.start) : (10 * (typeof window !== 'undefined' ? window.innerHeight : 900));
      const targetScrollY = st ? st.start + targetProgress * totalDist : targetProgress * totalDist;

      // If user scrolls or interacts early, immediately yield full control to user
      const cancelAutoMotion = () => {
        if (isAutoMovingRef.current) {
          isAutoMovingRef.current = false;
          if (autoTweenRef.current) {
            autoTweenRef.current.kill();
            autoTweenRef.current = null;
          }
          if (v0 && !v0.paused) {
            v0.pause();
          }
          setShowScrollPrompt(true);
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('wheel', cancelAutoMotion, { passive: true, once: true });
        window.addEventListener('touchstart', cancelAutoMotion, { passive: true, once: true });
        window.addEventListener('pointerdown', cancelAutoMotion, { passive: true, once: true });
        window.addEventListener('keydown', cancelAutoMotion, { passive: true, once: true });
      }

      const playPromise = v0.play();
      const scrollState = { y: (typeof window !== 'undefined' ? window.scrollY : 0) };

      autoTweenRef.current = gsap.to(scrollState, {
        y: targetScrollY,
        duration: previewDuration,
        ease: 'none',
        onUpdate: () => {
          if (!isAutoMovingRef.current) return;
          if (typeof window !== 'undefined') {
            window.scrollTo(0, scrollState.y);
          }
          if (progressFillRef.current && totalDist > 0) {
            const p = scrollState.y / totalDist;
            progressFillRef.current.style.transform = `scaleX(${Math.max(0, Math.min(1, p))})`;
          }
        },
        onComplete: () => {
          if (v0) {
            v0.pause();
            try {
              v0.currentTime = previewDuration;
            } catch {}
          }
          if (typeof window !== 'undefined') {
            window.scrollTo(0, targetScrollY);
          }
          if (progressFillRef.current) {
            progressFillRef.current.style.transform = `scaleX(${targetProgress})`;
          }
          isAutoMovingRef.current = false;
          setShowScrollPrompt(true);
        },
      });

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser autoplay policies restrict immediate play
        });
      }
    };

    // Wait until enough data is buffered to play from 0 cleanly
    if (v0.readyState >= 2) {
      runMotion();
    } else {
      v0.addEventListener('canplay', runMotion, { once: true });
    }
  }, []);

  // Lock scroll while intro is visible; unlock, refresh triggers, and start 1s video motion on complete
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, 0);
      setTimeout(() => {
        ScrollTrigger.refresh();
        playInitialPreview();
      }, 100);
    }
  }, [playInitialPreview]);

  useEffect(() => {
    if (showIntro && typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    };
  }, [showIntro]);

  // Mutable refs for high-performance seeking without React render bottlenecks
  const activeIndexRef = useRef(0);
  const isReadyRefs = useRef([false, false, false, false, false]);
  const videoDurationsRef = useRef([
    DEFAULT_VIDEO_DURATION,
    DEFAULT_VIDEO_DURATION,
    DEFAULT_VIDEO_DURATION,
    DEFAULT_VIDEO_DURATION,
    DEFAULT_VIDEO_DURATION,
  ]);
  const targetTimesRef = useRef([0, 0, 0, 0, 0]);
  const isSeekingRefs = useRef([false, false, false, false, false]);
  const lastSeekTimeRefs = useRef([0, 0, 0, 0, 0]);
  const lastAssignedRefs = useRef([-1, -1, -1, -1, -1]);
  const rafIdsRef = useRef([null, null, null, null, null]);

  // ─── High-Performance Non-Blocking Video Seek Dispatcher ──────────────────
  const performSeek = useCallback((index) => {
    const video = videoRefs.current[index];
    if (!video || !isReadyRefs.current[index]) return;

    const dur = videoDurationsRef.current[index] || DEFAULT_VIDEO_DURATION;
    const target = Math.max(0, Math.min(targetTimesRef.current[index], dur - 0.001));

    // Avoid redundant seeks when difference is negligible (< 12ms)
    if (
      Math.abs(video.currentTime - target) < 0.012 &&
      Math.abs(lastAssignedRefs.current[index] - target) < 0.012
    ) {
      return;
    }

    const now = performance.now();
    // Non-blocking seek queue (32ms throttle per video to avoid decoder congestion)
    if (isSeekingRefs.current[index] && now - lastSeekTimeRefs.current[index] < 32) {
      if (rafIdsRef.current[index]) cancelAnimationFrame(rafIdsRef.current[index]);
      rafIdsRef.current[index] = requestAnimationFrame(() => performSeek(index));
      return;
    }

    try {
      isSeekingRefs.current[index] = true;
      lastSeekTimeRefs.current[index] = now;
      lastAssignedRefs.current[index] = target;
      video.currentTime = target;
    } catch {
      isSeekingRefs.current[index] = false;
    }
  }, []);

  const scheduleSeek = useCallback(
    (index, time) => {
      targetTimesRef.current[index] = time;
      if (rafIdsRef.current[index]) {
        cancelAnimationFrame(rafIdsRef.current[index]);
      }
      rafIdsRef.current[index] = requestAnimationFrame(() => performSeek(index));
    },
    [performSeek]
  );

  const handleSeeked = useCallback(
    (index) => {
      isSeekingRefs.current[index] = false;
      const video = videoRefs.current[index];
      if (!video) return;

      // Catch up immediately if target moved while previous frame was decoding
      if (Math.abs(video.currentTime - targetTimesRef.current[index]) >= 0.018) {
        if (rafIdsRef.current[index]) {
          cancelAnimationFrame(rafIdsRef.current[index]);
        }
        rafIdsRef.current[index] = requestAnimationFrame(() => performSeek(index));
      }
    },
    [performSeek]
  );

  // ─── Native Scroll Menu Navigation ────────────────────────────────────────
  const handleDishClick = (index) => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const targetProgress = DISH_CLICK_TARGETS[index] ?? (index / 5);
    const scrollPos = st.start + targetProgress * (st.end - st.start);
    window.scrollTo({
      top: scrollPos,
      behavior: 'smooth',
    });
  };

  // ─── GSAP ScrollTrigger Setup ─────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    let ctx = null;

    const pinWrapper = pinWrapperRef.current;
    const container = containerRef.current;
    if (!pinWrapper || !container) return;

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    ctx = gsap.context(() => {
      // ──────────────────────────────────────────────────────────────────────
      // INITIAL STATE AT SCROLL 0:
      // Initial dish content, branding, navigation, and display title are
      // immediately visible once the intro finishes, before the user scrolls.
      // ──────────────────────────────────────────────────────────────────────
      gsap.set(
        [
          '.dish-menu-nav',
          '.dish-details-aside',
          '.dish-title-section',
          '.dish-progress-section',
          '.dish-section-badge',
        ],
        {
          autoAlpha: 1,
          y: 0,
        }
      );

      // All videos start hidden at opacity 0 initially (revealed on scroll)
      gsap.set(
        [
          '.dish-video-0',
          '.dish-video-1',
          '.dish-video-2',
          '.dish-video-3',
          '.dish-video-4',
        ],
        {
          autoAlpha: 0,
        }
      );

      // Dish 0 content and Video 0 start active and visible immediately (no black screen)
      gsap.set(['.dish-details-0', '.dish-title-0', '.dish-video-0'], { autoAlpha: 1, y: 0 });

      // Dishes 1 through 4 content start hidden
      gsap.set(
        [
          '.dish-details-1',
          '.dish-title-1',
          '.dish-details-2',
          '.dish-title-2',
          '.dish-details-3',
          '.dish-title-3',
          '.dish-details-4',
          '.dish-title-4',
        ],
        {
          autoAlpha: 0,
          y: 16,
        }
      );

      // ──────────────────────────────────────────────────────────────────────
      // MASTER TIMELINE:
      // Pin Section 01 for 1000% scroll distance with native scrolling.
      // scrub: 2.2 provides a slow, calm, elegant 2-second cinematic catch-up.
      // ──────────────────────────────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapper,
          start: 'top top',
          end: '+=1000%',
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 10,
          onUpdate: (self) => {
            if (!isMounted) return;
            const progress = self.progress; // 0 to 1

            // While auto-moving during the initial 1-second preview, let the autoTween
            // handle the synchronized scroll animation and progress bar fill.
            if (isAutoMovingRef.current) {
              if (progressFillRef.current) {
                progressFillRef.current.style.transform = `scaleX(${progress})`;
              }
              return;
            }

            // 1. Update active menu index based on current scroll segment
            let newIndex = 0;
            if (progress < 0.20) newIndex = 0;
            else if (progress < 0.40) newIndex = 1;
            else if (progress < 0.60) newIndex = 2;
            else if (progress < 0.80) newIndex = 3;
            else newIndex = 4;

            if (activeIndexRef.current !== newIndex) {
              activeIndexRef.current = newIndex;
              setActiveDishIndex(newIndex);
            }

            // 2. Update continuous bottom progress bar fill
            if (progressFillRef.current) {
              progressFillRef.current.style.transform = `scaleX(${progress})`;
            }

            // 3. Scrub active video(s) within their respective windows (fluidly backward and forward)
            for (let i = 0; i < 5; i++) {
              const win = DISH_SCRUB_WINDOWS[i];
              if (progress >= win.start - 0.03 && progress <= win.end + 0.03) {
                const normalized = Math.max(
                  0,
                  Math.min(1, (progress - win.start) / (win.end - win.start))
                );
                const dur = videoDurationsRef.current[i] || DEFAULT_VIDEO_DURATION;
                scheduleSeek(i, normalized * dur);
              }
            }
          },
        },
      });

      // ── Video 0: Visible Immediately (No Initial Black Screen) ────────────
      tl.set('.dish-video-0', { autoAlpha: 1 }, 0.0);

      // Hold Dish 0 content steady through 1.8s while user scrubs Video 0
      tl.to({}, { duration: 1.8 }, 0.0);

      // ── Transition: Dish 0 -> Dish 1 (timeline 1.8s to 2.4s) ───────────────
      // Video 1 crossfades over Video 0 (no black gap, combined opacity >= 1)
      tl.to('.dish-video-1', { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, 1.8);
      tl.to('.dish-video-0', { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, 1.95);

      // Dish 0 text fades out
      tl.to(
        ['.dish-details-0', '.dish-title-0'],
        { autoAlpha: 0, y: -14, duration: 0.3, ease: 'power1.inOut' },
        1.85
      );
      // Dish 1 text reveals
      tl.fromTo(
        ['.dish-details-1', '.dish-title-1'],
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power1.out' },
        2.15
      );

      // ── Transition: Dish 1 -> Dish 2 (timeline 3.8s to 4.4s) ───────────────
      // Video 2 crossfades over Video 1
      tl.to('.dish-video-2', { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, 3.8);
      tl.to('.dish-video-1', { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, 3.95);

      // Dish 1 text fades out
      tl.to(
        ['.dish-details-1', '.dish-title-1'],
        { autoAlpha: 0, y: -14, duration: 0.3, ease: 'power1.inOut' },
        3.85
      );
      // Dish 2 text reveals
      tl.fromTo(
        ['.dish-details-2', '.dish-title-2'],
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power1.out' },
        4.15
      );

      // ── Transition: Dish 2 -> Dish 3 (timeline 5.8s to 6.4s) ───────────────
      // Video 3 crossfades over Video 2
      tl.to('.dish-video-3', { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, 5.8);
      tl.to('.dish-video-2', { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, 5.95);

      // Dish 2 text fades out
      tl.to(
        ['.dish-details-2', '.dish-title-2'],
        { autoAlpha: 0, y: -14, duration: 0.3, ease: 'power1.inOut' },
        5.85
      );
      // Dish 3 text reveals
      tl.fromTo(
        ['.dish-details-3', '.dish-title-3'],
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power1.out' },
        6.15
      );

      // ── Transition: Dish 3 -> Dish 4 (timeline 7.8s to 8.4s) ───────────────
      // Video 4 crossfades over Video 3
      tl.to('.dish-video-4', { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, 7.8);
      tl.to('.dish-video-3', { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, 7.95);

      // Dish 3 text fades out
      tl.to(
        ['.dish-details-3', '.dish-title-3'],
        { autoAlpha: 0, y: -14, duration: 0.3, ease: 'power1.inOut' },
        7.85
      );
      // Dish 4 text reveals
      tl.fromTo(
        ['.dish-details-4', '.dish-title-4'],
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power1.out' },
        8.15
      );

      // Hold Dish 4 cleanly through the completion of Section 01
      tl.to({}, { duration: 1.6 }, 8.4);

      scrollTriggerRef.current = tl.scrollTrigger;
    }, container);

    ScrollTrigger.refresh();

    return () => {
      isMounted = false;
      if (autoMoveTimeoutRef.current) clearTimeout(autoMoveTimeoutRef.current);
      rafIdsRef.current.forEach((id) => {
        if (id) cancelAnimationFrame(id);
      });
      if (ctx) ctx.revert();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [scheduleSeek]);

  // ─── Video Metadata & Readiness Listeners ─────────────────────────────────
  useEffect(() => {
    const cleanups = [];

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      const onMetadata = () => {
        if (video.duration && Number.isFinite(video.duration) && video.duration > 0) {
          videoDurationsRef.current[index] = video.duration;
        }
        isReadyRefs.current[index] = true;
        // Pre-seek first frame so browser decodes initial frame immediately
        try {
          video.currentTime = 0.001;
        } catch {
          // ignore micro-seek restrictions
        }
        ScrollTrigger.refresh();
      };

      const onSeeked = () => handleSeeked(index);

      video.addEventListener('loadedmetadata', onMetadata);
      video.addEventListener('seeked', onSeeked);

      if (video.readyState >= 1) {
        onMetadata();
      }

      cleanups.push(() => {
        video.removeEventListener('loadedmetadata', onMetadata);
        video.removeEventListener('seeked', onSeeked);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      rafIdsRef.current.forEach((id) => {
        if (id) cancelAnimationFrame(id);
      });
    };
  }, [handleSeeked]);

  return (
    <>
      {/* ── CINEMATIC INTRO LOADER (0 to 100 with Rising Smoke & Click To Progress) ── */}
      {showIntro && <IntroLoader onComplete={handleIntroComplete} />}

      {/* ── SECTION 01: Pinned 5-Dish Editorial Showcase ── */}
      <div ref={containerRef} className={styles.container}>
        <div ref={pinWrapperRef} className={styles.pinWrapper}>
          {/* Top Header Navigation (Mr. Biriyaniwala style) */}
          <header className={`${styles.topHeader} dish-menu-nav`}>
            <div className={styles.topLogo}>
              <span className={styles.logoIcon}>🥘</span>
              <span className={styles.logoText}>Mr. Biriyaniwala</span>
            </div>
            <nav className={styles.topNavLinks} aria-label="Main links">
              <span className={`${styles.navLink} ${styles.navLinkActive}`}>The Dum</span>
              <span className={styles.navLink}>Spices</span>
              <span className={styles.navLink}>Menu</span>
              <span className={styles.navLink}>Tandoor</span>
              <span className={styles.navLink}>Visit</span>
            </nav>
            <div className={styles.topActions}>
              <span className={styles.statusDot}>• CLOSED • OPENS 11:30 AM</span>
              <button className={styles.orderBtn}>Call to Order</button>
            </div>
          </header>

          {/* Centered Cinematic Video Frame with Soft Edge Falloff */}
          <div className={styles.videoCenterContainer}>
            <div className={styles.videoMask}>
              {DISHES.map((dish, i) => (
                <video
                  key={dish.id}
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={encodeURI(dish.videoSrc)}
                  playsInline
                  muted
                  preload="auto"
                  className={`${styles.frameVideo} dish-video-${i}`}
                  style={{ zIndex: i + 1 }}
                  onError={(e) => {
                    console.warn(`Video ${dish.videoSrc} failed to load:`, e);
                  }}
                />
              ))}

              {/* Gentle outer perimeter shade (keeps video 85%+ clear and visible) */}
              <div className={styles.darkShadeOverlay} aria-hidden="true" />
            </div>
          </div>

          {/* Upper-Left: Editorial Details Section */}
          <aside
            className={`${styles.dishDetails} dish-details-aside`}
            aria-label="Dish details"
          >
            {DISHES.map((dish, i) => (
              <div
                key={dish.id}
                className={`${styles.detailsContent} dish-details-${i}`}
              >
                <div className={styles.brandSuperLabel}>
                  <span className={styles.brandSuperDot}>•</span>
                  <span>Mr. Biriyaniwala</span>
                </div>
                <div className={styles.numberHeader}>
                  <span className={styles.bigItalicNumber}>{dish.label}</span>
                  <span className={styles.totalNumberDivider}>/ 05</span>
                </div>
                <div className={styles.categoryTag}>{dish.category}</div>
                <h2 className={styles.detailsHeading}>
                  <span className={styles.headingWhite}>{dish.titleLine1}</span>
                  <span className={styles.headingGoldItalic}>{dish.titleLine2}</span>
                </h2>
                <p className={styles.detailsDescription}>{dish.description}</p>
                <div className={styles.detailsActionRow}>
                  <span className={styles.onTheMenuPill}>On The Menu +</span>
                  <span className={styles.detailsPrice}>{dish.price}</span>
                </div>
              </div>
            ))}
          </aside>

          {/* Upper-Right: The Table Menu */}
          <nav
            className={`${styles.dishMenu} dish-menu-nav`}
            aria-label="Course selection menu"
          >
            <div className={styles.menuHeader}>THE TABLE</div>
            <ul className={styles.menuList}>
              {DISHES.map((dish, i) => {
                const isActive = i === activeDishIndex;
                return (
                  <li
                    key={dish.id}
                    onClick={() => handleDishClick(i)}
                    className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                  >
                    <div className={styles.menuItemBody}>
                      <span className={styles.menuIndex}>{dish.label}</span>
                      <span className={styles.menuTitle}>{dish.title}</span>
                    </div>
                    {isActive && <div className={styles.menuActiveIndicator} aria-hidden="true" />}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Center: Huge Chunky Display Title (Biriyani style) */}
          <div className={`${styles.dishTitleSection} dish-title-section`}>
            {DISHES.map((dish, i) => (
              <h1 key={dish.id} className={`${styles.dishTitle} dish-title-${i}`}>
                {dish.displayWord}
              </h1>
            ))}
          </div>

          {/* Bottom Utility Bar: Progress Line + Scroll Prompt */}
          <div
            className={`${styles.bottomUtilityBar} dish-progress-section`}
            aria-label="Experience progress"
          >
            <div className={styles.progressGroup}>
              <span
                className={`${styles.progressInstruction} ${
                  showScrollPrompt ? styles.progressInstructionVisible : ''
                }`}
                aria-live="polite"
              >
                Scroll to Move
              </span>
              <div className={styles.progressBarTrack} aria-hidden="true">
                <div ref={progressFillRef} className={styles.progressBarFill} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTIONS 02–11: Preserved Editorial Flow ── */}
      <SectionWrapper number="02" label="Names" hideBadge noAnimation>
        <Section02FoodNames />
      </SectionWrapper>
      <SectionWrapper number="03" label="Story" hideBadge noAnimation>
        <Section03PreparationStory />
      </SectionWrapper>
      <SectionWrapper number="04" label="Process" hideBadge noAnimation>
        <Section04StoryProgression />
      </SectionWrapper>
      <SectionWrapper number="05" label="Biryani" hideBadge noAnimation>
        <Section05BiryaniMask />
      </SectionWrapper>
      <SectionWrapper number="06" label="Reveal" hideBadge noAnimation>
        <Section06BiryaniReveal />
      </SectionWrapper>
      <SectionWrapper number="07" label="Spices" hideBadge noAnimation>
        <Section07Spices />
      </SectionWrapper>
      <SectionWrapper number="08" label="Menu" hideBadge>
        <Section08Menu />
      </SectionWrapper>
      <SectionWrapper number="09" label="Fire" hideBadge noAnimation>
        <Section09Fire />
      </SectionWrapper>
      <SectionWrapper number="10" label="Craft" hideBadge noAnimation>
        <Section10ButterGhee />
      </SectionWrapper>
      <SectionWrapper number="11" label="Finale" hideBadge noAnimation>
        <Section11LiftTheLid />
      </SectionWrapper>
    </>
  );
}
