import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { TrialProps } from './PathOfTheFallen';

// RGBYP: Red, Green, Blue, Yellow, Pink/Purple
const COLORS = ['#ff4d4d', '#22c55e', '#3b82f6', '#facc15', '#d946ef'];

interface PlayerState {
  id: string;
  targetStack: string[];
  userStack: string[];
  score: number;
  status: 'PREVIEW' | 'INPUT' | 'SUCCESS' | 'FAILED';
}

const EchoesOfOrder: React.FC<TrialProps> = ({ playerCount: _pc, playerKeys: _pk, onComplete, isMuted: _im }) => {
  const [level, setLevel] = useState(1);
  const [player, setPlayer] = useState<PlayerState>({
    id: 'p1', targetStack: [], userStack: [], score: 0, status: 'PREVIEW'
  });
  const [phase, setPhase] = useState<'START' | 'ROUND' | 'GAMEOVER'>('START');
  const [winner, setWinner] = useState<string | null>(null);
  const isInputLocked = useRef(false);

  const startRound = useCallback(() => {
    const stackSize = 4 + Math.floor(level / 2);
    const newStack = Array.from({ length: stackSize }).map(() => COLORS[Math.floor(Math.random() * COLORS.length)]);
    isInputLocked.current = false;

    setPlayer(prev => ({
      ...prev,
      targetStack: [...newStack],
      userStack: [],
      status: 'PREVIEW'
    }));

    setPhase('ROUND');
    const preview = 3000 + (level * 500);
    setTimeout(() => {
      setPlayer(prev => ({ ...prev, status: 'INPUT' }));
    }, preview);
  }, [level]);

  const handleInput = (color: string) => {
    if (player.status !== 'INPUT' || isInputLocked.current) return;
    
    // Lock briefly to prevent double-trigger
    isInputLocked.current = true;
    setTimeout(() => { isInputLocked.current = false; }, 100);

    setPlayer(prev => {
      if (prev.userStack.length < prev.targetStack.length) {
        return { ...prev, userStack: [...prev.userStack, color] };
      }
      return prev;
    });
  };

  const checkStack = () => {
    if (player.status !== 'INPUT') return;

    const isCorrect = player.userStack.every((color, i) => color === player.targetStack[i]);
    if (isCorrect && player.userStack.length === player.targetStack.length) {
      setPlayer(prev => ({ ...prev, status: 'SUCCESS', score: prev.score + 10 }));
    } else {
      setPlayer(prev => ({ ...prev, status: 'FAILED' }));
    }
  };

  useEffect(() => {
    if (player.status === 'SUCCESS' || player.status === 'FAILED') {
      if (player.score >= 50) {
        setWinner("CHALLENGER 01 VICTORIOUS");
        setPhase('GAMEOVER');
      } else {
        setTimeout(() => {
          if (player.status === 'SUCCESS') setLevel(l => Math.min(10, l + 1));
          startRound();
        }, 1500);
      }
    }
  }, [player.status, player.score, startRound]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 2rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center', width: '100%', maxWidth: '800px' }}>
        <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: '#fff', fontSize: '1.8rem', letterSpacing: '0.2em' }}>ECHOES OF ORDER</h3>
        <span style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8', fontSize: '1.2rem', letterSpacing: '0.3em' }}>ASCENSION: {level}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '2rem', position: 'relative' }}>
          <div style={{ marginBottom: '1.5rem', color: '#fff', fontFamily: 'Cinzel, serif', fontSize: '1.1rem', letterSpacing: '0.1em' }}>CHALLENGER_01 // {player.score} PTS</div>
          
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column-reverse', 
            gap: '8px', 
            width: '100%', 
            maxWidth: '180px', 
            minHeight: '350px', 
            justifyContent: 'flex-start',
            borderBottom: '4px solid rgba(255,255,255,0.2)',
            paddingBottom: '8px'
          }}>
            {(player.status === 'PREVIEW' ? player.targetStack : player.userStack).map((color, i) => (
              <div 
                key={i} 
                style={{ 
                  height: '40px', 
                  background: color, 
                  width: '100%', 
                  boxShadow: `0 0 20px ${color}60`,
                  animation: 'cinematicFade 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '2px'
                }} 
              />
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', minHeight: '30px' }}>
            {player.status === 'FAILED' && <div style={{ color: '#ef4444', fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'Cinzel, serif', textShadow: '0 0 15px rgba(239, 68, 68, 0.6)' }}>FAULT_DETECTED</div>}
            {player.status === 'SUCCESS' && <div style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Cinzel, serif', textShadow: '0 0 15px rgba(74, 222, 128, 0.6)' }}>ORDER_MATCHED</div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {COLORS.map(c => (
                <button 
                  key={c}
                  onPointerDown={() => handleInput(c)}
                  style={{
                    height: '50px',
                    background: c,
                    border: 'none',
                    cursor: player.status === 'INPUT' ? 'pointer' : 'default',
                    opacity: player.status === 'INPUT' ? 1 : 0.3,
                    transition: 'all 0.2s',
                    boxShadow: `0 0 10px ${c}40`,
                    borderRadius: '2px'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 0 20px ${c}80`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 0 10px ${c}40`; }}
                />
              ))}
            </div>
            
            {player.status === 'INPUT' && player.userStack.length === player.targetStack.length && (
              <button 
                onClick={checkStack}
                style={{
                  background: '#fff',
                  color: '#020617',
                  border: 'none',
                  padding: '16px',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 30px rgba(255,255,255,0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                SUBMIT_RESULT
              </button>
            )}

            <button 
              onClick={() => setPlayer(prev => ({ ...prev, userStack: [] }))}
              style={{ background: 'transparent', color: '#64748b', border: 'none', fontSize: '0.8rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
            >
              purge_selection
            </button>
          </div>
      </div>

      {phase === 'START' && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
           <button style={{ background: 'transparent', color: '#fff', padding: '18px 60px', border: '1px solid #fff', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '0.2em', transition: 'all 0.3s' }} 
             onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#020617'; }}
             onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
             onClick={startRound}>START_ASCENSION</button>
        </div>
      )}

      {phase === 'GAMEOVER' && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.95)', backdropFilter: 'blur(16px)', zIndex: 10 }}>
           <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '5rem', color: '#fff', textAlign: 'center', letterSpacing: '0.1em' }}>{winner}</h2>
           <button style={{ background: '#fff', color: '#020617', padding: '18px 48px', border: 'none', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: 'bold', marginTop: '3rem', letterSpacing: '0.2em' }} onClick={() => onComplete(winner || "Result Recorded")}>DISMISS_RESULT</button>
        </div>
      )}
    </div>
  );
};

export default EchoesOfOrder;
