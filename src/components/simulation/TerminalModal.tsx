import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './TerminalModal.module.css';

interface TerminalProps {
  onAccessGranted: () => void;
}

const lines = [
  "Interactive system unlocked...",
  "Enter command to proceed:"
];

const TerminalModal: React.FC<TerminalProps> = ({ onAccessGranted }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<'TYPING' | 'INPUT' | 'ERROR' | 'SUCCESS'>('TYPING');

  useEffect(() => {
    // Fade and subtle scale/flicker
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
    }
  }, []);

  useEffect(() => {
    if (phase !== 'TYPING') return;
    let currentLine = 0;
    let currentChar = 0;
    let isCancelled = false;

    const typeInterval = setInterval(() => {
      if (isCancelled) return;

      // Capture the values at this exact moment so React's asynchronous state
      // updater function doesn't see mutated values upon execution.
      const freezeLine = currentLine;
      const freezeChar = currentChar;

      setDisplayText((prev) => {
        const newText = [...prev];
        if (!newText[freezeLine]) newText[freezeLine] = '';
        newText[freezeLine] = lines[freezeLine].substring(0, freezeChar + 1);
        return newText;
      });

      currentChar++;
      if (currentChar >= lines[currentLine].length) {
        currentLine++;
        currentChar = 0;
        if (currentLine >= lines.length) {
          clearInterval(typeInterval);
          setPhase('INPUT');
        }
      }
    }, 50);

    return () => {
      isCancelled = true;
      clearInterval(typeInterval);
    };
  }, [phase]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim().length > 0) {
      const cmd = input.trim().toLowerCase();
      if (cmd === '/avada kedavra' || cmd === 'avada kedavra') {
        setPhase('SUCCESS');
        setTimeout(() => {
          onAccessGranted();
        }, 1500);
      } else {
        setPhase('ERROR');
        setTimeout(() => {
          setInput('');
          setPhase('INPUT');
        }, 2000);
      }
    }
  };

  return (
    <div className={styles.terminalBackdrop}>
      <div className={styles.terminalBox} ref={containerRef}>
        <div className={styles.terminalHeader}>
          <div className={styles.dotGroup}>
            <span className={styles.dot} style={{ background: '#ff5f56' }} />
            <span className={styles.dot} style={{ background: '#ffbd2e' }} />
            <span className={styles.dot} style={{ background: '#27c93f' }} />
          </div>
          <span className={styles.title}>root@local:~</span>
        </div>
        <div className={styles.terminalBody}>
          {displayText.map((line, i) => (
            <div key={i} className={styles.line}>{line}</div>
          ))}

          {phase === 'INPUT' && (
            <div className={styles.inputLine}>
              <span className={styles.prompt}>{'>_'}</span>
              <input
                autoFocus
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.hiddenInput}
                spellCheck={false}
              />
              <span className={styles.inputText}>{input}</span>
              <span className={styles.cursor} />
            </div>
          )}

          {phase === 'ERROR' && (
            <>
              <div className={styles.inputLine}>
                <span className={styles.prompt}>{'>_'}</span>
                <span>{input}</span>
              </div>
              <div className={styles.errorLine}>Invalid command.</div>
              <div className={styles.errorLine}>Access denied.</div>
            </>
          )}

          {phase === 'SUCCESS' && (
            <>
              <div className={styles.inputLine}>
                <span className={styles.prompt}>{'>_'}</span>
                <span>{input}</span>
              </div>
              <div className={styles.successLine}>Access granted.</div>
              <div className={styles.successLine}>Launching environment...</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalModal;
