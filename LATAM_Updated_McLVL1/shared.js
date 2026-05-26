// ─── UTILIDADES COMPARTIDAS — Capacitación de Tutores de Minecraft Education ─────────────────

function getTheme() { return localStorage.getItem('mc-theme') || 'light'; }
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('mc-theme', t);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
}
function toggleTheme() { applyTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

const STORAGE_KEY = 'mc-edu-progress';
function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
function markModulePassed(moduleId, score) {
  const p = getProgress();
  p[moduleId] = { passed: true, score, timestamp: Date.now() };
  saveProgress(p);
}
function isModulePassed(moduleId) {
  const p = getProgress();
  return p[moduleId] && p[moduleId].passed === true;
}
function getModuleScore(moduleId) {
  const p = getProgress();
  return p[moduleId] ? p[moduleId].score : null;
}
function isModuleUnlocked(moduleId) {
  if (isDevMode()) return true;
  if (moduleId === 1) return true;
  return isModulePassed(moduleId - 1);
}

const TOTAL_MODULES = 5;
function getOverallProgress() {
  let passed = 0;
  for (let i = 1; i <= TOTAL_MODULES; i++) { if (isModulePassed(i)) passed++; }
  return passed;
}

function isDevMode() { return localStorage.getItem('mc-devmode') === '1'; }
function activateDevMode() {
  localStorage.setItem('mc-devmode', '1');
  const p = {};
  for (let i = 1; i <= TOTAL_MODULES; i++) p[i] = { passed: true, score: 100 };
  saveProgress(p);
  showDevBadge(true);
  alert('🔓 Modo Desarrollador ACTIVADO — Todos los módulos desbloqueados.');
}
function deactivateDevMode() {
  localStorage.removeItem('mc-devmode');
  saveProgress({});
  showDevBadge(false);
  alert('🔒 Modo Desarrollador DESACTIVADO — Progreso restablecido.');
}
function toggleDevMode() { isDevMode() ? deactivateDevMode() : activateDevMode(); }
function showDevBadge(on) {
  let b = document.getElementById('dev-badge');
  if (!b) {
    b = document.createElement('div');
    b.id = 'dev-badge';
    b.style.cssText = 'position:fixed;bottom:14px;right:14px;background:var(--pink,#f03d9e);color:#fff;font-family:Nunito,sans-serif;font-weight:900;font-size:11px;padding:5px 12px;border-radius:20px;z-index:9999;pointer-events:none;letter-spacing:.5px;box-shadow:0 2px 12px rgba(0,0,0,.3)';
    b.textContent = '🔓 MODO DEV ACTIVADO';
    document.body.appendChild(b);
  }
  b.style.display = on ? 'block' : 'none';
}

(function() {
  let seq = 0, timer = null;
  document.addEventListener('keydown', function(e) {
    if (e.key === 'D' && e.shiftKey) {
      clearTimeout(timer);
      seq++;
      timer = setTimeout(() => seq = 0, 2000);
      if (seq >= 3) { seq = 0; toggleDevMode(); if (typeof onDevModeToggle === 'function') onDevModeToggle(); }
    }
  });
})();

function initShared() {
  applyTheme(getTheme());
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', toggleTheme);
  if (isDevMode()) showDevBadge(true);
}

function goHome() { window.location.href = 'Es.html'; }
function goModule(n) { window.location.href = `EsModule${n}.html`; }
function goTest(n) { window.location.href = `EsModule${n}Test.html`; }
function goDST() { window.location.href = 'EsDST.html'; }