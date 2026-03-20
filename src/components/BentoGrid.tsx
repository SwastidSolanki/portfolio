import React, { useEffect, useRef, useState } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Music, Mail, GitBranch, Linkedin, Instagram, ArrowUp, Headphones } from 'lucide-react';
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from './BentoGrid.module.css';

const BentoGrid: React.FC = () => {
  const layouts = {
    lg: [
      { i: 'focus', x: 0, y: 0, w: 3, h: 2 },
      { i: 'spotify', x: 3, y: 0, w: 3, h: 2 },
      { i: 'gmail', x: 6, y: 0, w: 2, h: 2 },
      { i: 'insta', x: 8, y: 0, w: 2, h: 2 },
      
      { i: 'services', x: 0, y: 2, w: 6, h: 2 },
      { i: 'linkedin', x: 6, y: 2, w: 2, h: 2 },
      { i: 'topbar', x: 8, y: 2, w: 2, h: 2 },

      { i: 'nft', x: 0, y: 4, w: 6, h: 4 },
      { i: 'github', x: 6, y: 4, w: 4, h: 2 },
      { i: 'proj2', x: 6, y: 6, w: 4, h: 3 },
      { i: 'simon', x: 0, y: 8, w: 6, h: 4 },
      { i: 'proj1', x: 6, y: 9, w: 4, h: 3 }
    ],
    md: [
      { i: 'focus', x: 0, y: 0, w: 3, h: 2 },
      { i: 'spotify', x: 3, y: 0, w: 3, h: 2 },
      { i: 'gmail', x: 6, y: 0, w: 2, h: 2 },
      { i: 'insta', x: 8, y: 0, w: 2, h: 2 },
      
      { i: 'services', x: 0, y: 2, w: 6, h: 2 },
      { i: 'linkedin', x: 6, y: 2, w: 2, h: 2 },
      { i: 'topbar', x: 8, y: 2, w: 2, h: 2 },

      { i: 'nft', x: 0, y: 4, w: 6, h: 4 },
      { i: 'github', x: 6, y: 4, w: 4, h: 2 },
      { i: 'proj2', x: 6, y: 6, w: 4, h: 3 },
      { i: 'simon', x: 0, y: 8, w: 6, h: 4 },
      { i: 'proj1', x: 6, y: 9, w: 4, h: 3 }
    ],
    sm: [
      { i: 'focus', x: 0, y: 0, w: 1, h: 1 },
      { i: 'spotify', x: 0, y: 1, w: 1, h: 1 },
      { i: 'gmail', x: 0, y: 2, w: 1, h: 1 },
      { i: 'insta', x: 0, y: 3, w: 1, h: 1 },
      { i: 'services', x: 0, y: 4, w: 1, h: 2 },
      { i: 'linkedin', x: 0, y: 6, w: 1, h: 1 },
      { i: 'simon', x: 0, y: 7, w: 1, h: 1 },
      { i: 'github', x: 0, y: 8, w: 1, h: 1 },
      { i: 'nft', x: 0, y: 9, w: 1, h: 2 },
      { i: 'proj2', x: 0, y: 11, w: 1, h: 1 },
      { i: 'proj1', x: 0, y: 12, w: 1, h: 1 }
    ],
    xs: [
      { i: 'focus', x: 0, y: 0, w: 1, h: 1 },
      { i: 'spotify', x: 0, y: 1, w: 1, h: 1 },
      { i: 'gmail', x: 0, y: 2, w: 1, h: 1 },
      { i: 'insta', x: 0, y: 3, w: 1, h: 1 },
      { i: 'services', x: 0, y: 4, w: 1, h: 2 },
      { i: 'linkedin', x: 0, y: 6, w: 1, h: 1 },
      { i: 'simon', x: 0, y: 7, w: 1, h: 1 },
      { i: 'github', x: 0, y: 8, w: 1, h: 1 },
      { i: 'nft', x: 0, y: 9, w: 1, h: 2 },
      { i: 'proj2', x: 0, y: 11, w: 1, h: 1 },
      { i: 'proj1', x: 0, y: 12, w: 1, h: 1 }
    ],
    xxs: [
      { i: 'focus', x: 0, y: 0, w: 1, h: 1 },
      { i: 'spotify', x: 0, y: 1, w: 1, h: 1 },
      { i: 'gmail', x: 0, y: 2, w: 1, h: 1 },
      { i: 'insta', x: 0, y: 3, w: 1, h: 1 },
      { i: 'services', x: 0, y: 4, w: 1, h: 2 },
      { i: 'linkedin', x: 0, y: 6, w: 1, h: 1 },
      { i: 'simon', x: 0, y: 7, w: 1, h: 1 },
      { i: 'github', x: 0, y: 8, w: 1, h: 1 },
      { i: 'nft', x: 0, y: 9, w: 1, h: 2 },
      { i: 'proj2', x: 0, y: 11, w: 1, h: 1 },
      { i: 'proj1', x: 0, y: 12, w: 1, h: 1 }
    ]
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [isDark, setIsDark] = useState(true);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial checks
    setIsDark(!document.documentElement.classList.contains('light-theme'));
    
    const checkTouch = () => {
      const isTouchCapability = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
      const isMobileWidth = window.innerWidth <= 768;
      // We consider it a "touch-oriented" view if it has touch capability OR is mobile-sized
      return isTouchCapability || isMobileWidth;
    };
    
    const updateState = () => {
      setIsTouch(checkTouch());
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateState();
    window.addEventListener('resize', updateState);

    // Theme listener
    const themeObserver = new MutationObserver(() => {
      setIsDark(!document.documentElement.classList.contains('light-theme'));
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('resize', updateState);
      themeObserver.disconnect();
    };
  }, []);

  const goToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const isMobile = width <= 768;
  const rowHeight = isMobile ? 180 : 116;

  const gridProps: any = {
    className: "layout",
    layouts,
    width,
    breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},
    cols: {lg: 10, md: 10, sm: 1, xs: 1, xxs: 1},
    rowHeight,
    containerPadding: [0, 0],
    margin: [16, 16],
    isDraggable: !isMobile,
    isResizable: !isMobile,
    isBounded: true,
    compactType: "vertical",
    verticalCompact: true,
    useCSSTransforms: true
  };

  return (
    <section className={styles.bentoSection} data-touch={isTouch}>
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
                 colorScheme={isDark ? "dark" : "light"} 
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
          <div 
            key="gmail" 
            className={`${styles.card} ${styles.draggable} ${styles.socialMiniCard} ${styles.gmailBg}`}
            onClick={() => isTouch && (window.location.href = 'mailto:swastid03@gmail.com')}
          >
             {!isTouch && <a href="mailto:swastid03@gmail.com" className={styles.redirectBtnMini}>↗</a>}
             <div className={styles.navLinkCenter}>
               <Mail size={48} className={styles.giantIconImage} />
             </div>
             <span className={styles.gmailLabel}>swastid03@gmail.com</span>
          </div>



          {/* Services Offered Card */}
          <div key="services" className={`${styles.card} ${styles.draggable} ${styles.servicesCard}`}>
             <h3 className={styles.servicesTitle}>Services Offered / What I do</h3>
             <div className={styles.servicesSplit}>
               <div className={styles.serviceCol}>
                  <div className={styles.serviceIcons}>
                    <img src="https://cdn.simpleicons.org/nextdotjs/white" alt="Next" className={styles.serviceIconNext} />
                    <img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" className={styles.serviceIcon} />
                  </div>
                  <p className={styles.serviceLabel}>Product Engineering</p>
                </div>
                <div className={styles.serviceDivider}></div>
                <div className={styles.serviceCol}>
                  <div className={styles.serviceIcons}>
                    <img src="https://cdn.simpleicons.org/nodedotjs/339933" alt="Node" className={styles.serviceIcon} />
                    <img src="https://cdn.simpleicons.org/postgresql/4169E1" alt="PostgreSQL" className={styles.serviceIcon} />
                  </div>
                 <p className={styles.serviceLabel}>Full Stack Development</p>
               </div>
             </div>
          </div>

          {/* LinkedIn Connect */}
          <div 
            key="linkedin" 
            className={`${styles.card} ${styles.draggable} ${styles.socialMiniCard} ${styles.linkedinBg}`}
            onClick={() => isTouch && window.open('https://www.linkedin.com/in/swastidsolanki/', '_blank')}
          >
             {!isTouch && <a href="https://www.linkedin.com/in/swastidsolanki/" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnMini}>↗</a>}
             <div className={styles.navLinkCenter}>
               <Linkedin size={80} className={styles.giantIcon} />
             </div>
          </div>

          {/* Instagram Connect */}
          <div 
            key="insta" 
            className={`${styles.card} ${styles.draggable} ${styles.socialMiniCard} ${styles.instaBg}`}
            onClick={() => isTouch && window.open('https://instagram.com/swastidsolankii', '_blank')}
          >
             {!isTouch && <a href="https://instagram.com/swastidsolankii" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnMini}>↗</a>}
             <div className={styles.navLinkCenter}>
               <Instagram size={80} className={styles.giantIcon} />
             </div>
          </div>

          {/* Project 1 */}
          <div 
             key="proj1" 
             className={`${styles.card} ${styles.draggable} ${styles.projectCard}`} 
             style={{backgroundImage: 'url(https://api.microlink.io/?url=https://weblogslive.vercel.app/&screenshot=true&meta=false&embed=screenshot.url)'}}
             onClick={() => isTouch && window.open('https://weblogslive.vercel.app/', '_blank')}
          >
             {!isTouch && <a href="https://weblogslive.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnProject}>↗</a>}
             <div className={styles.projectOverlay}>
               <div className={styles.projectMeta}>
                 <h3>Blog App</h3>
                 <p>Full-Stack Application</p>
               </div>
             </div>
          </div>

          {/* Project 2 */}
          <div 
             key="proj2" 
             className={`${styles.card} ${styles.draggable} ${styles.projectCard}`} 
             style={{backgroundImage: 'url(https://api.microlink.io/?url=https://frontend-quiz-app-teal.vercel.app&screenshot=true&meta=false&embed=screenshot.url)'}}
             onClick={() => isTouch && window.open('https://frontend-quiz-app-teal.vercel.app', '_blank')}
          >
             {!isTouch && <a href="https://frontend-quiz-app-teal.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnProject}>↗</a>}
             <div className={styles.projectOverlay}>
               <div className={styles.projectMeta}>
                 <h3>Frontend Quiz</h3>
                 <p>Interactive UI / React</p>
               </div>
             </div>
          </div>

          {/* NFT Marketplace */}
          <div 
             key="nft" 
             className={`${styles.card} ${styles.draggable} ${styles.projectCard}`} 
             style={{backgroundImage: 'url(https://api.microlink.io/?url=https://nft-marketplacemp.vercel.app&screenshot=true&meta=false&embed=screenshot.url)'}}
             onClick={() => isTouch && window.open('https://nft-marketplacemp.vercel.app', '_blank')}
          >
             {!isTouch && <a href="https://nft-marketplacemp.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnProject}>↗</a>}
             <div className={styles.projectOverlay}>
               <div className={styles.projectMeta}>
                 <h3 className={styles.giantProjectTitle}>NFT Marketplace</h3>
                 <p>Web3 & Blockchain Full Scale Application</p>
               </div>
             </div>
          </div>

          {/* Simon Game */}
          <div 
             key="simon" 
             className={`${styles.card} ${styles.draggable} ${styles.projectCard}`} 
             style={{backgroundImage: 'url(https://api.microlink.io/?url=https://thesimongame03.vercel.app/&screenshot=true&meta=false&embed=screenshot.url)'}}
             onClick={() => isTouch && window.open('https://thesimongame03.vercel.app/', '_blank')}
          >
             {!isTouch && <a href="https://thesimongame03.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnProject}>↗</a>}
             <div className={styles.projectOverlay}>
               <div className={styles.projectMeta}>
                 <h3 className={styles.giantProjectTitle}>Simon Game</h3>
                 <p>Interactive Web Game</p>
               </div>
             </div>
          </div>

          {/* Topbar/Arrow Card - Desktop Only */}
          {width > 768 && (
            <div 
              key="topbar" 
              className={`${styles.card} ${styles.draggable} ${styles.topbarCard}`} 
              onClick={goToTop}
            >
              <div className={styles.navLinkCenter}>
                <ArrowUp size={48} className={styles.topbarIcon} />
              </div>
            </div>
          )}

          {/* Connect Cards */}
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
