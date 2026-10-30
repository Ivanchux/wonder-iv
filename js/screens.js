// WONDER IV — Cambio de pantallas y menú de selección de maravilla.

// ════════════════════════════════════════
//  SCREENS
// ════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function goToSelect() {
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('era-card').classList.remove('show');
  showScreen('screen-select');
}

// ════════════════════════════════════════
//  SELECT SCREEN
// ════════════════════════════════════════
function buildSelectScreen() {
  const grid = document.getElementById('sel-grid');
  grid.innerHTML = '';
  WONDERS.forEach((w, i) => {
    const best   = getBestScore(i);
    const stars  = getBestStars(i);
    const locked = i > 0 && getBestStars(i-1) === 0;
    const card   = document.createElement('div');
    card.className = 'wonder-card' + (locked ? ' locked' : '');

    const starHtml = [0,1,2].map(s => `<span class="wc-star${s < stars ? ' earned' : ''}">★</span>`).join('');

    card.innerHTML =
      `<div class="wc-top">` +
        `<div class="wc-num">MARAVILLA ${String(i+1).padStart(2,'0')}</div>` +
        `<div class="wc-stars">${starHtml}</div>` +
      `</div>` +
      `<div class="wc-title">${w.name}</div>` +
      `<div class="wc-desc">${w.desc}</div>` +
      `<div class="wc-ascii">${w.ascii.join('\n')}</div>` +
      `<div class="wc-meta">` +
        `<span class="wc-tag diff-${w.diff}">${diffLabel(w.diff)}</span>` +
        `<span class="wc-tag">${w.stages} ETAPAS</span>` +
        `<span class="wc-tag">${w.movs} MOVS</span>` +
        `<span class="wc-tag">${w.year}</span>` +
        (best > 0 ? `<span class="wc-tag" style="color:#ffaa0077">MEJOR: ${best}</span>` : '') +
        (locked   ? `<span class="wc-tag tag-locked">🔒 BLOQUEADO</span>` : '') +
      `</div>`;
    if (!locked) card.addEventListener('click', () => startLevel(i));
    grid.appendChild(card);
  });
}
function diffLabel(d) {
  return {easy:'FÁCIL',medium:'MEDIO',hard:'DIFÍCIL',expert:'EXPERTO'}[d]||d.toUpperCase();
}
