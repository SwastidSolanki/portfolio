import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { TrialProps } from './PathOfTheFallen';

const generatePrompts = () => {
  const birds = ['EAGLE', 'HAWK', 'DOVE', 'OWL', 'CROW', 'RAVEN', 'PARROT', 'ROBIN', 'GULL'];
  const fish = ['SHARK', 'WHALE', 'TUNA', 'SALMON', 'TROUT', 'EEL', 'CARP', 'CLOWNFISH'];
  const mammals = ['DOG', 'CAT', 'WOLF', 'BEAR', 'LION', 'TIGER', 'DEER', 'HORSE', 'PIG', 'COW', 'MOUSE', 'RAT', 'MULE', 'ZEBRA', 'GOAT', 'SHEEP'];
  const reptiles = ['SNAKE', 'LIZARD', 'GECKO', 'IGUANA', 'TURTLE', 'CROCODILE', 'ALLIGATOR'];
  
  const validPrompts: string[] = [];
  const invalidPrompts: string[] = [];

  birds.forEach(b => validPrompts.push(`${b} FLY`));
  fish.forEach(f => validPrompts.push(`${f} SWIM`));
  mammals.forEach(m => validPrompts.push(`${m} RUN`));
  reptiles.forEach(r => validPrompts.push(`${r} CRAWL`));
  
  validPrompts.push('SUN HOT', 'FIRE BRIGHT', 'ICE COLD', 'STONE HARD', 'OCEAN DEEP');
  invalidPrompts.push('SUN COLD', 'FIRE WET', 'ICE HOT', 'STONE SOFT', 'OCEAN DRY');
  
  // Fake prompts for confusion
  invalidPrompts.push('BIRD SWIM', 'FISH FLY', 'DOG FLY', 'STONE MELTS', 'SUN SMALL');

  const shuffle = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };
  
  shuffle(validPrompts);
  shuffle(invalidPrompts);

  const finalPool: {text: string, valid: boolean}[] = [];
  for (let i=0; i<150; i++) {
    const text = validPrompts[i % validPrompts.length];
    finalPool.push({ text, valid: true });
  }
  for (let i=0; i<80; i++) {
    const text = invalidPrompts[i % invalidPrompts.length];
    finalPool.push({ text, valid: false });
  }

  shuffle(finalPool);
  return finalPool;
};

interface Player {
  id: string;
  name: string;
  key: string;
  color: string;
  score: number;
  status: 'IDLE' | 'CORRECT' | 'WRONG'; 
}

const PLAYER_COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899'];

