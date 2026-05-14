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
    el.boosterRatioText.innerText = `${Math.round(state.ratioVg)}/${100 - Math.round(state.ratioVg)}`;
    el.inNicTarget.value = round2(state.nicTarget);
    
    // Afficher/Cacher la carte de sevrage
    const sevrageContainer = document.getElementById('sevrage-container');
    if (sevrageContainer) {
        sevrageContainer.style.display = (state.useNicotine && state.nicTarget > 0) ? 'block' : 'none';
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

    let optiHTML = '';
    
    // Optimisation 1: Mesure du booster complexe
    // Si les décimales ne sont pas faciles à mesurer (ex: 1.33 au lieu de 1.5)
    let boosterDec = state.outBooster % 1;
    if (boosterDec > 0.05 && boosterDec < 0.95 && (Math.abs(boosterDec - 0.5) > 0.05)) {
        // Trouver la cible de nicotine pour un compte rond (arrondi au 0.5 ml près)
        let idealBoosterVol = Math.round(state.outBooster * 2) / 2; 
        if(idealBoosterVol === 0) idealBoosterVol = 0.5; // minimum
        
        let idealNicTarget = (idealBoosterVol * state.nicBooster) / state.volume;
        
        optiHTML += `
        <div class="suggestion-box">
            <i class="fa-solid fa-lightbulb text-warning"></i> <strong>Optimisation de mesure :</strong><br>
            Mesurer ${round2(state.outBooster)} ml est difficile. 
            Si vous visez <strong>${round2(idealNicTarget)} mg/ml</strong> de nicotine à la place de ${round2(state.nicTarget)}, 
            vous utiliserez exactement <strong>${idealBoosterVol} ml</strong> de booster.
            <button class="btn btn-sm btn-outline-success w-100 mt-2" onclick="applyOptimization(${idealNicTarget}, 'nicTarget')">Appliquer</button>
        </div>`;
    }

    // Optimisation 2: Ratio Booster/Base inefficace
    // Si on utilise plus de 50% de la bouteille juste en booster
    if (state.outBooster > (state.volume * 0.5)) {
        optiHTML += `
        <div class="suggestion-box mt-2 border-warning" style="background-color: rgba(255, 193, 7, 0.1);">
            <i class="fa-solid fa-triangle-exclamation text-warning"></i> <strong>Alerte de dilution :</strong><br>
            Vous utilisez beaucoup de booster (${round2(state.outBooster)} ml). Envisagez d'acheter un booster avec une plus forte teneur (ex: sel de nicotine à 20mg/ml) si le vôtre est plus bas, pour laisser plus de place à votre base pur.
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
    let text = `<strong>Détails du calcul:</strong><br>`;
    if(state.useNicotine) {
        text += `Volume Booster = (${round2(state.volume)}ml * ${round2(state.nicTarget)}mg) / ${round2(state.nicBooster)}mg = ${round2(state.outBooster)} ml<br>`;
        text += `Volume Base (à ajouter) = ${round2(state.volume)}ml - ${round2(state.outBooster)}ml = ${round2(state.volume - state.outBooster)} ml<br>`;
    } else {
        text += `Volume Base = ${round2(state.volume)} ml<br>`;
    }
    let base = state.volume - state.outBooster;
    text += `VG à ajouter = ${round2(base)}ml * ${Math.round(state.ratioVg)}% = ${round2(state.outVg)} ml<br>`;
    text += `PG à ajouter = ${round2(base)}ml * ${100 - Math.round(state.ratioVg)}% = ${round2(state.outPg)} ml`;
    
    el.formulasDisplay.innerHTML = text;
}

// Helper mathématique
function round2(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
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

// -- Event Listeners Entrées (Forward) --
el.inVol.addEventListener('input', (e) => { state.volume = parseFloat(e.target.value) || 0; calculateForward(); });
el.inRatio.addEventListener('input', (e) => { state.ratioVg = parseFloat(e.target.value) || 0; calculateForward(); });

// 3-way sync for VG/PG percentages
el.inVgPercent.addEventListener('input', (e) => { 
    let vg = parseFloat(e.target.value) || 0;
    if (vg < 0) vg = 0;
    if (vg > 100) vg = 100;
    state.ratioVg = vg;
    calculateForward();
});

el.inPgPercent.addEventListener('input', (e) => { 
    let pg = parseFloat(e.target.value) || 0;
    if (pg < 0) pg = 0;
    if (pg > 100) pg = 100;
    state.ratioVg = 100 - pg;
    calculateForward();
});

el.inNicBooster.addEventListener('input', (e) => { state.nicBooster = parseFloat(e.target.value) || 1; calculateForward(); });
el.inNicTarget.addEventListener('input', (e) => { state.nicTarget = parseFloat(e.target.value) || 0; calculateForward(); });

el.inUseNic.addEventListener('change', (e) => {
    state.useNicotine = e.target.checked;
    const nicSection = document.getElementById('nicotine-section');
    const outBoosterContainer = document.getElementById('out-booster-container');
    if (nicSection) nicSection.style.display = state.useNicotine ? 'block' : 'none';
    if (outBoosterContainer) outBoosterContainer.style.display = state.useNicotine ? 'block' : 'none';
    calculateForward();
});

// -- Event Listeners Sorties (Reverse) --
// Note: Use 'change' instead of 'input' for outputs to avoid crazy recalculation loops while typing
el.outBooster.addEventListener('change', () => calculateReverse('booster'));
el.outVg.addEventListener('change', () => calculateReverse('vg'));
el.outPg.addEventListener('change', () => calculateReverse('pg'));



function saveHistory(isSevrage = false) {
    let history = JSON.parse(localStorage.getItem('vapemix_history') || '[]');
    
    let record = {
        id: Date.now(),
        date: new Date().toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'}),
        state: JSON.parse(JSON.stringify(state)), // Deep clone state
        isSevrage: isSevrage
    };
    
    history.unshift(record);
    if(history.length > 10) history.pop(); // Keep only last 10
    
    localStorage.setItem('vapemix_history', JSON.stringify(history));
    renderHistory();
    showAlert(isSevrage ? "Mélange de réduction sauvegardé avec succès !" : "Mélange sauvegardé dans l'historique !");
}

function renderHistory() {
    let history = JSON.parse(localStorage.getItem('vapemix_history') || '[]');
    if(history.length === 0) {
        el.historyList.innerHTML = '<div class="text-center text-muted p-3">Aucun historique</div>';
        return;
    }

    let html = '';
    history.forEach(h => {
        let title = `${h.state.volume}ml - ${Math.round(h.state.ratioVg)}VG/${100-Math.round(h.state.ratioVg)}PG`;
        if(h.state.useNicotine) title += ` - ${round2(h.state.nicTarget)}mg`;
        
        let badge = h.isSevrage ? `<span class="badge bg-danger ms-2">Sevrage</span>` : '';

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
        const nicSection = document.getElementById('nicotine-section');
        const outBoosterContainer = document.getElementById('out-booster-container');
        if (nicSection) nicSection.style.display = state.useNicotine ? 'block' : 'none';
        if (outBoosterContainer) outBoosterContainer.style.display = state.useNicotine ? 'block' : 'none';
        
        calculateForward(); // Recalculate to ensure UI syncs perfectly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showAlert("Historique chargé.");
    }
}

// Sevrage Action
document.getElementById('btn-sevrage').addEventListener('click', () => {
    let reduction = parseFloat(document.getElementById('in-sevrage-step').value) || 0;
    if(state.nicTarget - reduction < 0) {
        state.nicTarget = 0;
        state.useNicotine = false;
        showAlert("Félicitation ! Votre taux de nicotine a atteint 0 !");
    } else {
        state.nicTarget -= reduction;
    }
    
    // Sync UI toggles if it hit 0
    el.inUseNic.checked = state.useNicotine;
    const nicSection = document.getElementById('nicotine-section');
    const outBoosterContainer = document.getElementById('out-booster-container');
    if (nicSection) nicSection.style.display = state.useNicotine ? 'block' : 'none';
    if (outBoosterContainer) outBoosterContainer.style.display = state.useNicotine ? 'block' : 'none';

    calculateForward();
    saveHistory(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('btn-save').addEventListener('click', () => saveHistory(false));

function init() {
    // Load last state from history if exists
    let history = JSON.parse(localStorage.getItem('vapemix_history') || '[]');
    if(history.length > 0) {
        state = JSON.parse(JSON.stringify(history[0].state));
        el.inUseNic.checked = state.useNicotine;
        const nicSection = document.getElementById('nicotine-section');
        const outBoosterContainer = document.getElementById('out-booster-container');
        if (nicSection) nicSection.style.display = state.useNicotine ? 'block' : 'none';
        if (outBoosterContainer) outBoosterContainer.style.display = state.useNicotine ? 'block' : 'none';
    }
    
    calculateForward();
    renderHistory();
}

// Start App
init();
