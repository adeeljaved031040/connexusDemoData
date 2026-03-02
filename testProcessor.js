/**
 * Test script for Insurance Data Processor
 * Run with: node testProcessor.js
 */

const InsuranceDataProcessor = require('./processors/insuranceDataProcessor');
const fs = require('fs');
const path = require('path');

// Load sample data
const sampleDataPath = path.join(__dirname, 'examples', 'sampleInsuranceData.json');
const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

console.log('='.repeat(80));
console.log('INSURANCE DATA PROCESSOR TEST');
console.log('='.repeat(80));
console.log('\nOriginal Data:');
console.log('- Policy Type:', sampleData.policyType);
console.log('- Other Coverage Limits Count:', sampleData.otherCoverageLimits.length);
console.log('- Property Total Insured Value:', sampleData.propertyLimits.totalInsuredValue);
console.log('\nProcessing data...\n');

// Process the data
const processedData = InsuranceDataProcessor.process(sampleData);
const summary = InsuranceDataProcessor.getProcessingSummary(sampleData, processedData);

console.log('Processed Data:');
console.log('- Policy Type:', processedData.policyType);
console.log('- Other Coverage Limits Count:', processedData.otherCoverageLimits.length);
console.log('- Property Total Insured Value:', processedData.propertyLimits.totalInsuredValue);
console.log('\nProcessing Summary:');
console.log(JSON.stringify(summary, null, 2));

console.log('\nOther Coverage Limits (Processed):');
processedData.otherCoverageLimits.forEach((cov, idx) => {
  console.log(`  ${idx + 1}. ${cov.coverageType} - ${cov.limitDescription}: $${cov.limit.toLocaleString()}`);
});

console.log('\nProperty Limits:');
processedData.propertyLimits.buildings.forEach((building, idx) => {
  console.log(`  Building ${idx + 1}:`);
  console.log(`    Location: ${building.location}`);
  console.log(`    Building Limit: $${building.buildingLimit.toLocaleString()}`);
  console.log(`    Business Income Limit: $${building.businessIncomeLimit.toLocaleString()}`);
});

console.log('\n' + '='.repeat(80));
console.log('Test completed successfully!');
console.log('='.repeat(80));

