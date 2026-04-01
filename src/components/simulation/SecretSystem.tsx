import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import TerminalModal from './TerminalModal';
import HallOfTrials from './HallOfTrials';
import styles from './SecretSystem.module.css';

type SystemState = 'IDLE' | 'CINEMATIC' | 'TERMINAL' | 'OVERLAY';

const playOminousAtmosphere = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Low Drone
    const lowOsc = audioCtx.createOscillator();
    const lowGain = audioCtx.createGain();
    lowOsc.type = 'sawtooth';
    lowOsc.frequency.setValueAtTime(55, now); // A1
    lowOsc.frequency.exponentialRampToValueAtTime(27.5, now + 3); // A0
    lowGain.gain.setValueAtTime(0, now);
    lowGain.gain.linearRampToValueAtTime(0.15, now + 0.5);
    lowGain.gain.exponentialRampToValueAtTime(0.001, now + 4);
    
    // High Dissonance (Scream)
    const highOsc = audioCtx.createOscillator();
    const highGain = audioCtx.createGain();
    highOsc.type = 'square';
    highOsc.frequency.setValueAtTime(880, now); // A5
    highOsc.frequency.linearRampToValueAtTime(1320, now + 0.1); // Tension
    highGain.gain.setValueAtTime(0, now);
    highGain.gain.linearRampToValueAtTime(0.05, now + 0.05);
    highGain.gain.exponentialRampToValueAtTime(0.001, now + 2);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 3);

    lowOsc.connect(filter);
    highOsc.connect(filter);
    filter.connect(lowGain);
    filter.connect(highGain);
    lowGain.connect(audioCtx.destination);
    highGain.connect(audioCtx.destination);

    lowOsc.start(); lowOsc.stop(now + 4);
    highOsc.start(); highOsc.stop(now + 2);
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
      playOminousAtmosphere();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      // Don't trigger if already in a trial state (unless idle)
      if (currentState !== 'IDLE') return;

      sequenceRef.current += e.key;
      if (sequenceRef.current.length > 20) {
        sequenceRef.current = sequenceRef.current.substring(1);
      }
      
      if (sequenceRef.current.toLowerCase().endsWith('avada-kedavra')) {
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
    const accessPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
    if (accessPath === '/avada-kedavra' || window.location.hash === '#/avada-kedavra') {
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
