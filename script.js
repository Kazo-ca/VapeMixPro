// ============================================================
// VapeMix Pro — Interface (DOM, événements, historique)
// Les calculs sont dans calculator.js (VapeCalc), les textes dans i18n.js (translations).
// ============================================================

const { FIELDS, parseDecimal, formatDecimal, solve, applyReduction } = window.VapeCalc;

const STORAGE_HISTORY = 'vapemix_history';
const STORAGE_CURRENT = 'vapemix_current';
const STORAGE_LANG = 'vapemix_lang';
const HISTORY_MAX = 10;
const MAX_LOCKS = 2;
const ALERT_DURATION_MS = 4000;

const ERROR_KEYS = {
    invalidNumber: 'errInvalidNumber',
    targetTooHigh: 'errTargetTooHigh',
    lockConflict: 'errLockConflict',
    negative: 'errNegative',
    invalidVolume: 'errInvalidVolume',
    invalidRatio: 'errInvalidRatio',
    invalidBooster: 'errInvalidBooster',
    unsolvable: 'errUnsolvable',
    notEditable: 'errUnsolvable',
    invalidReduction: 'errInvalidReduction'
};

const DEFAULT_STATE = {
    volume: 50,
    ratioVg: 60, // PG = 100 - ratioVg
    useNicotine: false,
    nicBooster: 20,
    nicTarget: 3,
    // Valeurs calculées
    outBooster: 0,
    outVg: 0,
    outPg: 0
};

// Current active language
let currentLang = 'en';
// État de l'application (remplacé à chaque calcul, jamais modifié en place)
let state = { ...DEFAULT_STATE };
// Champs verrouillés (cadenas), dans l'ordre où ils ont été verrouillés
let locks = [];
// Dernière cible de nicotine avant désactivation, pour la restaurer
let lastNicTarget = DEFAULT_STATE.nicTarget;

// Elements DOM
const el = {
    inVol: document.getElementById('in-volume'),
    inRatio: document.getElementById('in-ratio'),
    inVgPercent: document.getElementById('in-vg-percent'),
    inPgPercent: document.getElementById('in-pg-percent'),
    inUseNic: document.getElementById('in-use-nic'),
    inNicBooster: document.getElementById('in-nic-booster'),
    inNicTarget: document.getElementById('in-nic-target'),
    inSevrageStep: document.getElementById('in-sevrage-step'),
    outBooster: document.getElementById('out-booster'),
    outVg: document.getElementById('out-vg'),
    outPg: document.getElementById('out-pg'),
    formulasDisplay: document.getElementById('formulas-display'),
    optiContainer: document.getElementById('optimization-container'),
    historyList: document.getElementById('history-list'),
    sevrageContainer: document.getElementById('sevrage-container')
};

// Champs numériques éditables : élément, champ du modèle, conversion saisie -> valeur, affichage
const INPUTS = [
    { input: el.inVol, field: 'volume', display: s => fmt(s.volume) },
    { input: el.inVgPercent, field: 'ratioVg', display: s => fmt(s.ratioVg, 1) },
    { input: el.inPgPercent, field: 'ratioVg', toValue: pg => 100 - pg, display: s => fmt(100 - s.ratioVg, 1) },
    { input: el.inNicBooster, field: 'nicBooster', display: s => fmt(s.nicBooster) },
    { input: el.inNicTarget, field: 'nicTarget', display: s => fmt(s.nicTarget) },
    { input: el.outBooster, field: 'outBooster', display: s => fmt(s.outBooster) },
    { input: el.outVg, field: 'outVg', display: s => fmt(s.outVg) },
    { input: el.outPg, field: 'outPg', display: s => fmt(s.outPg) }
];

function fmt(num, decimals) {
    return formatDecimal(num, currentLang, decimals);
}

function t() {
    return translations[currentLang];
}

// ============================================================
// Stockage local (peut être indisponible : navigation privée, etc.)
// ============================================================
function readJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
        return fallback;
    }
}

function writeJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        // Stockage plein ou bloqué : l'application reste utilisable sans persistance
    }
}

function persistCurrent() {
    writeJson(STORAGE_CURRENT, { state, locks });
}

// ============================================================
// Application d'une modification
// ============================================================

/**
 * Recalcule la recette après la modification d'un champ.
 * @param {string} field champ modifié
 * @param {number} value
 * @param {HTMLElement|null} sourceInput champ en cours de saisie (non réécrit pour ne pas gêner la frappe)
 * @returns {boolean} true si la modification a été appliquée
 */
function applyChange(field, value, sourceInput) {
    const res = solve(state, field, value, locks);
    if (!res.ok) {
        showFieldError(sourceInput, res.error);
        return false;
    }
    commitState(res.state, sourceInput);
    return true;
}

function commitState(nextState, skipInput) {
    state = nextState;
    clearFieldError();
    render(skipInput);
    persistCurrent();
}

function render(skipInput) {
    INPUTS.forEach(({ input, display }) => {
        if (input !== skipInput) input.value = display(state);
    });
    if (el.inRatio !== skipInput) el.inRatio.value = Math.round(state.ratioVg);

    // Re-query booster-ratio-text in case the booster-note innerHTML was rebuilt by setLanguage
    const boosterRatioEl = document.getElementById('booster-ratio-text');
    if (boosterRatioEl) boosterRatioEl.innerText = ratioLabel();

    el.inUseNic.checked = state.useNicotine;
    toggleNicotineSections(state.useNicotine);
    if (el.sevrageContainer) {
        el.sevrageContainer.style.display = (state.useNicotine && state.nicTarget > 0) ? 'block' : 'none';
    }

    renderLocks();
    generateFormulas();
    checkOptimizations();
}

function ratioLabel() {
    return `${fmt(state.ratioVg, 1)}/${fmt(100 - state.ratioVg, 1)}`;
}

// ============================================================
// Erreurs de saisie (affichées sous le champ concerné)
// ============================================================
function showFieldError(input, errorCode) {
    clearFieldError();
    const message = t()[ERROR_KEYS[errorCode] || 'errUnsolvable'];
    if (!input || input === el.inRatio) {
        showAlert(message, 'danger');
        return;
    }
    input.classList.add('is-invalid');
    const anchor = input.closest('.input-group') || input;
    const feedback = document.createElement('div');
    feedback.className = 'calc-error small';
    feedback.id = 'calc-error';
    feedback.setAttribute('role', 'alert');
    feedback.textContent = message;
    anchor.after(feedback);
}

function clearFieldError() {
    document.querySelectorAll('.is-invalid').forEach(node => node.classList.remove('is-invalid'));
    const existing = document.getElementById('calc-error');
    if (existing) existing.remove();
}

// ============================================================
// Cadenas
// ============================================================
function toggleLock(field) {
    if (locks.includes(field)) {
        locks = locks.filter(f => f !== field);
    } else if (locks.length >= MAX_LOCKS) {
        showAlert(t().errTooManyLocks.replace('%MAX%', MAX_LOCKS), 'warning');
        return;
    } else {
        locks = [...locks, field];
    }
    clearFieldError();
    renderLocks();
    checkOptimizations();
    persistCurrent();
}

function renderLocks() {
    document.querySelectorAll('[data-lock]').forEach(btn => {
        const locked = locks.includes(btn.dataset.lock);
        const label = locked ? t().unlockTitle : t().lockTitle;
        btn.classList.toggle('locked', locked);
        btn.setAttribute('aria-pressed', String(locked));
        btn.title = label;
        btn.setAttribute('aria-label', label);
        const icon = btn.querySelector('i');
        if (icon) icon.className = locked ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open';
    });
    INPUTS.forEach(({ input, field }) => input.classList.toggle('input-locked', locks.includes(field)));
}

