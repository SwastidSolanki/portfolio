import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, X, Maximize, Minimize, RotateCcw, ChevronLeft } from 'lucide-react';
import gsap from 'gsap';
import PathOfTheFallen from './modes/PathOfTheFallen';
import JudgementOfInstinct from './modes/JudgementOfInstinct';
import BurdenOfFate from './modes/BurdenOfFate';
import VeilOfMemory from './modes/VeilOfMemory';
import EchoesOfOrder from './modes/EchoesOfOrder';
import PulseOfArena from './modes/PulseOfArena';
import ControlAssigner from './shared/ControlAssigner';
import styles from './HallOfTrials.module.css';

interface HallProps {
  onClose: () => void;
}

type ArenaEntry = 'MENU' | 'FALLEN' | 'INSTINCT' | 'FATE' | 'MEMORY' | 'ORDER' | 'PULSE';

const HallOfTrials: React.FC<HallProps> = ({ onClose }) => {
  const [currentArena, setCurrentArena] = useState<ArenaEntry>('MENU');
  const [setupArena, setSetupArena] = useState<ArenaEntry | null>(null);
  const [isPickingPlayers, setIsPickingPlayers] = useState(false);
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerKeys, setPlayerKeys] = useState<Record<string, string>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (currentArena === 'MENU' && !setupArena && cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 60, rotateX: -15, scale: 0.9 },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  }, [currentArena, setupArena]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleArenaClick = (entry: ArenaEntry) => {
    if (entry === 'MEMORY' || entry === 'ORDER') {
      setPlayerCount(1);
      setPlayerKeys({ p1: ' ' });
      setCurrentArena(entry);
      setSetupArena(null);
      setResetKey(k => k + 1);
    } else if (entry === 'PULSE') {
      setPlayerCount(2);
      setCurrentArena('PULSE');
      setSetupArena(null);
      setResetKey(k => k + 1);
    } else {
      setSetupArena(entry);
      setIsPickingPlayers(true);
    }
  };

  const confirmPlayers = (count: number) => {
    setPlayerCount(count);
    setIsPickingPlayers(false);
  };

  const onControlsAssigned = (keys: Record<string, string>) => {
    setPlayerKeys(keys);
    setCurrentArena(setupArena!);
    setSetupArena(null);
    setResetKey(k => k + 1);
  };

  return (
    <div className={styles.overlayRoot} ref={containerRef}>
      <div className={styles.cyberGrid} />
      <div className={styles.scanline} />

      <div className={styles.topBar}>
        <div className={styles.titleGroup}>
          <div className={styles.libraryBadge}></div>
          <h2 className={styles.title}>Chamber Of Secrets</h2>
        </div>

        <div className={styles.controls}>
          {currentArena !== 'MENU' && (
            <>
              <button title="Attempt Again" onClick={() => setResetKey(k => k + 1)} className={styles.iconBtn}>
                <RotateCcw size={16} />
              </button>
              <button title="Back to Arena" onClick={() => setCurrentArena('MENU')} className={styles.iconBtn}>
                <ChevronLeft size={16} />
              </button>
            </>
          )}
          <button title="Mute/Unmute" onClick={() => setIsMuted(!isMuted)} className={styles.iconBtn}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button title="Toggle Fullscreen" onClick={toggleFullscreen} className={styles.iconBtn}>
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <button title="Exit Chamber" onClick={onClose} className={styles.iconBtnExit}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className={styles.contentArea}>
        {currentArena === 'MENU' && !setupArena && !isPickingPlayers && (
          <div className={styles.menuContainer}>
            <div className={styles.menuHeader}>
              <h2>Choose Your Challenge</h2>
              <p>THE PATH TO VICTORY IS PAVED WITH FAILED ATTEMPTS</p>
            </div>

            <div className={styles.trialGrid}>
              <div ref={el => { cardsRef.current[0] = el; }} className={styles.trialCard} onClick={() => handleArenaClick('FALLEN')}>
                <h3>Shadow Run</h3>
                <p className={styles.trialSubtitle}>Navigate the abyss where many before you have vanished.</p>
                <div className={styles.trialFooter}><span className={styles.playerTag}>Two Survivors</span></div>
              </div>

              <div ref={el => { cardsRef.current[1] = el; }} className={styles.trialCard} onClick={() => handleArenaClick('INSTINCT')}>
                <h3>Reflex Test</h3>
                <p className={styles.trialSubtitle}>Hesitation is the first sign of slowing down.</p>
                <div className={styles.trialFooter}><span className={styles.playerTag}>Priority Duel</span></div>
              </div>

              <div ref={el => { cardsRef.current[2] = el; }} className={styles.trialCard} onClick={() => handleArenaClick('FATE')}>
                <h3>Hot Core</h3>
                <p className={styles.trialSubtitle}>Time is a currency you cannot afford to hold.</p>
                <div className={styles.trialFooter}><span className={styles.playerTag}>Last One Standing</span></div>
              </div>

              <div ref={el => { cardsRef.current[3] = el; }} className={styles.trialCard} onClick={() => handleArenaClick('MEMORY')}>
                <h3>Memory Grid</h3>
                <p className={styles.trialSubtitle}>Trace the forgotten path hidden in shadows.</p>
                <div className={styles.trialFooter}><span className={styles.playerTag}>Solo Focus</span></div>
              </div>

              <div ref={el => { cardsRef.current[4] = el; }} className={styles.trialCard} onClick={() => handleArenaClick('ORDER')}>
                <h3>Tower Sync</h3>
                <p className={styles.trialSubtitle}>Assemble the shards of a shattered structure.</p>
                <div className={styles.trialFooter}><span className={styles.playerTag}>Architectural Focus</span></div>
              </div>

              <div ref={el => { cardsRef.current[5] = el; }} className={styles.trialCard} onClick={() => handleArenaClick('PULSE')}>
                <h3>Glow Hockey</h3>
                <p className={styles.trialSubtitle}>Kinetic conflict in the glowing void.</p>
                <div className={styles.trialFooter}><span className={styles.playerTag}>Two Player Duel</span></div>
              </div>
            </div>
          </div>
        )}

        {isPickingPlayers && (
          <div className={styles.setupOverlay}>
            <div className={styles.setupCard}>
              <h3>Challenger Entry</h3>
              <div className={styles.playerButtons}>
                {[2, 3, 4].map(n => (
                  <button key={n} onClick={() => confirmPlayers(n)}>{n} Players</button>
                ))}
              </div>
              <button className={styles.cancelBtn} onClick={() => { setIsPickingPlayers(false); setSetupArena(null); }}>Back To Hall</button>
            </div>
          </div>
        )}

        {setupArena && (
          <ControlAssigner
            playerCount={playerCount}
            onCancel={() => setSetupArena(null)}
            onComplete={onControlsAssigned}
          />
        )}

        {currentArena === 'FALLEN' && <PathOfTheFallen key={resetKey} playerCount={playerCount} playerKeys={playerKeys} isMuted={isMuted} onComplete={() => { setCurrentArena('MENU'); }} />}
        {currentArena === 'INSTINCT' && <JudgementOfInstinct key={resetKey} playerCount={playerCount} playerKeys={playerKeys} isMuted={isMuted} onComplete={() => { setCurrentArena('MENU'); }} />}
        {currentArena === 'FATE' && <BurdenOfFate key={resetKey} playerCount={playerCount} playerKeys={playerKeys} isMuted={isMuted} onComplete={() => { setCurrentArena('MENU'); }} />}
        {currentArena === 'MEMORY' && <VeilOfMemory key={resetKey} playerCount={playerCount} playerKeys={playerKeys} isMuted={isMuted} onComplete={() => { setCurrentArena('MENU'); }} />}
        {currentArena === 'ORDER' && <EchoesOfOrder key={resetKey} playerCount={playerCount} playerKeys={playerKeys} isMuted={isMuted} onComplete={() => { setCurrentArena('MENU'); }} />}
        {currentArena === 'PULSE' && <PulseOfArena key={resetKey} playerCount={playerCount} playerKeys={playerKeys} isMuted={isMuted} onComplete={() => { setCurrentArena('MENU'); }} />}
      </div>
    </div>
  );
};

export default HallOfTrials;
