import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { TrialProps } from './PathOfTheFallen';

interface GridPos {
  x: number;
  y: number;
}

interface PlayerState {
  id: string;
  grid: GridPos[];
  userPath: GridPos[];
  lives: number;
  score: number;
  status: 'PREVIEW' | 'INPUT' | 'SUCCESS' | 'FAILED';
}

const VeilOfMemory: React.FC<TrialProps> = ({ onComplete }) => {
  const [level, setLevel] = useState(1);
  const gridSize = 8;
  const [player, setPlayer] = useState<PlayerState>({
    id: 'p1', grid: [], userPath: [], lives: 3, score: 0, status: 'PREVIEW'
  });
  const [phase, setPhase] = useState<'START' | 'ROUND' | 'GAMEOVER'>('START');
  const [winner, setWinner] = useState<string | null>(null);
  const [previewIdx, setPreviewIdx] = useState(-1);
  const [wrongTile, setWrongTile] = useState<GridPos | null>(null);
  
  const isProcessingInput = useRef(false);

  const generatePath = useCallback((size: number): GridPos[] => {
    const path: GridPos[] = [];
    let cur: GridPos = { x: Math.floor(Math.random() * size), y: size - 1 };
    path.push({ ...cur });

    while (cur.y > 0) {
      const move = Math.random();
      if (move > 0.45) {
        cur.y -= 1;
      } else if (move > 0.22 && cur.x < size - 1) {
        cur.x += 1;
      } else if (cur.x > 0) {
        cur.x -= 1;
      }

      if (!path.some(p => p.x === cur.x && p.y === cur.y)) {
        path.push({ ...cur });
      }
    }
    return path;
  }, []);

  const startRound = useCallback(() => {
    const newPath = generatePath(gridSize);
    setWrongTile(null);
    isProcessingInput.current = false;
    
    setPlayer(prev => ({
      ...prev,
      grid: JSON.parse(JSON.stringify(newPath)),
      userPath: [],
      status: 'PREVIEW'
    }));

    setPhase('ROUND');
    setPreviewIdx(-1);

    let idx = 0;
    const interval = setInterval(() => {
      setPreviewIdx(idx);
      idx++;
      if (idx >= newPath.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPlayer(prev => ({ ...prev, status: 'INPUT' }));
          setPreviewIdx(-1);
        }, 800);
      }
    }, 200);
  }, [gridSize, generatePath]);

  useEffect(() => {
    if (phase === 'START') {
      setPlayer({ id: 'p1', grid: [], userPath: [], lives: 3, score: 0, status: 'PREVIEW' });
    }
  }, [phase]);

  const handleInput = (pos: GridPos) => {
    if (player.status !== 'INPUT' || isProcessingInput.current) return;

    isProcessingInput.current = true;
    const expected = player.grid[player.userPath.length];
    
    if (pos.x === expected.x && pos.y === expected.y) {
      const newUserPath = [...player.userPath, pos];
      setPlayer(prev => ({ ...prev, userPath: newUserPath }));
      
      if (newUserPath.length === player.grid.length) {
        setPlayer(prev => ({ ...prev, status: 'SUCCESS', score: prev.score + 10 }));
      }
      isProcessingInput.current = false;
    } else {
      setWrongTile(pos);
      setPlayer(prev => ({ ...prev, status: 'FAILED', lives: prev.lives - 1 }));
      // Allow re-input after a short delay if failed
      setTimeout(() => {
         isProcessingInput.current = false;
      }, 500);
    }
  };

  useEffect(() => {
    if (player.status === 'SUCCESS' || (player.status === 'FAILED' && player.lives <= 0)) {
       if (player.lives <= 0) {
         setWinner("CHALLENGE LOST // MEMORY DEPLETED");
         setPhase('GAMEOVER');
       } else if (player.score >= 50) {
         setWinner("CHALLENGER 01 VICTORIOUS");
         setPhase('GAMEOVER');
       } else {
         setTimeout(() => {
           setLevel(l => Math.min(10, l + 1));
           startRound();
         }, 1500);
       }
    } else if (player.status === 'FAILED') {
      // Small delay then reset path for the current level or just let them try again?
      // User said "it is clicking a tile by itself and showing red even when its right",
      // so if they click wrong once, we should show them the wrong tile then let them restart the round.
      setTimeout(() => {
        startRound();
      }, 1000);
    }
  }, [player.status, player.lives, player.score, startRound]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 2rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', marginBottom: '1rem', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: '#fff', fontSize: '1.8rem', letterSpacing: '0.2em' }}>VEIL OF MEMORY</h3>
        <span style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8', fontSize: '1.2rem', letterSpacing: '0.3em' }}>DEPTH: {level}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
            <span style={{ color: '#fff', fontFamily: 'Cinzel, serif', fontSize: '1.1rem', letterSpacing: '0.1em' }}>CHALLENGER_01 // {player.score} PTS</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: i < player.lives ? '#ef4444' : 'rgba(255,255,255,0.05)', boxShadow: i < player.lives ? '0 0 10px #ef444460' : 'none', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '6px',
            width: '100%',
            aspectRatio: '1',
            maxWidth: '600px',
            background: 'rgba(2, 6, 23, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '8px'
          }}>
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
              const x = i % gridSize;
              const y = Math.floor(i / gridSize);
              const pathIdx = player.grid.findIndex(pos => pos.x === x && pos.y === y);
              const isUser = player.userPath.some(pos => pos.x === x && pos.y === y);
              const isGreenPreview = previewIdx !== -1 && pathIdx <= previewIdx && pathIdx !== -1;
              const isWrong = wrongTile?.x === x && wrongTile?.y === y;
              const isCorrectExpected = player.status === 'FAILED' && player.grid[player.userPath.length]?.x === x && player.grid[player.userPath.length]?.y === y;
              
              return (
                <div 
                  key={i}
                  onPointerDown={() => handleInput({x, y})}
                  style={{
                    background: isGreenPreview || isUser || isCorrectExpected ? '#4ade80' : isWrong ? '#ef4444' : 'rgba(255, 255, 255, 0.015)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: isGreenPreview || isUser || isCorrectExpected ? '0 0 15px rgba(74, 222, 128, 0.4)' : isWrong ? '0 0 15px rgba(239, 68, 68, 0.6)' : 'none',
                    cursor: player.status === 'INPUT' ? 'pointer' : 'default',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '2px'
                  }}
                />
              );
            })}
          </div>
          
          <div style={{ 
            marginTop: '2rem', 
            color: player.status === 'SUCCESS' ? '#4ade80' : player.status === 'FAILED' ? '#ef4444' : '#64748b', 
            fontSize: '1rem', 
            letterSpacing: '0.3em', 
            fontWeight: 'bold',
            fontFamily: 'Cinzel, serif',
            animation: player.status === 'INPUT' ? 'pulse 2s infinite' : 'none'
          }}>
            {player.status === 'PREVIEW' ? 'DECODING...' : player.status === 'INPUT' ? 'AWAITING_INPUT' : player.status === 'FAILED' ? 'INPUT_INTERRUPTED' : 'INPUT_VERIFIED'}
          </div>
      </div>

      {phase === 'START' && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
           <button style={{ background: 'transparent', color: '#fff', padding: '18px 60px', border: '1px solid #fff', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '0.2em', transition: 'all 0.3s' }} 
             onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#020617'; }}
             onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
             onClick={startRound}>BEGIN_CHALLENGE</button>
        </div>
      )}

      {phase === 'GAMEOVER' && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.95)', backdropFilter: 'blur(16px)', zIndex: 10 }}>
           <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '5rem', color: '#fff', textAlign: 'center', letterSpacing: '0.1em' }}>{winner}</h2>
           <button style={{ background: '#fff', color: '#020617', padding: '18px 48px', border: 'none', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: 'bold', marginTop: '3rem', letterSpacing: '0.2em' }} onClick={() => onComplete(winner || "Challenge Complete")}>DISMISS_RESULT</button>
        </div>
      )}
    </div>
  );
};

export default VeilOfMemory;
