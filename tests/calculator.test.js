const test = require('node:test');
const assert = require('node:assert/strict');
const { parseDecimal, formatDecimal, solve, applyReduction } = require('../calculator.js');

const BASE = {
    volume: 50, ratioVg: 60, useNicotine: true, nicBooster: 20, nicTarget: 3,
    outBooster: 7.5, outVg: 25.5, outPg: 17
};

function near(actual, expected, msg) {
    assert.ok(Math.abs(actual - expected) < 1e-6, `${msg || ''} expected ${expected}, got ${actual}`);
}

test('parseDecimal accepte la virgule et le point', () => {
    assert.equal(parseDecimal('1,5'), 1.5);
    assert.equal(parseDecimal('1.5'), 1.5);
    assert.equal(parseDecimal(' 0,25 '), 0.25);
    assert.equal(parseDecimal(',5'), 0.5);
    assert.equal(parseDecimal('3'), 3);
});

test('parseDecimal rejette les saisies invalides ou vides', () => {
    assert.ok(Number.isNaN(parseDecimal('')));
    assert.ok(Number.isNaN(parseDecimal('abc')));
    assert.ok(Number.isNaN(parseDecimal('1,2,3')));
    assert.ok(Number.isNaN(parseDecimal('-')));
});

test('formatDecimal utilise la virgule en français', () => {
    assert.equal(formatDecimal(1.5, 'fr'), '1,5');
    assert.equal(formatDecimal(1.5, 'en'), '1.5');
    assert.equal(formatDecimal(2.345678, 'fr'), '2,35');
    assert.equal(formatDecimal(-0.0001, 'en'), '0');
});

test('calcul standard: volume, ratio et nicotine -> recette', () => {
    const res = solve(BASE, 'none');
    assert.ok(res.ok);
    near(res.state.outBooster, 7.5);
    near(res.state.outVg, 25.5);
    near(res.state.outPg, 17);
});

test('solve ne modifie pas l\'état d\'origine', () => {
    const copy = { ...BASE };
    solve(BASE, 'volume', 100);
    assert.deepEqual(BASE, copy);
});

test('modifier le booster (ml) garde le volume et donne la concentration finale', () => {
    const res = solve(BASE, 'outBooster', 10);
    assert.ok(res.ok);
    near(res.state.volume, 50);
    near(res.state.nicTarget, 4); // 10 ml × 20 mg / 50 ml
    near(res.state.outVg + res.state.outPg, 40);
    near(res.state.ratioVg, 60);
});

test('booster (ml) avec nicotine verrouillée: le volume total change', () => {
    const res = solve(BASE, 'outBooster', 10, ['nicTarget']);
    assert.ok(res.ok);
    near(res.state.nicTarget, 3);
    near(res.state.volume, 10 * 20 / 3);
});

test('modifier la concentration du booster garde la cible', () => {
    const res = solve(BASE, 'nicBooster', 18);
    assert.ok(res.ok);
    near(res.state.nicTarget, 3);
    near(res.state.outBooster, 50 * 3 / 18);
});

test('concentration du booster avec booster (ml) verrouillé: la cible change', () => {
    const res = solve(BASE, 'nicBooster', 10, ['outBooster']);
    assert.ok(res.ok);
    near(res.state.outBooster, 7.5);
    near(res.state.nicTarget, 1.5);
});

test('une cible plus haute que le booster est refusée sans rien écraser', () => {
    const res = solve(BASE, 'nicTarget', 25);
    assert.equal(res.ok, false);
    assert.equal(res.error, 'targetTooHigh');
});

test('modifier le volume avec booster (ml) verrouillé recalcule la nicotine', () => {
    const res = solve(BASE, 'volume', 100, ['outBooster']);
    assert.ok(res.ok);
    near(res.state.outBooster, 7.5);
    near(res.state.nicTarget, 1.5);
});

