import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.add('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    
    // Spectacular GSAP transition for the toggle
    gsap.timeline()
      .to(iconRef.current, {
        rotation: "+=180",
        scale: 0.5,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setIsDark(!isDark);
          if (newTheme === 'light') {
            document.documentElement.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
          } else {
            document.documentElement.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
          }
        }
      })
      .to(iconRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
      });
      
    // Animate the entire body background for an extra pop
    gsap.fromTo(document.body, 
      { backgroundColor: isDark ? '#ffffff' : '#0a0a0c' },
      { backgroundColor: isDark ? '#f8fafc' : '#0a0a0c', duration: 0.8, ease: "power3.out" }
    );
  };

  return (
    <button className={styles.toggleBtn} onClick={toggleTheme} aria-label="Toggle Theme">
      <div ref={iconRef} className={styles.iconContainer}>
        {isDark ? <Sun size={20} className="text-gradient" /> : <Moon size={20} className="text-gradient" />}
      </div>
    </button>
  );
};

export default ThemeToggle;
