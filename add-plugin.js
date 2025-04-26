#!/usr/bin/env node
// Script to add a new plugin to the site

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for plugin details
console.log('\n============ ADD NEW PLUGIN ============');

async function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

const addPlugin = async () => {
    console.log(green("\n=== ADD NEW PLUGIN ===\n"));
    
    const name = await promptUser("Plugin name: ");
    const version = await promptUser("Version (e.g., 1.0): ");
    const description = await promptUser("Description: ");
    
    // Ask about media type
    const mediaType = await promptUser("Media type (image/video): ");
    let mediaPath;
    
    if (mediaType.toLowerCase() === 'video') {
        mediaPath = await promptUser("Video file path (e.g., 'path/to/video.mp4' or 'path/to/video.mov'): ");
        // Ensure the file is in the right location
        await handleMediaFile(mediaPath, true);
    } else {
        mediaPath = await promptUser("Image file path (e.g., 'path/to/image.png'): ");
        // Ensure the file is in the right location
        await handleMediaFile(mediaPath, false);
    }
    
    const downloadPath = await promptUser("Download file path (.pkg file): ");
    
    // Verify the download file exists
    try {
        await fs.access(downloadPath);
    } catch (error) {
        console.log(red(`Error: Could not find the download file at ${downloadPath}`));
        console.log(yellow("Make sure the file exists at the specified path."));
        return;
    }
    
    // Copy the download file to the downloads directory if it's not already there
    const downloadFileName = path.basename(downloadPath);
    const targetDownloadPath = path.join('downloads', downloadFileName);
    
    if (downloadPath !== targetDownloadPath) {
        try {
            await fs.mkdir('downloads', { recursive: true });
            await fs.copyFile(downloadPath, targetDownloadPath);
            console.log(green(`Copied ${downloadFileName} to downloads folder`));
        } catch (error) {
            console.log(red(`Error copying download file: ${error.message}`));
            return;
        }
    }
    
    // Update the plugins.js file
    await addPluginToJsFile({
        name,
        version,
        description,
        media: mediaPath,
        downloadUrl: targetDownloadPath
    });
}

async function handleMediaFile(filePath, isVideo) {
    try {
        await fs.access(filePath);
    } catch (error) {
        console.log(red(`Error: Could not find the ${isVideo ? 'video' : 'image'} file at ${filePath}`));
        console.log(yellow("Make sure the file exists at the specified path."));
        process.exit(1);
    }
    
    // Get file extension
    const fileExtension = path.extname(filePath).toLowerCase();
    
    // Directory where media files should be stored
    let mediaDir;
    if (isVideo) {
        if (fileExtension === '.mp4') {
            mediaDir = 'mp4';
        } else if (fileExtension === '.mov') {
            mediaDir = 'videos';
        } else {
            mediaDir = 'videos'; // Default for other video formats
        }
    } else {
        mediaDir = 'img';
    }
    
    // Ensure the directory exists
    try {
        await fs.mkdir(mediaDir, { recursive: true });
    } catch (error) {
        console.log(red(`Error creating ${mediaDir} directory: ${error.message}`));
        process.exit(1);
    }
    
    // Copy the file to the correct directory if it's not already there
    const fileName = path.basename(filePath);
    const targetPath = path.join(mediaDir, fileName);
    
    if (filePath !== targetPath) {
        try {
            await fs.copyFile(filePath, targetPath);
            console.log(green(`Copied ${fileName} to ${mediaDir} folder`));
        } catch (error) {
            console.log(red(`Error copying ${isVideo ? 'video' : 'image'} file: ${error.message}`));
            process.exit(1);
        }
    }
    
    return targetPath;
}

const addPluginToJsFile = async (plugin) => {
    // Read existing plugins file
    const pluginsPath = path.join(__dirname, 'plugins.js');
    const pluginsContent = await fs.readFile(pluginsPath, 'utf8');
    
    // Extract plugins array
    const pluginsMatch = pluginsContent.match(/const plugins = \[([\s\S]*?)\];/);
    if (!pluginsMatch) {
        console.error('Could not parse plugins.js file. Make sure it has the expected format.');
        process.exit(1);
    }
    
    const existingPlugins = pluginsMatch[1];
    
    // Create new plugin entry
    const pluginEntry = `
    {
        name: "${plugin.name}",
        version: "${plugin.version}",
        description: "${plugin.description}",
        media: "${plugin.media}",
        downloadUrl: "${plugin.downloadUrl}"
    }`;
    
    // Add new plugin to array
    const updatedPlugins = existingPlugins.trim().length === 0 
        ? pluginEntry 
        : existingPlugins + ',' + pluginEntry;
    
    // Replace in file
    const updatedContent = pluginsContent.replace(
        /const plugins = \[([\s\S]*?)\];/, 
        `const plugins = [${updatedPlugins}];`
    );
    
    // Write back to file
    await fs.writeFile(pluginsPath, updatedContent);
};

// Main function
const main = async () => {
    try {
        await addPlugin();
        
        console.log(`\n${green('✅ Successfully added plugin to plugins.js!')}`);
        console.log('\nNext steps:');
        console.log(`1. Make sure your media files are in the correct directory`);
        console.log(`2. Make sure your download files are in the downloads directory`);
        console.log('3. Run the deployment script: ./deploy.sh');
        
    } catch (error) {
        console.error(red(`Error: ${error.message}`));
    } finally {
        rl.close();
    }
};

// Run the script
main(); 