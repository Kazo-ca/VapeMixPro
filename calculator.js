// ============================================================
// Moteur de calcul VapeMix Pro (pur, sans DOM — testable sous Node)
// ============================================================
//
// Variables du mélange :
//   volume     V  : volume total (ml)
//   ratioVg    r  : % de VG dans le mélange final (le booster est supposé avoir le même ratio)
//   nicTarget  N  : taux de nicotine final (mg/ml)
//   outBooster b  : volume de booster (ml)
//   outVg      vg : volume de VG pure à ajouter (ml)
//   outPg      pg : volume de PG pure à ajouter (ml)
//   nicBooster B  : concentration du booster (mg/ml) — toujours une donnée connue
//
// Relations :  b = V × N / B      base = V − b      vg = base × r      pg = base × (1 − r)
//
// Il reste donc 3 degrés de liberté (en plus de B). Quand l'utilisateur modifie un champ,
// on le fixe, on fixe les champs verrouillés (cadenas), puis on complète avec des valeurs
// conservées par défaut jusqu'à avoir 3 valeurs connues, et on résout tout le reste.

(function (root) {
    'use strict';

    const FIELDS = ['volume', 'ratioVg', 'nicTarget', 'outBooster', 'outVg', 'outPg'];
    const REQUIRED_KNOWNS = 3;
    const EPS = 1e-9;
    const MAX_PASSES = 10;

    // Combinaisons redondantes (une des valeurs se déduit des deux autres)
    const DEPENDENT_SETS = [
        ['volume', 'nicTarget', 'outBooster'],
        ['ratioVg', 'outVg', 'outPg']
    ];

    // Valeurs conservées par défaut (dans l'ordre) quand on modifie un champ et que
    // les cadenas ne suffisent pas à déterminer le calcul.
    const KEEP_PRIORITY = {
        volume:     ['nicTarget', 'ratioVg', 'outBooster', 'outVg', 'outPg'],
        ratioVg:    ['nicTarget', 'volume', 'outBooster', 'outVg', 'outPg'],
        nicTarget:  ['volume', 'ratioVg', 'outBooster', 'outVg', 'outPg'],
        outBooster: ['volume', 'ratioVg', 'nicTarget', 'outVg', 'outPg'],
        outVg:      ['nicTarget', 'volume', 'ratioVg', 'outBooster', 'outPg'],
        outPg:      ['nicTarget', 'volume', 'ratioVg', 'outBooster', 'outVg'],
        nicBooster: ['volume', 'ratioVg', 'nicTarget', 'outBooster', 'outVg', 'outPg'],
        none:       ['volume', 'ratioVg', 'nicTarget', 'outBooster', 'outVg', 'outPg']
    };

    /**
     * Convertit une saisie utilisateur en nombre. Accepte la virgule (fr-CA « 1,5 »)
     * comme le point (en-US « 1.5 »). Retourne NaN si la saisie est invalide ou incomplète.
     * @param {string|number} raw
     * @returns {number}
     */
    function parseDecimal(raw) {
        if (typeof raw === 'number') return raw;
        const text = String(raw == null ? '' : raw).replace(/\s/g, '').replace(',', '.');
        if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(text)) return NaN;
        return Number(text);
    }

    /**
     * Formate un nombre pour l'affichage selon la langue (virgule en français).
     * @param {number} num
     * @param {string} lang 'fr' | 'en'
     * @param {number} [maxDecimals=2]
     * @returns {string}
     */
    function formatDecimal(num, lang, maxDecimals) {
        const decimals = maxDecimals === undefined ? 2 : maxDecimals;
        const factor = Math.pow(10, decimals);
        let rounded = Math.round((num + Number.EPSILON) * factor) / factor;
        if (Object.is(rounded, -0)) rounded = 0;
        const text = String(rounded);
        return lang === 'fr' ? text.replace('.', ',') : text;
    }

    function round2(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    function isDependent(keys) {
        return DEPENDENT_SETS.some(set => set.every(k => keys.includes(k)));
    }

    /**
     * Choisit les 3 valeurs à conserver pour une modification donnée :
     * le champ modifié, puis les cadenas, puis les valeurs par défaut.
     * @param {string} edited
     * @param {string[]} locks
     * @param {boolean} useNicotine
     * @returns {{ keys: string[] } | { error: string }}
     */
    function chooseKnowns(edited, locks, useNicotine) {
        // Sans nicotine, le taux (0) est imposé : il compte comme une valeur connue
        const keys = useNicotine ? [] : ['nicTarget'];
        const allowed = useNicotine ? FIELDS : FIELDS.filter(f => f !== 'outBooster');

        if (FIELDS.includes(edited)) {
            if (!allowed.includes(edited) || keys.includes(edited)) return { error: 'notEditable' };
            keys.push(edited);
        }

        for (const lock of locks) {
            if (keys.includes(lock) || !allowed.includes(lock)) continue;
            const candidate = keys.concat(lock);
            if (candidate.length > REQUIRED_KNOWNS || isDependent(candidate)) return { error: 'lockConflict' };
            keys.push(lock);
        }

        for (const key of KEEP_PRIORITY[edited] || FIELDS) {
            if (keys.length >= REQUIRED_KNOWNS) break;
            if (keys.includes(key) || !allowed.includes(key)) continue;
            if (!isDependent(keys.concat(key))) keys.push(key);
        }

        return keys.length === REQUIRED_KNOWNS ? { keys } : { error: 'lockConflict' };
    }

    /**
     * Résout toutes les variables à partir des valeurs connues, par propagation des relations.
     * Valeurs internes : ratio en fraction (0..1), base = V − b.
     */
    function propagate(known, nicBooster) {
        const v = Object.assign({}, known);
        const has = k => v[k] !== undefined;
        const B = nicBooster;

        for (let pass = 0; pass < MAX_PASSES; pass++) {
            // Relation nicotine : b = V × N / B
            if (has('nicTarget') && v.nicTarget < EPS && !has('outBooster')) v.outBooster = 0;
            if (has('volume') && has('nicTarget') && !has('outBooster')) v.outBooster = v.volume * v.nicTarget / B;
            if (has('volume') && has('outBooster') && !has('nicTarget')) v.nicTarget = v.outBooster * B / v.volume;
            if (has('nicTarget') && has('outBooster') && !has('volume') && v.nicTarget > EPS) v.volume = v.outBooster * B / v.nicTarget;

            // Relation volumes : V = b + base
            if (has('volume') && has('outBooster') && !has('base')) v.base = v.volume - v.outBooster;
            if (has('base') && has('outBooster') && !has('volume')) v.volume = v.base + v.outBooster;
            if (has('base') && has('volume') && !has('outBooster')) v.outBooster = v.volume - v.base;
            // base = V × (1 − N/B)  →  V = base / (1 − N/B)
            if (has('base') && has('nicTarget') && !has('volume') && !has('outBooster') && v.nicTarget < B) {
                v.volume = v.base / (1 - v.nicTarget / B);
            }

            // Relation ratio : vg = base × r, pg = base × (1 − r)
            if (has('outVg') && has('outPg') && !has('base')) v.base = v.outVg + v.outPg;
            if (has('base') && has('outVg') && !has('ratio') && v.base > EPS) v.ratio = v.outVg / v.base;
            if (has('base') && has('outPg') && !has('ratio') && v.base > EPS) v.ratio = 1 - v.outPg / v.base;
            if (has('ratio') && has('outVg') && !has('base') && v.ratio > EPS) v.base = v.outVg / v.ratio;
            if (has('ratio') && has('outPg') && !has('base') && v.ratio < 1 - EPS) v.base = v.outPg / (1 - v.ratio);
            if (has('base') && has('ratio')) {
                if (!has('outVg')) v.outVg = v.base * v.ratio;
                if (!has('outPg')) v.outPg = v.base * (1 - v.ratio);
            }
        }
        return v;
    }

    function validate(r, nicBooster) {
        if (FIELDS.some(f => r[f] === undefined || !Number.isFinite(r[f]))) return 'unsolvable';
        if (!(r.volume > EPS)) return 'invalidVolume';
        if (r.ratioVg < -EPS || r.ratioVg > 100 + EPS) return 'invalidRatio';
        if (r.nicTarget > nicBooster + EPS) return 'targetTooHigh';
        if ([r.nicTarget, r.outBooster, r.outVg, r.outPg].some(x => x < -EPS)) return 'negative';
        if (Math.abs(r.outBooster + r.outVg + r.outPg - r.volume) > 1e-6) return 'unsolvable';
        return null;
    }

    // Supprime les résidus d'arrondi flottant (-0,0000001, 100,0000001…)
    function clean(r) {
        const out = {};
        FIELDS.forEach(f => { out[f] = Math.abs(r[f]) < EPS ? 0 : r[f]; });
        out.ratioVg = Math.min(100, Math.max(0, out.ratioVg));
        return out;
    }

    /**
     * Recalcule le mélange après la modification d'un champ. Ne modifie pas `state`.
     *
     * @param {object} state  { volume, ratioVg, useNicotine, nicBooster, nicTarget, outBooster, outVg, outPg }
     * @param {string} edited champ modifié (un de FIELDS, 'nicBooster', ou 'none' pour un recalcul
     *                        qui garde les cadenas puis le volume, le ratio et la nicotine)
     * @param {number} [value] nouvelle valeur du champ modifié
     * @param {string[]} [locks] champs verrouillés (cadenas)
     * @returns {{ ok: true, state: object } | { ok: false, error: string }}
     */
    function solve(state, edited, value, locks) {
        const next = Object.assign({}, state);
        if (edited === 'nicBooster' || FIELDS.includes(edited)) next[edited] = value;

        if (!(next.nicBooster > 0)) return { ok: false, error: 'invalidBooster' };
        if (!next.useNicotine) {
            next.nicTarget = 0;
            next.outBooster = 0;
        }

        const choice = chooseKnowns(edited, locks || [], next.useNicotine);
        if (choice.error) return { ok: false, error: choice.error };

        const known = {};
        choice.keys.forEach(k => {
            if (k === 'ratioVg') known.ratio = next.ratioVg / 100;
            else known[k] = next[k];
        });

        const v = propagate(known, next.nicBooster);
        const result = {
            volume: v.volume,
            ratioVg: v.ratio === undefined ? undefined : v.ratio * 100,
            nicTarget: v.nicTarget,
            outBooster: v.outBooster,
            outVg: v.outVg,
            outPg: v.outPg
        };

        const error = validate(result, next.nicBooster);
        if (error) return { ok: false, error };

        return { ok: true, state: Object.assign(next, clean(result)) };
    }

    /**
     * Applique une réduction de nicotine (sevrage). Ne modifie pas `state`.
     * @returns {{ ok: true, state: object, reachedZero: boolean } | { ok: false, error: string }}
     */
    function applyReduction(state, reduction, locks) {
        if (!(reduction > 0)) return { ok: false, error: 'invalidReduction' };
        const newTarget = round2(state.nicTarget - reduction);
        if (newTarget >= state.nicTarget) return { ok: false, error: 'invalidReduction' };
        if (newTarget <= 0) {
            const res = solve(Object.assign({}, state, { useNicotine: false }), 'none', undefined, locks);
            return res.ok ? Object.assign(res, { reachedZero: true }) : res;
        }
        const res = solve(state, 'nicTarget', newTarget, locks);
        return res.ok ? Object.assign(res, { reachedZero: false }) : res;
    }

    const api = { FIELDS, parseDecimal, formatDecimal, round2, solve, chooseKnowns, applyReduction };

    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.VapeCalc = api;
})(typeof window !== 'undefined' ? window : this);
