/**
 * Menu data for Section 08 — The Whole Table and Categorised Menu.
 * Formatted with Pakistani Rupees (Rs.).
 */

// Section 08.1 — The Whole Table
export const WHOLE_TABLE_DISHES = [
  {
    id: 'menu-01',
    number: '01',
    title: 'Chicken Dum Biryani',
    description: 'Slow-cooked over an open flame, sealed with dough.',
    price: 'Rs. 1,800',
  },
  {
    id: 'menu-02',
    number: '02',
    title: 'Butter Chicken',
    description: 'Char-grilled, simmered in a velvety tomato cream.',
    price: 'Rs. 1,600',
  },
  {
    id: 'menu-03',
    number: '03',
    title: 'Tandoori Chicken',
    description: 'Marinated overnight, fired at high heat.',
    price: 'Rs. 1,500',
  },
  {
    id: 'menu-04',
    number: '04',
    title: 'Lamb Seekh Kebab',
    description: 'Hand-minced with caramelised onion and coriander.',
    price: 'Rs. 1,700',
  },
  {
    id: 'menu-05',
    number: '05',
    title: 'Paneer Tikka',
    description: 'Pressed cottage cheese with charred green pepper.',
    price: 'Rs. 1,300',
  },
  {
    id: 'menu-06',
    number: '06',
    title: 'Dal Makhani',
    description: 'Black lentils, slow-stirred for eighteen hours.',
    price: 'Rs. 1,100',
  },
  {
    id: 'menu-07',
    number: '07',
    title: 'Garlic Butter Naan',
    description: 'Hand-stretched, blistered in the tandoor.',
    price: 'Rs. 400',
  },
];

// Section 08.2 — Categorised Menu
export const CATEGORIES = [
  {
    id: 'biryani',
    label: 'Biryani',
    items: [
      { title: 'Chicken Dum Biryani', description: 'Slow-cooked, sealed with dough', price: 'Rs. 1,800' },
      { title: 'Lamb Biryani', description: 'Bone-in, aged basmati', price: 'Rs. 2,100' },
      { title: 'Prawn Biryani', description: 'Coastal spice, saffron rice', price: 'Rs. 2,200' },
      { title: 'Vegetable Biryani', description: 'Seven seasonal vegetables', price: 'Rs. 1,400' },
    ],
  },
  {
    id: 'tandoor',
    label: 'Tandoor',
    items: [
      { title: 'Tandoori Chicken', description: 'Marinated overnight', price: 'Rs. 1,500' },
      { title: 'Lamb Seekh Kebab', description: 'Hand-minced with coriander', price: 'Rs. 1,700' },
      { title: 'Paneer Tikka', description: 'Charred green pepper', price: 'Rs. 1,300' },
      { title: 'Chicken Tikka', description: 'Yoghurt and rose marinade', price: 'Rs. 1,400' },
    ],
  },
  {
    id: 'curries',
    label: 'Curries',
    items: [
      { title: 'Butter Chicken', description: 'Velvety tomato cream', price: 'Rs. 1,600' },
      { title: 'Dal Makhani', description: 'Eighteen-hour slow-stirred', price: 'Rs. 1,100' },
      { title: 'Rogan Josh', description: 'Kashmiri lamb, whole spice', price: 'Rs. 1,900' },
      { title: 'Palak Paneer', description: 'Fresh spinach, cottage cheese', price: 'Rs. 1,300' },
    ],
  },
  {
    id: 'breads',
    label: 'Breads',
    items: [
      { title: 'Garlic Butter Naan', description: 'Blistered in the tandoor', price: 'Rs. 400' },
      { title: 'Laccha Paratha', description: 'Flaky layered flatbread', price: 'Rs. 350' },
      { title: 'Peshwari Naan', description: 'Coconut and almond filling', price: 'Rs. 450' },
      { title: 'Tandoori Roti', description: 'Whole wheat, tandoor-fired', price: 'Rs. 300' },
    ],
  },
  {
    id: 'sides',
    label: 'Sides',
    items: [
      { title: 'Raita', description: 'Cucumber, mint, cumin', price: 'Rs. 300' },
      { title: 'Pickled Onions', description: 'Kachumber salad', price: 'Rs. 300' },
      { title: 'Papadum', description: 'With tamarind chutney', price: 'Rs. 250' },
      { title: 'Basmati Rice', description: 'Aged, steamed plain', price: 'Rs. 350' },
    ],
  },
  {
    id: 'drinks',
    label: 'Drinks',
    items: [
      { title: 'Mango Lassi', description: 'Chilled, hand-blended', price: 'Rs. 500' },
      { title: 'Masala Chai', description: 'Ginger, cardamom, milk', price: 'Rs. 350' },
      { title: 'Rose Sharbat', description: 'Chilled, with sabja seeds', price: 'Rs. 400' },
      { title: 'Still Water', description: '500ml', price: 'Rs. 200' },
    ],
  },
];
