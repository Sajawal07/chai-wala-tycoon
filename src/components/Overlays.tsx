import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ChevronRight, CloudRain, Coffee, ExternalLink, Flame, Hand, Heart, Leaf, LockKeyhole, MapPin, Pause, Play, RotateCcw, ShieldCheck, Sparkles, Star, Sun, Trophy, UsersRound, Volume2, Zap } from 'lucide-react';
import { ACHIEVEMENTS, DRINKS, SIDE_IDS, SIDE_ITEMS, LOCATIONS, RECIPES, UPGRADES, WORKERS, formatCoins, type Game, type ModalName } from '../game';
import { CartIllustration, ChaiCup, CoinIcon, IngredientArt, StaffFigure, UpgradeArt } from './Illustrations';
import { Dialog } from './Dialog';
import { RewardedAdModal } from './RewardedAdModal';

export type ShopTab = 'kitchen' | 'flavors' | 'snacks' | 'style';

export function GameOverlay({ modal, game, onClose, initialTab = 'kitchen' }: { modal: ModalName; game: Game; onClose: () => void; initialTab?: ShopTab }) {
  if (modal === 'upgrades') return <UpgradeShop game={game} onClose={onClose} initialTab={initialTab}/>;
  if (modal === 'staff') return <StaffRoom game={game} onClose={onClose}/>;
  if (modal === 'map') return <CityMap game={game} onClose={onClose}/>;
  if (modal === 'achievements') return <Achievements game={game} onClose={onClose}/>;
  if (modal === 'guide') return <Guide onClose={onClose}/>;
  if (modal === 'settings') return <Settings game={game} onClose={onClose}/>;
  if (modal === 'boost') return <Boost game={game} onClose={onClose}/>;
  return <Events game={game} onClose={onClose}/>;
}

function Wallet({ coins }: { coins: number }) {
  return <div className="dialog-wallet"><CoinIcon size={21}/><strong>{formatCoins(coins)}</strong><span>to grow your dream</span></div>;
}

