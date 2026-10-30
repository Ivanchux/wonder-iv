// WONDER IV — Arranque.

// ════════════════════════════════════════
//  BOOT
// ════════════════════════════════════════
window.addEventListener('resize',()=>{ invalidateMetrics(); relayoutBoard(); });
buildSelectScreen();

// Botón ◑ — modo claro/oscuro propio del juego
(function () {
  const btn = document.getElementById('btn-theme');
  let saved = null;
  try { saved = localStorage.getItem('rt_wonder_theme'); } catch (e) {}
  if (saved === 'light') document.body.classList.add('light-mode');
  if (btn) {
    btn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      try { localStorage.setItem('rt_wonder_theme', isLight ? 'light' : 'dark'); } catch (e) {}
    });
  }
})();
