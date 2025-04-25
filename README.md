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