function UpgradeShop({ game, onClose, initialTab }: { game: Game; onClose: () => void; initialTab: ShopTab }) {
  const [tab, setTab] = useState<ShopTab>(initialTab);
  return <Dialog title="A little better, every day." eyebrow="THE UPGRADE SHOP" description="Small upgrades. Happier customers. Bigger dreams." onClose={onClose} className="shop-dialog">
    <Wallet coins={game.save.coins}/>
    <div className="shop-tabs" role="tablist" aria-label="Upgrade categories">
      {([{ id: 'kitchen', label: 'Kitchen', icon: Flame }, { id: 'flavors', label: 'Drinks', icon: Leaf }, { id: 'snacks', label: 'Snacks & stock', icon: Coffee }, { id: 'style', label: 'Style', icon: Sparkles }] as const).map(item => <button key={item.id} role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}><item.icon size={16}/>{item.label}</button>)}
    </div>
    {tab === 'kitchen' && <div role="tabpanel">
      <div className="shop-grid">{UPGRADES.map(item => {
        const level = game.save.upgrades[item.id] ?? 0;
        const maxed = level >= item.max;
        const reqLevel = item.id === 'extra-stove' ? (level === 0 ? 7 : 11) : (item.level ?? 1);
        const cost = item.id === 'extra-stove' ? (level === 0 ? 550 : 1200) : (item.cost ?? item.baseCost * (level + 1));
        const lockedByLevel = game.level < reqLevel;
        const displayName = item.id === 'extra-stove' ? (level === 0 ? 'Second Stove' : level === 1 ? 'Third Stove' : 'All 3 Stoves') : item.name;
        const displayDesc = item.id === 'extra-stove' ? (level === 0 ? 'Brew a second drink at the same time.' : level === 1 ? 'Brew a third drink at the same time.' : 'All 3 stoves unlocked and brewing!') : item.description;
        return <article className="upgrade-item" key={item.id}>
          <div className="upgrade-art-row"><UpgradeArt type={item.id} size={78}/><div className="upgrade-level"><span>LEVEL {level}</span><div>{Array.from({ length: item.max }, (_, i) => <i key={i} className={i < level ? 'filled' : ''}/>)}</div></div></div>
          <h3>{displayName}</h3><p>{displayDesc}</p><span className="upgrade-benefit"><ArrowRight size={13}/>{item.benefit}</span>
          <div className="purchase-row"><span className="coin-price"><CoinIcon size={19}/>{maxed ? 'All yours' : formatCoins(cost)}</span><button className={`button ${maxed || lockedByLevel ? 'button-muted' : 'button-small'}`} disabled={maxed || lockedByLevel || game.save.coins < cost} onClick={() => game.buyUpgrade(item.id)}>{maxed ? <><Check size={15}/>Maxed out</> : lockedByLevel ? <><LockKeyhole size={13}/>Level {reqLevel}</> : <>Upgrade<PlusSymbol/></>}</button></div>
        </article>;
      })}</div>
      <div className="supply-section">
        <h3><Flame size={17}/>Gas station</h3>
        <div className="gas-supply-grid">{[1, 2, 5, 10].map(kg => {
          const tierIdx = [1, 2, 5, 10].indexOf(kg);
          const cost = 30 * kg;
          const locked = game.level < [1, 10, 13, 16][tierIdx];
          return <button key={kg} className={`gas-supply-btn ${game.save.gasCapacityKg >= kg ? 'unlocked' : ''} ${locked ? 'locked' : ''}`} disabled={locked || game.save.coins < cost} onClick={() => game.buyGas(kg)}>
            <strong>{kg} kg</strong><span>{formatCoins(cost)} coins</span>{locked && <small>Level {[1, 10, 13, 16][tierIdx]}</small>}
          </button>;
        })}</div>
        <div className="cup-supply">
          <h3><Coffee size={17}/>More cups</h3>
          <div className="cup-supply-row">
            <span className="cup-count">You have <strong>{game.save.cupCapacity}</strong> cups</span>
            {game.cupInfo.tiers.filter(t => !t.current).slice(0, 1).map(t => (
              <button key={t.capacity} className="button button-small" disabled={game.save.coins < t.cost || t.locked} onClick={game.buyCupUpgrade}>
                {t.locked ? `Level ${t.level} for ${t.capacity} cups` : `Buy ${t.capacity} cups · ${formatCoins(t.cost)}`}
              </button>
            ))}
          </div>
        </div>
        <div className="cup-supply seating-supply">
          <h3><UsersRound size={17}/>Thela seating capacity</h3>
          <div className="cup-supply-row">
            <span className="cup-count">Capacity: <strong>{game.seatingInfo.current}</strong> customer seats</span>
            {game.seatingInfo.next ? (
              <button
                className="button button-small"
                disabled={!game.seatingInfo.canBuyNext}
                onClick={game.buySeating}
              >
                {game.level < game.seatingInfo.next.requiredLevel
                  ? `Level ${game.seatingInfo.next.requiredLevel} for ${game.seatingInfo.next.seats} seats`
                  : `Expand to ${game.seatingInfo.next.seats} seats · ${formatCoins(game.seatingInfo.next.cost)} coins`}
              </button>
            ) : (
              <span className="paid-badge"><Check size={12}/>Max seats reached</span>
            )}
          </div>
        </div>
      </div>
    </div>}
    {tab === 'flavors' && <div className="shop-grid" role="tabpanel">
      {DRINKS.map(id => {
        const item = RECIPES[id];
        const owned = game.save.orders.includes(id);
        return <article className="upgrade-item flavor-item" key={id}>
          <div className="upgrade-art-row"><div className="flavor-art"><ChaiCup size={75}/>{id !== 'classic' && <IngredientArt type={id === 'adrak' ? 'ginger' : id === 'elaichi' ? 'cardamom' : 'yogurt'} size={40}/>}</div><span className="recipe-value"><CoinIcon size={15}/>{item.price}<small>/ cup</small></span></div>
          <h3>{item.name}</h3><p>{item.description}</p>
          <div className="purchase-row"><span className="coin-price">{owned ? <><Check size={15}/>On your menu</> : <><CoinIcon size={19}/>{formatCoins(item.cost)}</>}</span><button className="button button-small" disabled={!owned && game.save.coins < item.cost} onClick={() => { if (owned) { game.selectRecipe(id); onClose(); } else game.unlockRecipe(id); }}>{owned ? 'Brew this' : 'Unlock'}<ChevronRight size={15}/></button></div>
        </article>;
      })}
    </div>}
    {tab === 'snacks' && <div className="stock-shop" role="tabpanel" aria-label="Buy side item stock">
      <p className="stock-explainer">Unlock snacks by leveling up, then buy stock here. Stock is used only when you serve the first customer's order.</p>
      {SIDE_IDS.map(id => {
        const item = SIDE_ITEMS[id];
        const unlocked = game.level >= item.level;
        const canAfford = game.save.coins >= item.buyPrice;
        return <div className={`stock-line ${unlocked ? '' : 'stock-locked'}`} key={id}>
          <div className="stock-illustration"><IngredientArt type={id === 'samosa' || id === 'pakora' ? 'potato' : id === 'cake' ? 'egg' : 'flour'} size={42}/></div>
          <div className="stock-details"><strong>{RECIPES[id].name}</strong><span>{item.quantity} pieces | Buy: {item.buyPrice} coins | Serve: {item.sellValue} coins</span><small>{unlocked ? `Stock: ${game.save.inventory[id]} | Listed margin: ${item.sellValue - item.buyPrice} coins` : `Unlocks at level ${item.level}`}</small>{unlocked && !canAfford && <small className="stock-shortfall">Need {item.buyPrice - game.save.coins} more coins to restock</small>}</div>
          <button className="button button-small" disabled={!unlocked || !canAfford} onClick={() => game.buySideStock(id)}>{unlocked ? `Buy ${item.quantity}` : <><LockKeyhole size={13}/>Level {item.level}</>}</button>
        </div>;
      })}
      {SIDE_IDS.some(id => game.level >= SIDE_ITEMS[id].level && game.save.coins < SIDE_ITEMS[id].buyPrice) && <p className="stock-shortfall">Not enough coins for some stock. Serve more complete orders to earn coins.</p>}
    </div>}
    {tab === 'style' && <div className="cosmetic-panel" role="tabpanel">
      <div className={`cosmetic-preview ${game.save.skin === 'festival' ? 'festive' : ''}`}><div className="decorative-garland"><span/><span/><span/><span/><span/><span/><span/></div><CartIllustration size={245}/></div>
      <div><span className="eyebrow">JUST FOR THE JOY OF IT</span><h3>A little festival, every day.</h3><p>Dress your thela in glowing lanterns and a little extra golden warmth. No gameplay advantage. Just good vibes.</p><div className="purchase-row"><span className="coin-price">{game.save.festivalOwned ? <><Check size={16}/>In your collection</> : <><CoinIcon size={21}/>600</>}</span><button className="button" disabled={!game.save.festivalOwned && game.save.coins < 600} onClick={game.changeSkin}>{game.save.skin === 'festival' ? 'Use classic style' : game.save.festivalOwned ? 'Bring on the lights' : 'Make it festive'}<Sparkles size={16}/></button></div></div>
    </div>}
    <div className="dialog-footnote"><Heart size={14}/>Built with hard work and a little extra adrak.</div>
  </Dialog>;
}

