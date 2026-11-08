/**
 * Five-dish data for Section 01 — Cinematic Scroll Experience.
 *
 * Designed to match the luxury editorial restaurant layout:
 * - Two-tone title: titleLine1 (white) + titleLine2 (gold italic)
 * - Large bottom display word (chunky retro/editorial serif)
 * - Category subtitle (e.g. SIGNATURE • DUM)
 * - Price & interactive button
 */

export const DISHES = [
  {
    id: 'dish-01',
    index: 0,
    label: '01',
    category: 'SIGNATURE • DUM',
    title: 'Chicken Dum Biryani',
    titleLine1: 'Chicken Dum',
    titleLine2: 'Biryani',
    displayWord: 'Biriyani',
    price: 'Rs. 1,850',
    description:
      'Bone-in chicken and saffron basmati, sealed under dough and slow-cooked for ninety minutes. Served with salan and raita.',
    // Note: exact filename has a trailing space
    videoSrc: '/videos/Chicken Biryani-60fps.mp4',
  },
  {
    id: 'dish-02',
    index: 1,
    label: '02',
    category: 'SIGNATURE • MAKHANI',
    title: 'Butter Chicken Makhani',
    titleLine1: 'Butter Chicken',
    titleLine2: 'Makhani',
    displayWord: 'Makhani',
    price: 'Rs. 1,650',
    description:
      'Succulent chicken enveloped in a silky tomato-based makhani sauce, enriched with butter, cream and warming aromatic spices.',
    videoSrc: '/videos/Butter Chicken Makhani-60fps.mp4',
  },
  {
    id: 'dish-03',
    index: 2,
    label: '03',
    category: 'TANDOOR • CHARCOAL',
    title: 'Chicken Tikka',
    titleLine1: 'Chicken',
    titleLine2: 'Tikka',
    displayWord: 'Tikka',
    price: 'Rs. 1,450',
    description:
      'Tender chicken marinated in yoghurt and fragrant spices, then roasted over intense heat for a beautifully charred finish.',
    videoSrc: '/videos/Chicken Tikka-60fps.mp4',
  },
  {
    id: 'dish-04',
    index: 3,
    label: '04',
    category: 'TANDOOR • CLAY OVEN',
    title: 'Garlic Butter Nan',
    titleLine1: 'Garlic Butter',
    titleLine2: 'Naan',
    displayWord: 'Naan',
    price: 'Rs. 350',
    description:
      'Freshly baked, soft naan finished with melted butter and aromatic garlic for a warm, golden and irresistible finish.',
    videoSrc: '/videos/Garlic Butter Nan-60fps.mp4',
  },
  {
    id: 'dish-05',
    index: 4,
    label: '05',
    category: 'CHILLED • REFRESHING',
    title: 'Mango Lassi',
    titleLine1: 'Mango',
    titleLine2: 'Lassi',
    displayWord: 'Lassi',
    price: 'Rs. 450',
    description:
      'A refreshing blend of ripe mangoes and creamy yoghurt, bringing a naturally sweet and cooling finish to the experience.',
    videoSrc: '/videos/Mango Lassi-60fps.mp4',
  },
];

export const DISH_COUNT = DISHES.length;
