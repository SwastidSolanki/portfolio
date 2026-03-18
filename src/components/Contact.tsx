import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import styles from './Contact.module.css';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".contact-char", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".contact-title",
          start: "top 80%",
        }
      });
    }, container);
    
    return () => ctx.revert();
  }, []);

  const text = "Let's Talk";

  return (
    <section id="contact" className={styles.contact} ref={container}>
      <div className={styles.content}>
        <h2 className={`contact-title ${styles.title}`}>
          {text.split('').map((char, i) => (
            <span key={i} className={`contact-char ${char === ' ' ? styles.space : ''}`}>
              {char}
            </span>
          ))}
        </h2>
        
        <p className={styles.subtitle}>
          Ready to create something spectacular? Get in touch and let's make it happen.
        </p>

        <motion.a 
          href="mailto:hello@example.com"
          className={`hover-target ${styles.button}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send a Message
          <div className={styles.btnBg}></div>
        </motion.a>
      </div>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        <div className={styles.socials}>
          <a href="#" className="hover-target">Twitter</a>
          <a href="#" className="hover-target">LinkedIn</a>
          <a href="#" className="hover-target">GitHub</a>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
