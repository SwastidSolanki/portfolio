import React, { useState, useEffect, useRef } from 'react';
import styles from './PulseOfArena.module.css';
import type { TrialProps } from './PathOfTheFallen';

const BOARD_WIDTH = 450;
const BOARD_HEIGHT = 700;
const PUCK_RADIUS = 15;
const MALLET_RADIUS = 30;
const GOAL_WIDTH = 220;
const MAX_SPEED = 28;
const FRICTION = 0.998;
const BW = 10; // Border Width

const PulseOfArena: React.FC<TrialProps> = ({ playerCount: _pc, playerKeys: _pk, onComplete, isMuted: _im }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [victor, setVictor] = useState<string | null>(null);

  const gameState = useRef({
    p1: { x: BOARD_WIDTH / 2, y: BOARD_HEIGHT - 100, vx: 0, vy: 0 },
    p2: { x: BOARD_WIDTH / 2, y: 100, vx: 0, vy: 0 },
    puck: { x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2, vx: 0, vy: 0 },
    keys: {} as Record<string, boolean>
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { gameState.current.keys[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { gameState.current.keys[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resetPuck = () => {
      gameState.current.puck = { x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2, vx: 0, vy: 0 };
    };

    const update = () => {
      if (isGameOver) return;
      const st = gameState.current;
      const speed = 7;

      // Mallet Movement P1 (WASD)
      let p1vx = 0, p1vy = 0;
      if (st.keys['w'] || st.keys['W']) p1vy -= speed;
      if (st.keys['s'] || st.keys['S']) p1vy += speed;
      if (st.keys['a'] || st.keys['A']) p1vx -= speed;
      if (st.keys['d'] || st.keys['D']) p1vx += speed;
      st.p1.vx = p1vx; st.p1.vy = p1vy;
      st.p1.x += p1vx; st.p1.y += p1vy;

      // Mallet Movement P2 (Arrows)
      let p2vx = 0, p2vy = 0;
      if (st.keys['ArrowUp']) p2vy -= speed;
      if (st.keys['ArrowDown']) p2vy += speed;
      if (st.keys['ArrowLeft']) p2vx -= speed;
      if (st.keys['ArrowRight']) p2vx += speed;
      st.p2.vx = p2vx; st.p2.vy = p2vy;
      st.p2.x += p2vx; st.p2.y += p2vy;

      // Bound Mallets
      st.p1.x = Math.max(MALLET_RADIUS, Math.min(BOARD_WIDTH - MALLET_RADIUS, st.p1.x));
      st.p1.y = Math.max(BOARD_HEIGHT / 2 + MALLET_RADIUS, Math.min(BOARD_HEIGHT - MALLET_RADIUS, st.p1.y));
      st.p2.x = Math.max(MALLET_RADIUS, Math.min(BOARD_WIDTH - MALLET_RADIUS, st.p2.x));
      st.p2.y = Math.max(MALLET_RADIUS, Math.min(BOARD_HEIGHT / 2 - MALLET_RADIUS, st.p2.y));

      // Puck Physics
      st.puck.x += st.puck.vx;
      st.puck.y += st.puck.vy;
      st.puck.vx *= FRICTION;
      st.puck.vy *= FRICTION;

      // Wall Collisions (Puck)
      if (st.puck.x <= PUCK_RADIUS || st.puck.x >= BOARD_WIDTH - PUCK_RADIUS) {
        st.puck.vx *= -1;
        st.puck.x = st.puck.x <= PUCK_RADIUS ? PUCK_RADIUS : BOARD_WIDTH - PUCK_RADIUS;
      }
      
      // Goal logic vs Wall logic
      const inGoalX = st.puck.x > (BOARD_WIDTH - GOAL_WIDTH)/2 && st.puck.x < (BOARD_WIDTH + GOAL_WIDTH)/2;
      
      if (st.puck.y <= PUCK_RADIUS) {
        if (inGoalX) {
          setScores((s: { p1: number; p2: number }) => {
            const next = { ...s, p1: s.p1 + 1 };
            if (next.p1 >= 7) { setIsGameOver(true); setVictor('ALPHA'); }
            return next;
          });
          resetPuck();
        } else {
          st.puck.vy *= -1;
          st.puck.y = PUCK_RADIUS;
        }
      } else if (st.puck.y >= BOARD_HEIGHT - PUCK_RADIUS) {
        if (inGoalX) {
          setScores((s: { p1: number; p2: number }) => {
            const next = { ...s, p2: s.p2 + 1 };
            if (next.p2 >= 7) { setIsGameOver(true); setVictor('OMEGA'); }
            return next;
          });
          resetPuck();
        } else {
          st.puck.vy *= -1;
          st.puck.y = BOARD_HEIGHT - PUCK_RADIUS;
        }
      }

      // Circle-Circle Collision (Puck vs Mallets)
      const handleCollision = (mallet: typeof st.p1) => {
        const dx = st.puck.x - mallet.x;
        const dy = st.puck.y - mallet.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const minDist = PUCK_RADIUS + MALLET_RADIUS;

        if (dist < minDist) {
          // Normal vector
          const nx = dx / dist;
          const ny = dy / dist;

          // Push puck out
          st.puck.x = mallet.x + nx * minDist;
          st.puck.y = mallet.y + ny * minDist;

          // Relative velocity
          const rvx = st.puck.vx - mallet.vx;
          const rvy = st.puck.vy - mallet.vy;

          // Vel along normal
          const velAlongNormal = rvx * nx + rvy * ny;

          // Only collide if moving towards each other
          if (velAlongNormal < 0) {
            const j = -1.5 * velAlongNormal; // 1.5 = restitution approx
            st.puck.vx += j * nx;
            st.puck.vy += j * ny;
          }
          
          // Speed cap
          const spd = Math.sqrt(st.puck.vx**2 + st.puck.vy**2);
          if (spd > MAX_SPEED) {
            st.puck.vx = (st.puck.vx/spd) * MAX_SPEED;
            st.puck.vy = (st.puck.vy/spd) * MAX_SPEED;
          }
        }
      };

      handleCollision(st.p1);
      handleCollision(st.p2);
    };

    const draw = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      const st = gameState.current;

      // Draw Borders (Holes for goals)
      ctx.lineWidth = BW;
      ctx.lineCap = 'round';
      const goalStart = (BOARD_WIDTH - GOAL_WIDTH) / 2;
      const goalEnd = (BOARD_WIDTH + GOAL_WIDTH) / 2;
      
      // Top Left: Red
      ctx.strokeStyle = '#ff3131'; ctx.shadowColor = '#ff3131'; ctx.shadowBlur = 25;
      ctx.beginPath(); 
      ctx.moveTo(BW, BOARD_HEIGHT/2); 
      ctx.lineTo(BW, BW); 
      ctx.lineTo(goalStart, BW); 
      ctx.stroke();
      
      // Top Right: Yellow
      ctx.strokeStyle = '#ffe227'; ctx.shadowColor = '#ffe227'; ctx.shadowBlur = 25;
      ctx.beginPath(); 
      ctx.moveTo(goalEnd, BW); 
      ctx.lineTo(BOARD_WIDTH - BW, BW); 
      ctx.lineTo(BOARD_WIDTH - BW, BOARD_HEIGHT/2); 
      ctx.stroke();

      // Bottom Left: Blue
      ctx.strokeStyle = '#0066ff'; ctx.shadowColor = '#0066ff'; ctx.shadowBlur = 25;
      ctx.beginPath(); 
      ctx.moveTo(BW, BOARD_HEIGHT/2); 
      ctx.lineTo(BW, BOARD_HEIGHT - BW); 
      ctx.lineTo(goalStart, BOARD_HEIGHT - BW); 
      ctx.stroke();

      // Bottom Right: Green
      ctx.strokeStyle = '#39ff14'; ctx.shadowColor = '#39ff14'; ctx.shadowBlur = 25;
      ctx.beginPath(); 
      ctx.moveTo(goalEnd, BOARD_HEIGHT - BW); 
      ctx.lineTo(BOARD_WIDTH - BW, BOARD_HEIGHT - BW); 
      ctx.lineTo(BOARD_WIDTH - BW, BOARD_HEIGHT/2); 
      ctx.stroke();

      // Goal Arches (Neon cutout indicators)
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffe227'; ctx.shadowColor = '#ffe227'; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(BOARD_WIDTH/2, BW, GOAL_WIDTH/2, 0, Math.PI); ctx.stroke();
      ctx.strokeStyle = '#ff3131'; ctx.shadowColor = '#ff3131'; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(BOARD_WIDTH/2, BOARD_HEIGHT - BW, GOAL_WIDTH/2, Math.PI, 0); ctx.stroke();

      // Center UI
      ctx.shadowBlur = 5; ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, BOARD_HEIGHT/2); ctx.lineTo(BOARD_WIDTH, BOARD_HEIGHT/2); ctx.stroke();
      ctx.beginPath(); ctx.arc(BOARD_WIDTH/2, BOARD_HEIGHT/2, 60, 0, Math.PI*2); ctx.stroke();
      
      // Mallets - Thick White Hollow Rings with Colored Glow
      ctx.lineWidth = 12;
      
      // P1: Red Glow
      ctx.strokeStyle = '#ffffff'; ctx.shadowColor = '#ff3131'; ctx.shadowBlur = 40;
      ctx.beginPath(); ctx.arc(st.p1.x, st.p1.y, MALLET_RADIUS, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 10; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(st.p1.x, st.p1.y, MALLET_RADIUS - 16, 0, Math.PI * 2); ctx.stroke();

      // P2: Green Glow
      ctx.strokeStyle = '#ffffff'; ctx.shadowColor = '#39ff14'; ctx.shadowBlur = 40;
      ctx.lineWidth = 12;
      ctx.beginPath(); ctx.arc(st.p2.x, st.p2.y, MALLET_RADIUS, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 10; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(st.p2.x, st.p2.y, MALLET_RADIUS - 16, 0, Math.PI * 2); ctx.stroke();

      // Puck - Solid White with extreme glow
      ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 45;
      ctx.beginPath(); ctx.arc(st.puck.x, st.puck.y, PUCK_RADIUS, 0, Math.PI * 2); ctx.fill();
      
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationId);
  }, [isGameOver]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.gameBoard}>
        <canvas 
          ref={canvasRef} 
          width={BOARD_WIDTH} 
          height={BOARD_HEIGHT}
          className={styles.mainCanvas}
        />
      </div>

      <div className={styles.sideUi}>
        <div className={styles.playerInfo}>
          <div className={styles.p2Score}>{scores.p2}</div>
          <div className={styles.pTag}>OMEGA</div>
        </div>
        <div className={styles.middleControl}>
          <div className={styles.pauseBtn}>II</div>
        </div>
        <div className={styles.playerInfo}>
          <div className={styles.pTag}>ALPHA</div>
          <div className={styles.p1Score}>{scores.p1}</div>
        </div>
      </div>

      {isGameOver && (
        <div className={styles.resultsOverlay}>
          <div className={styles.resultsCard}>
            <h1>{victor}</h1>
            <p>CHALLENGE CONCLUDED</p>
            <button onClick={() => onComplete(victor!)}>RETURN TO ARENA</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PulseOfArena;
