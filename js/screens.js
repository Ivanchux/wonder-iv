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
  document.body.classList.remove('in-level');
  Snd.music('menu');
  showScreen('screen-select');
}

// ════════════════════════════════════════
//  MENÚ: el asentamiento se dibuja en js/asentamiento.js
// ════════════════════════════════════════
function buildSelectScreen() { if (typeof renderSettlement === 'function') renderSettlement(); }
function diffLabel(d) {
  return {easy:'FÁCIL',medium:'MEDIO',hard:'DIFÍCIL',expert:'EXPERTO'}[d]||d.toUpperCase();
}
