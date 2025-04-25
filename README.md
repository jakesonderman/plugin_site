# Matrix-Style Audio Plugins Terminal Website

A 2000s Matrix-inspired terminal website for showcasing audio plugins with green text, descriptions, images, and download links for .pkg files.

## Features

- Matrix-style terminal UI with green text and digital rain effect
- Responsive design that works on all screen sizes
- Interactive terminal typing effects and animations
- Plugin cards with images, descriptions, and download links
- Matrix-inspired glitch effects on hover

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser to view the website

## Adding Your Own Plugins

To add your own audio plugins to the website, follow these steps:

1. Add your plugin images to the `img/` directory
2. Place your plugin .pkg files in the `downloads/` directory 
3. Edit the `plugins.js` file to add your plugin information:

```javascript
{
    name: "YourPluginName",
    version: "1.0.0",
    description: "Description of your plugin...",
    image: "img/your-plugin-image.jpg",
    downloadUrl: "downloads/YourPlugin_v1.0.0.pkg"
}
```

## Customization

You can customize the website by editing the following files:

- `styles.css` - Change colors, fonts, and layout
- `terminal.js` - Modify animations and effects
- `index.html` - Change the site structure and content

## Credits

- Font: VT323 (Google Fonts)
- Inspired by the Matrix movie series 

## Deploying to Netlify with Large Files

### Method 1: Manual Upload (Recommended for Beginners)

1. **Deploy your site to Netlify**:
   - Connect your GitHub repository to Netlify
   - Deploy the site (without the large .pkg and image files)

2. **Upload large files manually**:
   - After deployment, go to Netlify dashboard
   - Navigate to "Deploys" > "Latest Deploy" > "Functions" > "Files"
   - Use "Upload Files" to manually upload your:
     - `downloads/*.pkg` files
     - `img/*.png` and other image files
   - Files will be placed at the paths matching your site structure

3. **Verify files are accessible**:
   - Check your deployed site to ensure images display correctly
   - Test the download links for your .pkg files

### Method 2: Include Large Files in Deployment

If you prefer to have Netlify handle everything in one deployment:

1. **Remove large files from .gitignore**:
   ```
   # Keep these lines commented out during local development
   # Uncomment only when deploying
   # downloads/*
   # !downloads/.gitkeep
   # img/* 
   # !img/.gitkeep
   ```

2. **Use Netlify Large Media (Git LFS)**:
   - Install Git LFS locally: `git lfs install`
   - Track large files: 
     ```
     git lfs track "*.pkg"
     git lfs track "*.png"
     git lfs track "*.jpg"
     ```
   - Add, commit and push your files

Note: Method 1 is simpler for one-time deployments. Method 2 is better for ongoing site maintenance. 

## Automatic Deployment and Management

This project includes scripts to automate adding plugins and deploying your site.

### Adding New Plugins Automatically

Run the plugin adder script:

```bash
./add-plugin.js
```

This interactive script will:
1. Prompt you for plugin details (name, version, description, etc.)
2. Add the plugin to plugins.js
3. Check if required files exist
4. Guide you through next steps

### Automated Deployment

Deploy your site with a single command:

```bash
./deploy.sh
```

This script will:
1. Verify all files exist
2. Check Git LFS is installed
3. Stage and commit your changes
4. Push to GitHub
5. Deploy to Netlify (if the CLI is installed)

### First-Time Setup

Before using the automated scripts:

1. Install Git LFS:
   ```bash
   brew install git-lfs  # On macOS
   git lfs install
   ```

2. Install Netlify CLI (optional):
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify link  # Connect to your Netlify site
   ```

3. Make the scripts executable:
   ```bash
   chmod +x deploy.sh add-plugin.js
   ```

The automated workflow uses Git LFS to track large files, so they'll be properly included in your site deployment. 