function PlusSymbol() { return <span aria-hidden="true" className="plus-symbol">+</span>; }

function StaffRoom({ game, onClose }: { game: Game; onClose: () => void }) {
  return <Dialog title="Your team" eyebrow="YOUR PEOPLE" description="Every worker has a job and a salary. Pay them well!" onClose={onClose}>
    <Wallet coins={game.save.coins}/>
    {game.totalSalariesDue > 0 && <div className="salary-due-banner"><strong>Salaries due: {formatCoins(game.totalSalariesDue)} coins</strong><button className="button button-small" onClick={() => { game.payAllSalaries(); }}>Pay all</button></div>}
    <div className="staff-grid">{WORKERS.map(person => {
      const state = game.save.staff[person.id];
      const hired = state.hired;
      const unlocked = game.save.served >= person.requires;
      const due = hired ? person.salary * state.unpaidDays : 0;
      return <article className={`staff-item ${hired ? 'hired' : ''} ${state.onStrike ? 'on-strike' : ''}`} key={person.id}>
        <StaffFigure role={person.id} size={86}/><h3>{person.name}</h3><span className="staff-role">{person.role}</span><p>{person.description}</p>
        <div className="staff-salary"><span>Daily: {person.salary} coins</span>{state.unpaidDays > 0 && <span className="unpaid">Unpaid: {state.unpaidDays} day{state.unpaidDays > 1 ? 's' : ''} ({due} coins)</span>}{state.onStrike && <span className="strike-badge">ON STRIKE</span>}</div>
        {hired && state.unpaidDays > 0 && <button className="button button-small" disabled={game.save.coins < due} onClick={() => game.paySalary(person.id)}>Pay {due} coins</button>}
        {!hired && <button className={`button ${state.onStrike ? 'button-muted' : ''}`} disabled={!unlocked || game.save.coins < person.cost} onClick={() => game.hireStaff(person.id)}>{!unlocked ? <><LockKeyhole size={14}/>Serve {person.requires} cups</> : <>Hire for<CoinIcon size={18}/>{formatCoins(person.cost)}</>}</button>}
        {hired && state.unpaidDays === 0 && <span className="paid-badge"><Check size={12}/>Paid up</span>}
      </article>;
    })}</div>
    <div className="soft-note"><Coffee size={24}/><div><strong>Salaries are due each day.</strong><p>Unpaid workers: Day 1 = warning, Day 2 = still working, Day 3 = STRIKE. Pay outstanding salary to end the strike.</p></div></div>
  </Dialog>;
}

