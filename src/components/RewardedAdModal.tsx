import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, Play, Sparkles, Trophy, Volume2, VolumeX, Wallet, X, Zap } from 'lucide-react';
import { ChaiCup, CoinIcon } from './Illustrations';

export interface RewardedAdProps {
  isOpen: boolean;
  rewardType: 'boost' | 'coins' | 'salary';
  rewardDescription: string;
  onReward: () => void;
  onClose: () => void;
}

export function RewardedAdModal({
  isOpen,
  rewardType,
  rewardDescription,
  onReward,
  onClose,
}: RewardedAdProps) {
  const [timeLeft, setTimeLeft] = useState(5);
  const [completed, setCompleted] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(5);
      setCompleted(false);
      return;
    }

    setTimeLeft(5);
    setCompleted(false);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleClaim = () => {
    onReward();
    onClose();
  };

  const handleCloseAttempt = () => {
    if (completed) {
      handleClaim();
    } else {
      if (confirm('Skip video ad? You will lose this reward.')) {
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="rewarded-ad-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.94)',
          zIndex: 9999999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <motion.div
          className="rewarded-ad-card"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px',
            backgroundColor: '#1f1912',
            borderRadius: '20px',
            border: '1px solid rgba(229, 169, 60, 0.35)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Ad Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  backgroundColor: '#d97706',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 800,
                  letterSpacing: '0.8px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                AD
              </span>
              <span style={{ color: '#d1c7b7', fontSize: '11px', fontWeight: 500 }}>
                {completed ? 'Reward Unlocked!' : `Reward in ${timeLeft}s`}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setMuted(m => !m)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#948c7d',
                  padding: '4px',
                  display: 'flex',
                  cursor: 'pointer',
                }}
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={handleCloseAttempt}
                aria-label="Close ad"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#f6f5ef',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Ad Video Simulator / Creative */}
          <div
            style={{
              padding: '28px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              background: 'radial-gradient(circle at center, #352514 0%, #17110a 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Animated Glow Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, transparent, rgba(245, 158, 11, 0.12), transparent)',
                pointerEvents: 'none',
              }}
            />

            {/* Reward Icon Graphic */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '18px',
                  backgroundColor: '#2e1c0c',
                  border: '2px solid #d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(217, 119, 6, 0.4)',
                }}
              >
                {rewardType === 'boost' ? (
                  <Zap size={38} color="#fbbf24" />
                ) : rewardType === 'salary' ? (
                  <Wallet size={36} color="#4ade80" />
                ) : (
                  <CoinIcon size={38} />
                )}
              </motion.div>

              {completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  <Check size={16} strokeWidth={3} />
                </motion.div>
              )}
            </div>

            <h3
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '6px',
              }}
            >
              {completed ? 'Reward Ready to Claim!' : 'Sponsored Video Ad'}
            </h3>

            <p
              style={{
                fontSize: '13px',
                color: '#d4c5b2',
                maxWidth: '280px',
                lineHeight: 1.5,
                marginBottom: '16px',
              }}
            >
              {rewardDescription}
            </p>

            {/* Countdown / Progress bar */}
            {!completed ? (
              <div style={{ width: '100%', maxWidth: '240px' }}>
                <div
                  style={{
                    height: '6px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${((5 - timeLeft) / 5) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #d97706, #fbbf24)',
                    }}
                  />
                </div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    color: '#948c7d',
                    marginTop: '8px',
                  }}
                >
                  Please wait {timeLeft}s to earn your reward...
                </span>
              </div>
            ) : (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleClaim}
                style={{
                  backgroundColor: '#d97706',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 28px',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(217, 119, 6, 0.5)',
                }}
              >
                <Sparkles size={16} />
                Claim Reward Now
              </motion.button>
            )}
          </div>

          {/* Ad Footer Info */}
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '10px',
              color: '#787062',
            }}
          >
            <span>Demo Ad Unit (Google AdMob Ready)</span>
            <span>Chai Wala Tycoon</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
