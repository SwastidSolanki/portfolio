import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface TrialProps {
  playerCount: number;
  playerKeys: Record<string, string>;
  onComplete: (score: string) => void;
  onExit?: () => void;
  isMuted: boolean;
}

type ObstacleType = 'box' | 'bird' | 'projectile';

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: ObstacleType;
  laneIdx: number;
  vy?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Trail {
  x: number;
  y: number;
  life: number;
  color: string;
}

interface PlayerState {
  id: string;
  name: string;
  keyLabel: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  groundY: number;
  isAlive: boolean;
}

const PLAYER_COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899'];

const PathOfTheFallen: React.FC<TrialProps> = ({ playerCount, playerKeys, onComplete, isMuted }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const [gameStateStage, setGameStateStage] = useState<'COUNTDOWN' | 'PLAYING' | 'GAMEOVER'>('COUNTDOWN');
  const [countdown, setCountdown] = useState(3);
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const stateRef = useRef({
    width: 800,
    height: 400,
    speed: 5,
    frames: 0,
    score: 0,
    players: [] as PlayerState[],
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    trails: [] as Trail[],
  });

  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(window.innerHeight * 0.65);
      canvasRef.current.width = w;
      canvasRef.current.height = h;

      stateRef.current.width = w;
      stateRef.current.height = h;

      const laneHeight = h / playerCount;

      const pStates: PlayerState[] = [];
      for (let i = 0; i < playerCount; i++) {
        const pId = `p${i + 1}`;
        pStates.push({
          id: pId,
          name: `Challenger 0${i + 1}`,
          keyLabel: playerKeys[pId]?.toUpperCase() || '?',
          color: PLAYER_COLORS[i],
          x: w * 0.1,
          y: (i + 1) * laneHeight - 50,
          width: 35,
          height: 35,
          velocityY: 0,
          isJumping: false,
          groundY: (i + 1) * laneHeight - 50,
          isAlive: true
        });
      }
      stateRef.current.players = pStates;
    }
  }, [playerCount, playerKeys]);

  const playSound = useCallback((type: 'jump' | 'crash' | 'tick' | 'go') => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      if (type === 'jump') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
      } else if (type === 'crash') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'tick') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'go') {
        osc.type = 'square'; osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
      }

      osc.connect(gain); gain.connect(audioCtx.destination);
    } catch (e) { }
  }, [isMuted]);

  useEffect(() => {
    if (gameStateStage !== 'COUNTDOWN') return;
    let count = 3;
    playSound('tick');
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        playSound('tick');
      } else {
        setCountdown(0);
        setGameStateStage('PLAYING');
        playSound('go');
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [gameStateStage, playSound]);

  const jump = useCallback((playerIdx: number) => {
    if (gameStateStage !== 'PLAYING') return;
    const p = stateRef.current.players[playerIdx];
    if (p && p.isAlive && !p.isJumping) {
      p.velocityY = -14;
      p.isJumping = true;
      playSound('jump');

      for (let i = 0; i < 12; i++) {
        stateRef.current.particles.push({
          x: p.x + p.width / 2, y: p.y + p.height,
          vx: (Math.random() - 0.5) * 6, vy: Math.random() * 3,
          life: 1.2, color: p.color
        });
      }
    }
  }, [gameStateStage, playSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      Object.entries(playerKeys).forEach(([_pId, boundKey], idx) => {
        if (boundKey === key) jump(idx);
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, playerKeys]);

  const handleTouch = (e: React.TouchEvent) => {
    if (gameStateStage !== 'PLAYING') return;
    Array.from(e.changedTouches).forEach(touch => {
      const zoneWidth = window.innerWidth / playerCount;
      const idx = Math.floor(touch.clientX / zoneWidth);
      if (idx >= 0 && idx < playerCount) {
        jump(idx);
      }
    });
  };

  useEffect(() => {
    if (gameStateStage !== 'PLAYING') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    let stopped = false;
    const gravity = 0.68;
    const st = stateRef.current;
    st.speed = 3.5;

    const gameLoop = () => {
      if (stopped) return;

      st.frames++;
      st.speed += 0.0006;
      st.score += 1;

      ctx.clearRect(0, 0, st.width, st.height);

      st.players.forEach((player) => {
        if (!player.isAlive) return;

        if (st.frames % 3 === 0) {
          st.trails.push({ x: player.x, y: player.y, color: player.color, life: 1 });
        }

        if (player.isJumping) {
          player.velocityY += gravity;
          player.y += player.velocityY;
          if (player.y >= player.groundY) {
            player.y = player.groundY;
            player.isJumping = false;
            player.velocityY = 0;

            for (let i = 0; i < 8; i++) {
              st.particles.push({
                x: player.x + player.width / 2, y: player.y + player.height,
                vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 3,
                life: 0.6, color: player.color
              });
            }
          }
        }
      });

      st.trails.forEach(t => { t.life -= 0.04; t.x -= st.speed; });
      st.trails = st.trails.filter(t => t.life > 0);

      st.particles.forEach(p => {
        p.x += p.vx - st.speed;
        p.y += p.vy;
        p.vy += 0.12;
        p.life -= 0.02;
      });
      st.particles = st.particles.filter(p => p.life > 0);

      const spawnRate = Math.max(40, Math.floor(160 - st.speed * 10));
      if (st.frames % spawnRate === 0) {
        let aliveLanes: number[] = [];
        st.players.forEach((p, idx) => { if (p.isAlive) aliveLanes.push(idx); });

        if (aliveLanes.length > 0) {
          const createObs = (laneIdx: number, type: ObstacleType): Obstacle => {
            const groundY = st.players[laneIdx].groundY;
            if (type === 'box') return { x: st.width + 60, y: groundY, w: 30, h: 35, type, laneIdx };
            if (type === 'bird') return { x: st.width + 60, y: groundY - 60, w: 35, h: 20, type, laneIdx, vy: 0 };
            return { x: st.width + 60, y: groundY - 30, w: 40, h: 10, type: 'projectile', laneIdx };
          };

          const targetLane = aliveLanes[Math.floor(Math.random() * aliveLanes.length)];
          const type: ObstacleType = st.speed < 5 ? 'box' : (Math.random() > 0.6 ? 'bird' : 'box');
          st.obstacles.push(createObs(targetLane, type));

          if (st.speed > 8 && Math.random() > 0.6) {
            const secLane = aliveLanes.filter(l => l !== targetLane)[0];
            if (secLane !== undefined) st.obstacles.push(createObs(secLane, 'box'));
          }
        }
      }

      st.obstacles.forEach(obs => {
        let spd = st.speed;
        if (obs.type === 'projectile') spd *= 1.6;
        obs.x -= spd;
        if (obs.type === 'bird') obs.y += Math.sin(st.frames / 12) * 2.5;

        const p = st.players[obs.laneIdx];
        if (p && p.isAlive) {
          if (p.x < obs.x + obs.w && p.x + p.width > obs.x && p.y < obs.y + obs.h && p.y + p.height > obs.y) {
            p.isAlive = false;
            playSound('crash');
            for (let i = 0; i < 30; i++) {
              st.particles.push({
                x: p.x + p.width / 2, y: p.y + p.height / 2,
                vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15,
                life: 1.5, color: '#ef4444'
              });
            }
          }
        }
      });

      st.obstacles = st.obstacles.filter(o => o.x > -100);

      const laneHeight = st.height / playerCount;
      for (let i = 0; i < playerCount; i++) {
        const p = st.players[i];
        const ly = i * laneHeight;
        const gy = p.groundY + p.height;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, gy); ctx.lineTo(st.width, gy);
        ctx.stroke();

        if (!p.isAlive) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
          ctx.fillRect(0, ly, st.width, laneHeight);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.font = 'bold 1.2rem "Cinzel", serif';
          ctx.textAlign = 'center';
          ctx.fillText("CHALLENGE LOST // ELIMINATED", st.width / 2, ly + laneHeight / 2 + 10);
        }
      }

      st.trails.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.globalAlpha = t.life * 0.15;
        ctx.fillRect(t.x, t.y, 35, 35);
      });
      ctx.globalAlpha = 1.0;

      st.players.forEach(p => {
        if (!p.isAlive) return;
        ctx.shadowBlur = 25;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.shadowBlur = 0;
      });

      st.obstacles.forEach(obs => {
        ctx.fillStyle = obs.type === 'bird' ? '#a855f7' : obs.type === 'projectile' ? '#f59e0b' : '#ef4444';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      });

      st.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x, p.y, 4, 4);
      });
      ctx.globalAlpha = 1.0;

      if (st.score % 10 === 0) setScore(Math.floor(st.score / 10));

      const alive = st.players.filter(p => p.isAlive);
      if (alive.length === 1 && playerCount > 1) {
        setWinner(`${alive[0].name.toUpperCase()} VICTORIOUS`);
        setGameStateStage('GAMEOVER');
        stopped = true;
      } else if (alive.length === 0) {
        setWinner('ALL CHALLENGERS PERISHED');
        setGameStateStage('GAMEOVER');
        stopped = true;
      }

      if (!stopped) requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => { stopped = true; if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [gameStateStage, playSound, playerCount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }} ref={containerRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2rem', marginBottom: '1rem', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: '#f8fafc', fontSize: '1.8rem', letterSpacing: '0.15em' }}>PATH OF THE FALLEN</h3>
        <span style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8', fontSize: '1.2rem', letterSpacing: '0.2em' }}>SCORE: {score}</span>
      </div>

      <div
        style={{
          flex: 1,
          width: '100%',
          background: 'rgba(2, 6, 23, 0.6)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative'
        }}
        onTouchStart={handleTouch}
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {gameStateStage === 'COUNTDOWN' && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.7)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
            <span style={{ fontSize: '8rem', fontWeight: 'bold', fontFamily: 'Cinzel, serif', color: '#fff', textShadow: '0 0 50px rgba(255,255,255,0.3)', transform: `scale(${1 + ((3 - countdown) * 0.2)})`, transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
              {countdown > 0 ? countdown : 'BEGIN'}
            </span>
          </div>
        )}

        {gameStateStage === 'GAMEOVER' && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 10, animation: 'cinematicFade 0.8s ease' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#fff', marginBottom: '1rem', fontSize: '4.5rem', letterSpacing: '0.1em' }}>{winner}</h2>
            <p style={{ color: '#94a3b8', marginBottom: '4rem', fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', letterSpacing: '0.4em' }}>CHALLENGE COMPLETE // SCORE: {score}</p>
            <button style={{ background: '#fff', color: '#020617', padding: '18px 48px', fontSize: '1.1rem', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: '700', letterSpacing: '0.2em', transition: 'all 0.3s' }}
              onClick={() => onComplete(`Score: ${score} - ${winner}`)}>
              DISMISS RESULT
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', width: '100%', padding: '1.5rem', color: '#64748b', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
        {Object.entries(playerKeys).map(([pId, key], idx) => (
          <span key={pId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PLAYER_COLORS[idx] }}></span>
            PLAYER_0{idx + 1} [ {key.toUpperCase()} ]
          </span>
        ))}
      </div>
    </div>
  );
};

export default PathOfTheFallen;