// ============================================================
// Suggestions et détails du calcul
// ============================================================
function checkOptimizations() {
    el.optiContainer.innerHTML = ''; // Clear old optimisations
    if (!state.useNicotine) return;

    const tr = t();
    let optiHTML = '';

    // Optimisation 1: Mesure du booster complexe (seulement si la cible peut bouger)
    const boosterDec = state.outBooster % 1;
    const targetCanMove = !locks.includes('nicTarget') && !locks.includes('outBooster');
    if (targetCanMove && boosterDec > 0.05 && boosterDec < 0.95 && (Math.abs(boosterDec - 0.5) > 0.05)) {
        let idealBoosterVol = Math.round(state.outBooster * 2) / 2;
        if (idealBoosterVol === 0) idealBoosterVol = 0.5;
        const idealNicTarget = (idealBoosterVol * state.nicBooster) / state.volume;

        optiHTML += `
        <div class="suggestion-box">
            <i class="fa-solid fa-lightbulb text-warning"></i> <strong>${tr.optiMeasureTitle}</strong><br>
            ${tr.optiMeasureText
                .replace('%VAL%', fmt(state.outBooster))
                .replace('%IDEAL%', fmt(idealNicTarget))
                .replace('%CURRENT%', fmt(state.nicTarget))
                .replace('%ROUND%', fmt(idealBoosterVol))}
            <button class="btn btn-sm btn-outline-success w-100 mt-2" type="button" data-apply-booster="${idealBoosterVol}">${tr.optiApply}</button>
        </div>`;
    }

    // Optimisation 2: Ratio Booster/Base inefficace
    if (state.outBooster > (state.volume * 0.5)) {
        optiHTML += `
        <div class="suggestion-box mt-2 border-warning" style="background-color: rgba(255, 193, 7, 0.1);">
            <i class="fa-solid fa-triangle-exclamation text-warning"></i> <strong>${tr.dilutionTitle}</strong><br>
            ${tr.dilutionText.replace('%VAL%', fmt(state.outBooster))}
        </div>`;
    }

    el.optiContainer.innerHTML = optiHTML;
}

function generateFormulas() {
    const tr = t();
    let text = `<strong>${tr.formulaTitle}</strong><br>`;
    if (state.useNicotine) {
        text += tr.formulaBoosterLine
            .replace('%VOL%', fmt(state.volume))
            .replace('%NIC%', fmt(state.nicTarget))
            .replace('%BOOST%', fmt(state.nicBooster))
            .replace('%RESULT%', fmt(state.outBooster)) + '<br>';
        text += tr.formulaBaseReducedLine
            .replace('%VOL%', fmt(state.volume))
            .replace('%BOOST%', fmt(state.outBooster))
            .replace('%REDUCED%', fmt(state.volume - state.outBooster)) + '<br>';
    } else {
        text += tr.formulaBaseSimpleLine.replace('%VOL%', fmt(state.volume)) + '<br>';
    }
    const base = state.volume - state.outBooster;
    text += tr.formulaVgLine
        .replace('%BASE%', fmt(base))
        .replace('%RATIO%', fmt(state.ratioVg, 1))
        .replace('%RESULT%', fmt(state.outVg)) + '<br>';
    text += tr.formulaPgLine
        .replace('%BASE%', fmt(base))
        .replace('%PGRATIO%', fmt(100 - state.ratioVg, 1))
        .replace('%RESULT%', fmt(state.outPg));

    el.formulasDisplay.innerHTML = text;
}

function toggleNicotineSections(visible) {
    const nicSection = document.getElementById('nicotine-section');
    const outBoosterContainer = document.getElementById('out-booster-container');
    if (nicSection) nicSection.style.display = visible ? 'block' : 'none';
    if (outBoosterContainer) outBoosterContainer.style.display = visible ? 'block' : 'none';
}

function showAlert(msg, type = 'success') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.textContent = msg;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'btn-close';
    close.setAttribute('data-bs-dismiss', 'alert');
    close.setAttribute('aria-label', 'Close');
    alert.appendChild(close);
    container.replaceChildren(alert);
    setTimeout(() => { if (alert.isConnected) alert.remove(); }, ALERT_DURATION_MS);
}