test('modifier la VG (ml) par défaut garde volume et nicotine, ajuste PG et ratio', () => {
    const res = solve(BASE, 'outVg', 30);
    assert.ok(res.ok);
    near(res.state.volume, 50);
    near(res.state.nicTarget, 3);
    near(res.state.outPg, 12.5);
    near(res.state.ratioVg, 30 / 42.5 * 100);
});

test('VG (ml) avec ratio verrouillé: calcule le volume total possible', () => {
    const res = solve(BASE, 'outVg', 51, ['ratioVg']);
    assert.ok(res.ok);
    near(res.state.ratioVg, 60);
    near(res.state.nicTarget, 3);
    near(res.state.volume, 100);
    near(res.state.outPg, 34);
    near(res.state.outBooster, 15);
});

test('VG (ml) trop grande pour le volume verrouillé est refusée', () => {
    const res = solve(BASE, 'outVg', 45, ['volume']);
    assert.equal(res.ok, false);
});

test('ratio avec VG (ml) verrouillée: le volume s\'ajuste, la nicotine reste', () => {
    const res = solve(BASE, 'ratioVg', 50, ['outVg']);
    assert.ok(res.ok);
    near(res.state.outVg, 25.5);
    near(res.state.outPg, 25.5);
    near(res.state.nicTarget, 3);
});

test('trop de cadenas incompatibles: conflit signalé', () => {
    const res = solve(BASE, 'outBooster', 10, ['volume', 'nicTarget']);
    assert.equal(res.ok, false);
    assert.equal(res.error, 'lockConflict');
});

test('sans nicotine, modifier la PG ajuste le ratio', () => {
    const noNic = { ...BASE, useNicotine: false };
    const res = solve(noNic, 'outPg', 10);
    assert.ok(res.ok);
    near(res.state.outBooster, 0);
    near(res.state.volume, 50);
    near(res.state.outVg, 40);
    near(res.state.ratioVg, 80);
});

test('sans nicotine, PG avec ratio verrouillé: le volume change', () => {
    const noNic = { ...BASE, useNicotine: false };
    const res = solve(noNic, 'outPg', 40, ['ratioVg']);
    assert.ok(res.ok);
    near(res.state.volume, 100);
    near(res.state.outVg, 60);
});

test('sevrage: réduction décimale', () => {
    const res = applyReduction(BASE, 1.5);
    assert.ok(res.ok);
    assert.equal(res.reachedZero, false);
    near(res.state.nicTarget, 1.5);
    near(res.state.outBooster, 3.75);
});

test('sevrage: atteindre exactement 0 désactive la nicotine', () => {
    const res = applyReduction(BASE, 3);
    assert.ok(res.ok);
    assert.equal(res.reachedZero, true);
    assert.equal(res.state.useNicotine, false);
    near(res.state.outBooster, 0);
    near(res.state.outVg + res.state.outPg, 50);
});

test('sevrage: réduction invalide refusée', () => {
    assert.equal(applyReduction(BASE, NaN).ok, false);
    assert.equal(applyReduction(BASE, 0).ok, false);
});

test('sevrage: une réduction trop petite pour changer la cible est refusée', () => {
    assert.equal(applyReduction(BASE, 0.001).ok, false);
});

test('sevrage jusqu\'à 0 respecte un cadenas sur la VG (ml)', () => {
    const res = applyReduction(BASE, 3, ['outVg']);
    assert.ok(res.ok);
    near(res.state.outVg, 25.5);
    near(res.state.volume, 50);
    near(res.state.outPg, 24.5);
});

test('activer la nicotine avec la VG (ml) verrouillée garde la VG', () => {
    const noNic = solve({ ...BASE, useNicotine: false }, 'none').state;
    const res = solve({ ...noNic, useNicotine: true }, 'nicTarget', 3, ['outVg']);
    assert.ok(res.ok);
    near(res.state.outVg, noNic.outVg);
    near(res.state.nicTarget, 3);
    near(res.state.volume, 50);
});
