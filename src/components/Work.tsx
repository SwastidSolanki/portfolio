import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import styles from './Work.module.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: 1, title: 'Ethereal', category: 'WebGL Experience' },
  { id: 2, title: 'Velocity', category: 'E-Commerce Platform' },
  { id: 3, title: 'Aura', category: 'Brand Identity & Web' },
  { id: 4, title: 'Nexus', category: 'SaaS Application' }
];

const Work: React.FC = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.work-card');
      
      cards.forEach((card: any) => {
        gsap.fromTo(card, 
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
        
        const img = card.querySelector('.parallax-img');
        if(img) {
          gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        }
      });
    }, container);
    
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className={styles.work} ref={container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Selected <span className="text-gradient">Works</span></h2>
        <p className={styles.subtitle}>A collection of recent projects pushing the boundaries of interactive design.</p>
      </div>

      <div className={styles.grid}>
        {projects.map((project, index) => (
          <motion.div 
            key={project.id}
            className={`work-card hover-target ${styles.card}`}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className={styles.imageContainer}>
              <div 
                className={`parallax-img ${styles.image}`} 
                style={{
                  background: `linear-gradient(${120 + index * 40}deg, var(--accent-${(index % 2) + 1}), var(--bg-primary))`
                }}
              />
              <div className={styles.overlay}>
                <span>View Project</span>
              </div>
            </div>
            <div className={styles.meta}>
              <h3>{project.title}</h3>
              <p>{project.category}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Work;
