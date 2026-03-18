import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Pinning the about section left side while scrolling the right side
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=50%",
        pin: ".about-left",
        pinSpacing: false
      });

      // Staggered text reveal for about paragraph
      const lines = gsap.utils.toArray('.about-line');
      lines.forEach((line: any) => {
        gsap.fromTo(line, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: line,
              start: "top 80%",
            }
          }
        );
      });
      
    }, container);
    
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className={styles.about} ref={container}>
      <div className={`about-left ${styles.left}`}>
        <h2>Who <br/> I <span className="text-gradient">Am</span></h2>
      </div>
      <div className={styles.right}>
        <div className={styles.textBlock}>
          <div className={styles.lineOverflow}><p className="about-line">I am a passionate creative developer</p></div>
          <div className={styles.lineOverflow}><p className="about-line">who lives at the intersection of</p></div>
          <div className={styles.lineOverflow}><p className="about-line">design and technology. I build</p></div>
          <div className={styles.lineOverflow}><p className="about-line">immersive web experiences that</p></div>
          <div className={styles.lineOverflow}><p className="about-line text-gradient">leave a lasting impression.</p></div>
        </div>
        
        <div className={styles.stats}>
          <div className="about-line">
            <h3>5+</h3>
            <p>Years Experience</p>
          </div>
          <div className="about-line">
            <h3>40+</h3>
            <p>Projects Launched</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
