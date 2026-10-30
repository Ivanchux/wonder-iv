// Gemas de la dirección de arte: piedra tallada con incrustación y símbolo dorado. Cada una devuelve el SVG interior (viewBox 0 0 100 100).
const PAL = { gold: '#f2d27a', goldD: '#a8782a', stone: '#d9bd8a', stoneD: '#8a6a3a', ink: '#2a1a08' };
const GEMS = [
  { name: 'ESCARABAJO', col: '#1fb8a8', dark: '#0b6b66', sym: `<ellipse cx="50" cy="54" rx="17" ry="21" fill="none" stroke="${PAL.gold}" stroke-width="4"/><path d="M50 33V75M33 54H67" stroke="${PAL.gold}" stroke-width="3"/><circle cx="50" cy="30" r="7" fill="${PAL.gold}"/><path d="M33 44L20 36M67 44L80 36M33 64L20 74M67 64L80 74" stroke="${PAL.gold}" stroke-width="4" stroke-linecap="round"/>` },
  { name: 'ANJ', col: '#e3a82c', dark: '#8a5a0a', sym: `<ellipse cx="50" cy="34" rx="12" ry="16" fill="none" stroke="${PAL.gold}" stroke-width="6"/><path d="M50 50V84M30 60H70" stroke="${PAL.gold}" stroke-width="7" stroke-linecap="round"/>` },
  { name: 'OJO DE HORUS', col: '#2a56c8', dark: '#122a78', sym: `<path d="M18 50Q50 22 82 50Q50 72 18 50Z" fill="none" stroke="${PAL.gold}" stroke-width="5"/><circle cx="50" cy="50" r="10" fill="${PAL.gold}"/><circle cx="50" cy="50" r="4" fill="${PAL.ink}"/><path d="M50 72V84Q44 90 36 86M62 62L74 74" stroke="${PAL.gold}" stroke-width="5" fill="none" stroke-linecap="round"/>` },
  { name: 'LOTO', col: '#d9578f', dark: '#7a1a48', sym: `<path d="M50 24Q60 44 50 70Q40 44 50 24Z M30 36Q50 50 50 70Q28 62 30 36Z M70 36Q50 50 50 70Q72 62 70 36Z" fill="none" stroke="${PAL.gold}" stroke-width="4" stroke-linejoin="round"/><path d="M34 76H66" stroke="${PAL.gold}" stroke-width="5" stroke-linecap="round"/>` },
  { name: 'DISCO SOLAR', col: '#e8602a', dark: '#8a2208', sym: `<circle cx="50" cy="52" r="15" fill="${PAL.gold}"/><g stroke="${PAL.gold}" stroke-width="4" stroke-linecap="round"><path d="M50 22V30M50 74V82M20 52H28M72 52H80M29 31L35 37M71 31L65 37M29 73L35 67M71 73L65 67"/></g><path d="M36 44Q50 28 64 44" fill="none" stroke="${PAL.ink}" stroke-width="3"/>` },
  { name: 'ÁNFORA', col: '#b4532a', dark: '#5e230a', sym: `<path d="M40 24H60L58 34Q72 44 68 62Q64 80 50 82Q36 80 32 62Q28 44 42 34Z" fill="none" stroke="${PAL.gold}" stroke-width="4" stroke-linejoin="round"/><path d="M40 24Q30 28 32 42M60 24Q70 28 68 42" fill="none" stroke="${PAL.gold}" stroke-width="4"/><path d="M38 54H62M40 64H60" stroke="${PAL.gold}" stroke-width="3"/>` },
  { name: 'COLUMNA', col: '#7a86b8', dark: '#2e3664', sym: `<path d="M34 28Q34 22 42 24L50 28L58 24Q66 22 66 28" fill="none" stroke="${PAL.gold}" stroke-width="4" stroke-linecap="round"/><path d="M38 34H62V74H38Z" fill="none" stroke="${PAL.gold}" stroke-width="4"/><path d="M44 34V74M50 34V74M56 34V74" stroke="${PAL.gold}" stroke-width="2.5"/><path d="M32 78H68" stroke="${PAL.gold}" stroke-width="5" stroke-linecap="round"/>` },
];
function gemTile(i, opt = {}) {
  const g = GEMS[i], id = 'g' + i + (opt.u || '');
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ead2a0"/><stop offset=".5" stop-color="#c9a46a"/><stop offset="1" stop-color="#8a6a3a"/></linearGradient>
    <radialGradient id="${id}r" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="${g.col}"/><stop offset="1" stop-color="${g.dark}"/></radialGradient>
    <filter id="${id}n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${i + 3}"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .1  0 0 0 .22 0"/></filter>
  </defs>
  <rect x="3" y="3" width="94" height="94" rx="12" fill="url(#${id}b)" stroke="#5a3e18" stroke-width="3"/>
  <rect x="3" y="3" width="94" height="94" rx="12" filter="url(#${id}n)"/>
  <path d="M8 14Q8 8 14 8H86" fill="none" stroke="#fff4d0" stroke-width="2.5" opacity=".7" stroke-linecap="round"/>
  <rect x="14" y="14" width="72" height="72" rx="14" fill="url(#${id}r)" stroke="#3a2608" stroke-width="3"/>
  <path d="M22 30Q22 20 34 20H58" fill="none" stroke="#fff" stroke-width="4" opacity=".35" stroke-linecap="round"/>
  ${g.sym}
  </svg>`;
}
function alienOverlay() {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="al" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#9dffd8" stop-opacity=".55"/><stop offset="1" stop-color="#6a1fd0" stop-opacity=".75"/></radialGradient></defs>
  <rect x="3" y="3" width="94" height="94" rx="12" fill="url(#al)"/>
  <g fill="none" stroke="#c8fff0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".95"><path d="M30 30L50 22L70 30"/><circle cx="50" cy="50" r="10"/><path d="M50 60V78M36 70L50 78L64 70"/><path d="M26 54H38M62 54H74"/></g>
  <g stroke="#e0b8ff" stroke-width="2" opacity=".8" fill="none"><path d="M10 90Q30 70 24 56M92 12Q70 28 76 44"/></g></svg>`;
}