// ============================================================
// i18n: Apply language to the DOM
// ============================================================
function setLanguage(lang) {
    currentLang = lang;
    try { localStorage.setItem(STORAGE_LANG, lang); } catch (err) { /* stockage indisponible */ }
    const tr = t();

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update page title and meta description
    document.title = tr.pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', tr.metaDescription);

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(node => {
        const key = node.dataset.i18n;
        if (tr[key] !== undefined) node.textContent = tr[key];
    });

    // Update booster note (contains a nested dynamic span for the ratio)
    const boosterNote = document.getElementById('booster-note');
    if (boosterNote) {
        boosterNote.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${tr.nicBoosterNote.replace('%RATIO%', `<span id="booster-ratio-text">${ratioLabel()}</span>`)}`;
    }

    // Update language toggle button label
    const btnLang = document.getElementById('btn-lang');
    if (btnLang) btnLang.textContent = tr.langButton;

    // Les nombres changent de séparateur décimal (virgule en français)
    const step = parseDecimal(el.inSevrageStep.value);
    if (!Number.isNaN(step)) el.inSevrageStep.value = fmt(step);

    clearFieldError();
    render();
    renderHistory();
}

// ============================================================
// Événements
// ============================================================

// Champs numériques : recalcul en direct, sans réécrire le champ en cours de saisie
INPUTS.forEach(({ input, field, toValue, display }) => {
    input.addEventListener('input', () => {
        const raw = parseDecimal(input.value);
        if (Number.isNaN(raw)) {
            // Saisie vide ou invalide : on n'écrase rien, on attend une valeur correcte
            if (input.value.trim() !== '') showFieldError(input, 'invalidNumber');
            else clearFieldError();
            return;
        }
        applyChange(field, toValue ? toValue(raw) : raw, input);
    });
    // À la sortie du champ : on réaffiche la valeur réellement retenue (formatée)
    input.addEventListener('change', () => {
        clearFieldError();
        input.value = display(state);
    });
});

el.inRatio.addEventListener('input', (e) => applyChange('ratioVg', parseFloat(e.target.value), el.inRatio));

el.inUseNic.addEventListener('change', (e) => {
    const useNicotine = e.target.checked;
    if (!useNicotine && state.nicTarget > 0) lastNicTarget = state.nicTarget;
    const nicTarget = useNicotine && state.nicTarget <= 0 ? lastNicTarget : state.nicTarget;
    const res = solve({ ...state, useNicotine, nicTarget }, 'none', undefined, locks);
    if (!res.ok) {
        e.target.checked = state.useNicotine;
        showFieldError(null, res.error);
        return;
    }
    commitState(res.state, null);
});

// -- Volume stepper buttons --
function stepVolume(delta) {
    applyChange('volume', Math.max(1, Math.round(state.volume) + delta), null);
}
document.getElementById('btn-vol-dec').addEventListener('click', () => stepVolume(-1));
document.getElementById('btn-vol-inc').addEventListener('click', () => stepVolume(1));

// -- Cadenas --
document.querySelectorAll('[data-lock]').forEach(btn => {
    btn.addEventListener('click', () => toggleLock(btn.dataset.lock));
});

// -- Suggestion "Appliquer" : on fixe le volume de booster arrondi --
el.optiContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-apply-booster]');
    if (btn) applyChange('outBooster', parseFloat(btn.dataset.applyBooster), null);
});

// -- Language toggle --
document.getElementById('btn-lang').addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'fr' : 'en');
});

// ============================================================
// Historique
// ============================================================
function saveHistory(isSevrage = false) {
    const history = readJson(STORAGE_HISTORY, []);
    const locale = currentLang === 'fr' ? 'fr-CA' : 'en-CA';
    const record = {
        id: Date.now(),
        date: new Date().toLocaleString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        state: { ...state },
        isSevrage: isSevrage
    };

    writeJson(STORAGE_HISTORY, [record, ...history].slice(0, HISTORY_MAX));
    renderHistory();
    showAlert(isSevrage ? t().alertSevrageSaved : t().alertSaved);
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderHistory() {
    const tr = t();
    const history = readJson(STORAGE_HISTORY, []);
    if (history.length === 0) {
        el.historyList.innerHTML = `<div class="text-center text-muted p-3">${tr.noHistory}</div>`;
        return;
    }

    let html = '';
    history.forEach(h => {
        const s = h.state;
        let title = `${fmt(s.volume)}ml - ${fmt(s.ratioVg, 1)}VG/${fmt(100 - s.ratioVg, 1)}PG`;
        if (s.useNicotine) title += ` - ${fmt(s.nicTarget)}mg`;

        const badge = h.isSevrage ? `<span class="badge bg-danger ms-2">${tr.badgeSevrage}</span>` : '';

        html += `
        <div class="list-group-item history-item d-flex justify-content-between align-items-center" data-history-id="${Number(h.id)}">
            <div>
                <div class="fw-bold">${escapeHtml(title)} ${badge}</div>
                <small class="text-muted"><i class="fa-regular fa-calendar"></i> ${escapeHtml(h.date)}</small>
            </div>
            <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
        `;
    });
    el.historyList.innerHTML = html;
}

function loadHistoryItem(id) {
    const history = readJson(STORAGE_HISTORY, []);
    const item = history.find(h => h.id === id);
    if (!item) return;
    const res = solve({ ...DEFAULT_STATE, ...item.state }, 'none');
    if (!res.ok) return;
    commitState(res.state, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showAlert(t().alertLoaded);
}

el.historyList.addEventListener('click', (e) => {
    const item = e.target.closest('[data-history-id]');
    if (item) loadHistoryItem(Number(item.dataset.historyId));
});

// Sevrage Action
document.getElementById('btn-sevrage').addEventListener('click', () => {
    const reduction = parseDecimal(el.inSevrageStep.value);
    const res = applyReduction(state, reduction, locks);
    if (!res.ok) {
        showFieldError(res.error === 'invalidReduction' ? el.inSevrageStep : null, res.error);
        return;
    }
    if (res.reachedZero) lastNicTarget = DEFAULT_STATE.nicTarget;
    commitState(res.state, null);
    saveHistory(true);
    if (res.reachedZero) showAlert(t().alertZeroNic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

el.inSevrageStep.addEventListener('input', () => {
    if (el.inSevrageStep.classList.contains('is-invalid')) clearFieldError();
});

document.getElementById('btn-save').addEventListener('click', () => saveHistory(false));

// ============================================================
// Démarrage
// ============================================================
function loadInitialState() {
    // Priorité : recette en cours > dernier mélange de l'historique > valeurs par défaut
    const current = readJson(STORAGE_CURRENT, null);
    const history = readJson(STORAGE_HISTORY, []);
    const saved = current && current.state ? current.state : (history[0] && history[0].state);
    if (current && Array.isArray(current.locks)) {
        locks = current.locks.filter(f => FIELDS.includes(f)).slice(0, MAX_LOCKS);
    }
    const res = solve({ ...DEFAULT_STATE, ...(saved || {}) }, 'none');
    state = res.ok ? res.state : solve(DEFAULT_STATE, 'none').state;
    if (state.nicTarget > 0) lastNicTarget = state.nicTarget;
}

function init() {
    // Detect language: localStorage > browser > default 'en'
    let savedLang = null;
    try { savedLang = localStorage.getItem(STORAGE_LANG); } catch (err) { /* stockage indisponible */ }
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    } else if (navigator.language && navigator.language.toLowerCase().startsWith('fr')) {
        currentLang = 'fr';
    } else {
        currentLang = 'en';
    }

    loadInitialState();
    setLanguage(currentLang); // Apply all translations and render everything
}

// Start App
init();
