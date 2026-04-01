import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains('light-theme'));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('light-theme');
    setIsDark(!document.documentElement.classList.contains('light-theme'));
  };

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.logo}>
        <span className="text-gradient hover-target">Swastid!</span>
      </div>
      <div className={styles.rightContent}>
        <ul className={styles.links}>
          <li><a href="#about" className="hover-target">About</a></li>
          <li><a href="#experience" className="hover-target">Experience</a></li>
          <li><a href="#ecosystem" className="hover-target">Ecosystem</a></li>
        </ul>
        <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme" style={{ display: 'none' }}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
