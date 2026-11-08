import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Register GSAP plugins safely on client-side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

export { gsap, ScrollTrigger, SplitText };
export default gsap;
