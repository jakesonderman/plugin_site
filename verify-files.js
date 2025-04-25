// File verification script
// Run this before deploying to ensure all files referenced in plugins.js exist

const fs = require('fs');
const path = require('path');

console.log('Verifying all required files exist...');

// Load plugins data
const pluginsFile = fs.readFileSync('plugins.js', 'utf8');
const pluginsData = pluginsFile.match(/const plugins = \[([\s\S]*?)\];/)[1];

// Extract file paths from plugins data
const imageRegex = /image: ["'](.*?)["']/g;
const downloadRegex = /downloadUrl: ["'](.*?)["']/g;

const images = [];
let imgMatch;
while ((imgMatch = imageRegex.exec(pluginsData)) !== null) {
  images.push(imgMatch[1]);
}

const downloads = [];
let dlMatch;
while ((dlMatch = downloadRegex.exec(pluginsData)) !== null) {
  downloads.push(dlMatch[1]);
}

// Verify files exist
console.log('\nChecking image files:');
images.forEach(img => {
  const exists = fs.existsSync(img);
  console.log(`${exists ? '✅' : '❌'} ${img} ${!exists ? '(MISSING)' : ''}`);
});

console.log('\nChecking download files:');
downloads.forEach(dl => {
  const exists = fs.existsSync(dl);
  console.log(`${exists ? '✅' : '❌'} ${dl} ${!exists ? '(MISSING)' : ''}`);
});

// Summary
const missingImages = images.filter(img => !fs.existsSync(img));
const missingDownloads = downloads.filter(dl => !fs.existsSync(dl));
const totalMissing = missingImages.length + missingDownloads.length;

console.log('\n=== SUMMARY ===');
console.log(`Total files checked: ${images.length + downloads.length}`);
console.log(`Missing files: ${totalMissing}`);

if (totalMissing > 0) {
  console.log('\nMISSING FILES:');
  [...missingImages, ...missingDownloads].forEach(file => {
    console.log(`- ${file}`);
  });
  console.log('\nPlease add these files before deploying!');
} else {
  console.log('\nAll files verified! Your site is ready for deployment.');
} 