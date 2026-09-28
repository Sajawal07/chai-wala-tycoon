import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Bell, BookOpen, Check, ChevronRight, CircleHelp,
  Clock3, CloudRain, Coffee, Expand, Flame, Gift, Heart, Leaf, LockKeyhole,
  Map, MapPin, Moon, Pause, Play, Plus, RotateCcw, Settings2, ShieldCheck,
  Sparkles, Star, Store, Sun, Trophy, UsersRound, Volume2, VolumeX, Wallet, X, Zap
} from 'lucide-react';
import { App as CapApp } from '@capacitor/app';
import {
  ACHIEVEMENTS, DRINKS, INGREDIENTS, LOCATIONS, RECIPES, SIDE_ITEMS, isSide,
  WORKERS, formatCoins, useGame, cupsToNextLevel, levelProgress, type Customer, type Game, type IngredientId,
  type ModalName, type StaffId, type OrderId
} from './game';
import { Avatar, CartIllustration, ChaiCup, CoinIcon, IngredientArt, StaffFigure, WashBasin } from './components/Illustrations';
import { BargainDialog, CelebrationDialog, GameOverlay, type ShopTab } from './components/Overlays';
import { SplashScreen } from './components/SplashScreen';
import { RewardedAdModal } from './components/RewardedAdModal';
import { setAmbientMode, resumeAudioContext } from './utils/ambientSound';

type OpenOverlay = (name: ModalName, tab?: ShopTab) => void;

function AnimatedCoins({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) { setDisplay(value); previous.current = value; return; }
    const controls = animate(previous.current, value, {
      duration: 0.7,
      ease: 'easeOut',
      onUpdate: latest => setDisplay(Math.round(latest))
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reducedMotion]);
  return <span className="coin-number">{formatCoins(display)}</span>;
}