function CityMap({ game, onClose }: { game: Game; onClose: () => void }) {
  return <Dialog title="A whole city of possibilities." eyebrow="YOUR NEXT CHAPTER" description="Every great chai empire starts on a little street corner." onClose={onClose} className="map-dialog">
    <div className="map-revenue"><span><MapPin size={16}/>{game.save.locations.length} of 4 neighborhoods</span><span><CoinIcon size={18}/><strong>{formatCoins(game.save.revenue)}</strong> lifetime earnings</span></div>
    <div className="location-grid">{LOCATIONS.map((place, index) => {
      const owned = game.save.locations.includes(place.id);
      const active = game.save.activeLocation === place.id;
      const unlocked = game.save.revenue >= place.revenue;
      return <article className={`location-item ${active ? 'current' : ''}`} key={place.id}>
        <div className="location-preview"><img src={place.image} alt={place.subtitle} loading="lazy"/>{!owned && <span className="location-lock"><LockKeyhole size={13}/>{unlocked ? 'Ready for a new beginning' : `CHAPTER 0${index + 1}`}</span>}{active && <span className="location-lock current-label"><span className="status-dot"/>You are here</span>}</div>
        <div className="location-info"><h3>{place.name}</h3><p>{place.description}</p>
          {!owned && <div className="location-unlock"><div><span>Lifetime earnings</span><strong>{formatCoins(Math.min(game.save.revenue, place.revenue))} / {formatCoins(place.revenue)}</strong></div><div className="progress-track"><i style={{ width: `${Math.min(100, game.save.revenue / place.revenue * 100)}%` }}/></div></div>}
          <button className={`button ${active ? 'button-muted' : owned ? 'button-outline' : ''}`} disabled={active || !unlocked || (!owned && game.save.coins < place.cost)} onClick={() => { if (game.openLocation(place.id)) onClose(); }}>{active ? <><Check size={15}/>Home, sweet thela</> : owned ? <>Head to this neighborhood<ArrowRight size={15}/></> : unlocked ? <>Open for<CoinIcon size={17}/>{formatCoins(place.cost)}</> : <><LockKeyhole size={14}/>Keep that chai brewing</>}</button>
        </div>
      </article>;
    })}</div>
  </Dialog>;
}

function Achievements({ game, onClose }: { game: Game; onClose: () => void }) {
  return <Dialog title="The little wins add up." eyebrow="MOMENTS WORTH CELEBRATING" description="Your journey, one well-earned milestone at a time." onClose={onClose}>
    <div className="achievement-list">{ACHIEVEMENTS.map((item, index) => {
      const progress = Math.min(item.target, item.progress(game.save));
      const claimed = game.save.claimedAchievements.includes(item.id);
      const ready = progress >= item.target;
      return <article className={`achievement-item ${ready ? 'unlocked' : ''}`} key={item.id}>
        <div className="achievement-medal">{index % 3 === 0 ? <Coffee size={24}/> : index % 3 === 1 ? <Trophy size={24}/> : <UsersRound size={24}/>}</div>
        <div className="achievement-copy"><h3>{item.title}</h3><p>{item.description}</p><div className="achievement-progress"><div className="progress-track"><i style={{ width: `${progress / item.target * 100}%` }}/></div><span>{formatCoins(progress)} / {formatCoins(item.target)}</span></div></div>
        <button className={`button button-small ${!ready || claimed ? 'button-muted' : ''}`} disabled={!ready || claimed} onClick={() => game.claimAchievement(item.id)}>{claimed ? <><Check size={14}/>Claimed</> : <>{ready ? 'Claim' : <LockKeyhole size={13}/>}<CoinIcon size={17}/>{formatCoins(item.reward)}</>}</button>
      </article>;
    })}</div>
    <div className="dialog-footnote"><Trophy size={14}/>{game.save.claimedAchievements.length} of {ACHIEVEMENTS.length} milestones celebrated. Your story is just getting started.</div>
  </Dialog>;
}

