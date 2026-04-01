import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import TerminalModal from './TerminalModal';
import HallOfTrials from './HallOfTrials';
import styles from './SecretSystem.module.css';

type SystemState = 'IDLE' | 'CINEMATIC' | 'TERMINAL' | 'OVERLAY';

const playSubtlePing = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);
  } catch (e) {
    console.warn("Audio Context failed", e);
  }
};

const SecretSystem: React.FC = () => {
  const [currentState, setCurrentState] = useState<SystemState>('IDLE');
  const cinematicRef = useRef<HTMLDivElement>(null);

  const sequenceRef = useRef<string>('');

  useEffect(() => {
    const handleTrigger = () => {
      setCurrentState('CINEMATIC');
      playSubtlePing();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      // Don't trigger if already in a trial state (unless idle)
      if (currentState !== 'IDLE') return;

      sequenceRef.current += e.key;
      if (sequenceRef.current.length > 20) {
        sequenceRef.current = sequenceRef.current.substring(1);
      }
      
      if (sequenceRef.current.toLowerCase().endsWith('/gametime!')) {
        handleTrigger();
        sequenceRef.current = ''; 
      }
    };

    const handleSkip = () => {
      setCurrentState('OVERLAY');
      window.dispatchEvent(new CustomEvent('haltThreeJS'));
    };

    window.addEventListener('triggerSecretSystem', handleTrigger);
    window.addEventListener('triggerSecretDirect', handleSkip);
    window.addEventListener('keydown', handleKeydown);
    
    // Automatic routing check (including hash variations)
    const accessPath = window.location.pathname.toLowerCase();
    if (accessPath === '/gametime!' || window.location.hash === '#/gametime!') {
      handleSkip();
    }

    return () => {
      window.removeEventListener('triggerSecretSystem', handleTrigger);
      window.removeEventListener('triggerSecretDirect', handleSkip);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [currentState]);

  useEffect(() => {
    if (currentState !== 'IDLE') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.documentElement.classList.add('secret-active');
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.documentElement.classList.remove('secret-active');
    }
  }, [currentState]);

  useEffect(() => {
    if (currentState === 'CINEMATIC' && cinematicRef.current) {
      const el = cinematicRef.current;
      gsap.fromTo(el, 
        { opacity: 0, scale: 0.9, filter: 'blur(20px)' },
        { 
          opacity: 1, 
          scale: 1, 
          filter: 'blur(0px)', 
          duration: 1.5, 
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(el, {
              opacity: 0,
              filter: 'blur(10px)',
              duration: 1,
              delay: 1,
              ease: 'power2.in',
              onComplete: () => {
                setCurrentState('TERMINAL');
              }
            });
          }
        }
      );
    }
  }, [currentState]);

  if (currentState === 'IDLE') return null;

  return (
    <div className={styles.systemRoot}>
      {currentState === 'CINEMATIC' && (
        <div className={styles.cinematicWrapper}>
          <h1 ref={cinematicRef} className={styles.cinematicText}>The Arena awaits.</h1>
        </div>
      )}

      {currentState === 'TERMINAL' && (
        <TerminalModal onAccessGranted={() => setCurrentState('OVERLAY')} />
      )}

      {currentState === 'OVERLAY' && (
        <HallOfTrials onClose={() => {
            setCurrentState('IDLE');
            window.dispatchEvent(new CustomEvent('resumeThreeJS'));
        }} />
      )}
    </div>
  );
};

export default SecretSystem;
