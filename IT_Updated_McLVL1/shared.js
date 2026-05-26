// ─── UTILITÀ CONDIVISE — Formazione Tutor Minecraft Education ─────────────────

// ── Tema ──────────────────────────────────────────────────────────────────
function getTheme() { return localStorage.getItem('mc-theme') || 'light'; }
function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('mc-theme', t);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
}
function toggleTheme() { applyTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

// ── Archiviazione dei Progressi ────────────────────────────────────────────
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

// Moduli totali
const TOTAL_MODULES = 5;
function getOverallProgress() {
    let passed = 0;
    for (let i = 1; i <= TOTAL_MODULES; i++) { if (isModulePassed(i)) passed++; }
    return passed;
}

// ── Modalità Sviluppatore ──────────────────────────────────────────────────
function isDevMode() { return localStorage.getItem('mc-devmode') === '1'; }
function activateDevMode() {
    localStorage.setItem('mc-devmode', '1');
    const p = {};
    for (let i = 1; i <= TOTAL_MODULES; i++) p[i] = { passed: true, score: 100 };
    saveProgress(p);
    showDevBadge(true);
    alert('🔓 Modalità Sviluppatore ABILITATA — tutti i moduli sono sbloccati. I progressi verranno resettati alla disattivazione.');
}
function deactivateDevMode() {
    localStorage.removeItem('mc-devmode');
    saveProgress({});
    showDevBadge(false);
    alert('🔒 Modalità Sviluppatore DISABILITATA — progressi cancellati.');
}
function toggleDevMode() { isDevMode() ? deactivateDevMode() : activateDevMode(); }
function showDevBadge(on) {
    let b = document.getElementById('dev-badge');
    if (!b) {
        b = document.createElement('div');
        b.id = 'dev-badge';
        b.style.cssText = 'position:fixed;bottom:14px;right:14px;background:var(--pink,#f03d9e);color:#fff;font-family:Nunito,sans-serif;font-weight:900;font-size:11px;padding:5px 12px;border-radius:20px;z-index:9999;pointer-events:none;letter-spacing:.5px;box-shadow:0 2px 12px rgba(0,0,0,.3)';
        b.textContent = '🔓 MODALITÀ DEV';
        document.body.appendChild(b);
    }
    b.style.display = on ? 'block' : 'none';
}

// ── Attivazione Modalità Sviluppatore (Shift+D × 3 entro 2s) ───────────────
(function () {
    let seq = 0, timer = null;
    document.addEventListener('keydown', function (e) {
        if (e.key === 'D' && e.shiftKey) {
            clearTimeout(timer);
            seq++;
            timer = setTimeout(() => seq = 0, 2000);
            if (seq >= 3) { seq = 0; toggleDevMode(); if (typeof onDevModeToggle === 'function') onDevModeToggle(); }
        }
    });
})();

// ── Funzioni di inizializzazione ───────────────────────────────────────────
function initShared() {
    applyTheme(getTheme());
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggleTheme);
    if (isDevMode()) showDevBadge(true);
    injectRegionSwitcher();
}

// ── Funzioni di navigazione ────────────────────────────────────────────────
function goHome() { window.location.href = 'It.html'; }
function goModule(n) { window.location.href = `ItModule${n}.html`; }
function goTest(n) { window.location.href = `ItModule${n}Test.html`; }
function goDST() { window.location.href = 'ItDST.html'; }