function Sidebar({ game, modal, open, close }: { game: Game; modal: ModalName | null; open: OpenOverlay; close: () => void }) {
  const readyAchievements = ACHIEVEMENTS.filter(a => a.progress(game.save) >= a.target && !game.save.claimedAchievements.includes(a.id)).length;
  const primary = [
    { name: 'My thela', icon: Store, modal: null },
    { name: 'Upgrade shop', icon: Sparkles, modal: 'upgrades' as const },
    { name: 'My people', icon: UsersRound, modal: 'staff' as const },
    { name: 'City map', icon: Map, modal: 'map' as const },
  ];
  return (
    <aside className="sidebar">
      <button className="brand" onClick={close} aria-label="Chai Wala Tycoon home">
        <ChaiCup size={46} />
        <span className="brand-type">chai wala<span>TYCOON</span></span>
      </button>
      <div className="sidebar-main">
        <span className="nav-caption">YOUR LITTLE EMPIRE</span>
        <nav className="primary-nav" aria-label="Main navigation">
          {primary.map(item => (
            <button
              key={item.name}
              className={`nav-item ${modal === item.modal ? 'active' : ''}`}
              aria-current={modal === item.modal ? 'page' : undefined}
              onClick={() => item.modal ? open(item.modal) : close()}
              title={item.name}
            >
              <item.icon size={20} strokeWidth={1.65} />
              <span>{item.name}</span>
              {item.modal === 'staff' && game.save.served < 5 && <LockKeyhole size={12} className="nav-lock" />}
              {item.modal === 'upgrades' && <span className="nav-new">+</span>}
            </button>
          ))}
        </nav>
        <div className="secondary-nav">
          <span className="nav-caption">MORE TO YOUR STORY</span>
          <nav aria-label="Game information">
            <button
              className={`nav-item ${modal === 'achievements' ? 'active' : ''}`}
              onClick={() => open('achievements')}
              title="Achievements"
            >
              <Trophy size={19} strokeWidth={1.6} />
              <span>Little milestones</span>
              {readyAchievements > 0 && <span className="nav-dot" />}
            </button>
            <button
              className={`nav-item ${modal === 'guide' ? 'active' : ''}`}
              onClick={() => open('guide')}
              title="How to play"
            >
              <BookOpen size={19} strokeWidth={1.6} />
              <span>How to play</span>
            </button>
          </nav>
        </div>
        <div className="sidebar-journey">
          <span className="nav-caption">ONE CUP AT A TIME</span>
          <div className="journey-label">
            <strong>{game.level >= 5 ? 'Neighborhood favorite' : game.level >= 3 ? 'The local chai hero' : 'Roadside dreamer'}</strong>
            <span>LV. {game.level}</span>
          </div>
          <div className="progress-track">
            <i style={{ width: `${Math.max(6, Math.round(levelProgress(game.save.served) * 100))}%` }} />
          </div>
          <p>{cupsToNextLevel(game.save.served)} cups to your next chapter</p>
        </div>
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-illustration">
          <CartIllustration size={136} />
          <p>Big dreams start small.</p>
          <span>Make your next cup count.</span>
        </div>
        <div className="sidebar-tools">
          <button className="sound-toggle" onClick={game.toggleSound} aria-label={game.save.sound ? 'Mute game sound' : 'Turn on game sound'}>
            {game.save.sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
            <span>Sound {game.save.sound ? 'on' : 'off'}</span>
          </button>
          <button className="icon-button" onClick={() => open('settings')} aria-label="Settings">
            <Settings2 size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function MobileTopHud({ game, open }: { game: Game; open: OpenOverlay }) {
  const currentMinutes = 8 * 60 + 30 + Math.floor((game.clock % 360) * 2);
  const formattedTime = `${Math.floor(currentMinutes / 60) % 12 || 12}:${String(currentMinutes % 60).padStart(2, '0')} ${currentMinutes >= 720 ? 'PM' : 'AM'}`;
  const cupsToNext = cupsToNextLevel(game.save.served);
  const xpPercent = Math.max(8, Math.round(levelProgress(game.save.served) * 100));
  const gasPercent = Math.min(100, Math.max(0, (game.gasInfo.kg / game.gasInfo.capacityKg) * 100));

  return (
    <div className="mobile-hud" role="region" aria-label="Mobile Status HUD">
      {/* Primary Row: Brand, Coins, Rating, Controls */}
      <div className="hud-primary-row">
        <div className="hud-brand" onClick={() => open('guide')} role="button" tabIndex={0}>
          <ChaiCup size={32} />
          <div className="hud-brand-copy">
            <span className="hud-brand-name">chai wala</span>
            <span className="hud-level-pill">LV. {game.level}</span>
          </div>
        </div>

        <div className="hud-coins-wrapper">
          <div className="wallet-chip" onClick={() => open('achievements')} role="button" tabIndex={0} title="Coins">
            <CoinIcon size={21} />
            <AnimatedCoins value={game.save.coins} />
            <button onClick={(e) => { e.stopPropagation(); open('achievements'); }} aria-label="Earn bonus coins" title="Bonus coins">
              <Plus size={13} />
            </button>
          </div>
          <div className="hud-rating-chip" title="Rating">
            <Star size={13} fill="currentColor" />
            <strong>{game.save.rating.toFixed(1)}</strong>
          </div>
        </div>

        <div className="hud-quick-tools">
          <button
            className="hud-tool-btn"
            onClick={() => open('settings')}
            aria-label="Settings"
            title="Settings"
          >
            <Settings2 size={16} />
          </button>
        </div>
      </div>

      {/* Resource & Time Row */}
      <div className="hud-resource-row">
        {/* Game Clock */}
        <div className="hud-pill hud-time-pill" title={`Time: ${formattedTime}`}>
          <Clock3 size={13} />
          <span>{formattedTime}</span>
          {game.night && <Moon size={11} className="hud-night-icon" />}
          {game.rushHour && <Zap size={11} className="hud-rush-icon" />}
        </div>

        {/* Gas Bar & Refill */}
        <div
          className={`hud-pill hud-gas-pill ${game.gasInfo.kg <= 0.4 ? 'low-gas' : ''}`}
          onClick={() => {
            if (game.gasInfo.kg <= 0.5 && !game.gasFilling.active) {
              const tier = game.gasInfo.tiers.find(t => !t.locked && game.save.coins >= t.cost);
              if (tier) game.buyGas(tier.kg);
              else open('upgrades', 'kitchen');
            } else {
              open('upgrades', 'kitchen');
            }
          }}
          role="button"
          tabIndex={0}
          title="Gas system"
        >
          <Flame size={13} />
          <span className="hud-pill-label">
            {game.gasFilling.active ? 'Filling...' : `${game.gasInfo.kg.toFixed(1)}kg`}
          </span>
          <div className="hud-mini-bar">
            <i style={{ width: `${gasPercent}%` }} />
          </div>
          {game.gasInfo.kg <= 0.4 && !game.gasFilling.active && (
            <span className="hud-pill-action">+Gas</span>
          )}
        </div>

        {/* Cup Inventory & Wash */}
        <div
          className={`hud-pill hud-cup-pill ${game.cleanCups === 0 ? 'empty-cups' : ''}`}
          onClick={() => {
            if (game.dirtyCups > 0 && !game.wash.active && !game.manuallyPaused && game.busyTask === null) {
              game.washCups();
            } else {
              open('upgrades', 'kitchen');
            }
          }}
          role="button"
          tabIndex={0}
          title="Cups inventory"
        >
          <Coffee size={13} />
          <span className="hud-pill-label">
            {game.wash.active ? 'Washing...' : `${game.cleanCups} clean`}
          </span>
          {game.dirtyCups > 0 && !game.wash.active && (
            <span className="hud-pill-action wash-action">Wash ({game.dirtyCups})</span>
          )}
        </div>

        {/* Speed Controls: 1x, 2x, 3x */}
        <div className="hud-speed-controls" role="group" aria-label="Game Speed">
          {([1, 2, 3] as const).map(s => (
            <button
              key={s}
              className={`hud-speed-btn ${game.save.speed === s ? 'active' : ''}`}
              onClick={() => game.setSpeed(s)}
              aria-label={`Speed ${s}x`}
              aria-pressed={game.save.speed === s}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Level XP Progress Bar */}
      <div className="hud-xp-row" title={`${cupsToNext} cups to Level ${game.level + 1}`}>
        <div className="hud-xp-bar">
          <i style={{ width: `${xpPercent}%` }} />
        </div>
        <span className="hud-xp-caption">{cupsToNext} cups to Lv.{game.level + 1}</span>
      </div>
    </div>
  );
}

function Topbar({ game, open }: { game: Game; open: OpenOverlay }) {
  return (
    <header className="topbar">
      <div className="topbar-note">
        <Sun size={20} strokeWidth={1.6} />
        <span>A new day. A fresh brew.</span>
      </div>
      <button className="mobile-brand" onClick={() => open('guide')}>
        <ChaiCup size={35} />
        <span>chai wala</span>
      </button>
      <div className="topbar-right">
        <div className="wallet-chip">
          <CoinIcon size={25} />
          <AnimatedCoins value={game.save.coins} />
          <button onClick={() => open('achievements')} aria-label="Earn bonus coins" title="A little something extra">
            <Plus size={14} />
          </button>
        </div>
        <div className="rating-chip" title="Your service rating. Serve quickly to earn more neighborhood love.">
          <Star size={20} fill="currentColor" strokeWidth={1.3} />
          <strong>{game.save.rating.toFixed(1)}</strong>
          <span>good chai, good vibes</span>
        </div>
        <div className="topbar-divider" />
        <button className="icon-button notification-button" aria-label="Neighborhood news and special events" onClick={() => open('events')}>
          <Bell size={20} />
          <i />
        </button>
        <button className="profile-button" aria-label="Your game settings" onClick={() => open('settings')}>
          <Avatar kind="regular" size={39} />
        </button>
      </div>
    </header>
  );
}

function GameScene({ game, open }: { game: Game; open: OpenOverlay }) {
  const panel = useRef<HTMLElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const st = game.stoves[game.activeStove] ?? game.stoves[0];
  const inProgress = st.phase === 'heating' || st.phase === 'brewing';
  const coldDrink = st.recipe === 'lassi';
  const phaseText = {
    idle: coldDrink ? 'Your matka is ready.' : 'Your stove is ready.',
    heating: 'A little fire. A little patience.',
    adding: 'Tap or drag in the good stuff.',
    brewing: coldDrink ? 'Whisking up something cool.' : 'Something good is brewing.',
    ready: `${st.cups} ${coldDrink ? 'cool' : 'warm'} ${st.cups === 1 ? 'cup' : 'cups'}, ready to make a day.`
  }[st.phase];
  const buttonText = {
    idle: coldDrink ? 'Make lassi' : `Brew ${RECIPES[st.recipe].shortName}`,
    heating: 'Warming up...',
    adding: 'Add ingredients',
    brewing: coldDrink ? 'Whisking...' : 'Brewing...',
    ready: coldDrink ? `Serve lassi (${st.cups})` : `Serve ${RECIPES[st.recipe].shortName} (${st.cups})`
  }[st.phase];
  const minutes = 8 * 60 + 30 + Math.floor((game.clock % 360) * 2);
  const time = `${Math.floor(minutes / 60) % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${minutes >= 720 ? 'PM' : 'AM'}`;

  useEffect(() => {
    const handler = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (panel.current?.requestFullscreen) await panel.current.requestFullscreen();
      else game.notify('Full-screen mode unavailable.', 'info');
    } catch {
      game.notify('Full-screen mode unavailable.', 'info');
    }
  };

  const handleIngredientDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const ingredient = event.dataTransfer.getData('chai-ingredient') as IngredientId;
    if (Object.prototype.hasOwnProperty.call(INGREDIENTS, ingredient) && !game.manuallyPaused) {
      game.addIngredient(ingredient);
    }
  };

  // Stove slot definitions for Stove 1, Stove 2, Stove 3
  const stoveSlots = [
    { index: 0, label: 'Stove 1', requiredLevel: 1, unlocked: true },
    { index: 1, label: 'Stove 2', requiredLevel: 7, unlocked: game.stoves.length >= 2 },
    { index: 2, label: 'Stove 3', requiredLevel: 11, unlocked: game.stoves.length >= 3 },
  ];

  return (
    <section className="play-panel" ref={panel} aria-label="Your interactive chai thela">
      <div className={`game-scene ${game.save.weather === 'rainy' ? 'rainy' : ''} ${game.save.skin === 'festival' ? 'festival-scene' : ''} ${game.night ? 'night' : ''}`}>
        <motion.img
          className="street-image"
          key={game.location.id}
          src={game.location.image}
          alt="A cozy illustrated chai cart"
          initial={{ opacity: 0, scale: 1.035 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          fetchPriority="high"
        />
        <div className="scene-light" />
        <div className="night-overlay" aria-hidden="true" />
        <div className="dhaba-glow" aria-hidden="true" />
        <div className="dhaba-lights" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className={`event-lights ${game.eventActive ? 'on' : ''}`} aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => <i key={i} />)}
        </div>
        <div className="scene-top">
          <div className="location-hud">
            <span className="location-hud-icon"><MapPin size={17} /></span>
            <div>
              <strong>{game.location.name}</strong>
              <span>LEVEL {game.level}<i />YOUR {game.save.activeLocation === 'thela' ? 'LITTLE THELA' : game.save.activeLocation.toUpperCase()}</span>
            </div>
          </div>
          <div className="scene-top-right">
            <button
              className="weather-hud"
              onClick={() => game.setWeather(game.save.weather === 'sunny' ? 'rainy' : 'sunny')}
              aria-label={`Weather is ${game.save.weather}. Click to change.`}
            >
              {game.save.weather === 'sunny' ? <Sun className="sun-icon" size={24} strokeWidth={1.6} /> : <CloudRain size={24} strokeWidth={1.6} />}
              <span>
                <strong>{game.save.weather === 'sunny' ? '28' : '22'}&deg;C</strong>
                <small>{game.night ? 'Night' : game.rushHour ? 'Rush!' : time}</small>
              </span>
            </button>
          </div>
        </div>

        <div className={`pot-steam ${inProgress ? 'active-steam' : ''}`} aria-hidden="true"><i /><i /><i /></div>

        <AnimatePresence>
          {game.ingredientDrop && (
            <motion.div
              className="ingredient-fall"
              aria-hidden="true"
              key={game.ingredientDrop.id}
              initial={{ y: -68, opacity: 0, scale: 0.6, rotate: -16 }}
              animate={{ y: [-68, -9, 4], opacity: [0, 1, 0], scale: [0.6, 1.15, 0.4], rotate: [-16, 6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, times: [0, 0.65, 1] }}
            >
              <IngredientArt type={game.ingredientDrop.ingredient} size={38} />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className={`pot-hotspot ${dragOver ? 'drag-over' : ''} ${st.phase === 'adding' ? 'awaiting-ingredients' : ''}`}
          onClick={() => {
            if (game.manuallyPaused) return;
            if (st.phase === 'idle') game.startBrew();
            else if (st.phase === 'ready') game.serveCustomer();
            else if (st.phase === 'adding') game.notify('Tap an ingredient below to add it to the pot.', 'info');
          }}
          onDragOver={event => { event.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleIngredientDrop}
          aria-label={st.phase === 'adding' ? 'Pot: drop ingredients' : st.phase === 'ready' ? 'Serve chai' : 'Tap stove to brew'}
          disabled={game.manuallyPaused}
        >
          <span>{st.phase === 'adding' ? 'Add ingredients' : st.phase === 'ready' ? 'Ready to serve' : 'Put the kettle on'}</span>
          {st.phase === 'adding' && <Plus size={24} />}
        </button>

        {game.save.weather === 'rainy' && (
          <div className="rain-particles" aria-hidden="true">
            {Array.from({ length: 32 }, (_, i) => (
              <i key={i} style={{ left: `${(i * 3.17) % 100}%`, animationDelay: `${i * 0.073}s`, animationDuration: `${0.65 + (i % 5) * 0.13}s` }} />
            ))}
          </div>
        )}

        {game.save.skin === 'festival' && (
          <div className="festival-lanterns" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} style={{ left: `${8 + i * 10.5}%`, top: `${9 + Math.sin((i / 8) * Math.PI) * 24}px`, animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        )}

        {/* Visible staff at the dhaba */}
        {Object.entries(game.save.staff).map(([id, w]) => {
          if (!w.hired) return null;
          const worker = WORKERS.find(x => x.id === id);
          if (!worker) return null;
          const positions: Record<string, string> = {
            washer: 'staff-washer', helper: 'staff-helper', cashier: 'staff-cashier',
            cook: 'staff-cook', gasman: 'staff-gasman'
          };
          return (
            <div key={id} className={`staff-sprite ${positions[id] || ''} ${w.onStrike ? 'on-strike' : ''}`} aria-label={`${worker.name} ${w.onStrike ? 'on strike' : 'working'}`}>
              {id === 'washer' && <WashBasin />}
              <StaffFigure role={id as StaffId} size={50} />
              {w.onStrike && <span className="strike-sign">STRIKE</span>}
            </div>
          );
        })}

        <AnimatePresence>
          {st.phase !== 'idle' && !game.manuallyPaused && (
            <motion.div
              className={`brew-world-message ${st.phase === 'ready' ? 'ready-message' : ''}`}
              key={st.phase === 'ready' ? 'ready' : 'progress'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {st.phase === 'ready' ? (
                <>
                  <div
                    className="draggable-cup"
                    draggable
                    onDragStart={event => event.dataTransfer.setData('chai-cup', st.recipe)}
                    onClick={() => game.serveCustomer()}
                    title="Tap to serve"
                  >
                    <ChaiCup size={44} />
                  </div>
                  <span>
                    <strong>{coldDrink ? 'Thandi thandi lassi!' : 'Garam garam chai!'}</strong>
                    <small>Tap or drag to serve</small>
                  </span>
                  <span className="ready-cup-count">{st.cups}</span>
                </>
              ) : (
                <>
                  {st.phase === 'adding' ? <Leaf size={18} /> : <Flame size={18} />}
                  <span>
                    {st.phase === 'adding'
                      ? `${st.ingredients.length} of ${RECIPES[st.recipe].ingredients.length} ingredients added`
                      : st.phase === 'heating'
                      ? 'Warming up...'
                      : coldDrink
                      ? 'Whisking lassi...'
                      : 'Brewing chai...'}
                  </span>
                  {inProgress && <span className="world-progress" style={{ width: `${st.progress}%` }} />}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="scene-bottom">
          <div className="scene-utility">
            <button className="scene-icon-button" onClick={game.togglePause} aria-label={game.manuallyPaused ? 'Resume' : 'Pause'} title="Pause">
              {game.manuallyPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button className="scene-icon-button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit' : 'Full screen'} title="Full screen">
              {fullscreen ? <X size={16} /> : <Expand size={15} />}
            </button>
          </div>
          <button className={`boost-link ${game.boostActive ? 'boost-active' : ''}`} onClick={() => open('boost')}>
            <Zap size={14} fill="currentColor" />
            {game.boostActive ? `2x speed / ${Math.max(0, Math.ceil((game.save.boostUntil - Date.now()) / 1000))}s` : 'Boost'}
            {!game.boostActive && <ChevronRight size={14} />}
          </button>
        </div>

        {game.eventActive && <div className="rush-label"><span className="status-dot" />Match-day rush! +50% coins</div>}

        <AnimatePresence>
          {game.manuallyPaused && (
            <motion.div className="pause-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ChaiCup size={72} />
              <h3>Your chai can wait.</h3>
              <p>Take a breath. The neighborhood will be right here.</p>
              <button className="button" onClick={game.togglePause}><Play size={16} />Resume game</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {game.reward && (
            <motion.div
              className="coin-reward"
              key={game.reward.id}
              initial={{ opacity: 0, y: 20, scale: 0.7 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, -20, -60, -105], scale: [0.7, 1.1, 1, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6 }}
            >
              <CoinIcon size={32} />
              <strong>+{game.reward.amount}</strong>
              {Array.from({ length: 6 }, (_, i) => (
                <motion.span
                  key={i}
                  className="burst-coin"
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ x: (i - 2.5) * 34, y: [-10, -60 - (i % 3) * 12, -15], opacity: [0, 1, 0], rotate: (i - 3) * 70 }}
                  transition={{ duration: 1.1, delay: i * 0.04 }}
                >
                  <CoinIcon size={15} />
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {game.upgradePulse > 0 && (
          <motion.div key={game.upgradePulse} className="upgrade-glow" initial={{ opacity: 0.75 }} animate={{ opacity: 0 }} transition={{ duration: 1.5 }} />
        )}
      </div>

      {/* Brewing Station Controls */}
      <div className="brewing-station">
        {/* Stove Tabs: Stove 1 | Stove 2 | Stove 3 */}
        <div className="station-top-row">
          <div className="stove-tabs" role="tablist" aria-label="Select stove">
            {stoveSlots.map(slot => {
              const currentStoveState = game.stoves[slot.index];
              const isSelected = game.activeStove === slot.index && slot.unlocked;
              return (
                <button
                  key={slot.index}
                  className={`stove-tab ${isSelected ? 'active' : ''} ${!slot.unlocked ? 'stove-locked' : ''}`}
                  onClick={() => {
                    if (!slot.unlocked) {
                      game.notify(
                        slot.index === 1
                          ? 'Unlock Stove 2 at Level 7 in the Upgrade Shop!'
                          : 'Unlock Stove 3 at Level 11 in the Upgrade Shop!',
                        'info',
                        { label: 'Shop', onClick: () => open('upgrades', 'kitchen') }
                      );
                      return;
                    }
                    game.selectStove(slot.index);
                  }}
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={slot.unlocked ? `Use ${slot.label}: ${RECIPES[currentStoveState.recipe].name}` : `${slot.label} Locked`}
                >
                  <div className="stove-tab-top">
                    <strong>{slot.label}</strong>
                    {slot.unlocked ? (
                      <span className={`stove-phase-dot ${currentStoveState.phase}`} title={currentStoveState.phase} />
                    ) : (
                      <span className="stove-lock-badge"><LockKeyhole size={10} />Lv.{slot.requiredLevel}</span>
                    )}
                  </div>
                  {slot.unlocked && (
                    <span className="stove-subtext">
                      {currentStoveState.phase === 'ready'
                        ? `✓ ${currentStoveState.cups} cups`
                        : currentStoveState.phase === 'brewing'
                        ? `♨ ${Math.round(currentStoveState.progress)}%`
                        : RECIPES[currentStoveState.recipe].shortName}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stove Heading & Drink Selector */}
        <div className="station-heading">
          <div className="station-info-left">
            <span className="eyebrow">STOVE {game.activeStove + 1} &middot; {RECIPES[st.recipe].name}</span>
            <span className="station-cups-detail">{2 + game.save.upgrades.pot} cups per batch &middot; {RECIPES[st.recipe].prepMinutes}m brew</span>
          </div>

          {/* Quick Recipe Pills (When Stove is Idle) */}
          {st.phase === 'idle' && (
            <div className="recipe-quick-pills" role="radiogroup" aria-label="Choose recipe for this stove">
              {DRINKS.map(id => {
                const unlocked = game.save.orders.includes(id);
                const active = st.recipe === id;
                return (
                  <button
                    key={id}
                    className={`recipe-pill-btn ${active ? 'active' : ''} ${!unlocked ? 'locked' : ''}`}
                    onClick={() => {
                      if (unlocked) {
                        game.selectRecipe(id);
                      } else {
                        open('upgrades', 'flavors');
                      }
                    }}
                    title={unlocked ? RECIPES[id].name : `Unlock ${RECIPES[id].name} in Shop`}
                  >
                    {RECIPES[id].shortName}
                    {!unlocked && <LockKeyhole size={10} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Ingredients Tray & Main Brew Action */}
        <div className="station-main">
          <div className="ingredient-tray" aria-label="Ingredients for recipe">
            {RECIPES[st.recipe].ingredients.map(id => {
              const added = st.ingredients.includes(id);
              return (
                <button
                  key={id}
                  className={`ingredient-button ${added ? 'added' : ''} ${st.phase === 'adding' && !added ? 'ingredient-needed' : ''}`}
                  draggable={st.phase === 'adding' && !added && !game.manuallyPaused}
                  onDragStart={event => event.dataTransfer.setData('chai-ingredient', id)}
                  onClick={() => game.addIngredient(id)}
                  disabled={added || inProgress || st.phase === 'ready' || game.manuallyPaused}
                  aria-label={`${added ? 'Added' : 'Add'} ${INGREDIENTS[id]}`}
                >
                  <IngredientArt type={id} size={36} />
                  <span>{INGREDIENTS[id]}</span>
                  {added && <span className="ingredient-check"><Check size={11} /></span>}
                </button>
              );
            })}
          </div>

          <div className="brew-action">
            <div className="brew-status-row">
              <span className="brew-status" aria-live="polite">{phaseText}</span>
              {st.phase !== 'idle' && (
                <button
                  className="discard-batch"
                  onClick={game.discardBatch}
                  disabled={game.manuallyPaused}
                  aria-label="Empty pot and start fresh"
                  title="Empty pot and start fresh"
                >
                  <RotateCcw size={12} />
                </button>
              )}
            </div>

            <button
              className={`button main-brew-button ${st.phase === 'ready' ? 'serve-button' : ''}`}
              disabled={inProgress || st.phase === 'adding' || game.manuallyPaused}
              onClick={st.phase === 'ready' ? () => game.serveCustomer() : game.startBrew}
            >
              {inProgress && <span className="button-brew-progress" style={{ width: `${st.progress}%` }} />}
              <span className="brew-button-content">
                {st.phase === 'ready' ? <Coffee size={19} /> : st.phase === 'adding' ? <Leaf size={18} /> : <Flame size={18} />}
                <strong>{buttonText}</strong>
              </span>
            </button>
          </div>
        </div>

        {/* Cup Sink & Gas Station Quick Bar */}
        <div className="station-extras">
          <div className="sink-panel">
            <div className="sink-info">
              <span className="eyebrow">THE SINK</span>
              <strong>{game.cleanCups} clean &middot; {game.dirtyCups} dirty</strong>
              <div className="cup-stack">
                {Array.from({ length: Math.min(game.cleanCups, 10) }, (_, i) => (
                  <span key={i} className="cup-pip" />
                ))}
              </div>
            </div>
            <button
              className="button button-small"
              disabled={game.dirtyCups === 0 || game.wash.active || game.manuallyPaused || game.busyTask !== null}
              onClick={game.washCups}
            >
              {game.wash.active ? `Washing ${Math.round(game.wash.progress * 100)}%` : 'Wash cups'}
            </button>
            {game.wash.active && (
              <div className="wash-progress">
                <i style={{ width: `${game.wash.progress * 100}%` }} />
              </div>
            )}
          </div>

          <div className="gas-panel">
            <div className="gas-info">
              <span className="eyebrow">GAS TANK</span>
              <strong>
                {game.gasFilling.active
                  ? `Filling... ${Math.round(game.gasFilling.progress * 100)}%`
                  : `${game.gasInfo.kg.toFixed(1)} / ${game.gasInfo.capacityKg} kg`}
              </strong>
              <div className="gas-bar">
                <i style={{ width: `${game.gasFilling.active ? game.gasFilling.progress * 100 : (game.gasInfo.kg / game.gasInfo.capacityKg) * 100}%` }} />
              </div>
            </div>
            {game.gasInfo.kg <= 0.5 && !game.gasFilling.active && (
              <button
                className="button button-small gas-buy-btn"
                onClick={() => {
                  const tier = game.gasInfo.tiers.find(t => !t.locked && game.save.coins >= t.cost);
                  if (tier) game.buyGas(tier.kg);
                }}
              >
                Buy Gas
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomerRow({ customer, game, first, open }: { customer: Customer; game: Game; first: boolean; open: OpenOverlay }) {
  const ratio = Math.max(0, Math.min(1, customer.patience / customer.maxPatience));
  const unserved = customer.order.filter(i => !customer.served.includes(i));
  const ready = first && unserved.some(id => isSide(id) ? (game.save.inventory[id] ?? 0) > 0 : game.cleanCups > 0 && game.stoves.some(s => s.phase === 'ready' && s.cups > 0 && s.recipe === id)) && !game.manuallyPaused;

  return (
    <motion.div
      layout="position"
      className={`customer-wrapper ${first ? 'first-in-line' : ''} ${ratio < 0.25 ? 'impatient' : ''}`}
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30, height: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={`customer-row ${ready ? 'customer-ready' : ''}`}>
        <div className="customer-avatar">
          <Avatar kind={customer.kind} size={48} />
          {ready && <span className="serve-avatar-badge"><Coffee size={10} /></span>}
        </div>

        <div className="customer-info">
          <div className="customer-name">
            <strong>{customer.name}</strong>
            <span className="customer-place">{first ? 'NOW SERVING' : 'NEXT IN LINE'}</span>
          </div>
          <span className="customer-title">{customer.title}</span>

          {/* Customer Order Items with Clear Status & Actions */}
          <div className="customer-order-items">
            {customer.order.map((id, itemIdx) => {
              const isServed = customer.served.includes(id);
              const itemRecipe = RECIPES[id];
              const isSideItem = isSide(id);
              const stock = isSideItem ? (game.save.inventory[id] ?? 0) : 0;
              const sideUnlocked = isSideItem && game.level >= SIDE_ITEMS[id].level;
              const matchingReadyStove = !isSideItem && game.stoves.find(s => s.phase === 'ready' && s.cups > 0 && s.recipe === id);
              const matchingBrewingStove = !isSideItem && game.stoves.find(s => (s.phase === 'brewing' || s.phase === 'heating' || s.phase === 'adding') && s.recipe === id);

              return (
                <div key={`${id}-${itemIdx}`} className={`order-item-card ${isServed ? 'served' : 'pending'}`}>
                  <div className="order-item-header">
                    <span className="order-item-art">
                      {id === 'classic' ? <ChaiCup size={24} /> : <IngredientArt type={id === 'adrak' ? 'ginger' : id === 'elaichi' ? 'cardamom' : id === 'lassi' ? 'yogurt' : id === 'samosa' || id === 'pakora' ? 'potato' : id === 'cake' ? 'egg' : 'flour'} size={22} />}
                    </span>
                    <div className="order-item-details">
                      <strong>{itemRecipe.name}</strong>
                      <span className="order-item-status">
                        {isServed
                          ? '✓ Served'
                          : isSideItem
                          ? sideUnlocked
                            ? `${stock} in stock`
                            : `Unlocks Lv.${SIDE_ITEMS[id].level}`
                          : matchingReadyStove
                          ? `Ready (${matchingReadyStove.cups} cups)`
                          : matchingBrewingStove
                          ? `${matchingBrewingStove.phase === 'adding' ? 'Needs ingredients' : `Brewing ${Math.round(matchingBrewingStove.progress)}%`}`
                          : 'Not brewing'}
                      </span>
                    </div>
                  </div>

                  {first && !isServed && (
                    <div className="order-item-action">
                      {isSideItem ? (
                        sideUnlocked && stock > 0 ? (
                          <button
                            className="button button-small serve-item-btn"
                            disabled={game.manuallyPaused}
                            onClick={() => game.serveCustomer(customer.id, id)}
                          >
                            Serve {itemRecipe.shortName}
                          </button>
                        ) : (
                          <button
                            className="button button-small restock-item-btn"
                            onClick={() => open('upgrades', 'snacks')}
                          >
                            Restock
                          </button>
                        )
                      ) : (
                        matchingReadyStove && game.cleanCups > 0 ? (
                          <button
                            className="button button-small serve-item-btn ready-glow"
                            disabled={game.manuallyPaused}
                            onClick={() => game.serveCustomer(customer.id, id)}
                          >
                            <Coffee size={14} /> Serve {itemRecipe.shortName}
                          </button>
                        ) : game.cleanCups <= 0 && matchingReadyStove ? (
                          <button
                            className="button button-small wash-needed-btn"
                            disabled={game.wash.active}
                            onClick={game.washCups}
                          >
                            Wash cups
                          </button>
                        ) : matchingBrewingStove ? (
                          <div className="brewing-indicator">
                            <Flame size={12} className="flicker" />
                            <span>{matchingBrewingStove.phase === 'adding' ? 'Add items' : 'Brewing...'}</span>
                          </div>
                        ) : (
                          <button
                            className="button button-small button-outline brew-item-btn"
                            onClick={() => {
                              const idleIdx = game.stoves.findIndex(s => s.phase === 'idle');
                              if (idleIdx >= 0) {
                                game.selectStove(idleIdx);
                                game.selectRecipe(id);
                              } else {
                                game.selectRecipe(id);
                              }
                            }}
                          >
                            Select recipe
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className={`patience-track ${ratio < 0.25 ? 'low' : ratio < 0.5 ? 'medium' : ''}`}
            role="progressbar"
            aria-label={`${customer.name}'s patience`}
            aria-valuenow={Math.round(ratio * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <i style={{ width: `${Math.max(0, ratio * 100)}%` }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CustomerQueue({ game, open }: { game: Game; open: OpenOverlay }) {
  const nextLocked = DRINKS.find(id => !game.save.orders.includes(id));
  const menuRecipes = [...game.save.orders, ...(nextLocked ? [nextLocked] : [])];
  const pendingRecipes = menuRecipes.filter(id => id !== game.stoves[game.activeStove]?.recipe && game.save.orders.includes(id));

  return (
    <section className="people-panel" aria-label="Customer queue and chai menu">
      <div className="people-heading">
        <div>
          <h2>At your thela</h2>
          <span>Serve the first customer before the next.</span>
        </div>
        <span className="queue-count">{game.customers.length}<UsersRound size={13} /></span>
      </div>

      <div className="customer-list">
        <AnimatePresence initial={false}>
          {game.customers.slice(0, 3).map((customer, index) => (
            <CustomerRow key={customer.id} customer={customer} game={game} first={index === 0} open={open} />
          ))}
        </AnimatePresence>

        {game.customers.length === 0 && (
          <div className="empty-queue">
            <ChaiCup size={68} />
            <h3>A quiet little moment.</h3>
            <p>Another friendly face will be along soon. Keep the kettle warm.</p>
          </div>
        )}
      </div>

      <div className="queue-footnote">
        {game.customers.length > 3 ? (
          <><UsersRound size={13} />{game.customers.length - 3} more {game.customers.length === 4 ? 'neighbor' : 'neighbors'} waiting</>
        ) : !game.save.tutorialDone ? (
          <><Heart size={13} />Your first cup? Take your time.</>
        ) : (
          <><Clock3 size={13} />First in, first served.</>
        )}
      </div>

      <div className="chai-menu">
        <div className="menu-heading">
          <span className="eyebrow">DRINKS TO BREW</span>
          <button className="text-button" onClick={() => open('upgrades', 'snacks')} aria-label="Open snacks shop">
            Snack stock<ArrowUpRight size={12} />
          </button>
        </div>
        <div className="menu-list">
          {pendingRecipes.map(id => (
            <button
              key={id}
              className={`recipe-button ${game.stoves[game.activeStove]?.recipe === id ? 'selected' : ''}`}
              onClick={() => { if (!game.selectRecipe(id)) open('upgrades', 'flavors'); }}
              aria-pressed={game.stoves[game.activeStove]?.recipe === id}
            >
              <span className="recipe-mini-art">
                {id === 'classic' ? <ChaiCup size={34} /> : <IngredientArt type={id === 'adrak' ? 'ginger' : id === 'elaichi' ? 'cardamom' : 'yogurt'} size={32} />}
              </span>
              <span className="recipe-copy">
                <strong>{RECIPES[id].name}</strong>
                <small>{RECIPES[id].price} per cup</small>
              </span>
              {game.stoves[game.activeStove]?.recipe === id ? <span className="recipe-check"><Check size={11} /></span> : <ChevronRight size={14} />}
            </button>
          ))}
          {menuRecipes.filter(id => !game.save.orders.includes(id)).map(id => (
            <button
              key={id}
              className="recipe-button recipe-locked"
              onClick={() => open('upgrades', 'flavors')}
              aria-label={`Unlock ${RECIPES[id].name} for ${RECIPES[id].cost} coins`}
            >
              <span className="recipe-mini-art">
                <IngredientArt type={id === 'adrak' ? 'ginger' : id === 'elaichi' ? 'cardamom' : 'yogurt'} size={32} />
              </span>
              <span className="recipe-copy">
                <strong>{RECIPES[id].name}</strong>
                <small>Unlock for {RECIPES[id].cost}</small>
              </span>
              <LockKeyhole size={14} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function DailyGoals({ game, open }: { game: Game; open: OpenOverlay }) {
  const next = LOCATIONS.find(place => !game.save.locations.includes(place.id));
  return (
    <div className="daily-goals">
      <section className="daily-goal">
        <div className="daily-goal-top">
          <div className="goal-icon"><Gift size={22} strokeWidth={1.5} /></div>
          <div className="goal-copy">
            <span className="eyebrow">TODAY'S LITTLE GOAL</span>
            <h3>20 cups. Countless smiles.</h3>
          </div>
          <span className="goal-reward"><CoinIcon size={19} />+200</span>
        </div>
        <div className="daily-progress-row">
          <div className="progress-track">
            <i style={{ width: `${Math.min(100, (game.save.dailyServed / 20) * 100)}%` }} />
          </div>
          <span>{Math.min(20, game.save.dailyServed)} / 20 cups</span>
          {game.save.dailyServed >= 20 && (
            <button className="text-button claim-daily" onClick={game.claimDaily} disabled={game.save.dailyClaimed}>
              {game.save.dailyClaimed ? <><Check size={13} />Collected</> : <>Claim<ArrowRight size={13} /></>}
            </button>
          )}
        </div>
      </section>

      <button className="next-chapter" onClick={() => open('map')}>
        <span className="next-chapter-art"><Store size={28} strokeWidth={1.25} /></span>
        <span className="next-chapter-copy">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <strong>
            {next
              ? next.id === 'market'
                ? 'The market is calling.'
                : next.id === 'dhaba'
                ? 'The open road is calling.'
                : 'Your name above the door.'
              : 'A whole city, a little closer.'}
          </strong>
          <span>
            {next ? (
              <>Earn <b>{formatCoins(next.revenue)}</b> lifetime coins.</>
            ) : (
              'Your chai has found a home in every neighborhood.'
            )}
          </span>
        </span>
        <ArrowUpRight size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [modal, setModal] = useState<ModalName | null>(null);
  const [shopTab, setShopTab] = useState<ShopTab>('kitchen');
  const [salaryAdOpen, setSalaryAdOpen] = useState(false);
  const game = useGame(showSplash || (modal !== null && modal !== 'upgrades'));
  const open: OpenOverlay = (name, tab = 'kitchen') => { setShopTab(tab); setModal(name); };

  const handleFinishSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Audio unlock listener for browser & mobile webview
  useEffect(() => {
    const unlockAudio = () => {
      resumeAudioContext();
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Ambient sound system (Rain, Night Crickets & Girgit/Gecko, Morning Birds)
  useEffect(() => {
    if (showSplash || game.paused || game.appBackgrounded || !game.save.sound) {
      setAmbientMode('none', false);
      return;
    }

    if (game.save.weather === 'rainy') {
      setAmbientMode('rain', true);
    } else if (game.night) {
      setAmbientMode('night', true);
    } else if (game.hour >= 5 && game.hour < 11) {
      setAmbientMode('morning', true);
    } else {
      setAmbientMode('none', true);
    }
  }, [showSplash, game.paused, game.appBackgrounded, game.save.sound, game.save.weather, game.night, game.hour]);

  // Keyboard controls for desktop
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || game.paused) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key.toLowerCase() === 'b') { event.preventDefault(); game.startBrew(); }
      if (event.key.toLowerCase() === 's') { event.preventDefault(); game.serveCustomer(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [game.paused, game.startBrew, game.serveCustomer]);

  // Android hardware back button handler
  useEffect(() => {
    let removeListener: (() => void) | null = null;
    try {
      const listenerPromise = CapApp.addListener('backButton', () => {
        if (modal) {
          setModal(null);
        } else if (game.celebration) {
          game.closeCelebration();
        } else if (game.bargain) {
          game.settleBargain(false);
        } else if (game.showSalary) {
          game.toggleSalary();
        } else if (game.manuallyPaused) {
          game.togglePause();
        } else {
          // If no modal or overlay is open, exit the app
          CapApp.exitApp();
        }
      });
      listenerPromise.then(handle => {
        removeListener = () => handle.remove();
      }).catch(() => {});
    } catch {
      // Browser fallback (Capacitor not running in web preview)
    }

    return () => {
      if (removeListener) removeListener();
    };
  }, [modal, game.celebration, game.bargain, game.showSalary, game.manuallyPaused, game.closeCelebration, game.settleBargain, game.toggleSalary, game.togglePause]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onFinish={handleFinishSplash} />
        )}
      </AnimatePresence>

      <div className="app-shell">
        <Sidebar game={game} modal={modal} open={open} close={() => setModal(null)} />
        <div className="workspace">
          {/* Desktop Topbar */}
          <Topbar game={game} open={open} />
          {/* Mobile Top HUD (Visible on phones & small screens) */}
          <MobileTopHud game={game} open={open} />

          <main className="main-content">
            <motion.div className="page-heading" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div>
                <h1>Small cart. Big chai dreams.</h1>
                <p>One warm cup at a time. Let's make someone's day.</p>
              </div>
              <div className="open-status">
                <span><i className="status-dot" />{game.manuallyPaused ? 'Taking a little break' : 'Open for good company'}</span>
                <small>Day {String(game.save.day).padStart(2, '0')} of your chai story</small>
              </div>
            </motion.div>

            <div className="game-grid">
              <GameScene game={game} open={open} />
              <CustomerQueue game={game} open={open} />
            </div>

            <DailyGoals game={game} open={open} />

            <footer className="page-footer">
              <span><ShieldCheck size={13} />Your little dream is saved automatically.</span>
              <button className="text-button" onClick={() => open('guide')}>
                <CircleHelp size={13} />A little help?
              </button>
            </footer>
          </main>
        </div>

        {/* Modals and Overlays */}
        <AnimatePresence>
          {modal && <GameOverlay key={modal} modal={modal} game={game} onClose={() => setModal(null)} initialTab={shopTab} />}
        </AnimatePresence>
        <AnimatePresence>
          {game.bargain && <BargainDialog game={game} />}
        </AnimatePresence>
        <AnimatePresence>
          {game.celebration && <CelebrationDialog game={game} />}
        </AnimatePresence>

        {/* Level-up celebration */}
        <AnimatePresence>
          {game.levelUp && (
            <motion.div className="level-up-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="level-up-card" initial={{ scale: 0.5, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: -20 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                <div className="level-up-sparkles">
                  {Array.from({ length: 12 }, (_, i) => (
                    <motion.i
                      key={i}
                      style={{ left: `${5 + i * 8}%` }}
                      initial={{ y: 0, opacity: 0, scale: 0 }}
                      animate={{ y: [-20, -80], opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: i * 30 }}
                      transition={{ duration: 1.5, delay: i * 0.1, repeat: 2 }}
                    />
                  ))}
                </div>
                <span className="level-up-eyebrow">MUBARAK HO!</span>
                <h2>Level {game.levelUp.level}</h2>
                <p>New unlocks are waiting for you.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Salary notification with Pay button */}
        <AnimatePresence>
          {game.anySalariesDue && !modal && (
            <motion.div className="salary-toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
              <Wallet size={18} />
              <div>
                <strong>Salary due — Pay Now</strong>
                <span>{formatCoins(game.totalSalariesDue)} coins owed to your team</span>
              </div>
              <button className="button button-small" onClick={game.payAllSalaries}>
                Pay {formatCoins(game.totalSalariesDue)}
              </button>
              <button
                className="button button-small"
                style={{ background: 'linear-gradient(135deg,#92400e,#d97706)', border: 'none' }}
                onClick={() => setSalaryAdOpen(true)}
                title="Watch an ad to pay salaries for free"
              >
                <Zap size={13} /> Watch Ad
              </button>
              <button className="icon-button" onClick={game.toggleSalary} aria-label="Dismiss">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rewarded Ad: pay salary for free */}
        <RewardedAdModal
          isOpen={salaryAdOpen}
          rewardType="salary"
          rewardDescription="Watch this short ad and your team's salaries will be paid for free! Keep the chai flowing."
          onReward={() => { game.clearSalariesFree(); }}
          onClose={() => setSalaryAdOpen(false)}
        />

        {/* Toast Notifications */}
        <AnimatePresence>
          {game.toast && (
            <motion.div
              className={`toast ${game.toast.tone === 'info' ? 'info-toast' : ''}`}
              key={game.toast.id}
              role="status"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22 }}
            >
              <span className="toast-icon">
                {game.toast.tone === 'success' ? <Check size={16} /> : <Coffee size={16} />}
              </span>
              <p>{game.toast.message}</p>
              {game.toast.action && (
                <button
                  className="toast-action"
                  onClick={() => {
                    const a = game.toast?.action;
                    if (a) a.onClick();
                    game.dismissToast();
                  }}
                >
                  {game.toast.action.label}
                </button>
              )}
              <button onClick={game.dismissToast} aria-label="Dismiss notification">
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
