'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { WHOLE_TABLE_DISHES, CATEGORIES } from '@/data/menu';
import styles from './Section08Menu.module.css';

/**
 * Section 08 — The Whole Table and Categorised Menu
 *
 * 08.1: The Whole Table — editorial two-column menu layout, gold scroll highlight.
 * 08.2: Categorised Menu — 6 category buttons, 2-column dish list, client-side switching.
 */
export default function Section08Menu() {
  const sectionRef = useRef(null);
  const tableRef = useRef(null);
  const catMenuRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('biryani');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // ── 08.1 Whole Table: subtle stagger entrance reveal without auto-highlight ──
      const rows = section.querySelectorAll('[data-menu-row]');
      if (rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: tableRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // ── 08.2 Category Menu: section reveal ──
      if (catMenuRef.current) {
        gsap.fromTo(
          catMenuRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: catMenuRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const activeCategoryData = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Full menu">
      {/* ── 08.1 THE WHOLE TABLE ── */}
      <div ref={tableRef} className={styles.wholeTable}>
        <div className={styles.tableHeader}>
          <p className={styles.tableLabel}>The Whole Table</p>
          <h2 className={styles.tableHeadline}>
            Everything we serve. <em>Nothing held back.</em>
          </h2>
        </div>

        <div className={styles.tableGrid}>
          {/* Left: dish list */}
          <ul className={styles.dishList} aria-label="Menu dishes">
            {WHOLE_TABLE_DISHES.map((dish, i) => {
              const isHighlighted = hoveredIndex === i;
              return (
                <li
                  key={dish.id}
                  className={`${styles.dishRow} ${isHighlighted ? styles.dishRowActive : ''}`}
                  data-menu-row
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className={styles.dishNum}>{dish.number}</span>
                  <span className={styles.dishTitle}>{dish.title}</span>
                </li>
              );
            })}
          </ul>

          {/* Right: aligned descriptions + prices */}
          <ul className={styles.descList} aria-label="Dish descriptions">
            {WHOLE_TABLE_DISHES.map((dish, i) => {
              const isHighlighted = hoveredIndex === i;
              return (
                <li
                  key={dish.id}
                  className={`${styles.descRow} ${isHighlighted ? styles.descRowActive : ''}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className={styles.descText}>{dish.description}</span>
                  <span className={styles.descPrice}>{dish.price}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ── 08.2 CATEGORISED MENU ── */}
      <div ref={catMenuRef} className={styles.catMenu} aria-label="Menu by category">
        <div className={styles.catHeader}>
          <p className={styles.catLabel}>Browse by Category</p>
        </div>

        {/* Category buttons */}
        <div className={styles.catButtons} role="tablist" aria-label="Menu categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catBtnActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Two-column item list */}
        <div className={styles.catItems} role="tabpanel" aria-label={activeCategoryData.label}>
          {activeCategoryData.items.map((item, i) => (
            <div key={i} className={styles.catItem}>
              <div className={styles.catItemLeft}>
                <span className={styles.catItemTitle}>{item.title}</span>
                <span className={styles.catItemDesc}>{item.description}</span>
              </div>
              <span className={styles.catItemPrice}>{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

