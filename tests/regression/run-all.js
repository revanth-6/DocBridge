const securityTest = require('./security.test.js');
const stabilityTest = require('./stability.test.js');
const integrityTest = require('./integrity.test.js');
const crudTest = require('./crud.test.js');

async function runAll() {
  console.log('--- RUNNING DOCBRIDGE REGRESSION SUITE ---');
  
  const suites = [
    securityTest,
    stabilityTest,
    integrityTest,
    crudTest
  ];

  const results = [];
  let allPassed = true;
  let totalTests = 0;
  let totalPassed = 0;

  for (const suite of suites) {
    const res = await suite();
    results.push(res);
    totalTests += res.total;
    totalPassed += res.passed;
    if (res.passed !== res.total) allPassed = false;
    
    // Wait 1 second to ensure JWT 'iat' changes for the next login to avoid unique constraint error
    await new Promise(r => setTimeout(r, 1000));
  }

  // Print results
  console.log('\nFailed Tests Detail:');
  for (const res of results) {
    for (const t of res.results) {
      if (!t.passed) {
        console.log(`❌ [${res.name}] ${t.name} -> ${t.reason}`);
      }
    }
  }

  console.log('\n╔══════════════════════════════════╦════════╦═════════╗');
  console.log('║ Test Suite                       ║ Tests  ║ Result  ║');
  console.log('╠══════════════════════════════════╬════════╬═════════╣');
  
  for (const res of results) {
    const namePad = res.name.padEnd(32, ' ');
    const testPad = `${res.passed}/${res.total}`.padEnd(6, ' ');
    const resultPad = res.passed === res.total ? '✅ PASS ' : '❌ FAIL ';
    console.log(`║ ${namePad} ║ ${testPad} ║ ${resultPad}║`);
  }

  console.log('╠══════════════════════════════════╬════════╬═════════╣');
  const totalNamePad = 'TOTAL'.padEnd(32, ' ');
  const totalTestPad = `${totalPassed}/${totalTests}`.padEnd(6, ' ');
  const totalResultPad = allPassed ? '✅ PASS ' : '❌ FAIL ';
  console.log(`║ ${totalNamePad} ║ ${totalTestPad} ║ ${totalResultPad}║`);
  console.log('╚══════════════════════════════════╩════════╩═════════╝');

  if (!allPassed) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAll();
