// ============================================================
// i18n: Translations
// ============================================================
const translations = {
    en: {
        pageTitle: 'VapeMix Pro - E-Liquid Calculator',
        metaDescription: 'Free DIY e-liquid calculator. Compute exact VG, PG and nicotine booster volumes for your perfect vape mix recipe.',
        introTitle: 'DIY E-Liquid Calculator',
        introText: 'VapeMix Pro is a free e-liquid calculator for DIY vaping enthusiasts. Enter your desired volume, VG/PG ratio and nicotine level to instantly get the exact quantities needed to create your perfect custom e-liquid recipe.',
        configTitle: 'Main Configuration',
        labelVolume: 'Desired total volume (ml)',
        labelRatio: 'VG / PG Ratio',
        labelVgPct: 'VG %',
        labelPgPct: 'PG %',
        rangeLeft: '0% VG (100% PG)',
        rangeRight: '100% VG (0% PG)',
        nicTitle: 'Nicotine (Optional)',
        nicToggle: 'Add nicotine',
        nicBoosterNote: 'We assume the booster (nicotine liquid) has the same VG/PG ratio (%RATIO%) as your target.',
        labelBoosterConc: 'Booster Concentration',
        labelNicTarget: 'Desired target',
        resultsTitle: 'Results (Recipe)',
        resultsHint: 'You can edit the values below to reverse-calculate the recipe.',
        labelBooster: 'Nicotine Booster',
        labelVg: 'Vegetable Glycerine (VG)',
        labelPg: 'Propylene Glycol (PG)',
        showCalcs: 'Show calculations',
        btnSave: 'Save this mix',
        sevrageTitle: 'Nicotine Reduction Program',
        sevrageDesc: 'Progressively reduce your nicotine dependency. Choose the amount to subtract from your current target for this new mix.',
        labelReduction: 'Reduction',
        btnReduce: 'Reduce',
        historyTitle: 'Mix History',
        noHistory: 'No history yet',
        alertSaved: 'Mix saved to history!',
        alertSevrageSaved: 'Reduction mix saved successfully!',
        alertLoaded: 'History entry loaded.',
        alertZeroNic: 'Congratulations! Your nicotine level has reached 0!',
        badgeSevrage: 'Reduction',
        optiMeasureTitle: 'Measurement Optimization:',
        optiMeasureText: 'Measuring %VAL% ml is difficult. If you target <strong>%IDEAL% mg/ml</strong> of nicotine instead of %CURRENT%, you will use exactly <strong>%ROUND% ml</strong> of booster.',
        optiApply: 'Apply',
        dilutionTitle: 'Dilution Alert:',
        dilutionText: 'You are using a lot of booster (%VAL% ml). Consider buying a higher-concentration booster (e.g. nicotine salt at 20 mg/ml) to leave more room for your pure base.',
        formulaTitle: 'Calculation details:',
        formulaBoosterLine: 'Booster Volume = (%VOL%ml &times; %NIC%mg) / %BOOST%mg = %RESULT% ml',
        formulaBaseReducedLine: 'Base Volume (to add) = %VOL%ml &minus; %BOOST%ml = %REDUCED% ml',
        formulaBaseSimpleLine: 'Base Volume = %VOL% ml',
        formulaVgLine: 'VG to add = %BASE%ml &times; %RATIO%% = %RESULT% ml',
        formulaPgLine: 'PG to add = %BASE%ml &times; %PGRATIO%% = %RESULT% ml',
        langButton: 'FR',
    },
    fr: {
        pageTitle: 'VapeMix Pro - Calculateur e-liquide',
        metaDescription: "Calculateur d'e-liquide DIY gratuit. Calculez les volumes exacts de VG, PG et booster de nicotine pour votre mélange parfait.",
        introTitle: "Calculateur d'e-liquide DIY",
        introText: "VapeMix Pro est un calculateur d'e-liquide gratuit pour les passionnés de DIY. Entrez le volume désiré, le ratio VG/PG et le taux de nicotine pour obtenir instantanément les quantités exactes à mélanger pour créer votre recette d'e-liquide parfaite.",
        configTitle: 'Configuration Principale',
        labelVolume: 'Volume total désiré (ml)',
        labelRatio: 'Ratio VG / PG',
        labelVgPct: 'VG %',
        labelPgPct: 'PG %',
        rangeLeft: '0% VG (100% PG)',
        rangeRight: '100% VG (0% PG)',
        nicTitle: 'Nicotine (Optionnel)',
        nicToggle: 'Ajouter de la nicotine',
        nicBoosterNote: 'Nous assumons que le booster (liquide nicotiné) possède le même ratio VG/PG (%RATIO%) que votre cible.',
        labelBoosterConc: 'Concentration Booster',
        labelNicTarget: 'Cible désirée',
        resultsTitle: 'Résultats (Recette)',
        resultsHint: "Vous pouvez modifier les valeurs ci-dessous pour recalculer la recette à l'envers.",
        labelBooster: 'Booster Nicotiné',
        labelVg: 'Glycérine (VG)',
        labelPg: 'Propylène (PG)',
        showCalcs: 'Voir les calculs',
        btnSave: 'Sauvegarder ce mélange',
        sevrageTitle: 'Programme de Sevrage',
        sevrageDesc: 'Réduisez progressivement votre dépendance à la nicotine. Choisissez la quantité à soustraire de votre cible actuelle pour ce nouveau mélange.',
        labelReduction: 'Réduction',
        btnReduce: 'Réduire',
        historyTitle: 'Historique des mélanges',
        noHistory: 'Aucun historique',
        alertSaved: "Mélange sauvegardé dans l'historique !",
        alertSevrageSaved: 'Mélange de réduction sauvegardé avec succès !',
        alertLoaded: 'Historique chargé.',
        alertZeroNic: 'Félicitations ! Votre taux de nicotine a atteint 0 !',
        badgeSevrage: 'Sevrage',
        optiMeasureTitle: 'Optimisation de mesure :',
        optiMeasureText: 'Mesurer %VAL% ml est difficile. Si vous visez <strong>%IDEAL% mg/ml</strong> de nicotine à la place de %CURRENT%, vous utiliserez exactement <strong>%ROUND% ml</strong> de booster.',
        optiApply: 'Appliquer',
        dilutionTitle: 'Alerte de dilution :',
        dilutionText: 'Vous utilisez beaucoup de booster (%VAL% ml). Envisagez d\'acheter un booster avec une plus forte teneur (ex : sel de nicotine à 20 mg/ml) si le vôtre est plus bas, pour laisser plus de place à votre base pur.',
        formulaTitle: 'Détails du calcul :',
        formulaBoosterLine: 'Volume Booster = (%VOL%ml &times; %NIC%mg) / %BOOST%mg = %RESULT% ml',
        formulaBaseReducedLine: 'Volume Base (à ajouter) = %VOL%ml &minus; %BOOST%ml = %REDUCED% ml',
        formulaBaseSimpleLine: 'Volume Base = %VOL% ml',
        formulaVgLine: 'VG à ajouter = %BASE%ml &times; %RATIO%% = %RESULT% ml',
        formulaPgLine: 'PG à ajouter = %BASE%ml &times; %PGRATIO%% = %RESULT% ml',
        langButton: 'EN',
    }
};

