// Tests de bout en bout dans un vrai navigateur (Playwright).
// Ignorés automatiquement si Playwright n'est pas installé.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

let playwright = null;
try { playwright = require('playwright'); } catch (err) { playwright = null; }

const PAGE_URL = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;

async function openApp(browser, locale) {
    const context = await browser.newContext({ locale });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(PAGE_URL);
    return { context, page, errors };
}

async function typeInto(page, selector, text) {
    await page.fill(selector, '');
    await page.type(selector, text);
}

test('e2e', { skip: !playwright && 'playwright non installé' }, async (t) => {
    const browser = await playwright.chromium.launch();
    t.after(() => browser.close());

    await t.test('fr-CA: décimales avec virgule et sevrage', async () => {
        const { page, errors, context } = await openApp(browser, 'fr-CA');
        await page.check('#in-use-nic');
        await typeInto(page, '#in-nic-target', '6');
        assert.equal(await page.inputValue('#out-booster'), '15');

        await typeInto(page, '#in-sevrage-step', '1,5');
        await page.click('#btn-sevrage');
        assert.equal(await page.inputValue('#in-nic-target'), '4,5');
        assert.equal(await page.inputValue('#out-booster'), '11,25');

        // Le point est aussi accepté
        await typeInto(page, '#in-sevrage-step', '0.5');
        await page.click('#btn-sevrage');
        assert.equal(await page.inputValue('#in-nic-target'), '4');
        assert.deepEqual(errors, []);
        await context.close();
    });

    await t.test('vider la concentration du booster ne détruit pas la cible', async () => {
        const { page, errors, context } = await openApp(browser, 'fr-CA');
        await page.check('#in-use-nic');
        await typeInto(page, '#in-nic-booster', '18');
        assert.equal(await page.inputValue('#in-nic-target'), '3');
        assert.equal(await page.inputValue('#out-booster'), '8,33');
        assert.deepEqual(errors, []);
        await context.close();
    });

    await t.test('booster en ml -> concentration finale; cadenas sur la nicotine -> volume', async () => {
        const { page, errors, context } = await openApp(browser, 'en-US');
        await page.check('#in-use-nic');
        await typeInto(page, '#out-booster', '10');
        assert.equal(await page.inputValue('#in-nic-target'), '4');
        assert.equal(await page.inputValue('#in-volume'), '50');

        await page.click('[data-lock="nicTarget"]');
        assert.equal(await page.getAttribute('[data-lock="nicTarget"]', 'aria-pressed'), 'true');
        await typeInto(page, '#out-booster', '5');
        assert.equal(await page.inputValue('#in-nic-target'), '4');
        assert.equal(await page.inputValue('#in-volume'), '25');
        assert.deepEqual(errors, []);
        await context.close();
    });

    await t.test('une valeur impossible affiche une erreur sans écraser les autres', async () => {
        const { page, errors, context } = await openApp(browser, 'en-US');
        await page.check('#in-use-nic');
        await page.fill('#in-nic-target', '25');
        assert.equal(await page.locator('#calc-error').count(), 1);
        assert.equal(await page.inputValue('#out-booster'), '7.5');
        assert.equal(await page.inputValue('#in-nic-booster'), '20');
        // En quittant le champ, la dernière valeur valide est réaffichée
        await page.locator('#in-nic-target').blur();
        assert.equal(await page.inputValue('#in-nic-target'), '3');
        assert.equal(await page.locator('#calc-error').count(), 0);
        assert.deepEqual(errors, []);
        await context.close();
    });

    await t.test('désactiver la nicotine libère ses cadenas cachés', async () => {
        const { page, errors, context } = await openApp(browser, 'en-US');
        await page.check('#in-use-nic');
        await page.click('[data-lock="nicTarget"]');
        await page.click('[data-lock="outBooster"]');
        await page.uncheck('#in-use-nic');
        await page.click('[data-lock="volume"]');
        assert.equal(await page.getAttribute('[data-lock="volume"]', 'aria-pressed'), 'true');
        assert.equal(await page.getAttribute('[data-lock="nicTarget"]', 'aria-pressed'), 'false');
        assert.deepEqual(errors, []);
        await context.close();
    });

    await t.test('un historique corrompu ne bloque pas le démarrage', async () => {
        const { page, errors, context } = await openApp(browser, 'en-US');
        await page.evaluate(() => localStorage.setItem('vapemix_history', '{"oops":1}'));
        await page.reload();
        assert.equal(await page.inputValue('#out-vg'), '30');
        assert.deepEqual(errors, []);
        await context.close();
    });

    await t.test('la recette en cours et les cadenas sont restaurés au rechargement', async () => {
        const { page, errors, context } = await openApp(browser, 'en-US');
        await typeInto(page, '#in-volume', '120');
        await page.click('[data-lock="outPg"]');
        await page.reload();
        assert.equal(await page.inputValue('#in-volume'), '120');
        assert.equal(await page.getAttribute('[data-lock="outPg"]', 'aria-pressed'), 'true');
        assert.deepEqual(errors, []);
        await context.close();
    });
});
