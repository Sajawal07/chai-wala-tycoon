import { useId } from 'react';
import type { CustomerKind, IngredientId, StaffId, UpgradeId } from '../game';

export function CoinIcon({ size = 22, className = '' }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true"><circle cx="14" cy="14" r="12" fill="#E9BA4E" stroke="#C18A26" strokeWidth="1.5"/><circle cx="14" cy="14" r="8.8" stroke="#F8DF91" strokeWidth="1.5"/><path d="M15.9 9.3c-.6-.5-1.3-.7-2.2-.7-1.5 0-2.5.8-2.5 2s1 1.8 2.8 2.4c1.8.6 2.8 1.3 2.8 2.6s-1.2 2.3-2.9 2.3c-1 0-2-.3-2.8-1M14 7v14" stroke="#A16C1C" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

export function ChaiCup({ className = '', size = 58 }: { className?: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 90 90" fill="none" className={className} aria-hidden="true"><path d="M31 27c-8-9 9-10 1-20M45 28c-7-10 9-12 2-22M57 28c-5-7 8-10 3-17" stroke="#AC7446" strokeWidth="2.5" strokeLinecap="round"/><path d="M64 39h7c15 0 13 22-3 22h-5" stroke="#6F492D" strokeWidth="5"/><path d="M19 36h48l-4 26c-2 13-35 13-39 0l-5-26Z" fill="#D3934E" stroke="#6F492D" strokeWidth="2.5"/><ellipse cx="43" cy="36" rx="24" ry="6" fill="#EDD2A0" stroke="#6F492D" strokeWidth="2.5"/><ellipse cx="43" cy="37" rx="18" ry="3.2" fill="#8D5736"/><path d="M16 77c16 6 42 6 57-1" stroke="#9A6A3E" strokeWidth="3" strokeLinecap="round"/><path d="M28 47l3 15" stroke="#E8BB7F" strokeWidth="3" strokeLinecap="round"/><path d="M37 51c3-5 10-1 6 3-3-4-9-1-6-3Z" fill="#F6DCAE"/></svg>;
}

export function IngredientArt({ type, size = 42 }: { type: IngredientId; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    {type === 'tea' && <><path d="M17 16h30v39c0 5-30 5-30 0V16Z" fill="#DBE0CC" stroke="#746D4B" strokeWidth="1.7"/><path d="M20 31h24v22c-4 3-20 3-24 0V31Z" fill="#A7AA78"/><path d="m24 36 5 4-4 6m12-13-4 7 6 4m-10 0 3 7m9-3-3 4" stroke="#697142" strokeWidth="2" strokeLinecap="round"/><rect x="15" y="10" width="34" height="9" rx="3" fill="#B7824C" stroke="#746044" strokeWidth="1.7"/><path d="M21 24v22" stroke="#F7F9E7" strokeWidth="2.5" strokeLinecap="round"/><path d="M22 13h19" stroke="#DAB889" strokeWidth="2" strokeLinecap="round"/></>}
    {type === 'milk' && <><path d="M24 10h16v11l7 12v23c0 6-30 6-30 0V33l7-12V10Z" fill="#FCF7E8" stroke="#9A9B86" strokeWidth="1.7"/><path d="M18 36h28v17H18z" fill="#B5C6BD"/><path d="M23 40c8 4 11-4 18 0v9H23v-9Z" fill="#F7F5E5"/><rect x="22" y="7" width="20" height="7" rx="2" fill="#B47456" stroke="#825E43" strokeWidth="1.7"/><path d="M22 31v-2l5-8" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M21 54v2" stroke="#DDD8C7" strokeWidth="3" strokeLinecap="round"/></>}
    {type === 'sugar' && <><path d="M12 33h40l-5 21c-1 6-28 6-30 0l-5-21Z" fill="#D9B889" stroke="#8A6848" strokeWidth="1.7"/><ellipse cx="32" cy="34" rx="20" ry="5" fill="#F3E5CA" stroke="#8A6848" strokeWidth="1.7"/><path d="m22 25 9-4 9 3v10l-9 3-9-4v-8Z" fill="#FFFCF3" stroke="#CFC5AE" strokeWidth="1.3"/><path d="m22 25 9 4 9-5m-9 5v8" stroke="#CFC5AE" strokeWidth="1.3"/><path d="m38 20 7-3 7 2v10l-7 3-7-3v-9Z" fill="#FFFCF3" stroke="#CFC5AE" strokeWidth="1.3"/><path d="m38 20 7 4 7-5m-7 5v8" stroke="#CFC5AE" strokeWidth="1.3"/><path d="M21 45h22" stroke="#ECD1AC" strokeWidth="2" strokeLinecap="round"/></>}
    {type === 'ginger' && <><path d="m17 39-5-7c-4-6 3-11 7-7l7 7 4-12c2-6 10-4 9 2l-2 10 10-5c7-4 12 4 5 8l-11 7 5 6c5 6-3 12-7 7l-9-9-9 6c-8 5-14-4-7-9l3-4Z" fill="#D6B879" stroke="#987B48" strokeWidth="1.8"/><path d="m26 32 4 4m7-4-2 5m6 5-6 2m-18-5 5 3m9 0-4-2m12 8-3 3" stroke="#B59258" strokeWidth="2" strokeLinecap="round"/></>}
    {type === 'cardamom' && <><path d="M22 49C7 41 17 17 29 12c10 11 10 33-7 37Z" fill="#9CAC6E" stroke="#68733E" strokeWidth="1.8"/><path d="M25 17c-4 9-7 19-4 27m7-25c3 11 1 18-3 25" stroke="#71834B" strokeWidth="1.5" strokeLinecap="round"/><path d="M35 52c-8-14 8-28 22-28 4 15-3 31-22 28Z" fill="#B5BD81" stroke="#68733E" strokeWidth="1.8"/><path d="M53 28 38 48m14-16c-2 8-7 13-12 16" stroke="#7E8F53" strokeWidth="1.5" strokeLinecap="round"/></>}
    {type === 'yogurt' && <><path d="M12 30h40l-6 24c-2 5-26 5-28 0l-6-24Z" fill="#AE8062" stroke="#79543F" strokeWidth="1.8"/><ellipse cx="32" cy="30" rx="20" ry="7" fill="#FCF8E8" stroke="#79543F" strokeWidth="1.8"/><path d="M23 29c5-3 15-3 19 0" stroke="#E4DECF" strokeWidth="2" strokeLinecap="round"/><path d="m43 28 9-20" stroke="#A4A59B" strokeWidth="4" strokeLinecap="round"/><path d="M19 43h26" stroke="#D5AD8B" strokeWidth="2"/></>}
    {type === 'flour' && <><path d="M12 33h40l-5 21c-1 6-28 6-30 0l-5-21Z" fill="#E8D5A8" stroke="#A68B5A" strokeWidth="1.7"/><ellipse cx="32" cy="34" rx="20" ry="5" fill="#F5EBD0" stroke="#A68B5A" strokeWidth="1.7"/><path d="M24 38c4 3 12 3 16 0" stroke="#D4C090" strokeWidth="1.5" strokeLinecap="round"/><path d="M28 42c3 2 9 2 12 0" stroke="#D4C090" strokeWidth="1.5" strokeLinecap="round"/><path d="M20 48c8 4 16 4 24 0" stroke="#D4C090" strokeWidth="1.5" strokeLinecap="round"/></>}
    {type === 'potato' && <><ellipse cx="32" cy="36" rx="18" ry="14" fill="#C9A86A" stroke="#8B6F42" strokeWidth="1.8"/><ellipse cx="28" cy="32" rx="3" ry="2" fill="#B08D52"/><ellipse cx="36" cy="38" rx="2.5" ry="1.8" fill="#B08D52"/><ellipse cx="30" cy="42" rx="2" ry="1.5" fill="#B08D52"/><path d="M20 28c4-6 20-6 24 0" stroke="#D4B87A" strokeWidth="1.5" strokeLinecap="round"/></>}
    {type === 'batter' && <><path d="M24 10h16v11l7 12v23c0 6-30 6-30 0V33l7-12V10Z" fill="#D4A86A" stroke="#8B6F42" strokeWidth="1.7"/><path d="M18 36h28v17H18z" fill="#E8C88A"/><path d="M23 40c8 4 11-4 18 0v9H23v-9Z" fill="#F0D8A8"/><rect x="22" y="7" width="20" height="7" rx="2" fill="#8B6F42" stroke="#6B5332" strokeWidth="1.7"/><path d="M22 31v-2l5-8" stroke="#F0D8A8" strokeWidth="3" strokeLinecap="round"/></>}
    {type === 'egg' && <><ellipse cx="32" cy="36" rx="16" ry="20" fill="#F5E6C8" stroke="#C4A86A" strokeWidth="1.8"/><ellipse cx="32" cy="36" rx="10" ry="14" fill="#FBF2E0"/><path d="M28 24c2-4 6-4 8 0" stroke="#E8D0A0" strokeWidth="1.5" strokeLinecap="round"/></>}
  </svg>;
}

export function Avatar({ kind = 'regular', size = 52, className = '' }: { kind?: CustomerKind; size?: number; className?: string }) {
  const clipId = useId();
  const student = kind === 'student';
  const worker = kind === 'worker';
  const officer = kind === 'officer';
  const traveler = kind === 'traveler';
  const background = student ? '#E7E4CE' : officer ? '#E1E8E2' : worker ? '#F0E2C8' : '#EADBCB';
  const shirt = student ? '#BB715A' : officer ? '#5C706F' : worker ? '#BA8E50' : traveler ? '#A86844' : '#84916F';
  return <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    <defs><clipPath id={clipId}><circle cx="40" cy="40" r="40"/></clipPath></defs>
    <g clipPath={`url(#${clipId})`}>
      <circle cx="40" cy="40" r="40" fill={background}/>
      {student && <path d="M20 37c0-29 41-31 41 0l4 34H15l5-34Z" fill="#44372E"/>}
      <path d="M8 83c0-20 12-29 32-29s32 9 32 29H8Z" fill={shirt}/>
      <path d="M33 49h14v13c-4 7-10 7-14 0V49Z" fill="#B9825D"/>
      <ellipse cx="24" cy="37" rx="3" ry="5" fill="#C18D64"/><ellipse cx="56" cy="37" rx="3" ry="5" fill="#C18D64"/>
      <path d="M23 27c0-18 34-18 34 0v14c0 12-9 19-17 19s-17-8-17-19V27Z" fill={student ? '#C9916B' : '#C28C60'}/>
      {!worker && !traveler && <path d="M22 32c-4-19 9-26 21-25 15 1 17 11 15 25l-6-10c-11 4-17 0-21-4l-4 13-5 1Z" fill="#3E332B"/>}
      {student && <path d="M23 33c4-3 9-10 9-16 7 6 14 8 22 9l3 10 2-17-20-9-17 13 1 10Z" fill="#44372E"/>}
      {(worker || traveler) && <><path d="M21 31C11 9 30 8 41 10c18-8 24 11 17 21l-13-7-24 7Z" fill={worker ? '#B86C4C' : '#D59B48'}/><path d="m20 24 35-8m-34 3 31 4m-28 6 22-7" stroke={worker ? '#D38D65' : '#E8B66A'} strokeWidth="3" strokeLinecap="round"/><path d="m21 29-4 18 7-4 1-14" fill={worker ? '#B86C4C' : '#D59B48'}/></>}
      <path d="M29 33h6m10 0h6" stroke="#59402C" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="32" cy="38" rx="1.5" ry="1.9" fill="#362A22"/><ellipse cx="48" cy="38" rx="1.5" ry="1.9" fill="#362A22"/>
      <path d="m40 38-2 7h4" stroke="#A66F49" strokeWidth="1.2" strokeLinecap="round"/>
      {!student && <path d="M40 47c-4-6-7-2-10 1 4 4 7 2 10 0 3 2 6 4 10 0-3-3-6-7-10-1Z" fill="#463327"/>}
      <path d={student ? 'M35 48c3 3 7 3 10 0' : 'M36 52c3 2 6 2 9 0'} stroke="#78472F" strokeWidth="1.4" strokeLinecap="round"/>
      {officer && <><rect x="25" y="33" width="13" height="10" rx="3" stroke="#463F32" strokeWidth="1.6"/><rect x="42" y="33" width="13" height="10" rx="3" stroke="#463F32" strokeWidth="1.6"/><path d="M38 36h4" stroke="#463F32" strokeWidth="1.6"/><path d="m31 57 9 9-7 8-8-14m24-3-9 9 7 8 8-14" fill="#F6F0E0"/><path d="m40 66 4 6-4 10-4-10 4-6Z" fill="#AE6D4D"/></>}
      {student && <><path d="m29 59 6 21h10l7-21-8 7h-9l-6-7Z" fill="#ECD1A8"/><circle cx="24" cy="43" r="2" fill="#D8B34F"/><circle cx="56" cy="43" r="2" fill="#D8B34F"/></>}
      {worker && <path d="m29 58 7 10 4-6 5 6 8-10" stroke="#E6C998" strokeWidth="3" strokeLinejoin="round"/>}
      {!student && !officer && <><path d="M40 64v16" stroke="#F0DABD" strokeWidth="2"/><circle cx="44" cy="71" r="1" fill="#D7C4A0"/></>}
    </g>
  </svg>;
}

export function UpgradeArt({ type, size = 80 }: { type: UpgradeId; size?: number }) {
  if (type === 'quality') return <IngredientArt type="tea" size={size}/>;
  if (type === 'extra-stove') return <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true"><ellipse cx="50" cy="86" rx="34" ry="5" fill="#E8DAC2"/><rect x="14" y="60" width="72" height="23" rx="5" fill="#65645A" stroke="#49493F" strokeWidth="2"/><rect x="22" y="66" width="28" height="8" rx="3" fill="#2F312C"/><rect x="50" y="66" width="28" height="8" rx="3" fill="#2F312C"/><path d="m28 64-4-14 14 2m40 12 4-14-14 2" stroke="#56584F" strokeWidth="4" strokeLinecap="round"/><path d="M28 52c-5-6 3-8 1-12m41 12c-5-6 3-8 1-12" fill="#E6AE46"/><path d="M17 48h66l-5 10H23l-6-10Z" fill="#9C9F8D" stroke="#5D6153" strokeWidth="2"/><circle cx="50" cy="80" r="4" fill="#D2CBBB"/><path d="M34 86v8m32-8v8" stroke="#49493F" strokeWidth="4" strokeLinecap="round"/></svg>;
  return <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    {type === 'stove' && <><ellipse cx="50" cy="85" rx="36" ry="5" fill="#E8DAC2"/><rect x="14" y="64" width="72" height="20" rx="5" fill="#69665A" stroke="#49493F" strokeWidth="2"/><path d="M22 83v6m56-6v6" stroke="#49493F" strokeWidth="4" strokeLinecap="round"/><rect x="21" y="59" width="58" height="7" rx="3" fill="#42433B"/><path d="M36 61c-6-7 0-10 2-15 0 9 9 8 6 15m12 0c-6-7 0-10 2-15 0 9 9 8 6 15" fill="#E6AE46"/><path d="M25 34h49l-4 15c-3 10-39 10-42 0l-3-15Z" fill="#9C9F8D" stroke="#5D6153" strokeWidth="2"/><path d="M24 34h52M75 38h14" stroke="#5D6153" strokeWidth="4" strokeLinecap="round"/><circle cx="68" cy="74" r="4" fill="#D2CBBB"/><path d="M40 26c-7-6 7-9 1-16m14 15c-6-7 6-7 2-13" stroke="#B7AA8C" strokeWidth="2.5" strokeLinecap="round"/></>}
    {type === 'pot' && <><ellipse cx="49" cy="86" rx="33" ry="5" fill="#E8DAC2"/><path d="M64 45h11c18 0 18 25 1 25h-8" stroke="#8A8F80" strokeWidth="6"/><path d="M31 31h31v9c0 6 13 13 13 23 0 29-55 29-55 0 0-10 11-17 11-23v-9Z" fill="#C2C4AF" stroke="#777F6E" strokeWidth="2"/><path d="M28 34h37M30 73c7 7 25 8 34 2" stroke="#E7E5D4" strokeWidth="3" strokeLinecap="round"/><ellipse cx="47" cy="30" rx="20" ry="5" fill="#D8D9C7" stroke="#777F6E" strokeWidth="2"/><path d="M40 22h14v5H40z" fill="#696C5E"/><path d="m29 45-12-7-9 5 16 15" fill="#C2C4AF" stroke="#777F6E" strokeWidth="2"/><path d="M40 15c-7-7 6-8 2-14m13 13c-4-5 6-7 2-11" stroke="#C4B59B" strokeWidth="2" strokeLinecap="round"/></>}
    {type === 'decor' && <><ellipse cx="51" cy="89" rx="37" ry="5" fill="#E8DAC2"/><path d="M48 18v66" stroke="#8D653D" strokeWidth="4" strokeLinecap="round"/><path d="M11 45C20 5 78 5 89 45H11Z" fill="#C88150" stroke="#9A6540" strokeWidth="1.8"/><path d="M26 45c6-28 13-29 23-30-9 10-11 20-10 30H26Zm34 0c1-25-5-29-11-30 17 0 26 15 27 30H60Z" fill="#F4DFC0"/><path d="M12 45c3 9 11 9 15 0 3 9 11 9 15 0 3 9 11 9 15 0 3 9 11 9 15 0 4 9 12 9 16 0" fill="#C88150" stroke="#9A6540" strokeWidth="1.8"/><path d="M14 73h65v9H14z" fill="#B7864E" stroke="#8D653D" strokeWidth="1.5"/><path d="M21 82v9m52-9v9" stroke="#8D653D" strokeWidth="3"/><path d="M46 11V7" stroke="#8D653D" strokeWidth="3" strokeLinecap="round"/></>}
  </svg>;
}

export function CartIllustration({ size = 145 }: { size?: number }) {
  return <svg width={size} height={size * 0.75} viewBox="0 0 160 120" fill="none" aria-hidden="true"><ellipse cx="78" cy="110" rx="62" ry="5" fill="#E9E1CD"/><path d="M33 48v48m89-48v48" stroke="#8A613F" strokeWidth="3"/><path d="M23 42 39 18h74l21 24H23Z" fill="#C88450" stroke="#94623D" strokeWidth="1.5"/><path d="m46 18-9 24h19l4-24m19 0 3 24h18l-9-24" fill="#F4E6C9"/><path d="M23 42v7c4 6 12 6 15 0 4 6 12 6 17 0 4 6 12 6 17 0 4 6 12 6 17 0 4 6 12 6 17 0 4 6 12 6 17 0 4 6 10 6 11 0v-7" fill="#C88450" stroke="#94623D" strokeWidth="1.5"/><path d="M28 73h101v26H28z" fill="#BC8C55" stroke="#8B643E" strokeWidth="1.5"/><path d="M26 70h106v7H26z" fill="#8B5F3A"/><path d="M128 77h17v7h-16" stroke="#8B643E" strokeWidth="3"/><circle cx="44" cy="100" r="13" fill="#EBDEC0" stroke="#655540" strokeWidth="3"/><circle cx="111" cy="100" r="13" fill="#EBDEC0" stroke="#655540" strokeWidth="3"/><path d="M44 88v24m-12-12h24m55-12v24m-12-12h24" stroke="#8A7556" strokeWidth="1.5"/><circle cx="79" cy="87" r="12" fill="#F3E3BC"/><path d="M72 84h13l-2 8h-9l-2-8Zm13 1h3v4h-4" stroke="#8E6842" strokeWidth="1.5"/><path d="M78 81c-3-3 3-3 0-6" stroke="#8E6842" strokeWidth="1.2" strokeLinecap="round"/><path d="M41 65h26l-3-9H45l-4 9Z" fill="#A3A894" stroke="#70745F" strokeWidth="1.5"/><path d="M49 55h13v-3H49z" fill="#858B75"/><path d="M51 47c-4-5 5-6 1-10" stroke="#B3A589" strokeWidth="1.5" strokeLinecap="round"/><rect x="79" y="57" width="10" height="12" rx="2" fill="#A2A471" stroke="#7C7B50" strokeWidth="1.3"/><rect x="94" y="57" width="10" height="12" rx="2" fill="#D4AA71" stroke="#9B7649" strokeWidth="1.3"/><path d="M109 62h10l-2 7h-6l-2-7Z" fill="#B6744B"/></svg>;
}

export function StaffFigure({ role, size = 54 }: { role: StaffId; size?: number }) {
  const apron = role === 'washer' ? '#7F9167' : role === 'cashier' ? '#A86844' : role === 'cook' ? '#8A613F' : '#84916F';
  const shirt = role === 'washer' ? '#BB715A' : role === 'cashier' ? '#5C706F' : role === 'cook' ? '#BA8E50' : '#D9B889';
  return <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <circle cx="40" cy="40" r="40" fill="#F0E7D6"/>
    <path d="M22 31C12 9 31 8 42 10c18-8 24 11 17 21l-13-7-24 7Z" fill={role === 'cook' ? '#C88450' : '#44372E'}/>
    <path d="M8 83c0-20 12-29 32-29s32 9 32 29H8Z" fill={shirt}/>
    <path d="M33 49h14v13c-4 7-10 7-14 0V49Z" fill="#B9825D"/>
    <ellipse cx="24" cy="37" rx="3" ry="5" fill="#C18D64"/><ellipse cx="56" cy="37" rx="3" ry="5" fill="#C18D64"/>
    <path d="M23 27c0-18 34-18 34 0v14c0 12-9 19-17 19s-17-8-17-19V27Z" fill="#C9916B"/>
    <path d="M29 33h6m10 0h6" stroke="#59402C" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="32" cy="38" rx="1.5" ry="1.9" fill="#362A22"/><ellipse cx="48" cy="38" rx="1.5" ry="1.9" fill="#362A22"/>
    <path d="m40 38-2 7h4" stroke="#A66F49" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M40 47c-4-6-7-2-10 1 4 4 7 2 10 0 3 2 6 4 10 0-3-3-6-7-10-1Z" fill="#463327"/>
    {role === 'washer' && <><rect x="8" y="55" width="24" height="18" rx="4" fill="#9CA7A0" stroke="#6E7A73" strokeWidth="1.5"/><path d="M12 58h16v10H12z" fill="#C8D8E0"/><circle cx="18" cy="63" r="2" fill="#E8F0F4"/><circle cx="24" cy="61" r="1.5" fill="#E8F0F4"/></>}
    {role === 'helper' && <><rect x="52" y="52" width="18" height="12" rx="3" fill="#C88450" stroke="#94623D" strokeWidth="1.3"/><path d="M56 56h10M56 60h10" stroke="#F4E6C9" strokeWidth="1.5" strokeLinecap="round"/></>}
    {role === 'cashier' && <><rect x="52" y="50" width="16" height="20" rx="2" fill="#F4E0B8" stroke="#B69A5E" strokeWidth="1.3"/><path d="M55 55h10M55 59h10M55 63h10" stroke="#C8A86A" strokeWidth="1.2" strokeLinecap="round"/></>}
    {role === 'cook' && <><path d="M58 48v-12" stroke="#8A613F" strokeWidth="3" strokeLinecap="round"/><ellipse cx="58" cy="38" rx="6" ry="3" fill="#9C9F8D" stroke="#5D6153" strokeWidth="1.3"/></>}
    <path d="M30 63l6 8 4-5 5 5 8-8" stroke={apron} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

export function WashBasin({ size = 60 }: { size?: number }) {
  return <svg width={size} height={size * 0.6} viewBox="0 0 100 60" fill="none" aria-hidden="true"><ellipse cx="50" cy="55" rx="40" ry="4" fill="#E8DAC2"/><path d="M10 20h80l-6 30c-2 6-66 6-68 0l-6-30Z" fill="#9CA7A0" stroke="#6E7A73" strokeWidth="2"/><ellipse cx="50" cy="22" rx="38" ry="7" fill="#C8D8E0" stroke="#6E7A73" strokeWidth="2"/><ellipse cx="50" cy="22" rx="30" ry="4" fill="#A8C4D4"/><path d="M30 14c-8-10 8-12 2-20m38 20c-8-10 8-12 2-20" stroke="#B7AA8C" strokeWidth="2.5" strokeLinecap="round"/></svg>;
}