// Current active language
let currentLang = 'en';

// Configuration principale / State de l'application
let state = {
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

// Elements DOM
const el = {
    inVol: document.getElementById('in-volume'),
    inRatio: document.getElementById('in-ratio'),
    inVgPercent: document.getElementById('in-vg-percent'),
    inPgPercent: document.getElementById('in-pg-percent'),
    inUseNic: document.getElementById('in-use-nic'),
    inNicBooster: document.getElementById('in-nic-booster'),
    inNicTarget: document.getElementById('in-nic-target'),
    outBooster: document.getElementById('out-booster'),
    outVg: document.getElementById('out-vg'),
    outPg: document.getElementById('out-pg'),
    boosterRatioText: document.getElementById('booster-ratio-text'),
    formulasDisplay: document.getElementById('formulas-display'),
    optiContainer: document.getElementById('optimization-container'),
    historyList: document.getElementById('history-list'),
    sevrageContainer: document.getElementById('sevrage-container')
};


// Calcul standard: Entrées -> Sorties
function calculateForward() {
    // Validation des valeurs aberrantes
    if(state.volume <= 0) state.volume = 1;
    if(state.nicTarget > state.nicBooster) state.nicTarget = state.nicBooster;

    if (state.useNicotine) {
        // Volume du booster = (Volume total * Taux cible) / Taux du booster
        state.outBooster = (state.volume * state.nicTarget) / state.nicBooster;
    } else {
        state.outBooster = 0;
    }

    // Le volume de base à rajouter (VG pure + PG pure)
    let baseVolume = state.volume - state.outBooster;

    // Puisqu'on assume que le booster a le même ratio, le volume de base doit aussi avoir ce ratio
    let ratioVgDec = state.ratioVg / 100;
    let ratioPgDec = (100 - state.ratioVg) / 100;

    state.outVg = baseVolume * ratioVgDec;
    state.outPg = baseVolume * ratioPgDec;

    updateUIInputs();
    updateUIOutputs();
    generateFormulas();
    checkOptimizations();
}

// Calcul inversé: Sorties modifiées manuellement -> Mise à jour des Entrées
// Cette fonction permet les comportements complexes demandés.
function calculateReverse(source) {
    if (source === 'booster') {
        // L'utilisateur modifie la quantité de booster, on garde le Volume Total, on ajuste la nicotine cible
        let newBoosterVol = parseFloat(el.outBooster.value) || 0;
        if (newBoosterVol > state.volume) newBoosterVol = state.volume;
        
        state.outBooster = newBoosterVol;
        // Nicotine Cible = (Volume Booster * Taux Booster) / Volume Total
        state.nicTarget = (state.outBooster * state.nicBooster) / state.volume;
        
        // Recalcul du reste des volumes
        let baseVolume = state.volume - state.outBooster;
        state.outVg = baseVolume * (state.ratioVg / 100);
        state.outPg = baseVolume * ((100 - state.ratioVg) / 100);

    } else if (source === 'vg' || source === 'pg') {
        // L'utilisateur modifie les quantités pures.
        // "Si je change la quantité de PG, le ratio change et le taux de nicotine est ajusté"
        // Cela implique que le Volume Total change !
        let newVg = parseFloat(el.outVg.value) || 0;
        let newPg = parseFloat(el.outPg.value) || 0;
        
        state.outVg = newVg;
        state.outPg = newPg;
        
        let baseVolume = state.outVg + state.outPg;
        state.volume = baseVolume + state.outBooster; // Le volume total s'ajuste
        
        if (baseVolume > 0) {
            state.ratioVg = (state.outVg / baseVolume) * 100;
        }
        
        // Le taux de nicotine s'ajuste car le volume total a changé
        if (state.useNicotine && state.volume > 0) {
            state.nicTarget = (state.outBooster * state.nicBooster) / state.volume;
        }
    }

    updateUIInputs();
    updateUIOutputs();
    generateFormulas();
    checkOptimizations();
}


function updateUIInputs() {
    el.inVol.value = round2(state.volume);
    el.inRatio.value = Math.round(state.ratioVg);
    el.inVgPercent.value = Math.round(state.ratioVg);
    el.inPgPercent.value = 100 - Math.round(state.ratioVg);
    // Re-query booster-ratio-text in case the booster-note innerHTML was rebuilt by setLanguage
    const boosterRatioEl = document.getElementById('booster-ratio-text');
    if (boosterRatioEl) boosterRatioEl.innerText = `${Math.round(state.ratioVg)}/${100 - Math.round(state.ratioVg)}`;
    el.inNicTarget.value = round2(state.nicTarget);
    
    // Afficher/Cacher la carte de sevrage
    if (el.sevrageContainer) {
        el.sevrageContainer.style.display = (state.useNicotine && state.nicTarget > 0) ? 'block' : 'none';
    }
}

function updateUIOutputs() {
    // Formattage à 2 décimales pour l'affichage
    el.outBooster.value = round2(state.outBooster);
    el.outVg.value = round2(state.outVg);
    el.outPg.value = round2(state.outPg);
}

function checkOptimizations() {
    el.optiContainer.innerHTML = ''; // Clear old optimisations
    if (!state.useNicotine) return;

    const t = translations[currentLang];
    let optiHTML = '';
    
    // Optimisation 1: Mesure du booster complexe
    let boosterDec = state.outBooster % 1;
    if (boosterDec > 0.05 && boosterDec < 0.95 && (Math.abs(boosterDec - 0.5) > 0.05)) {
        let idealBoosterVol = Math.round(state.outBooster * 2) / 2; 
        if(idealBoosterVol === 0) idealBoosterVol = 0.5;
        let idealNicTarget = (idealBoosterVol * state.nicBooster) / state.volume;
        
        optiHTML += `
        <div class="suggestion-box">
            <i class="fa-solid fa-lightbulb text-warning"></i> <strong>${t.optiMeasureTitle}</strong><br>
            ${t.optiMeasureText
                .replace('%VAL%', round2(state.outBooster))
                .replace('%IDEAL%', round2(idealNicTarget))
                .replace('%CURRENT%', round2(state.nicTarget))
                .replace('%ROUND%', idealBoosterVol)}
            <button class="btn btn-sm btn-outline-success w-100 mt-2" onclick="applyOptimization(${idealNicTarget}, 'nicTarget')">${t.optiApply}</button>
        </div>`;
    }

    // Optimisation 2: Ratio Booster/Base inefficace
    if (state.outBooster > (state.volume * 0.5)) {
        optiHTML += `
        <div class="suggestion-box mt-2 border-warning" style="background-color: rgba(255, 193, 7, 0.1);">
            <i class="fa-solid fa-triangle-exclamation text-warning"></i> <strong>${t.dilutionTitle}</strong><br>
            ${t.dilutionText.replace('%VAL%', round2(state.outBooster))}
        </div>`;
    }

    el.optiContainer.innerHTML = optiHTML;
}

// Fonction globale pour le bouton d'optimisation généré
window.applyOptimization = function(val, type) {
    if(type === 'nicTarget') {
        state.nicTarget = val;
        calculateForward();
    }
};


function generateFormulas() {
    const t = translations[currentLang];
    let text = `<strong>${t.formulaTitle}</strong><br>`;
    if(state.useNicotine) {
        text += t.formulaBoosterLine
            .replace('%VOL%', round2(state.volume))
            .replace('%NIC%', round2(state.nicTarget))
            .replace('%BOOST%', round2(state.nicBooster))
            .replace('%RESULT%', round2(state.outBooster)) + '<br>';
        text += t.formulaBaseReducedLine
            .replace('%VOL%', round2(state.volume))
            .replace('%BOOST%', round2(state.outBooster))
            .replace('%REDUCED%', round2(state.volume - state.outBooster)) + '<br>';
    } else {
        text += t.formulaBaseSimpleLine.replace('%VOL%', round2(state.volume)) + '<br>';
    }
    let base = state.volume - state.outBooster;
    text += t.formulaVgLine
        .replace('%BASE%', round2(base))
        .replace('%RATIO%', Math.round(state.ratioVg))
        .replace('%RESULT%', round2(state.outVg)) + '<br>';
    text += t.formulaPgLine
        .replace('%BASE%', round2(base))
        .replace('%PGRATIO%', 100 - Math.round(state.ratioVg))
        .replace('%RESULT%', round2(state.outPg));
    
    el.formulasDisplay.innerHTML = text;
}

// Helper functions
function round2(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function toggleNicotineSections(visible) {
    const nicSection = document.getElementById('nicotine-section');
    const outBoosterContainer = document.getElementById('out-booster-container');
    if (nicSection) nicSection.style.display = visible ? 'block' : 'none';
    if (outBoosterContainer) outBoosterContainer.style.display = visible ? 'block' : 'none';
}

function showAlert(msg, type="success") {
    const alertHtml = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    document.getElementById('alertContainer').innerHTML = alertHtml;
    setTimeout(() => { document.getElementById('alertContainer').innerHTML = ''; }, 4000);
}

// ============================================================
// i18n: Apply language to the DOM
// ============================================================
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('vapemix_lang', lang);
    const t = translations[lang];

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update page title and meta description
    document.title = t.pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t.metaDescription);

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(node => {
        const key = node.dataset.i18n;
        if (t[key] !== undefined) node.textContent = t[key];
    });

    // Update booster note (contains a nested dynamic span for the ratio)
    const boosterNote = document.getElementById('booster-note');
    if (boosterNote) {
        const ratio = `${Math.round(state.ratioVg)}/${100 - Math.round(state.ratioVg)}`;
        boosterNote.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${t.nicBoosterNote.replace('%RATIO%', `<span id="booster-ratio-text">${ratio}</span>`)}`;
    }

    // Update language toggle button label
    const btnLang = document.getElementById('btn-lang');
    if (btnLang) btnLang.textContent = t.langButton;

    // Refresh dynamic JS-generated content
    renderHistory();
    generateFormulas();
    checkOptimizations();
}

// -- Event Listeners Entrées (Forward) --
el.inVol.addEventListener('input', (e) => { state.volume = parseFloat(e.target.value) || 0; calculateForward(); });
el.inRatio.addEventListener('input', (e) => { state.ratioVg = parseFloat(e.target.value) || 0; calculateForward(); });

// 3-way sync for VG/PG percentages
el.inVgPercent.addEventListener('input', (e) => { 
    let vg = parseFloat(e.target.value) || 0;
    vg = clamp(vg, 0, 100);
    state.ratioVg = vg;
    calculateForward();
});

el.inPgPercent.addEventListener('input', (e) => { 
    let pg = parseFloat(e.target.value) || 0;
    pg = clamp(pg, 0, 100);
    state.ratioVg = 100 - pg;
    calculateForward();
});

el.inNicBooster.addEventListener('input', (e) => { state.nicBooster = parseFloat(e.target.value) || 1; calculateForward(); });
el.inNicTarget.addEventListener('input', (e) => { state.nicTarget = parseFloat(e.target.value) || 0; calculateForward(); });

el.inUseNic.addEventListener('change', (e) => {
    state.useNicotine = e.target.checked;
    toggleNicotineSections(state.useNicotine);
    calculateForward();
});

// -- Volume stepper buttons --
document.getElementById('btn-vol-dec').addEventListener('click', () => {
    let v = Math.max(1, (parseFloat(el.inVol.value) || 1) - 1);
    el.inVol.value = v;
    state.volume = v;
    calculateForward();
});

document.getElementById('btn-vol-inc').addEventListener('click', () => {
    let v = (parseFloat(el.inVol.value) || 0) + 1;
    el.inVol.value = v;
    state.volume = v;
    calculateForward();
});

// -- Language toggle --
document.getElementById('btn-lang').addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'fr' : 'en');
});

// -- Event Listeners Sorties (Reverse) --
// Note: Use 'change' instead of 'input' for outputs to avoid crazy recalculation loops while typing
el.outBooster.addEventListener('change', () => calculateReverse('booster'));
el.outVg.addEventListener('change', () => calculateReverse('vg'));
el.outPg.addEventListener('change', () => calculateReverse('pg'));



function saveHistory(isSevrage = false) {
    const t = translations[currentLang];
    let history = JSON.parse(localStorage.getItem('vapemix_history') || '[]');
    
    const locale = currentLang === 'fr' ? 'fr-FR' : 'en-CA';
    let record = {
        id: Date.now(),
        date: new Date().toLocaleString(locale, {day: '2-digit', month: '2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'}),
        state: JSON.parse(JSON.stringify(state)), // Deep clone state
        isSevrage: isSevrage
    };
    
    history.unshift(record);
    if(history.length > 10) history.pop(); // Keep only last 10
    
    localStorage.setItem('vapemix_history', JSON.stringify(history));
    renderHistory();
    showAlert(isSevrage ? t.alertSevrageSaved : t.alertSaved);
}

function renderHistory() {
    const t = translations[currentLang];
    let history = JSON.parse(localStorage.getItem('vapemix_history') || '[]');
    if(history.length === 0) {
        el.historyList.innerHTML = `<div class="text-center text-muted p-3">${t.noHistory}</div>`;
        return;
    }

    let html = '';
    history.forEach(h => {
        let title = `${h.state.volume}ml - ${Math.round(h.state.ratioVg)}VG/${100-Math.round(h.state.ratioVg)}PG`;
        if(h.state.useNicotine) title += ` - ${round2(h.state.nicTarget)}mg`;
        
        let badge = h.isSevrage ? `<span class="badge bg-danger ms-2">${t.badgeSevrage}</span>` : '';

        html += `
        <div class="list-group-item history-item d-flex justify-content-between align-items-center" onclick="loadHistoryItem(${h.id})">
            <div>
                <div class="fw-bold">${title} ${badge}</div>
                <small class="text-muted"><i class="fa-regular fa-calendar"></i> ${h.date}</small>
            </div>
            <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
        `;
    });
    el.historyList.innerHTML = html;
}

window.loadHistoryItem = function(id) {
    let history = JSON.parse(localStorage.getItem('vapemix_history') || '[]');
    let item = history.find(h => h.id === id);
    if(item) {
        state = JSON.parse(JSON.stringify(item.state));
        
        // Re-sync UI manually for checkboxes
        el.inUseNic.checked = state.useNicotine;
        toggleNicotineSections(state.useNicotine);
        
        calculateForward(); // Recalculate to ensure UI syncs perfectly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showAlert(translations[currentLang].alertLoaded);
    }
}

// Sevrage Action
document.getElementById('btn-sevrage').addEventListener('click', () => {
    const t = translations[currentLang];
    let reduction = parseFloat(document.getElementById('in-sevrage-step').value) || 0;
    if(state.nicTarget - reduction < 0) {
        state.nicTarget = 0;
        state.useNicotine = false;
        showAlert(t.alertZeroNic);
    } else {
        state.nicTarget -= reduction;
    }
    
    // Sync UI toggles if it hit 0
    el.inUseNic.checked = state.useNicotine;
    toggleNicotineSections(state.useNicotine);

    calculateForward();
    saveHistory(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('btn-save').addEventListener('click', () => saveHistory(false));

function init() {
    // Detect language: localStorage > browser > default 'en'
    const savedLang = localStorage.getItem('vapemix_lang');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    } else if (navigator.language && navigator.language.toLowerCase().startsWith('fr')) {
        currentLang = 'fr';
    } else {
        currentLang = 'en';
    }

    // Load last state from history if exists
    let history = JSON.parse(localStorage.getItem('vapemix_history') || '[]');
    if(history.length > 0) {
        state = JSON.parse(JSON.stringify(history[0].state));
        el.inUseNic.checked = state.useNicotine;
        toggleNicotineSections(state.useNicotine);
    }
    
    calculateForward();       // Calculate state and populate output values
    setLanguage(currentLang); // Apply all translations (also refreshes formulas/history/optimizations)
}

// Start App
init();