function Guide({ onClose }: { onClose: () => void }) {
  const steps = [
    { title: 'Get a little fire going.', text: 'Tap Brew chai or the kettle to start heating the water.', icon: Flame },
    { title: 'A pinch, a pour, a little sweetness.', text: 'Tap each ingredient, or drag it onto the pot. Add all the ingredients in your selected recipe.', icon: Leaf },
    { title: 'Let the good stuff brew.', text: 'Watch the steam rise. Your first pot makes two cups; a bigger pot makes even more.', icon: Coffee },
    { title: 'Make someone\'s day.', text: 'Tap Serve chai, click a matching customer, or drag a ready cup onto their order. Fast service earns bigger tips.', icon: Hand },
  ];
  return <Dialog title="There's a little magic in every cup." eyebrow="WELCOME TO CHAI WALA" description="All you need is a warm stove and a little heart. Let's begin." onClose={onClose} className="guide-dialog">
    <div className="guide-steps">{steps.map((step, index) => <div className="guide-step" key={step.title}><span className="step-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><step.icon size={25}/></div>)}</div>
    <div className="soft-note"><Heart size={23}/><div><strong>No rush on your very first cup.</strong><p>Your first customers will wait while you learn. After that, keep an eye on their patience bars.</p></div></div>
    <div className="guide-bottom"><span>A little shortcut: <kbd>B</kbd> to brew, <kbd>S</kbd> to serve.</span><button className="button" onClick={onClose}>Let's make some chai<ArrowRight size={17}/></button></div>
  </Dialog>;
}

function Settings({ game, onClose }: { game: Game; onClose: () => void }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const APP_VERSION = '1.0.1';
  const openUrl = (url: string) => { window.open(url, '_blank', 'noopener,noreferrer'); };
  return <Dialog title="Make yourself comfortable." eyebrow="THE LITTLE SETTINGS" description="Your corner of the city, just how you like it." onClose={onClose} className="settings-dialog">
    <div className="setting-row"><Volume2 size={21}/><div><h3>A little street-side sound</h3><p>Brewing notes, monsoon rain, morning birds & night crickets/girgit.</p></div><button className={`toggle ${game.save.sound ? 'on' : ''}`} role="switch" aria-checked={game.save.sound} aria-label="Game sound" onClick={game.toggleSound}><span/></button></div>
    <div className="setting-row"><Pause size={21}/><div><h3>Take your time</h3><p>Pause the street while life happens.</p></div><button className={`toggle ${game.manuallyPaused ? 'on' : ''}`} role="switch" aria-checked={game.manuallyPaused} aria-label="Pause game" onClick={game.togglePause}><span/></button></div>
    <div className="setting-row weather-setting"><Sun size={22}/><div><h3>A change in the weather</h3><p>Rain brings 25% more coins for garam chai.</p></div><div className="weather-options"><button className={game.save.weather === 'sunny' ? 'selected' : ''} onClick={() => game.setWeather('sunny')}><Sun size={16}/>Sunny</button><button className={game.save.weather === 'rainy' ? 'selected' : ''} onClick={() => game.setWeather('rainy')}><CloudRain size={16}/>Rainy</button></div></div>
    <div className="settings-divider" />
    <div className="setting-row setting-link" role="button" tabIndex={0} onClick={() => openUrl('https://play.google.com/store/apps/details?id=com.chaiwala.tycoon')} onKeyDown={e => e.key === 'Enter' && openUrl('https://play.google.com/store/apps/details?id=com.chaiwala.tycoon')}>
      <Star size={21}/><div><h3>Rate the app</h3><p>Enjoying the chai? Leave us a ⭐⭐⭐⭐⭐ on the Play Store!</p></div><ExternalLink size={16} className="setting-link-icon"/>
    </div>
    <div className="setting-row setting-link" role="button" tabIndex={0} onClick={() => openUrl('https://sajawal07.github.io/chai-wala-tycoon/privacy-policy.html')} onKeyDown={e => e.key === 'Enter' && openUrl('https://sajawal07.github.io/chai-wala-tycoon/privacy-policy.html')}>
      <ShieldCheck size={21}/><div><h3>Privacy Policy</h3><p>How we handle your data (spoiler: we store nothing personal).</p></div><ExternalLink size={16} className="setting-link-icon"/>
    </div>
    <div className="setting-row setting-link" role="button" tabIndex={0} onClick={() => openUrl('https://sajawal07.github.io/chai-wala-tycoon/terms.html')} onKeyDown={e => e.key === 'Enter' && openUrl('https://sajawal07.github.io/chai-wala-tycoon/terms.html')}>
      <Heart size={21}/><div><h3>Terms of Service</h3><p>The little rules of our chai neighborhood.</p></div><ExternalLink size={16} className="setting-link-icon"/>
    </div>
    <div className="soft-note"><ShieldCheck size={24}/><div><strong>Your little dream is safe.</strong><p>Progress is saved automatically on this device. No account needed.</p></div></div>
    <div className="reset-section">{confirmReset ? <><div><strong>A fresh start, for real?</strong><p>This clears all coins, upgrades, and progress. It cannot be undone.</p></div><div className="reset-actions"><button className="button button-outline" onClick={() => setConfirmReset(false)}>Keep my dream</button><button className="button button-danger" onClick={() => { game.resetGame(); onClose(); }}>Start fresh</button></div></> : <button className="text-button muted" onClick={() => setConfirmReset(true)}><RotateCcw size={15}/>Start a new journey</button>}</div>
    <div className="settings-version">Chai Wala Tycoon · v{APP_VERSION}</div>
  </Dialog>;
}

function Boost({ game, onClose }: { game: Game; onClose: () => void }) {
  const [adOpen, setAdOpen] = useState(false);
  return <Dialog title="Even chai walas need a chai break." eyebrow="A LITTLE SECOND WIND" description="Watch a short ad and your stove fires up at 2x speed!" onClose={onClose} className="boost-dialog">
    <div className={`boost-illustration ${game.boostActive ? 'breathing' : ''}`}><ChaiCup size={135}/><span className="boost-spark"><Zap size={24}/></span></div>
    {game.boostActive
      ? <><h3>You're all fired up.</h3><p className="boost-description">Your stove is already brewing at double speed. Let's put that extra energy to good use.</p><button className="button" onClick={onClose}>Back to the thela<ArrowRight size={17}/></button></>
      : <>
          <div className="boost-offer"><Zap size={17}/><strong>2x brewing speed</strong><span>for 2 minutes</span></div>
          <p className="boost-description">Watch a short video ad and your stove fires up at double speed for 2 minutes. Your customers will love the extra pace!</p>
          <button className="button boost-button" onClick={() => setAdOpen(true)}>
            <Play size={16}/>Watch Ad to Boost
          </button>
        </>
    }
    <span className="demo-note">Sponsored bonus &middot; Free 2x speed boost</span>
    <RewardedAdModal
      isOpen={adOpen}
      rewardType="boost"
      rewardDescription="Watch this short ad and your stove fires up at double speed for 2 minutes!"
      onReward={() => { game.activateBoost(); onClose(); }}
      onClose={() => setAdOpen(false)}
    />
  </Dialog>;
}

function Events({ game, onClose }: { game: Game; onClose: () => void }) {
  return <Dialog title="Something's happening in the mohalla." eyebrow="NEIGHBORHOOD NEWS" description="Good chai has a way of bringing everyone together." onClose={onClose} className="events-dialog">
    <div className="event-feature"><div className="cricket-art"><svg viewBox="0 0 150 110" fill="none" aria-hidden="true"><ellipse cx="75" cy="97" rx="60" ry="6" fill="#DDE0C5"/><path d="m48 84 41-62 13 9-42 62c-5 5-16-4-12-9Z" fill="#C79B5C" stroke="#8D6F40" strokeWidth="2"/><path d="m89 22 9-14 13 9-9 14" fill="#789079" stroke="#526C54" strokeWidth="2"/><path d="m57 79 32-48" stroke="#EAD2A4" strokeWidth="3" strokeLinecap="round"/><circle cx="109" cy="81" r="13" fill="#B8634C" stroke="#944C39" strokeWidth="2"/><path d="M109 69c-6 7-6 18 0 24" stroke="#E7C1A0" strokeWidth="2" strokeDasharray="3 2"/><path d="M28 50v43m12-43v43m12-43v18M26 48h28" stroke="#D5B479" strokeWidth="4" strokeLinecap="round"/></svg></div><span className="eyebrow">THE CRICKET MATCH RUSH</span><h3>One match. Many, many cups.</h3><p>Put on the neighborhood match and get ready for a full house. For 60 seconds, customers arrive faster and every cup earns 50% more.</p><button className="button" onClick={() => { game.startEvent(); onClose(); }} disabled={game.eventActive}>{game.eventActive ? <><Check size={16}/>The match is already on</> : <>Start the cricket rush<ArrowRight size={17}/></>}</button></div>
    <button className="weather-event" onClick={() => { game.setWeather(game.save.weather === 'sunny' ? 'rainy' : 'sunny'); onClose(); }}><CloudRain size={28}/><span><strong>A little monsoon magic?</strong><small>Switch the weather. Rainy days love hot chai.</small></span><ChevronRight size={18}/></button>
  </Dialog>;
}

export function BargainDialog({ game }: { game: Game }) {
  const [position, setPosition] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) { setPosition(50); return; }
    let frame: number;
    const start = performance.now();
    const animate = (time: number) => { setPosition((Math.sin((time - start) / 550) + 1) * 50); frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);
  if (!game.bargain) return null;
  return <Dialog title="Thoda kam, bhai?" eyebrow="THE ART OF A FAIR DEAL" description={`${game.bargain.name} loves a little friendly bargaining.`} onClose={() => game.settleBargain(false)} className="bargain-dialog">
    <ChaiCup size={90}/><p>Stop the marker in the green zone. A fair deal earns you a happy customer and a 20% bonus.</p>
    <div className="bargain-track"><div className="fair-zone"/><span className="bargain-marker" style={{ left: `${position}%` }}/></div><div className="bargain-labels"><span>A little too low</span><strong>Just right</strong><span>A little too high</span></div>
    <button className="button" onClick={() => game.settleBargain(position >= 35 && position <= 70)}><Hand size={17}/>Shake on it</button><button className="text-button muted" onClick={() => game.settleBargain(false)}>Give a friendly 15% discount instead</button>
    <AnimatePresence>{game.voiceQuote && <motion.div className={`voice-quote ${game.voiceQuote.kind}`} role="status" initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }}><span>{game.voiceQuote.side === 'left' ? '“' : '”'}{game.voiceQuote.text}{game.voiceQuote.side === 'left' ? '”' : '“'}</span><small>{game.voiceQuote.kind === 'good' ? 'So good!' : game.voiceQuote.kind === 'bad' ? 'A little less than perfect' : 'Chai chit-chat'}</small></motion.div>}</AnimatePresence>
  </Dialog>;
}

export function CelebrationDialog({ game }: { game: Game }) {
  return <Dialog title="Your dream just got a little bigger." eyebrow="HERE'S TO NEW BEGINNINGS" onClose={game.closeCelebration} className="celebration-dialog">
    <div className="celebration-art"><img src={game.location.image} alt={game.celebration ?? 'Your new chai location'}/>{Array.from({ length: 20 }, (_, i) => <motion.i key={i} style={{ backgroundColor: ['#C37A4F', '#D7B85B', '#7F9167', '#E4C9A0'][i % 4], left: `${5 + i * 4.5}%` }} initial={{ y: -25, opacity: 0, rotate: 0 }} animate={{ y: [0, 180], opacity: [0, 1, 0], rotate: [0, i % 2 ? 240 : -240] }} transition={{ duration: 2.7, delay: i * 0.08, repeat: 2 }}/>)}</div>
    <h3>{game.celebration}</h3><p>Same heart. Same good chai. A whole new neighborhood to call home.</p><button className="button" onClick={game.closeCelebration}>Let's make ourselves at home<ArrowRight size={17}/></button>
  </Dialog>;
}
