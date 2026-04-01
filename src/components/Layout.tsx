import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp } from 'lucide-react';
import Navbar from './Navbar';
import Cursor from './Cursor';

gsap.registerPlugin(ScrollTrigger);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update();
      if (e.scroll > 500) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains('secret-active')) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      lenis.destroy();
      observer.disconnect();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Cursor />
      <Navbar />
      <main>{children}</main>
      <button 
        className={`scrollTopBtn ${showTopBtn ? 'visible' : ''}`}
        onClick={goToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
    </>
  );
};

export default Layout;
