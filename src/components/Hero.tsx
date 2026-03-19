import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import ThreeBackground from './ThreeBackground';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
  const comp = useRef(null);
  const [showBlob, setShowBlob] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setShowBlob(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".title-word", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2
      })
        .from(".hero-sub", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        .from(".scroll-indicator", {
          opacity: 0,
          y: -10,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.4");

    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={comp}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <div className={styles.line}>
            <span className="title-word">Swastid</span>
            <span className="title-word">Solanki</span>
          </div>
          <div className={styles.line}>
            <span className="title-word">Data &</span>
            <span className={`title-word text-gradient ${styles.italic}`}>AWS.</span>
          </div>
        </h1>

        <p className={`hero-sub ${styles.subtitle}`}>
          Passionate about ThreeJS, GSAP, Automation, Python, Data Engineering, Data Visualization, ETL Pipelines,
          Cloud Infrastructure, and building
          scalable solutions on AWS.
        </p>
      </div>

      {showBlob && <ThreeBackground />}

      <div className={`scroll-indicator ${styles.scroll}`}>
        <span>Scroll</span>
        <div className={styles.scrollLine}>
          <motion.div
            className={styles.scrollDot}
            animate={{ y: [0, 50, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
