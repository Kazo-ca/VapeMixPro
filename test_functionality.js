const http = require('http');

// Test 1: Check if files are accessible
function testFileAccess(path) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:8080${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, data, length: data.length });
            });
        }).on('error', reject);
    });
}

async function runTests() {
    console.log('=== VapeMix Pro - Functional Tests ===\n');
    
    // Test HTML
    try {
        const html = await testFileAccess('/index.html');
        console.log('✓ index.html loaded:', html.status === 200 ? 'OK' : 'FAIL');
        console.log('  - Size:', html.length, 'bytes');
        console.log('  - Has CSS link:', html.data.includes('href="style.css"') ? 'YES' : 'NO');
        console.log('  - Has JS link:', html.data.includes('src="script.js"') ? 'YES' : 'NO');
        console.log('  - Has Bootstrap:', html.data.includes('bootstrap') ? 'YES' : 'NO');
        console.log('  - Has Font Awesome:', html.data.includes('font-awesome') ? 'YES' : 'NO');
    } catch (e) {
        console.log('✗ index.html failed:', e.message);
    }
    
    console.log('');
    
    // Test CSS
    try {
        const css = await testFileAccess('/style.css');
        console.log('✓ style.css loaded:', css.status === 200 ? 'OK' : 'FAIL');
        console.log('  - Size:', css.length, 'bytes');
        console.log('  - Has body styles:', css.data.includes('body {') ? 'YES' : 'NO');
        console.log('  - Has card styles:', css.data.includes('.card {') ? 'YES' : 'NO');
        console.log('  - Has gradient styles:', css.data.includes('linear-gradient') ? 'YES' : 'NO');
    } catch (e) {
        console.log('✗ style.css failed:', e.message);
    }
    
    console.log('');
    
    // Test JS
    try {
        const js = await testFileAccess('/script.js');
        console.log('✓ script.js loaded:', js.status === 200 ? 'OK' : 'FAIL');
        console.log('  - Size:', js.length, 'bytes');
        console.log('  - Has state object:', js.data.includes('let state = {') ? 'YES' : 'NO');
        console.log('  - Has calculateForward:', js.data.includes('function calculateForward()') ? 'YES' : 'NO');
        console.log('  - Has calculateReverse:', js.data.includes('function calculateReverse(') ? 'YES' : 'NO');
        console.log('  - Has saveHistory:', js.data.includes('function saveHistory(') ? 'YES' : 'NO');
        console.log('  - Has renderHistory:', js.data.includes('function renderHistory()') ? 'YES' : 'NO');
        console.log('  - Has init function:', js.data.includes('function init()') ? 'YES' : 'NO');
        console.log('  - Calls init:', js.data.includes('init();') ? 'YES' : 'NO');
    } catch (e) {
        console.log('✗ script.js failed:', e.message);
    }
    
    console.log('\n=== All tests completed ===');
}

runTests();
