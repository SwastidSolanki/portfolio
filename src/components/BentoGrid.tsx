import React, { useEffect, useRef, useState } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Music, Mail, GitBranch, Linkedin, Instagram, Headphones, FileText, Download, Github, Loader2 } from 'lucide-react';
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from './BentoGrid.module.css';
import ResumePDF from '../assets/Swastidresume.pdf';

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  homepage: string;
  html_url: string;
}

const BentoGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [isDark, setIsDark] = useState(true);
  const [isTouch, setIsTouch] = useState(false);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

    // Fetch dynamic project repositories
    const fetchRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/users/SwastidSolanki/repos?sort=pushed&per_page=100');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Keep only repos containing a valid homepage deployed link (exclude portfolio itself)
          const validRepos = data.filter((r: any) => 
            r.homepage && 
            r.homepage.startsWith('http') &&
            !r.name.toLowerCase().includes('portfolio') &&
            !r.name.toLowerCase().includes('solanki')
          );
          setRepos(validRepos);
        }
      } catch (err) {
        console.error("Error fetching github repos", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();

    return () => {
      window.removeEventListener('resize', updateState);
      themeObserver.disconnect();
    };
  }, []);

 
  const isMobile = width <= 768;
  const rowHeight = isMobile ? 180 : 116;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = ResumePDF;
    link.download = 'Swastid_Solanki_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const baseLayoutsLgMd = [
    { i: 'focus', x: 0, y: 0, w: 3, h: 2 },
    { i: 'spotify', x: 3, y: 0, w: 3, h: 2 },
    { i: 'gmail', x: 6, y: 0, w: 2, h: 2 },
    { i: 'insta', x: 8, y: 0, w: 2, h: 2 },
    { i: 'services', x: 0, y: 2, w: 6, h: 2 },
    { i: 'linkedin', x: 6, y: 2, w: 2, h: 2 },
    { i: 'resume', x: 8, y: 2, w: 2, h: 2 },
    { i: 'github', x: 6, y: 4, w: 4, h: 2 }
  ];

  // Dynamic Algorithmic layout builder matching visual ratios
  const dynamicLayouts = repos.map((repo, i) => {
    const id = `repo-${repo.id}`;
    if (i === 0) return { i: id, x: 0, y: 4, w: 6, h: 6 };
    if (i === 1) return { i: id, x: 6, y: 6, w: 4, h: 4 };
    
    // Group remaining projects into pairs matching 3:2 column scale
    const p = Math.floor((i - 2) / 2);
    const yCoord = 10 + p * 4;
    return i % 2 === 0 
      ? { i: id, x: 0, y: yCoord, w: 6, h: 4 }
      : { i: id, x: 6, y: yCoord, w: 4, h: 4 };
  });

  const layouts = {
    lg: [...baseLayoutsLgMd, ...dynamicLayouts],
    md: [...baseLayoutsLgMd, ...dynamicLayouts],
  };

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

  const renderContent = () => {
    const baseCards = [
      {
        key: 'focus',
        content: (
           <div className={`${styles.card} ${styles.focusCard}`}>
             <div className={styles.focusHeader}>
               <GitBranch size={20} className={styles.focusIcon} />
               <span>Current Focus</span>
             </div>
             <h2 className={styles.focusTitle}>AWS<br/>Architecture</h2>
             <p className={styles.focusSub}>Data Engineering</p>
           </div>
         )
       },
       {
         key: 'spotify',
         content: (
           <div className={`${styles.card} ${styles.spotifyCard}`}>
             <AppleMusicPlayer />
           </div>
         )
       },
       {
         key: 'gmail',
         content: (
           <div 
             className={`${styles.card} ${styles.socialMiniCard} ${styles.gmailBg}`}
             onClick={() => isTouch && (window.location.href = 'mailto:swastid03@gmail.com')}
           >
              {!isTouch && <a href="mailto:swastid03@gmail.com" className={styles.redirectBtnMini}>↗</a>}
              <div className={styles.navLinkCenter}>
                <Mail size={48} className={styles.giantIconImage} />
              </div>
              <span className={styles.gmailLabel}>swastid03@gmail.com</span>
           </div>
         )
       },
       {
         key: 'insta',
         content: (
           <div 
             className={`${styles.card} ${styles.socialMiniCard} ${styles.instaBg}`}
             onClick={() => isTouch && window.open('https://instagram.com/swastidsolankii', '_blank')}
           >
              {!isTouch && <a href="https://instagram.com/swastidsolankii" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnMini}>↗</a>}
              <div className={styles.navLinkCenter}>
                <Instagram size={80} className={styles.giantIcon} />
              </div>
           </div>
         )
       },
       {
         key: 'linkedin',
         content: (
           <div 
             className={`${styles.card} ${styles.socialMiniCard} ${styles.linkedinBg}`}
             onClick={() => isTouch && window.open('https://www.linkedin.com/in/swastidsolanki/', '_blank')}
           >
              {!isTouch && <a href="https://www.linkedin.com/in/swastidsolanki/" target="_blank" rel="noopener noreferrer" className={styles.redirectBtnMini}>↗</a>}
              <div className={styles.navLinkCenter}>
                <Linkedin size={80} className={styles.giantIcon} />
              </div>
           </div>
         )
       },
       {
         key: 'resume',
         content: (
           <div 
             className={`${styles.card} ${styles.socialMiniCard} ${styles.resumeBg}`}
             onClick={isTouch ? handleDownload : undefined}
           >
              <button onClick={handleDownload} className={styles.resumeDownloadBtn} style={{ border: 'none', cursor: 'pointer' }} aria-label="Download Resume">
                <Download size={20} />
              </button>
              <div className={styles.navLinkCenter}>
                <FileText size={80} className={styles.giantIcon} />
              </div>
              <span className={styles.resumeLabel}>Resume</span>
           </div>
         )
       },
       {
         key: 'services',
         content: (
           <div className={`${styles.card} ${styles.servicesCard}`}>
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
         )
       },
       {
         key: 'github',
         content: (
           <div className={`${styles.card}`}>
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
         )
       }
    ];

    const capitalize = (str: string) => str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const repoCards = repos.map((repo, i) => {
      // Scale titles natively for w:6 columns logic
      const isGiant = i === 0 || i % 2 === 0;
      const formattedName = capitalize(repo.name.replace(/-/g, ' '));
      const colorSchemeParam = isDark ? 'dark' : 'light';
      const imgUrl = `https://api.microlink.io/?url=${encodeURIComponent(repo.homepage)}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=${colorSchemeParam}&viewport.width=1920&viewport.height=1080&viewport.isMobile=false`;

      return {
        key: `repo-${repo.id}`,
        content: (
          <div 
             className={`${styles.card} ${styles.projectCard}`} 
             style={{backgroundImage: `url(${imgUrl})`}}
             onClick={() => isTouch && window.open(repo.homepage, '_blank')}
          >
             {!isTouch && <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className={styles.redirectBtnProject}>↗</a>}
             <div className={styles.projectOverlay}>
               <div className={styles.projectMeta}>
                 {isGiant ? (
                   <h3 className={styles.giantProjectTitle}>{formattedName}</h3>
                 ) : (
                   <h3>{formattedName}</h3>
                 )}
                 <p>{repo.description || 'Full-Stack Application'}</p>
               </div>
             </div>
          </div>
        )
      };
    });

    const allCards = [...baseCards, ...repoCards];

    if (isLoading) {
      allCards.push({
        key: 'loading',
        content: (
          <div className={styles.card} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '12px' }}>
            <style>{`@keyframes bentoSpin { 100% { transform: rotate(360deg); } }`}</style>
            <Loader2 size={32} style={{ animation: 'bentoSpin 2s linear infinite' }} />
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Fetching GitHub Projects...</p>
          </div>
        )
      });
      layouts.lg.push({ i: 'loading', x: 0, y: 4, w: 6, h: 6 });
      layouts.md.push({ i: 'loading', x: 0, y: 4, w: 6, h: 6 });
    }

    if (isMobile) {
      return (
        <div className={styles.mobileGrid}>
          {allCards.map(card => {
            const isMini = ['gmail', 'insta', 'linkedin', 'resume'].includes(card.key);
            return (
              <div key={card.key} className={isMini ? styles.mobileCardWrapperMini : styles.mobileCardWrapper}>
                {card.content}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <ResponsiveGridLayout {...gridProps}>
        {allCards.map(card => (
          <div key={card.key}>
            {card.content}
          </div>
        ))}
        {width > 768 && null}
      </ResponsiveGridLayout>
    );
  };

  return (
    <section className={styles.bentoSection} data-touch={isTouch}>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>The <span className="text-gradient">Ecosystem</span></h2>
          <p className={styles.subtitle}>Drag, drop, and resize anywhere. A glimpse into my tools, projects, and workflow.</p>
        </div>
        {renderContent()}
        
        <div className={styles.footer}>
          <a 
            href="https://github.com/SwastidSolanki" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.seeMoreBtn}
          >
            <span className={styles.seeMoreText}>Checkout more of my projects on GitHub</span>
            <Github size={20} />
          </a>
        </div>
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
