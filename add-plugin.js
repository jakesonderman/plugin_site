#!/usr/bin/env node
// Script to add a new plugin to the site

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for plugin details
console.log('\n============ ADD NEW PLUGIN ============');

const promptForInfo = () => {
  return new Promise((resolve) => {
    const plugin = {};
    
    rl.question('Plugin Name: ', (name) => {
      plugin.name = name;
      
      rl.question('Version (e.g. 1.0.0): ', (version) => {
        plugin.version = version;
        
        rl.question('Description: ', (description) => {
          plugin.description = description;
          
          rl.question('Image path (e.g. img/plugin.png): ', (image) => {
            plugin.image = image;
            
            rl.question('Download file path (e.g. downloads/plugin.pkg): ', (downloadUrl) => {
              plugin.downloadUrl = downloadUrl;
              
              resolve(plugin);
            });
          });
        });
      });
    });
  });
};

const addPluginToFile = (plugin) => {
  // Read existing plugins file
  const pluginsPath = path.join(__dirname, 'plugins.js');
  const pluginsContent = fs.readFileSync(pluginsPath, 'utf8');
  
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
        image: "${plugin.image}",
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
  fs.writeFileSync(pluginsPath, updatedContent);
};

// Main function
const main = async () => {
  try {
    const plugin = await promptForInfo();
    
    // Check if image file exists
    if (!fs.existsSync(plugin.image)) {
      console.log(`\nWARNING: Image file '${plugin.image}' doesn't exist yet.`);
      console.log(`Make sure to add it before deploying.`);
    }
    
    // Check if download file exists
    if (!fs.existsSync(plugin.downloadUrl)) {
      console.log(`\nWARNING: Download file '${plugin.downloadUrl}' doesn't exist yet.`);
      console.log(`Make sure to add it before deploying.`);
    }
    
    // Add to plugins.js
    addPluginToFile(plugin);
    
    console.log(`\n✅ Successfully added ${plugin.name} to plugins.js!`);
    console.log('\nNext steps:');
    console.log(`1. Make sure '${plugin.image}' exists in your repository`);
    console.log(`2. Make sure '${plugin.downloadUrl}' exists in your repository`);
    console.log('3. Run the deployment script: ./deploy.sh');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
};

// Run the script
main(); 