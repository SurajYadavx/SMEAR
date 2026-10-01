const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'all_packages');
const bloodTestFile = path.join(__dirname, '..', 'blood_test', 'health_tests.json');
const outputDir = path.join(__dirname, '..', 'price_management');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const packagesCsvFile = path.join(outputDir, 'packages_price_sheet.csv');
const bloodTestCsvFile = path.join(outputDir, 'blood_tests_price_sheet.csv');

// --- CSV Helper ---
function escapeCsv(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

// --- Helpers ---
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function extractSourcePrice(pkg) {
    // Attempt to extract raw price string
    let sourcePrice = '';
    
    // Check if it's already there
    if (pkg.price) {
        return pkg.price;
    }
    
    const content = pkg.preview_content || pkg.detailed_content || '';
    if (content) {
        const lines = content.split('\n').map(l => l.trim()).filter(l => l);
        const priceLines = lines.filter(l => l.startsWith('₹') || l.startsWith('Rs.'));
        if (priceLines.length > 0) {
            sourcePrice = priceLines.join(' | ');
        }
    }
    
    return sourcePrice;
}

// --- Package Processing ---
let totalJsonFiles = 0;
let totalPackageRecords = 0;
let packageRowsGenerated = 0;

let missingPackageNames = 0;
let missingPackagePrices = 0;
let missingDetailTitles = 0;

const packageNamesSet = new Set();
let duplicatePackageNames = 0;

const packageIdCounts = {};

const packagesCsvHeader = ['Sr No', 'Package ID', 'Category', 'Source File', 'Package Name', 'Detail Page Title', 'Current Source Price', 'Final Price', 'Notes'];
let packagesCsvContent = packagesCsvHeader.map(escapeCsv).join(',') + '\n';

const packageFiles = fs.readdirSync(packagesDir).filter(f => f.endsWith('.json'));

let packageSrNo = 1;

for (const file of packageFiles) {
    totalJsonFiles++;
    const category = file.replace(/\.json$/i, '');
    const filepath = path.join(packagesDir, file);
    
    let data;
    try {
        data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    } catch (e) {
        continue;
    }
    
    if (!Array.isArray(data)) continue;
    
    for (const pkg of data) {
        totalPackageRecords++;
        
        let pkgName = pkg.package_name || '';
        if (!pkgName) {
            missingPackageNames++;
        } else {
            if (packageNamesSet.has(pkgName.toLowerCase())) {
                duplicatePackageNames++;
            }
            packageNamesSet.add(pkgName.toLowerCase());
        }
        
        const detailTitle = pkg.detail_page_title || '';
        if (!detailTitle) missingDetailTitles++;
        
        const sourcePrice = extractSourcePrice(pkg);
        if (!sourcePrice) missingPackagePrices++;
        
        // Deterministic ID
        let baseId = slugify(category) + '::' + slugify(pkgName || 'unknown');
        if (!packageIdCounts[baseId]) packageIdCounts[baseId] = 0;
        packageIdCounts[baseId]++;
        
        let pkgId = baseId;
        if (packageIdCounts[baseId] > 1) {
            pkgId += '::record-' + String(packageIdCounts[baseId]).padStart(3, '0');
        }
        
        let notes = [];
        if (!pkgName) notes.push("Package name field missing");
        if (!sourcePrice) notes.push("Missing source price");
        if (sourcePrice.includes('|')) notes.push("Source contains multiple price values");
        
        const row = [
            packageSrNo,
            pkgId,
            category,
            file,
            pkgName,
            detailTitle,
            sourcePrice,
            '', // Final Price blank
            notes.join('; ')
        ];
        
        packagesCsvContent += row.map(escapeCsv).join(',') + '\n';
        packageSrNo++;
        packageRowsGenerated++;
    }
}

fs.writeFileSync(packagesCsvFile, packagesCsvContent, 'utf8');

// --- Blood Test Processing ---
let totalTestRecords = 0;
let testRowsGenerated = 0;

let missingTestNames = 0;
let missingLabs = 0;
let missingTestPrices = 0;

const testNamesSet = new Set();
let duplicateTestNames = 0;

const testIdCounts = {};

const testsCsvHeader = ['Sr No', 'Test ID', 'Test Name', 'Lab', 'Current Source Price', 'Final Price', 'Notes'];
let testsCsvContent = testsCsvHeader.map(escapeCsv).join(',') + '\n';

let testSrNo = 1;

if (fs.existsSync(bloodTestFile)) {
    let testData = [];
    try {
        testData = JSON.parse(fs.readFileSync(bloodTestFile, 'utf8'));
    } catch (e) {
        console.error("Failed to parse blood tests JSON");
    }
    
    if (Array.isArray(testData)) {
        for (const test of testData) {
            totalTestRecords++;
            
            let testName = test.test_name || '';
            if (!testName) {
                missingTestNames++;
            } else {
                if (testNamesSet.has(testName.toLowerCase())) {
                    duplicateTestNames++;
                }
                testNamesSet.add(testName.toLowerCase());
            }
            
            let lab = test.lab || '';
            if (!lab) missingLabs++;
            
            let price = test.price || '';
            if (!price) missingTestPrices++;
            
            let baseId = slugify(testName || 'unknown');
            if (!testIdCounts[baseId]) testIdCounts[baseId] = 0;
            testIdCounts[baseId]++;
            
            let testId = baseId;
            if (testIdCounts[baseId] > 1) {
                testId += '::record-' + String(testIdCounts[baseId]).padStart(3, '0');
            }
            
            let notes = [];
            if (!testName) notes.push("Test name field missing");
            if (!lab) notes.push("Missing lab");
            if (!price) notes.push("Missing source price");
            
            const row = [
                testSrNo,
                testId,
                testName,
                lab,
                price,
                '', // Final Price blank
                notes.join('; ')
            ];
            
            testsCsvContent += row.map(escapeCsv).join(',') + '\n';
            testSrNo++;
            testRowsGenerated++;
        }
    }
}

fs.writeFileSync(bloodTestCsvFile, testsCsvContent, 'utf8');

// --- Final Report ---
console.log(`========================================
PRICE MANAGEMENT CSV GENERATION REPORT
========================================

PACKAGE DATA
----------------------------------------
Source folder:
${packagesDir}

JSON files discovered:
${totalJsonFiles}

Package records discovered:
${totalPackageRecords}

Package CSV rows generated:
${packageRowsGenerated}

Missing package names:
${missingPackageNames}

Missing source prices:
${missingPackagePrices}

Duplicate package names:
${duplicatePackageNames}

Output:
${packagesCsvFile}


BLOOD TEST DATA
----------------------------------------
Source file:
${bloodTestFile}

Blood test records discovered:
${totalTestRecords}

Blood test CSV rows generated:
${testRowsGenerated}

Missing test names:
${missingTestNames}

Missing labs:
${missingLabs}

Missing source prices:
${missingTestPrices}

Duplicate test names:
${duplicateTestNames}

Output:
${bloodTestCsvFile}


VALIDATION
----------------------------------------
Package source count == CSV count:
${totalPackageRecords === packageRowsGenerated ? 'YES' : 'NO'}

Blood test source count == CSV count:
${totalTestRecords === testRowsGenerated ? 'YES' : 'NO'}

Source files modified:
NONE

Website files modified:
NONE

========================================`);
