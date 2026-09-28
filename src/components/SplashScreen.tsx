import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export function SplashScreen({ onFinish, durationMs = 2200 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const onFinishRef = useRef(onFinish);

  // Keep ref up to date without triggering re-runs
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    let completed = false;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setProgress(pct);

      if (pct < 100) {
        animationFrameId = requestAnimationFrame(update);
      } else if (!completed) {
        completed = true;
        // Hold 100% briefly (150ms) so user sees the 100% complete state, then transition
        setTimeout(() => {
          onFinishRef.current?.();
        }, 150);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [durationMs]);

  const handleSkip = () => {
    // If player taps screen after 30%, let them skip immediately into the game
    if (progress >= 30) {
      setProgress(100);
      onFinishRef.current?.();
    }
  };

  return (
    <motion.div
      className="splash-screen-stack-root"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 999999,
        backgroundColor: '#1a1008',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
      }}
      onClick={handleSkip}
    >
      {/* ─── STACK LAYER 1: Fullscreen Splash Image (0 padding all sides) ─── */}
      <img
        src="/images/splash_screen.png"
        alt="Chai Wala Tycoon"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          padding: 0,
          margin: 0,
          border: 'none',
        }}
      />

      {/* ─── STACK LAYER 2: Subtle bottom gradient vignette for loader readability ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(to top, rgba(16, 9, 3, 0.88) 0%, rgba(16, 9, 3, 0.5) 55%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ─── STACK LAYER 3: Custom Chai Loader positioned at bottom: 50px ─── */}
      <div
        className="splash-loader-stack-overlay"
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          zIndex: 10,
          width: 'max-content',
          maxWidth: '90vw',
        }}
      >
        {/* Custom Chai Spinner */}
        <div
          style={{
            position: 'relative',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Glowing outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.25, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '3px solid rgba(229, 169, 60, 0.15)',
              borderTopColor: '#f59e0b',
              borderRightColor: '#fbbf24',
              boxShadow: '0 0 18px rgba(245, 158, 11, 0.65), inset 0 0 10px rgba(245, 158, 11, 0.2)',
            }}
          />

          {/* Counter-rotating dashed gold accent ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: '6px',
              borderRadius: '50%',
              border: '2px dashed rgba(254, 243, 199, 0.55)',
            }}
          />

          {/* Steaming Chai Cup Graphic */}
          <motion.div
            animate={{ scale: [0.93, 1.07, 0.93], opacity: [0.85, 1, 0.85] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
            >
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
          </motion.div>
        </div>

        {/* Progress Bar with warm chai glow */}
        <div
          style={{
            width: '180px',
            height: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            borderRadius: '999px',
            overflow: 'hidden',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #fef08a 100%)',
              borderRadius: '999px',
              boxShadow: '0 0 10px #f59e0b',
              transition: 'width 20ms linear',
            }}
          />
        </div>

        {/* Status text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#fef3c7',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.9), 0 0 12px rgba(245, 158, 11, 0.5)',
            }}
          >
            {progress >= 100 ? 'Welcome!' : `Brewing Chai... ${progress}%`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
