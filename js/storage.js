// WONDER IV — Guardado local de récords y estrellas.
// Mismas claves que la versión del hub: el progreso se conserva en el mismo dominio.

// ════════════════════════════════════════
//  BEST SCORES (localStorage)
// ════════════════════════════════════════
function getBestScore(idx) {
  try { return parseInt(localStorage.getItem('wonder_best_' + idx) || '0'); } catch(e){ return 0; }
}
function setBestScore(idx, s) {
  try { localStorage.setItem('wonder_best_' + idx, s); } catch(e){}
}
function getBestStars(idx) {
  try { return parseInt(localStorage.getItem('wonder_stars_' + idx) || '0'); } catch(e){ return 0; }
}
function setBestStars(idx, s) {
  try { localStorage.setItem('wonder_stars_' + idx, s); } catch(e){}
}
