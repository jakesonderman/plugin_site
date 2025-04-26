// Audio Plugins Data
const plugins = [
    {
        name: "Vintage Emulations",
        version: "0.1",
        description: "Vintage gear emulated only from sine sweeps. They can clip or not be gain matched, but they ",
        // You can use either image or media property
        // image: "img/1176BGND.png",
        media: "img/1176BGND.png", // Can be a .png, .jpg, .mp4, or .mov file
        downloadUrl: "downloads/all_plugins-signed.pkg"
    },
    {
        name: "Clarity Prism",
        version: "1.0",
        description: "Multiband detail and transient destroyer plugin.",
        // Using the new PNG sequence animation
        pngSequence: {
            baseUrl: "img/",
            baseFileName: "ClarityPrismFrames",
            frameCount: 20,
            startIndex: 0,
            padLength: 2,
            fps: 12, // Reduced FPS for smoother animation
            extension: "png",
            loop: true
        },
        // Fallback image in case JS is disabled
        media: "img/ClarityPrismFrames03.png",
        downloadUrl: "downloads/prism-signed.pkg"
    }
    // Add more plugins here
]; 