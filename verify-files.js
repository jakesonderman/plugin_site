// File verification script
// Run this before deploying to ensure all files referenced in plugins.js exist

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

// Check if we're using Chalk v5+ (ESM version) or Chalk v4- (CommonJS)
const red = (text) => {
    if (typeof chalk.red === 'function') {
        return chalk.red(text);
    }
    return chalk.red ? chalk.red(text) : `\x1b[31m${text}\x1b[0m`;
};

const green = (text) => {
    if (typeof chalk.green === 'function') {
        return chalk.green(text);
    }
    return chalk.green ? chalk.green(text) : `\x1b[32m${text}\x1b[0m`;
};

const yellow = (text) => {
    if (typeof chalk.yellow === 'function') {
        return chalk.yellow(text);
    }
    return chalk.yellow ? chalk.yellow(text) : `\x1b[33m${text}\x1b[0m`;
};

const cyan = (text) => {
    if (typeof chalk.cyan === 'function') {
        return chalk.cyan(text);
    }
    return chalk.cyan ? chalk.cyan(text) : `\x1b[36m${text}\x1b[0m`;
};

async function checkFile(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log(cyan("Verifying all required files exist...\n"));
    
    try {
        // Read plugins data
        const pluginsFile = await fs.readFile('plugins.js', 'utf8');
        
        // Simple regex to extract file paths
        // This assumes the plugins.js follows the expected format
        const imgRegex = /(?:image|media):\s*['"](.+?)['"]/g;
        const downloadRegex = /downloadUrl:\s*['"](.+?)['"]/g;
        
        const imageMatches = [...pluginsFile.matchAll(imgRegex)].map(match => match[1]);
        const downloadMatches = [...pluginsFile.matchAll(downloadRegex)].map(match => match[1]);
        
        // Check image/video files
        console.log(yellow("Checking media files:"));
        let missingImages = 0;
        
        for (const filePath of imageMatches) {
            const exists = await checkFile(filePath);
            const fileExtension = path.extname(filePath).toLowerCase();
            
            if (exists) {
                let fileType = "image";
                if (fileExtension === '.mov') fileType = "video (MOV)";
                if (fileExtension === '.mp4') fileType = "video (MP4)";
                
                console.log(green(`✅ ${filePath} (${fileType})`));
            } else {
                console.log(red(`❌ ${filePath} (MISSING)`));
                missingImages++;
            }
        }
        
        // Check download files
        console.log(yellow("\nChecking download files:"));
        let missingDownloads = 0;
        
        for (const filePath of downloadMatches) {
            const exists = await checkFile(filePath);
            
            if (exists) {
                console.log(green(`✅ ${filePath} `));
            } else {
                console.log(red(`❌ ${filePath} (MISSING)`));
                missingDownloads++;
            }
        }
        
        // Summary
        console.log(cyan("\n=== SUMMARY ==="));
        console.log(`Total files checked: ${imageMatches.length + downloadMatches.length}`);
        console.log(`Missing files: ${missingImages + missingDownloads}`);
        
        if (missingImages + missingDownloads === 0) {
            console.log(green("\nAll files verified! Your site is ready for deployment."));
            return 0;
        } else {
            console.log(red("\nSome files are missing. Please add them before deploying."));
            return 1;
        }
        
    } catch (error) {
        console.error(red(`Error: ${error.message}`));
        return 1;
    }
}

// Run the verification
main().then(exitCode => {
    process.exit(exitCode);
}).catch(error => {
    console.error(red(`Unexpected error: ${error.message}`));
    process.exit(1);
}); 