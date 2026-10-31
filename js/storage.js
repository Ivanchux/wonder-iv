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

// ════════════════════════════════════════
//  ALMACÉN DE MATERIALES (se usa en el asentamiento)
// ════════════════════════════════════════
function getStock() {
  try { const j = JSON.parse(localStorage.getItem('wonder_stock') || '{}'); return (j && typeof j === 'object') ? j : {}; } catch(e){ return {}; }
}
function addStock(mat, n) {
  const st = getStock(); st[mat] = (st[mat] || 0) + n;
  try { localStorage.setItem('wonder_stock', JSON.stringify(st)); } catch(e){}
  return st;
}

// ════════════════════════════════════════
//  EDIFICIOS DEL ASENTAMIENTO
// ════════════════════════════════════════
function getBuildings() {
  try { const j = JSON.parse(localStorage.getItem('wonder_build') || '{}'); return (j && typeof j === 'object') ? j : {}; } catch(e){ return {}; }
}
function buildingLevel(id) { return Math.min(BUILD_MAX, Math.max(0, getBuildings()[id] | 0)); }
// Mejora un edificio si hay materiales. Devuelve true si lo ha subido de nivel.
function upgradeBuilding(id) {
  const b = BUILDINGS.find(x => x.id === id); if (!b) return false;
  const lv = buildingLevel(id); if (lv >= BUILD_MAX) return false;
  const cost = b.cost[lv], st = getStock();
  if ((st[b.mat] || 0) < cost) return false;
  st[b.mat] -= cost;
  const bs = getBuildings(); bs[id] = lv + 1;
  try { localStorage.setItem('wonder_stock', JSON.stringify(st)); localStorage.setItem('wonder_build', JSON.stringify(bs)); } catch(e){ return false; }
  return true;
}
