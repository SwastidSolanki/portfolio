import React, { useState, useEffect } from 'react';

interface Props {
  playerCount: number;
  onCancel: () => void;
  onComplete: (keys: Record<string, string>) => void;
}

const DEFAULT_KEYS = ['w', 'arrowup', 'i', 'p'];

const ControlAssigner: React.FC<Props> = ({ playerCount, onCancel, onComplete }) => {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [activePlayer, setActivePlayer] = useState<number>(1);

  const assignDefaults = () => {
    const keys: Record<string, string> = {};
    for (let i = 0; i < playerCount; i++) {
      keys[`p${i + 1}`] = DEFAULT_KEYS[i];
    }
    onComplete(keys);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent function keys, escape, etc.
      if (e.key.length > 1 && !['Enter', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      
      const key = e.key.toLowerCase();
      
      // Prevent duplicates
      if (Object.values(assignments).includes(key)) return;

      const newAssignments = { ...assignments, [`p${activePlayer}`]: key };
      setAssignments(newAssignments);

      if (activePlayer < playerCount) {
        setActivePlayer(prev => prev + 1);
      } else {
        setTimeout(() => onComplete(newAssignments), 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePlayer, assignments, playerCount, onComplete]);

  return (
    <div style={{
      background: 'rgba(2, 6, 23, 0.98)',
      padding: '4rem',
      borderRadius: '4px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      maxWidth: '600px',
      width: '100%',
      backdropFilter: 'blur(20px)',
      animation: 'cinematicFade 0.5s ease',
      position: 'relative',
      zIndex: 100
    }}>
      <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.4rem', marginBottom: '0.5rem', color: '#fff', letterSpacing: '0.05em' }}>ASSIGN CONTROLS</h2>
      <p style={{ color: '#94a3b8', letterSpacing: '0.3em', marginBottom: '3rem', fontSize: '0.75rem' }}>PREPARE FOR THE CHALLENGE</p>

      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
        {Array.from({ length: playerCount }).map((_, i) => {
          const pNum = i + 1;
          const isCurrent = activePlayer === pNum;
          const assignedKey = assignments[`p${pNum}`];

          return (
            <div 
              key={pNum}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.2rem 2rem',
                background: isCurrent ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.3)',
                border: '1px solid',
                borderColor: isCurrent ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                transition: 'all 0.3s ease',
                opacity: pNum > activePlayer ? 0.4 : 1,
                transform: isCurrent ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>CHALLENGER_0{pNum}</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', color: '#fff' }}>PLAYER {pNum}</div>
              </div>

              <div style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: assignedKey ? '#fff' : 'transparent',
                color: assignedKey ? '#020617' : '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: assignedKey ? '0 0 25px rgba(255, 255, 255, 0.4)' : 'none'
              }}>
                {assignedKey === ' ' ? 'SPC' : (assignedKey?.length === 1 ? assignedKey : assignedKey?.replace('arrow', '') || (isCurrent ? '?' : ''))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <button 
          onClick={assignDefaults}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 24px',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.9rem',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            transition: 'all 0.3s ease',
            width: '80%'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#020617'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#fff'; }}
        >
          USE STANDARD KEYS
        </button>

        <button 
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            textDecoration: 'none',
            cursor: 'pointer',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.6
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
        >
          ABANDON CHALLENGE
        </button>
      </div>
    </div>
  );
};

export default ControlAssigner;