// ── Region Switcher ─────────────────────────────────────────────────────────
function injectRegionSwitcher() {
    const navR = document.querySelector('.nav-r');
    if (!navR || document.getElementById('region-switcher-btn')) return;

    const FLAGS = {
        en: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="20" height="14" style="vertical-align:middle;border-radius:2px"><rect width="60" height="40" fill="#012169"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" stroke-width="8"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="5"/><path d="M30,0 V40 M0,20 H60" stroke="#fff" stroke-width="13"/><path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="8"/></svg>',
        it: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="20" height="14" style="vertical-align:middle;border-radius:2px"><rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#CE2B37"/></svg>',
        es: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="20" height="14" style="vertical-align:middle;border-radius:2px"><rect width="60" height="40" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/></svg>',
        pl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="20" height="14" style="vertical-align:middle;border-radius:2px"><rect width="60" height="20" fill="#fff"/><rect y="20" width="60" height="20" fill="#DC143C"/></svg>',
        pt: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="20" height="14" style="vertical-align:middle;border-radius:2px"><rect width="60" height="40" fill="#009C3B"/><polygon points="30,4 56,20 30,36 4,20" fill="#FFDF00"/><circle cx="30" cy="20" r="9" fill="#002776"/></svg>',
    };

    const REGIONS = [
        { key:'en', label:'ENG', path:'../ENG_Updated_McLVL1/En.html',   msg: 'You are about to switch to the English training.\n\nStai per passare alla formazione in inglese.' },
        { key:'it', label:'IT',  path:'../IT_Updated_McLVL1/it.html',    msg: null },
        { key:'es', label:'ES',  path:'../LATAM_Updated_McLVL1/es.html', msg: 'Stai per passare alla formazione in spagnolo.\n\nEstás a punto de cambiar a la formación en español.' },
        { key:'pl', label:'PL',  path:'../POL_Updated_McLVL1/pol.html',  msg: 'Stai per passare alla formazione in polacco.\n\nZamierzasz przejść do szkolenia polskiego.' },
        { key:'pt', label:'PT',  path:'../PT_Updated_McLVL1/pt.html',    msg: 'Stai per passare alla formazione in portoghese.\n\nVocê está prestes a mudar para o treinamento em português.' },
    ];

    if (!document.getElementById('region-switcher-style')) {
        const style = document.createElement('style');
        style.id = 'region-switcher-style';
        style.textContent = `
            #region-switcher-btn{width:36px;height:36px;border-radius:999px;background:var(--surface);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;transition:all .15s;flex-shrink:0}
            #region-switcher-btn:hover{background:var(--lime);border-color:var(--lime-d)}
            #region-dd{display:none;position:fixed;min-width:170px;background:var(--surface);border:2px solid var(--border);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.18);z-index:9999;padding:6px;flex-direction:column;gap:2px}
            #region-dd.open{display:flex}
            .region-opt{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;border:none;background:transparent;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;color:var(--text);cursor:pointer;transition:background .12s;text-align:left;width:100%}
            .region-opt:hover{background:var(--surface2)}
            .region-opt.active{background:var(--surface2);color:var(--lime-d);font-weight:700;cursor:default}
            .region-opt .rc{margin-left:auto;font-size:11px;opacity:0}
            .region-opt.active .rc{opacity:1}
            .region-dd-sep{height:1px;background:var(--border);margin:4px 0}
            .region-home{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:600;color:var(--text-muted);text-decoration:none;transition:background .12s}
            .region-home:hover{background:var(--surface2)}
            #region-modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);z-index:10000;align-items:center;justify-content:center}
            #region-modal-overlay.show{display:flex}
            #region-modal{background:var(--surface);border:2px solid var(--border);border-radius:20px;padding:28px;max-width:420px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2)}
            #region-modal h3{font-family:'Nunito',sans-serif;font-size:18px;font-weight:900;color:var(--text);margin-bottom:8px}
            #region-modal p{font-size:13px;color:var(--text2);line-height:1.65;margin-bottom:20px;white-space:pre-line}
            .rm-btns{display:flex;gap:10px}
            .rm-yes{flex:1;padding:11px;background:var(--lime);color:var(--ink);border:none;border-radius:999px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:900;cursor:pointer}
            .rm-yes:hover{background:var(--lime-d)}
            .rm-no{flex:1;padding:11px;background:var(--surface2);color:var(--text2);border:2px solid var(--border);border-radius:999px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;cursor:pointer}
            .rm-no:hover{background:var(--border)}
        `;
        document.head.appendChild(style);
    }

    const btn = document.createElement('button');
    btn.id = 'region-switcher-btn';
    btn.title = 'Cambia regione';
    btn.innerHTML = '🌐';

    const dd = document.createElement('div');
    dd.id = 'region-dd';

    REGIONS.forEach(r => {
        const opt = document.createElement('button');
        opt.className = 'region-opt' + (r.key === 'it' ? ' active' : '');
        opt.innerHTML = `${FLAGS[r.key]}<span>${r.label}</span><span class="rc">✓</span>`;
        if (r.key !== 'it') {
            opt.onclick = () => { closeDD(); showRegionModal(r); };
        }
        dd.appendChild(opt);
    });

    const sep = document.createElement('div');
    sep.className = 'region-dd-sep';
    dd.appendChild(sep);

    const homeLink = document.createElement('a');
    homeLink.className = 'region-home';
    homeLink.href = '../index.html';
    homeLink.innerHTML = '🌍 &nbsp;Cambia regione';
    dd.appendChild(homeLink);

    document.body.appendChild(dd);

    const overlay = document.createElement('div');
    overlay.id = 'region-modal-overlay';
    overlay.innerHTML = `
        <div id="region-modal">
            <div style="font-size:32px;margin-bottom:10px">🌐</div>
            <h3 id="rm-title">Cambia Regione</h3>
            <p id="rm-body"></p>
            <div class="rm-btns">
                <button class="rm-no" id="rm-cancel">Annulla</button>
                <button class="rm-yes" id="rm-confirm">Apri →</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    document.getElementById('rm-cancel').onclick = () => overlay.classList.remove('show');
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });

    btn.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = dd.classList.contains('open');
        closeDD();
        if (!isOpen) {
            const r = btn.getBoundingClientRect();
            dd.style.top = (r.bottom + 6) + 'px';
            dd.style.right = (window.innerWidth - r.right) + 'px';
            dd.style.left = 'auto';
            dd.classList.add('open');
        }
    });

    document.addEventListener('click', e => {
        if (!dd.contains(e.target) && e.target !== btn) closeDD();
    });

    function closeDD() { dd.classList.remove('open'); }

    function showRegionModal(region) {
        document.getElementById('rm-title').textContent = 'Passa a ' + region.label;
        document.getElementById('rm-body').textContent = region.msg;
        document.getElementById('rm-confirm').onclick = () => { window.location.href = region.path; };
        overlay.classList.add('show');
    }

    const themeBtn = document.getElementById('theme-toggle');
    navR.insertBefore(btn, themeBtn);
}