const JudgementOfInstinct: React.FC<TrialProps> = ({ playerCount, playerKeys, onComplete, onExit, isMuted }) => {
  const [phase, setPhase] = useState<'START' | 'WAITING' | 'PROMPT' | 'ROUND_OVER' | 'GAMEOVER'>('START');
  const [round, setRound] = useState(1);
  const [prompt, setPrompt] = useState<{ text: string, valid: boolean } | null>(null);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  
  const stateRef = useRef({
    currentPrompt: null as { text: string, valid: boolean } | null,
    phase: 'START',
    successOrder: 0,
    timeoutId: null as any,
    roundOverTimeoutId: null as any,
    promptsPool: [] as {text: string, valid: boolean}[],
  });

  useEffect(() => {
    stateRef.current.promptsPool = generatePrompts();
    const activeP: Record<string, Player> = {};
    for (let i=0; i<playerCount; i++) {
      const pId = `p${i+1}`;
      activeP[pId] = {
        id: pId,
        name: `Challenger 0${i+1}`,
        key: playerKeys[pId] || '',
        color: PLAYER_COLORS[i],
        score: 0,
        status: 'IDLE'
      };
    }
    setPlayers(activeP);
  }, [playerCount, playerKeys]);

  useEffect(() => { stateRef.current.phase = phase; }, [phase]);
  useEffect(() => { stateRef.current.currentPrompt = prompt; }, [prompt]);

  const playSound = useCallback((type: 'beep' | 'error' | 'success' | 'win') => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      gain.gain.value = 0.1;
      
      if (type === 'beep') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'error') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'success') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'win') {
        osc.type = 'square'; osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
      }
      osc.connect(gain); gain.connect(audioCtx.destination);
    } catch(e) {}
  }, [isMuted]);

  const startNextRound = useCallback(() => {
    if (round > 10) {
      setPhase('GAMEOVER');
      playSound('win');
      return;
    }
    
    setPhase('WAITING');
    setPrompt(null);
    stateRef.current.successOrder = 0;
    
    setPlayers(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { next[k].status = 'IDLE'; });
      return next;
    });

    const delay = 1000 + Math.random() * 2000;
    stateRef.current.timeoutId = setTimeout(() => {
      if (stateRef.current.promptsPool.length === 0) {
         stateRef.current.promptsPool = generatePrompts();
      }
      const p = stateRef.current.promptsPool.pop()!;
      setPrompt(p);
      setPhase('PROMPT');
      playSound('beep');

      stateRef.current.roundOverTimeoutId = setTimeout(() => {
        setPhase('ROUND_OVER');
        setRound(r => r + 1);
        setTimeout(() => startNextRound(), 2500); // Auto progress for cinematic feel
      }, 1500);

    }, delay);
  }, [round, playSound]);

  useEffect(() => {
    if (phase === 'START' && Object.keys(players).length > 0) {
      const t = setTimeout(() => startNextRound(), 1000);
      return () => clearTimeout(t);
    }
  }, [phase, startNextRound, players]);

  const handlePlayerAction = useCallback((pid: string) => {
    const st = stateRef.current;
    if (st.phase !== 'PROMPT') return; 

    setPlayers(prev => {
      const player = prev[pid];
      if (!player || player.status !== 'IDLE') return prev; 
      
      const next = { ...prev };
      if (st.currentPrompt?.valid) {
        playSound('success');
        const order = st.successOrder;
        st.successOrder++;
        const points = order === 0 ? 3 : order === 1 ? 2 : 1;
        next[pid] = { ...player, status: 'CORRECT', score: player.score + points };
      } else {
        playSound('error');
        next[pid] = { ...player, status: 'WRONG', score: Math.max(0, player.score - 2) };
      }
      return next;
    });
  }, [playSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const playerEntry = Object.values(players).find(p => p.key === key);
      if (playerEntry) {
        handlePlayerAction(playerEntry.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [players, handlePlayerAction]);

  useEffect(() => {
    return () => {
      if (stateRef.current.timeoutId) clearTimeout(stateRef.current.timeoutId);
      if (stateRef.current.roundOverTimeoutId) clearTimeout(stateRef.current.roundOverTimeoutId);
    };
  }, []);

  const getWinner = () => {
    const sorted = Object.values(players).sort((a,b) => b.score - a.score);
    if (!sorted[0]) return "";
    if (sorted[1] && sorted[0].score === sorted[1].score) return "SHATTERED EQUILIBRIUM"; 
    return `${sorted[0].name.toUpperCase()} VICTORIOUS`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 3rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: '#f8fafc', fontSize: '1.8rem', letterSpacing: '0.2em' }}>REFLEX TEST</h3>
        <span style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8', fontSize: '1rem', letterSpacing: '0.3em' }}>CHALLENGE {Math.min(round, 10)}/10</span>
      </div>
      
      <div 
        style={{ 
          flex: 1, 
          width: '100%', 
          background: 'rgba(2, 6, 23, 0.6)', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          {phase === 'START' && <h2 style={{ fontSize: '3rem', color: '#fff', fontFamily: 'Cinzel, serif', letterSpacing: '0.3em', opacity: 0.5 }}>PREPARING RESULT...</h2>}
          {phase === 'WAITING' && <h2 style={{ fontSize: '5rem', color: '#fff', opacity: 0.1, animation: 'pulse 1s infinite' }}>FOCUS</h2>}
          {(phase === 'PROMPT' || phase === 'ROUND_OVER') && prompt && (
            <div style={{ textAlign: 'center', transform: phase === 'PROMPT' ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <h1 style={{ 
                fontSize: '8rem', 
                margin: 0, 
                color: phase === 'ROUND_OVER' ? (prompt.valid ? '#4ade80' : '#ef4444') : '#fff',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.15em',
                textShadow: phase === 'ROUND_OVER' 
                  ? (prompt.valid ? '0 0 80px rgba(74, 222, 128, 0.5)' : '0 0 80px rgba(239, 68, 68, 0.5)') 
                  : '0 0 40px rgba(255,255,255,0.2)'
              }}>
                {prompt.text}
              </h1>
              {phase === 'ROUND_OVER' && (
                <p style={{ color: prompt.valid ? '#4ade80' : '#ef4444', marginTop: '1.5rem', fontSize: '1.2rem', fontFamily: 'Inter, sans-serif', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
                  {prompt.valid ? 'ABSOLUTE TRUTH' : 'DECEPTIVE ANOMALY'}
                </p>
              )}
            </div>
          )}
          
          {phase === 'GAMEOVER' && (
            <div style={{ textAlign: 'center', animation: 'cinematicFade 1s ease' }}>
              <h1 style={{ fontSize: '6rem', color: '#fff', margin: '0 0 2rem 0', fontFamily: 'Cinzel, serif', textShadow: '0 0 50px rgba(255,255,255,0.2)' }}>{getWinner()}</h1>
              <button 
                style={{ background: '#fff', color: '#020617', padding: '18px 48px', fontSize: '1.1rem', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: 'bold', letterSpacing: '0.2em' }}
                onClick={() => onComplete(`${getWinner()}`)}
              >
                DISMISS RESULT
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', height: '160px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {Object.values(players).map((p, idx) => (
            <div 
              key={p.id} 
              style={{ 
                flex: 1, 
                borderRight: idx < playerCount - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: p.status === 'CORRECT' ? 'rgba(74, 222, 128, 0.1)' : p.status === 'WRONG' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                transition: 'background 0.3s'
              }}
              onTouchStart={() => handlePlayerAction(p.id)}
            >
              <div style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>CHALLENGER_0{idx+1} [ {p.key.toUpperCase()} ]</div>
              <div style={{ color: '#fff', fontFamily: 'Cinzel, serif', fontSize: '3rem' }}>{p.score}</div>
              {p.status === 'WRONG' && <span style={{ color: '#ef4444', fontSize: '0.6rem', letterSpacing: '0.2em', marginTop: '0.4rem', animation: 'pulse 0.5s infinite' }}>JUDGED UNWORTHY</span>}
              {p.status === 'CORRECT' && <span style={{ color: '#4ade80', fontSize: '0.6rem', letterSpacing: '0.2em', marginTop: '0.4rem' }}>TRUTH REVEALED</span>}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ width: '100%', padding: '1.5rem', color: '#475569', fontSize: '0.75rem', letterSpacing: '0.3em', textAlign: 'center', textTransform: 'uppercase' }}>
        Act only when the path is true. Perception is your only weapon.
      </div>
    </div>
  );
};

export default JudgementOfInstinct;
