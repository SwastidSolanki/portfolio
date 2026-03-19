import React, { useState, useEffect, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Music, Mail, Sun, Moon, GitBranch, Linkedin, Instagram, ArrowUp, Headphones } from 'lucide-react';
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from './BentoGrid.module.css';

const BentoGrid: React.FC = () => {
  const layouts = {
    lg: [
      { i: 'focus', x: 0, y: 0, w: 2, h: 1 },
      { i: 'gmail', x: 2, y: 0, w: 1, h: 1 },
      { i: 'theme', x: 3, y: 0, w: 1, h: 1 },
      { i: 'services', x: 0, y: 1, w: 2, h: 1 },
      { i: 'linkedin', x: 2, y: 1, w: 1, h: 1 },
      { i: 'insta', x: 3, y: 1, w: 1, h: 1 },
      { i: 'github', x: 0, y: 2, w: 2, h: 1 },
      { i: 'nft', x: 2, y: 2, w: 2, h: 2 },
      { i: 'simon', x: 0, y: 3, w: 2, h: 1 },
      { i: 'proj1', x: 0, y: 4, w: 1, h: 1 },
      { i: 'spotify', x: 1, y: 4, w: 1, h: 1 },
      { i: 'proj2', x: 2, y: 4, w: 1, h: 1 },
      { i: 'topbar', x: 3, y: 4, w: 1, h: 1 }
    ],
    md: [
      { i: 'focus', x: 0, y: 0, w: 2, h: 1 },
      { i: 'gmail', x: 2, y: 0, w: 1, h: 1 },
      { i: 'theme', x: 3, y: 0, w: 1, h: 1 },
      { i: 'services', x: 0, y: 1, w: 2, h: 1 },
      { i: 'linkedin', x: 2, y: 1, w: 1, h: 1 },
      { i: 'insta', x: 3, y: 1, w: 1, h: 1 },
      { i: 'github', x: 0, y: 2, w: 2, h: 1 },
      { i: 'nft', x: 2, y: 2, w: 2, h: 2 },
      { i: 'simon', x: 0, y: 3, w: 2, h: 1 },
      { i: 'proj1', x: 0, y: 4, w: 1, h: 1 },
      { i: 'spotify', x: 1, y: 4, w: 1, h: 1 },
      { i: 'proj2', x: 2, y: 4, w: 1, h: 1 },
      { i: 'topbar', x: 3, y: 4, w: 1, h: 1 }
    ],
    sm: [
      { i: 'focus', x: 0, y: 0, w: 2, h: 1 },
      { i: 'gmail', x: 0, y: 1, w: 1, h: 1 },
      { i: 'theme', x: 1, y: 1, w: 1, h: 1 },
      { i: 'services', x: 0, y: 2, w: 2, h: 2 },
      { i: 'linkedin', x: 0, y: 4, w: 1, h: 1 },
      { i: 'insta', x: 1, y: 4, w: 1, h: 1 },
      { i: 'github', x: 0, y: 5, w: 2, h: 1 },
      { i: 'spotify', x: 0, y: 6, w: 1, h: 1 },
      { i: 'proj1', x: 1, y: 6, w: 1, h: 1 },
      { i: 'proj2', x: 0, y: 7, w: 1, h: 1 },
      { i: 'topbar', x: 1, y: 7, w: 1, h: 1 },
      { i: 'nft', x: 0, y: 8, w: 2, h: 2 },
      { i: 'simon', x: 0, y: 10, w: 2, h: 1 }
    ],
    xs: [
      { i: 'focus', x: 0, y: 0, w: 1, h: 1 },
      { i: 'gmail', x: 0, y: 1, w: 1, h: 1 },
      { i: 'theme', x: 0, y: 2, w: 1, h: 1 },
      { i: 'services', x: 0, y: 3, w: 1, h: 2 },
      { i: 'linkedin', x: 0, y: 5, w: 1, h: 1 },
      { i: 'insta', x: 0, y: 6, w: 1, h: 1 },
      { i: 'github', x: 0, y: 7, w: 1, h: 1 },
      { i: 'spotify', x: 0, y: 8, w: 1, h: 1 },
      { i: 'nft', x: 0, y: 9, w: 1, h: 2 },
      { i: 'proj1', x: 0, y: 11, w: 1, h: 1 },
      { i: 'proj2', x: 0, y: 12, w: 1, h: 1 },
      { i: 'simon', x: 0, y: 13, w: 1, h: 1 },
      { i: 'topbar', x: 0, y: 14, w: 1, h: 1 }
    ],
    xxs: [
      { i: 'focus', x: 0, y: 0, w: 1, h: 1 },
      { i: 'gmail', x: 0, y: 1, w: 1, h: 1 },
      { i: 'theme', x: 0, y: 2, w: 1, h: 1 },
      { i: 'services', x: 0, y: 3, w: 1, h: 2 },
      { i: 'linkedin', x: 0, y: 5, w: 1, h: 1 },
      { i: 'insta', x: 0, y: 6, w: 1, h: 1 },
      { i: 'github', x: 0, y: 7, w: 1, h: 1 },
      { i: 'spotify', x: 0, y: 8, w: 1, h: 1 },
      { i: 'nft', x: 0, y: 9, w: 1, h: 2 },
      { i: 'proj1', x: 0, y: 11, w: 1, h: 1 },
      { i: 'proj2', x: 0, y: 12, w: 1, h: 1 },
      { i: 'simon', x: 0, y: 13, w: 1, h: 1 },
      { i: 'topbar', x: 0, y: 14, w: 1, h: 1 }
    ]
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains('light-theme'));
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('light-theme');
    setIsDark(!document.documentElement.classList.contains('light-theme'));
  };

  const goToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const gridProps: any = {
    className: "layout",
    layouts,
    width,
    breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},
    cols: {lg: 4, md: 4, sm: 2, xs: 1, xxs: 1},
    rowHeight: 160,
    containerPadding: [0, 0],
    margin: [24, 24],
    isDraggable: true,
    isResizable: true,
    isBounded: true,
    compactType: "horizontal",
    verticalCompact: true,
    useCSSTransforms: true
  };

  return (
    <section className={styles.bentoSection}>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>The <span className="text-gradient">Ecosystem</span></h2>
          <p className={styles.subtitle}>Drag, drop, and resize anywhere. A glimpse into my tools, projects, and workflow.</p>
        </div>

        <ResponsiveGridLayout {...gridProps}>
          {/* GitHub Contributions */}
          <div key="github" className={`${styles.card} ${styles.draggable}`}>
             <h3>GitHub Activity</h3>
             <div className={styles.calendarWrapper}>
               <GitHubCalendar 
                 username="SwastidSolanki" 
                 colorScheme="dark" 
                 blockSize={12} 
                 blockMargin={5} 
                 fontSize={12}
                 transformData={(contributions) => {
                   const today = new Date();
                   const past = new Date();
                   past.setMonth(today.getMonth() - 3);
                   return contributions.filter((act) => new Date(act.date) >= past);
                 }}
               />
             </div>
          </div>

          {/* Apple Music Player */}
          <div key="spotify" className={`${styles.card} ${styles.draggable} ${styles.spotifyCard}`}>
             <AppleMusicPlayer />
          </div>

          {/* Current Focus */}
          <div key="focus" className={`${styles.card} ${styles.draggable} ${styles.focusCard}`}>
             <div className={styles.focusHeader}>
               <GitBranch size={20} className={styles.focusIcon} />
               <span>Current Focus</span>
             </div>
             <h2 className={styles.focusTitle}>AWS<br/>Architecture</h2>
             <p className={styles.focusSub}>Data Engineering</p>
          </div>

          {/* Mail / Gmail Connect */}
          <div key="gmail" className={`${styles.card} ${styles.draggable} ${styles.socialMiniCard} ${styles.gmailBg}`}>
             <div className={styles.navLinkCenter}>
               <Mail size={48} className={styles.giantIconImage} />
             </div>
             <span className={styles.gmailLabel}>swastid03@gmail.com</span>
          </div>

          {/* Theme Toggle Module */}
          <div key="theme" className={`${styles.card} ${styles.draggable} ${styles.socialMiniCard} ${styles.themeModule}`} onClick={toggleTheme}>
             <div className={styles.navLinkCenter}>
               {isDark ? <Sun size={48} className={styles.giantIcon} /> : <Moon size={48} className={styles.giantIcon} />}
             </div>
          </div>

          {/* Services Offered Card */}
          <div key="services" className={`${styles.card} ${styles.draggable} ${styles.servicesCard}`}>
             <h3 className={styles.servicesTitle}>Services Offered / What I do</h3>
             <div className={styles.servicesSplit}>
               <div className={styles.serviceCol}>
                 <div className={styles.serviceIcons}>
                   <img src="https://simpleicons.org/icons/nextdotjs.svg" alt="Next" className={styles.serviceIcon} />
                   <img src="https://simpleicons.org/icons/react.svg" alt="React" className={styles.serviceIcon} />
                 </div>
                 <p className={styles.serviceLabel}>Product Engineering</p>
               </div>
               <div className={styles.serviceDivider}></div>
               <div className={styles.serviceCol}>
                 <div className={styles.serviceIcons}>
                   <img src="https://simpleicons.org/icons/nodedotjs.svg" alt="Node" className={styles.serviceIcon} />
                   <img src="https://simpleicons.org/icons/postgresql.svg" alt="PostgreSQL" className={styles.serviceIcon} />
                 </div>
                 <p className={styles.serviceLabel}>Full Stack Development</p>
               </div>
             </div>
          </div>

          {/* LinkedIn Connect */}
          <div key="linkedin" className={`${styles.card} ${styles.draggable} ${styles.socialMiniCard} ${styles.linkedinBg}`}>
             <div className={styles.navLinkCenter}>
               <Linkedin size={80} className={styles.giantIcon} />
               <a href="https://www.linkedin.com/in/swastidsolanki/" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnMini}>↗</a>
             </div>
          </div>

          {/* Instagram Connect */}
          <div key="insta" className={`${styles.card} ${styles.draggable} ${styles.socialMiniCard} ${styles.instaBg}`}>
             <div className={styles.navLinkCenter}>
               <Instagram size={80} className={styles.giantIcon} />
               <a href="https://instagram.com/swastidsolankii" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnMini}>↗</a>
             </div>
          </div>

          {/* Project 1 */}
          <div key="proj1" className={`${styles.card} ${styles.draggable} ${styles.projectCard}`} style={{backgroundImage: 'url(https://api.microlink.io/?url=https://weblogslive.vercel.app/&screenshot=true&meta=false&embed=screenshot.url)'}}>
             <div className={styles.projectOverlay}>
               <a href="https://weblogslive.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnProject}>↗</a>
               <div className={styles.projectMeta}>
                 <h3>Blog App</h3>
                 <p>Full-Stack Application</p>
               </div>
             </div>
          </div>

          {/* Project 2 */}
          <div key="proj2" className={`${styles.card} ${styles.draggable} ${styles.projectCard}`} style={{backgroundImage: 'url(https://api.microlink.io/?url=https://frontend-quiz-app-teal.vercel.app&screenshot=true&meta=false&embed=screenshot.url)'}}>
             <div className={styles.projectOverlay}>
               <a href="https://frontend-quiz-app-teal.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnProject}>↗</a>
               <div className={styles.projectMeta}>
                 <h3>Frontend Quiz</h3>
                 <p>Interactive UI / React</p>
               </div>
             </div>
          </div>

          {/* NFT Marketplace */}
          <div key="nft" className={`${styles.card} ${styles.draggable} ${styles.projectCard}`} style={{backgroundImage: 'url(https://api.microlink.io/?url=https://nft-marketplacemp.vercel.app&screenshot=true&meta=false&embed=screenshot.url)'}}>
             <div className={styles.projectOverlay}>
               <a href="https://nft-marketplacemp.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnProject}>↗</a>
               <div className={styles.projectMeta}>
                 <h3 className={styles.giantProjectTitle}>NFT Marketplace</h3>
                 <p>Web3 & Blockchain Full Scale Application</p>
               </div>
             </div>
          </div>

          {/* Simon Game */}
          <div key="simon" className={`${styles.card} ${styles.draggable} ${styles.projectCard}`} style={{backgroundImage: 'url(https://api.microlink.io/?url=https://thesimongame03.vercel.app/&screenshot=true&meta=false&embed=screenshot.url)'}}>
             <div className={styles.projectOverlay}>
               <a href="https://thesimongame03.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnProject}>↗</a>
               <div className={styles.projectMeta}>
                 <h3 className={styles.giantProjectTitle}>Simon Game</h3>
                 <p>Interactive Web Game</p>
               </div>
             </div>
          </div>

          {/* Top Bar Button */}
          <div key="topbar" className={`${styles.card} ${styles.draggable} ${styles.socialMiniCard} ${styles.themeModule}`} onClick={goToTop}>
             <div className={styles.navLinkCenter}>
               <ArrowUp size={48} className={styles.giantIcon} />
             </div>
          </div>

        </ResponsiveGridLayout>
      </div>
    </section>
  );
};

const AppleMusicPlayer = () => {
  return (
    <div className={styles.spotifyContent}>
      <div className={styles.appleActive}>
        <div className={styles.spotifyHeader}>
          <Music size={16} className={styles.appleText} />
          <span className={styles.playingText} style={{color: '#fa243c'}}>Currently Listening</span>
          <div className={styles.spotifyBars}>
            <span className={styles.bar1} style={{background: '#fa243c'}}></span>
            <span className={styles.bar2} style={{background: '#fa243c'}}></span>
            <span className={styles.bar3} style={{background: '#fa243c'}}></span>
          </div>
        </div>
        <div className={styles.spotifyInfo}>
          <div className={styles.albumArtProxy}>
            <Headphones size={28} color="#fa243c" />
          </div>
          <div className={styles.trackDetails}>
            <h4 className={styles.songTitle}>On Repeat</h4>
            <p className={styles.artistName}>Apple Music Playlist</p>
          </div>
          <a href="https://music.apple.com/in/playlist/onfrepeat/pl.u-oZyl3PluqZ7o3pP" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnApple}>↗</a>
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
