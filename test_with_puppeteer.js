const puppeteer = require('puppeteer');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log('=== VapeMix Pro - Browser Tests ===\n');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport for mobile testing
    await page.setViewport({ width: 375, height: 667 });
    
    console.log('Navigating to application...');
    await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle0' });
    
    console.log('✓ Page loaded successfully\n');
    
    // Test 1: Check page title
    const title = await page.title();
    console.log('Page title:', title);
    console.log('  Expected: "VapeMix Pro - Calculateur e-liquide"');
    console.log('  Match:', title === 'VapeMix Pro - Calculateur e-liquide' ? '✓' : '✗');
    
    // Test 2: Check if main elements exist
    console.log('\n=== Testing DOM Elements ===');
    
    const volumeInput = await page.$('#in-volume');
    console.log('Volume input:', volumeInput ? '✓ Found' : '✗ Not found');
    
    const ratioSlider = await page.$('#in-ratio');
    console.log('Ratio slider:', ratioSlider ? '✓ Found' : '✗ Not found');
    
    const nicotineCheckbox = await page.$('#in-use-nic');
    console.log('Nicotine checkbox:', nicotineCheckbox ? '✓ Found' : '✗ Not found');
    
    const vgOutput = await page.$('#out-vg');
    console.log('VG output:', vgOutput ? '✓ Found' : '✗ Not found');
    
    const pgOutput = await page.$('#out-pg');
    console.log('PG output:', pgOutput ? '✓ Found' : '✗ Not found');
    
    const saveButton = await page.$('#btn-save');
    console.log('Save button:', saveButton ? '✓ Found' : '✗ Not found');
    
    // Test 3: Check initial values
    console.log('\n=== Testing Initial Values ===');
    
    const volumeValue = await page.$eval('#in-volume', el => el.value);
    console.log('Initial volume:', volumeValue, '(expected: 50)');
    
    const ratioValue = await page.$eval('#in-ratio', el => el.value);
    console.log('Initial ratio:', ratioValue, '(expected: 60)');
    
    const vgValue = await page.$eval('#out-vg', el => el.value);
    console.log('Initial VG:', vgValue, 'ml');
    
    const pgValue = await page.$eval('#out-pg', el => el.value);
    console.log('Initial PG:', pgValue, 'ml');
    
    // Test 4: Test calculation
    console.log('\n=== Testing Calculations ===');
    
    // Change volume to 100ml
    await page.$eval('#in-volume', el => el.value = '100');
    await page.$eval('#in-volume', el => el.dispatchEvent(new Event('input', { bubbles: true })));
    
    await sleep(100);
    
    const newVgValue = await page.$eval('#out-vg', el => el.value);
    const newPgValue = await page.$eval('#out-pg', el => el.value);
    console.log('After changing volume to 100ml:');
    console.log('  VG:', newVgValue, 'ml (expected: 60)');
    console.log('  PG:', newPgValue, 'ml (expected: 40)');
    console.log('  Calculation:', parseFloat(newVgValue) === 60 && parseFloat(newPgValue) === 40 ? '✓ Correct' : '✗ Incorrect');
    
    // Test 5: Test nicotine functionality
    console.log('\n=== Testing Nicotine Module ===');
    
    await page.click('#in-use-nic');
    await sleep(100);
    
    const nicSectionVisible = await page.$eval('#nicotine-section', el => el.style.display !== 'none');
    console.log('Nicotine section visible:', nicSectionVisible ? '✓ Yes' : '✗ No');
    
    const boosterVisible = await page.$eval('#out-booster-container', el => el.style.display !== 'none');
    console.log('Booster output visible:', boosterVisible ? '✓ Yes' : '✗ No');
    
    if (boosterVisible) {
        const boosterValue = await page.$eval('#out-booster', el => el.value);
        console.log('Booster volume:', boosterValue, 'ml');
    }
    
    // Test 6: Test history functionality
    console.log('\n=== Testing History Module ===');
    
    await page.click('#btn-save');
    await sleep(500);
    
    const historyItems = await page.$$('.history-item');
    console.log('History items after save:', historyItems.length, '(expected: 1)');
    console.log('History save:', historyItems.length === 1 ? '✓ Working' : '✗ Not working');
    
    // Test 7: Check responsive design
    console.log('\n=== Testing Responsive Design ===');
    
    const cards = await page.$$('.card');
    console.log('Number of cards:', cards.length);
    
    const hasBootstrap = await page.evaluate(() => {
        return typeof bootstrap !== 'undefined' || document.querySelector('link[href*="bootstrap"]') !== null;
    });
    console.log('Bootstrap loaded:', hasBootstrap ? '✓ Yes' : '✗ No');
    
    // Take screenshot
    console.log('\n=== Taking Screenshot ===');
    await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
    console.log('✓ Screenshot saved as test-screenshot.png');
    
    await browser.close();
    
    console.log('\n=== All browser tests completed ===');
})();
