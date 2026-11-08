'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import styles from './Section04StoryProgression.module.css';

/**
 * Section 04 — Five-Dish Cinematic Horizontal Process Sequence
 *
 * Architecture & Design:
 * - Single unified horizontal track containing:
 *   1. Left editorial intro block ("Ninety minutes you will never see us skip")
 *   2. Exactly FIVE vertical portrait video cards featuring the 5 signature dishes
 * - The entire composition moves together from right to left as the user scrolls vertically.
 * - The left text moves left and exits the viewport as the cards glide across.
 * - The horizontal movement finishes precisely when Card 5 reaches its natural position
 *   on the right side of the screen. Zero excess travel, zero black empty space.
 * - Clean GSAP + ScrollTrigger architecture with 1:1 scroll synchronization.
 */

const PROCESS_DISHES = [
  {
    id: 'dish-card-01',
    step: '01',
    title: 'Chicken Biryani',
    description:
      'Bone-in chicken and saffron basmati, sealed under dough and slow-cooked for ninety minutes.',
    videoSrc: '/videos/Chicken Biryani-60fps.mp4',
  },
  {
    id: 'dish-card-02',
    step: '02',
    title: 'Butter Chicken Makhani',
    description:
      'Succulent chicken enveloped in a silky tomato makhani sauce, enriched with butter and cream.',
    videoSrc: '/videos/Butter Chicken Makhani-60fps.mp4',
  },
  {
    id: 'dish-card-03',
    step: '03',
    title: 'Chicken Tikka',
    description:
      'Tender chicken marinated in yoghurt and fragrant spices, roasted over charcoal heat.',
    videoSrc: '/videos/Chicken Tikka-60fps.mp4',
  },
  {
    id: 'dish-card-04',
    step: '04',
    title: 'Garlic Butter Nan',
    description:
      'Freshly baked, soft tandoor naan finished with melted butter and aromatic roasted garlic.',
    videoSrc: '/videos/Garlic Butter Nan-60fps.mp4',
  },
  {
    id: 'dish-card-05',
    step: '05',
    title: 'Mango Lassi',
    description:
      'A refreshing blend of ripe Alphonso mangoes and thick creamy yoghurt, chilled to perfection.',
    videoSrc: '/videos/Mango Lassi-60fps.mp4',
  },
];

export default function Section04StoryProgression() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let ctx = null;

    ctx = gsap.context(() => {
      // Calculate exact travel distance needed:
      // When x = -(track.scrollWidth - window.innerWidth), Card 5 sits naturally
      // on the right side of the viewport. We add a subtle padding buffer (40-60px)
      // so Card 5 is framed comfortably with space on its right edge.
      const getTravelDistance = () => {
        const vpWidth = window.innerWidth;
        const trackWidth = track.scrollWidth;
        const buffer = Math.min(vpWidth * 0.04, 60);
        return Math.max(0, trackWidth - vpWidth + buffer);
      };

      // Animate the entire track (intro text + all 5 cards) horizontally to the left
      gsap.to(track, {
        x: () => -getTravelDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          // The vertical scroll runway precisely matches the horizontal travel distance:
          // 1:1 scroll-to-travel ratio means natural, smooth speed and ZERO dead black space
          end: () => `+=${getTravelDistance()}`,
          pin: true,
          scrub: 1.0,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Five Dish Preparation Process"
    >
      {/* The Unified Horizontal Travelling Composition */}
      <div ref={trackRef} className={styles.track}>
        {/* 1. Left Editorial Intro Block (moves with the track) */}
        <div className={styles.introBlock}>
          <h2 className={styles.introHeading}>
            Ninety minutes
            <span className={styles.introHeadingGold}>
              {' '}
              you will <em>never</em>
            </span>
            <br />
            see us skip.
          </h2>
          <p className={styles.introDescription}>
            Scroll sideways through the handi. This is the whole method — no
            shortcuts, no pressure cookers, no reheated pots.
          </p>
        </div>

        {/* 2. The Five Video Cards */}
        {PROCESS_DISHES.map((dish) => (
          <div key={dish.id} className={styles.card}>
            <div className={styles.videoWrapper}>
              <video
                src={encodeURI(dish.videoSrc)}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className={styles.cardVideo}
              />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardHeader}>
                <span className={styles.cardStep}>{dish.step}</span>
                <div className={styles.cardTitleRow}>
                  <h3 className={styles.cardTitle}>{dish.title}</h3>
                  <span className={styles.cardHindi}>{dish.hindi}</span>
                </div>
              </div>
              <p className={styles.cardDescription}>{dish.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
