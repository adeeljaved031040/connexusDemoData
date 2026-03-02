/**
 * Test the API endpoint directly to see what response we get
 */

const InsuranceDataProcessor = require('./processors/insuranceDataProcessor');
const fs = require('fs');
const path = require('path');

// Load sample data
const sampleDataPath = path.join(__dirname, 'examples', 'sampleInsuranceData.json');
const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

console.log('='.repeat(80));
console.log('TESTING PROCESSOR DIRECTLY (Same as API)');
console.log('='.repeat(80));

// Simulate what the API does
const originalData = JSON.parse(JSON.stringify(sampleData));
const processedData = InsuranceDataProcessor.process(sampleData);

console.log('\n✅ General Liability Limits:');
console.log(JSON.stringify(processedData.generalLiabilityLimits, null, 2));

console.log('\n✅ Other Coverage Limits Count:', processedData.otherCoverageLimits.length);
console.log('Other Coverage Limits:');
processedData.otherCoverageLimits.forEach((cov, idx) => {
  console.log(`  ${idx + 1}. ${cov.coverageType} - ${cov.limitDescription}: $${cov.limit.toLocaleString()}`);
});

console.log('\n✅ Umbrella Limits:');
console.log(JSON.stringify(processedData.umbrellaLimits, null, 2));

console.log('\n' + '='.repeat(80));
console.log('If you see nulls above, the processor has an issue.');
console.log('If you see correct values, the server needs to be restarted.');
console.log('='.repeat(80));

