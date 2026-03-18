import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
  const comp = useRef(null);

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
            <span className="title-word">Turning</span>
            <span className="title-word">Ideas</span>
          </div>
          <div className={styles.line}>
            <span className="title-word">Into</span>
            <span className={`title-word text-gradient ${styles.italic}`}>Reality.</span>
          </div>
        </h1>
        
        <p className={`hero-sub ${styles.subtitle}`}>
          Creative Developer specializing in interactive web experiences, 
          WebGL, and award-winning animations.
        </p>
      </div>

      <motion.div 
        className={styles.shapes}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
      >
        <motion.div 
          className={styles.shape1}
          animate={{ 
            y: [0, -40, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className={styles.shape2}
          animate={{ 
            y: [0, 40, 0],
            rotate: [0, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10, 
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>

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
