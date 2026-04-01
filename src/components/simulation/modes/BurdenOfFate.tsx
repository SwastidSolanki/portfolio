import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { TrialProps } from './PathOfTheFallen';

interface Player {
  id: string;
  name: string;
  key: string;
  color: string;
  isAlive: boolean;
}

const PLAYER_COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899'];

const BurdenOfFate: React.FC<TrialProps> = ({ playerCount, playerKeys, onComplete, isMuted }) => {
  const [phase, setPhase] = useState<'START' | 'PLAYING' | 'EXPLODED' | 'GAMEOVER'>('START');
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [timeLeftStr, setTimeLeftStr] = useState('??:??');
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [explodedName, setExplodedName] = useState<string | null>(null);
  const [spamWarning, setSpamWarning] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const stateRef = useRef({
    explosionTimeMs: 0,
    startTime: 0,
    activePlayerId: null as string | null,
    phase: 'START',
    lastTickTime: 0,
    animationFrame: 0,
    holdStartTime: 0,
    spamCounts: {} as Record<string, { count: number, lastTime: number, warnings: number }>
  });

  useEffect(() => {
    const initialSpam: Record<string, any> = {};
    const initialPlayers: Player[] = [];
    for (let i=0; i<playerCount; i++) {
       const pId = `p${i+1}`;
       initialSpam[pId] = { count: 0, lastTime: 0, warnings: 0 };
       initialPlayers.push({
         id: pId,
         name: `Challenger 0${i+1}`,
         key: playerKeys[pId] || '',
         color: PLAYER_COLORS[i],
         isAlive: true
       });
    }
    stateRef.current.spamCounts = initialSpam;
    setPlayers(initialPlayers);
  }, [playerCount, playerKeys]);

  useEffect(() => { stateRef.current.phase = phase; }, [phase]);
  useEffect(() => { 
    stateRef.current.activePlayerId = activePlayerId; 
    stateRef.current.holdStartTime = performance.now();
  }, [activePlayerId]);

  const playSound = useCallback((type: 'tick' | 'boom' | 'pass' | 'win' | 'warn') => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      gain.gain.value = 0.1;
      
      if (type === 'tick') {
        osc.type = 'square'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
      } else if (type === 'boom') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
        osc.start(); osc.stop(audioCtx.currentTime + 1);
      } else if (type === 'pass') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'win') {
        osc.type = 'square'; osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
      } else if (type === 'warn') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
      }
      osc.connect(gain); gain.connect(audioCtx.destination);
    } catch(e) {}
  }, [isMuted]);

  const eliminate = useCallback((id: string, reason: string) => {
    let name = '';
    setPlayers(prev => prev.map(p => {
       if (p.id === id) {
         name = p.name;
         return { ...p, isAlive: false };
       }
       return p;
    }));
    setExplodedName(`${name} - ${reason}`);
    setPhase('EXPLODED');
    playSound('boom');
    setTimeout(() => { if (stateRef.current.phase === 'EXPLODED') setPhase('START'); }, 3000);
  }, [playSound]);

  const startRound = useCallback(() => {
    const alive = players.filter(p => p.isAlive);
    if (alive.length <= 1) {
      setPhase('GAMEOVER');
      playSound('win');
      return;
    }
    setPhase('PLAYING');
    setShakeIntensity(0);
    setExplodedName(null);
    setSpamWarning(null);
    const randomStart = alive[Math.floor(Math.random() * alive.length)];
    setActivePlayerId(randomStart.id);
    stateRef.current.explosionTimeMs = 8000 + Math.random() * 12000;
    stateRef.current.startTime = performance.now();
    stateRef.current.lastTickTime = performance.now();
    stateRef.current.holdStartTime = performance.now();
  }, [players, playSound]);

  useEffect(() => {
    if (phase !== 'PLAYING') return;
    let stopped = false;
    const loop = (now: number) => {
      if (stopped) return;
      const st = stateRef.current;
      const elapsed = now - st.startTime;
      const timeRemaining = Math.max(0, st.explosionTimeMs - elapsed);
      setTimeLeftStr((timeRemaining/1000).toFixed(2));

      const holdDuration = now - st.holdStartTime;
      if (holdDuration > 2000 && st.activePlayerId) {
         eliminate(st.activePlayerId, "HESITATION_LIMIT_EXCEEDED");
         stopped = true; return;
      }

      const progress = elapsed / st.explosionTimeMs;
      if (progress > 0.75) setShakeIntensity((progress - 0.75) * 50); else setShakeIntensity(0);
      const tick = Math.max(100, 1000 - (progress * 900));
      if (now - st.lastTickTime > tick) { playSound('tick'); st.lastTickTime = now; }

      if (timeRemaining <= 0) {
        eliminate(st.activePlayerId || "", "TIME_EXPIRED");
        stopped = true; return;
      }
      st.animationFrame = requestAnimationFrame(loop);
    };
    stateRef.current.animationFrame = requestAnimationFrame(loop);
    return () => { stopped = true; cancelAnimationFrame(stateRef.current.animationFrame); };
  }, [phase, playSound, eliminate]);

  const pass = useCallback((id: string) => {
    const st = stateRef.current;
    if (st.phase !== 'PLAYING' || st.activePlayerId !== id) return;
    const now = performance.now();
    const spam = st.spamCounts[id];
    if (now - spam.lastTime < 450) spam.count++; else spam.count = 0;
    spam.lastTime = now;
    if (spam.count > 5) {
       if (spam.warnings === 0) {
          spam.warnings++; setSpamWarning(`BUFFER OVERFLOW IMMINENT`); playSound('warn');
          setTimeout(() => setSpamWarning(null), 1500); return;
       } else { eliminate(id, "BUFFER_OVERFLOW"); return; }
    }
    const alive = players.filter(p => p.isAlive);
    const currIdx = alive.findIndex(p => p.id === id);
    const nextIdx = (currIdx + 1) % alive.length;
    setActivePlayerId(alive[nextIdx].id);
    playSound('pass');
  }, [players, playSound, eliminate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const p = players.find(p => p.key === key && p.isAlive);
      if (p) pass(p.id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [players, pass]);

  const getWinner = () => players.filter(p => p.isAlive)[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 3rem', marginBottom: '1rem', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: '#fff', fontSize: '1.8rem', letterSpacing: '0.2em' }}>BURDEN OF FATE</h3>
        <span style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8', fontSize: '1rem', letterSpacing: '0.3em' }}>SURVIVOR CLASH</span>
      </div>

      <div style={{ flex: 1, width: '100%', background: phase === 'EXPLODED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(2, 6, 23, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', display: 'flex', flexDirection: 'column', transition: 'background 0.5s ease', transform: `translate(${(Math.random()-0.5)*shakeIntensity}px, ${(Math.random()-0.5)*shakeIntensity}px)` }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          {spamWarning && <div style={{ position: 'absolute', top: '2rem', padding: '1rem 2rem', background: '#ef4444', color: '#fff', fontFamily: 'Cinzel, serif', fontWeight: 'bold', zIndex: 100, animation: 'pulse 0.2s infinite' }}>{spamWarning}</div>}
          
          {phase === 'START' && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '3.5rem', color: '#fff', marginBottom: '2.5rem', fontFamily: 'Cinzel, serif', letterSpacing: '0.3em' }}>START RELAY</h2>
              <button style={{ background: '#fff', color: '#020617', padding: '18px 48px', fontSize: '1.1rem', border: 'none', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: 'bold', letterSpacing: '0.2em' }} onClick={startRound}>BEGIN CHALLENGE</button>
            </div>
          )}

          {phase === 'PLAYING' && (
            <div style={{ textAlign: 'center' }}>
               <h1 style={{ fontSize: '10rem', margin: 0, color: '#ef4444', fontFamily: 'Cinzel, serif', textShadow: `0 0 ${shakeIntensity + 30}px rgba(239, 68, 68, 0.5)` }}>{timeLeftStr}</h1>
               <p style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', letterSpacing: '0.4em' }}>TIME UNTIL OBLIVION</p>
               <div style={{ marginTop: '2.5rem', width: '300px', height: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', margin: '2rem auto' }}>
                  <div style={{ width: `${Math.max(0, (2000 - (performance.now() - stateRef.current.holdStartTime))/20)}%`, height: '100%', background: '#f59e0b', transition: 'width 0.1s linear' }} />
               </div>
               <p style={{ color: '#f59e0b', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>HESITATION WINDOW</p>
            </div>
          )}

          {phase === 'EXPLODED' && (
             <div style={{ textAlign: 'center', animation: 'cinematicFade 0.5s' }}>
                <h1 style={{ fontSize: '8rem', color: '#fff', fontFamily: 'Cinzel, serif', textShadow: '0 0 80px rgba(239,68,68,0.8)' }}>ELIMINATED</h1>
                <p style={{ fontSize: '1.5rem', color: '#ef4444', fontFamily: 'Inter, sans-serif', letterSpacing: '0.5em' }}>{explodedName?.toUpperCase()}</p>
             </div>
          )}

          {phase === 'GAMEOVER' && (
             <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '6rem', color: '#fff', fontFamily: 'Cinzel, serif', textShadow: '0 0 50px rgba(255,255,255,0.2)' }}>VICTOR EMERGES</h1>
                <p style={{ fontSize: '2rem', color: getWinner()?.color, fontFamily: 'Cinzel, serif', marginBottom: '3rem' }}>{getWinner()?.name.toUpperCase()}</p>
                <button style={{ background: '#fff', color: '#020617', padding: '18px 48px', border: 'none', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }} onClick={() => onComplete(`${getWinner()?.name} Survived`)}>DISMISS RESULT</button>
             </div>
          )}
        </div>

        <div style={{ display: 'flex', height: '160px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {players.map((p, idx) => (
            <div key={p.id} style={{ flex: 1, borderRight: idx < playerCount - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: !p.isAlive ? 'rgba(0,0,0,0.4)' : activePlayerId === p.id ? `rgba(239, 68, 68, 0.1)` : 'transparent', transition: 'background 0.2s', opacity: p.isAlive ? 1 : 0.4 }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>CHALLENGER_0{idx+1} [ {p.key.toUpperCase()} ]</div>
              <div style={{ color: p.color, fontFamily: 'Cinzel, serif', fontSize: '1.2rem' }}>{p.name.toUpperCase()}</div>
              {activePlayerId === p.id && phase === 'PLAYING' && <span style={{ color: '#ef4444', fontSize: '0.6rem', letterSpacing: '0.1em', marginTop: '0.5rem', animation: 'pulse 0.5s infinite alternate' }}>BURDEN HELD</span>}
              {!p.isAlive && <span style={{ color: '#ef4444', fontSize: '0.6rem', marginTop: '0.5rem' }}>ELIMINATED</span>}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ width: '100%', padding: '1.5rem', color: '#475569', fontSize: '0.75rem', letterSpacing: '0.3em', textAlign: 'center', textTransform: 'uppercase' }}>
        Pass the core or face the end. Speed is life. 
      </div>
    </div>
  );
};

export default BurdenOfFate;
