document.addEventListener('DOMContentLoaded', () => {
    // Matrix background effect
    createMatrixBackground();
    
    // Simulate terminal typing
    simulateTyping();
    
    // Load plugins with delay for terminal effect
    setTimeout(() => {
        loadPlugins();
    }, 2500);
    
    // Add touch support for mobile
    addMobileTouchSupport();
});

// Function to add mobile touch support
function addMobileTouchSupport() {
    // Convert mouseover to touch events for glitch effects
    document.addEventListener('touchstart', function() {
        // This empty function just enables touch behavior
    }, false);
    
    // Ensure scrolling works properly on touch devices
    const terminalContent = document.querySelector('.terminal-content');
    if (terminalContent) {
        terminalContent.style.webkitOverflowScrolling = 'touch';
    }
}

// Function to create the matrix digital rain effect
function createMatrixBackground() {
    const matrixBg = document.createElement('canvas');
    matrixBg.classList.add('matrix-bg');
    document.body.appendChild(matrixBg);
    
    const ctx = matrixBg.getContext('2d');
    
    // Set initial canvas size
    resizeCanvas();
    
    // Matrix characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    const fontSize = isMobile() ? 10 : 14; // Smaller font size on mobile
    let columns = Math.floor(matrixBg.width / fontSize);
    
    // Array to track the y position of each column
    let drops = [];
    
    function initDrops() {
        drops = [];
        columns = Math.floor(matrixBg.width / fontSize);
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
    }
    
    initDrops();
    
    // Drawing the characters
    function draw() {
        // Black with opacity to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrixBg.width, matrixBg.height);
        
        ctx.fillStyle = '#00ff00'; // Matrix green color
        ctx.font = fontSize + 'px monospace';
        
        // Looping over drops
        for (let i = 0; i < drops.length; i++) {
            // Random character to print
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            
            // x coordinate of the drop, y coordinate is drops[i] * fontSize
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Randomly reset some drops to the top after they reach a certain point
            if (drops[i] * fontSize > matrixBg.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Increment y coordinate
            drops[i]++;
        }
    }
    
    // Update animation
    let animationId;
    function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        function animate() {
            draw();
            animationId = requestAnimationFrame(animate);
        }
        animate();
    }
    
    startAnimation();
    
    // Function to check if device is mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Function to resize canvas
    function resizeCanvas() {
        matrixBg.width = window.innerWidth;
        matrixBg.height = window.innerHeight;
    }
    
    // Resize handler with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initDrops();
        }, 200);
    });
}

// Function to simulate terminal typing effect
function simulateTyping() {
    const introTextContainer = document.querySelector('.intro-text');
    const paragraphs = introTextContainer.querySelectorAll('p');
    
    // Hide all paragraphs initially
    paragraphs.forEach(p => {
        p.style.display = 'none';
    });
    
    // Show paragraphs one by one with typing effect
    paragraphs.forEach((p, index) => {
        setTimeout(() => {
            p.style.display = 'block';
            typeText(p);
        }, index * 500); // 500ms delay between each paragraph
    });
}

// Function to create typing effect for a single element
function typeText(element) {
    const text = element.textContent;
    element.textContent = '';
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 30); // Typing speed
}

// Function to load plugins from the plugins.js file
function loadPlugins() {
    const pluginsContainer = document.getElementById('plugins-list');
    const template = document.getElementById('plugin-template');
    
    // Clear loading message if exists
    pluginsContainer.innerHTML = '';
    
    // Debug: log plugins array
    console.log('Plugins array:', plugins);
    console.log('Number of plugins:', plugins.length);
    
    // Create and append each plugin
    plugins.forEach((plugin, index) => {
        console.log(`Processing plugin ${index + 1}:`, plugin.name);
        setTimeout(() => {
            const pluginElement = template.content.cloneNode(true);
            
            // Set plugin data
            pluginElement.querySelector('.plugin-name').textContent = `> ${plugin.name}`;
            pluginElement.querySelector('.plugin-version').textContent = `v${plugin.version}`;
            
            // Handle media content (image or video)
            const mediaContainer = pluginElement.querySelector('.plugin-media-container');
            const mediaPath = plugin.media || plugin.image; // Support both media and image properties
            
            console.log(`Plugin ${plugin.name} media path:`, mediaPath);
            
            if (mediaPath) {
                const fileExtension = mediaPath.split('.').pop().toLowerCase();
                console.log(`File extension for ${plugin.name}:`, fileExtension);
                
                if (['mov', 'mp4'].includes(fileExtension)) {
                    // Create video element
                    const videoElement = document.createElement('video');
                    videoElement.classList.add('plugin-video');
                    videoElement.src = mediaPath;
                    videoElement.autoplay = true;
                    videoElement.loop = true;
                    videoElement.muted = true;
                    videoElement.playsInline = true;
                    videoElement.setAttribute('playsinline', ''); // iOS support
                    
                    // Add poster attribute as fallback
                    videoElement.poster = 'img/video-poster.png';
                    
                    // Add controls for mobile (hidden by default but can be shown on tap)
                    if (isMobile()) {
                        videoElement.controls = true;
                        // Hide controls by default but show on tap
                        videoElement.classList.add('mobile-video');
                    }
                    
                    mediaContainer.appendChild(videoElement);
                    console.log(`Added video element for ${plugin.name}`);
                    
                    // Start video when it's visible
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                videoElement.play().catch(e => {
                                    console.log('Video play error:', e);
                                    // Fallback - add a play button if autoplay fails
                                    if (!mediaContainer.querySelector('.video-play-fallback')) {
                                        addVideoPlayButton(mediaContainer, videoElement);
                                    }
                                });
                            } else {
                                videoElement.pause();
                            }
                        });
                    }, { threshold: 0.1 });
                    
                    observer.observe(videoElement);
                } else if (plugin.pngSequence) {
                    // Handle PNG sequence animation
                    createPngSequenceAnimation(mediaContainer, plugin.pngSequence);
                    console.log(`Added PNG sequence animation for ${plugin.name}`);
                } else {
                    // Create image element
                    const imgElement = document.createElement('img');
                    imgElement.classList.add('plugin-image');
                    imgElement.src = mediaPath;
                    imgElement.alt = plugin.name;
                    
                    mediaContainer.appendChild(imgElement);
                    console.log(`Added image element for ${plugin.name}`);
                }
            }
            
            pluginElement.querySelector('.plugin-description').textContent = plugin.description;
            
            const downloadBtn = pluginElement.querySelector('.download-btn');
            downloadBtn.href = plugin.downloadUrl;
            downloadBtn.textContent = `DOWNLOAD ${plugin.name.toUpperCase()} .PKG`;
            
            // Add plugin element to container with delay
            pluginsContainer.appendChild(pluginElement);
            console.log(`Plugin ${plugin.name} added to DOM`);
            
            // Add glitch effect on hover/touch
            const pluginItem = pluginsContainer.lastElementChild;
            pluginItem.addEventListener('mouseover', () => {
                addGlitchEffect(pluginItem);
            });
            
            // Add touch support for mobile
            pluginItem.addEventListener('touchstart', (e) => {
                addGlitchEffect(pluginItem);
            }, false);
        }, index * 200); // Stagger the plugin appearance
    });
}

// Function to create PNG sequence animation
function createPngSequenceAnimation(container, sequenceConfig) {
    // Create container for the animation
    const animContainer = document.createElement('div');
    animContainer.classList.add('png-sequence-container');
    container.appendChild(animContainer);
    
    // Create image element for the animation
    const imgElement = document.createElement('img');
    imgElement.classList.add('png-sequence-image');
    animContainer.appendChild(imgElement);
    
    // Parse configuration
    let baseUrl = sequenceConfig.baseUrl || 'img/';
    let baseFileName = sequenceConfig.baseFileName || '';
    let frameCount = sequenceConfig.frameCount || 1;
    let extension = sequenceConfig.extension || 'png';
    let fps = sequenceConfig.fps || 24;
    let startIndex = sequenceConfig.startIndex || 0;
    let padLength = sequenceConfig.padLength || 2;
    let loop = sequenceConfig.loop !== false; // Default to true
    
    console.log('PNG Sequence Config:', sequenceConfig);
    
    // Debug: log the first frame path
    const firstFrameIndex = startIndex;
    const firstFramePadded = firstFrameIndex.toString().padStart(padLength, '0');
    const firstFramePath = `${baseUrl}${baseFileName}${firstFramePadded}.${extension}`;
    console.log('First frame path:', firstFramePath);
    
    // Set initial frame immediately to show something
    imgElement.src = firstFramePath;
    imgElement.alt = 'Animation frame';
    imgElement.onerror = function() {
        console.error('Error loading image:', this.src);
        // Set a fallback image if the frame doesn't load
        this.src = 'img/video-poster.png';
    };
    
    // Function to check if image exists
    function imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    
    // Preload all images and start animation only when they're loaded
    async function preloadImages() {
        const images = [];
        let allImagesExist = true;
        
        for (let i = 0; i < frameCount; i++) {
            const frameIndex = startIndex + i;
            const paddedIndex = frameIndex.toString().padStart(padLength, '0');
            const framePath = `${baseUrl}${baseFileName}${paddedIndex}.${extension}`;
            
            // Check if image exists
            const exists = await imageExists(framePath);
            if (!exists) {
                console.error(`Image does not exist: ${framePath}`);
                allImagesExist = false;
            }
            
            const img = new Image();
            img.src = framePath;
            images.push(img);
        }
        
        if (!allImagesExist) {
            console.warn('Some frames are missing. Animation might not work properly.');
        }
        
        return images;
    }
    
    // Start sequence animation
    async function initAnimation() {
        const images = await preloadImages();
        
        if (images.length === 0) {
            console.error('No valid images found for animation');
            return;
        }
        
        console.log(`Successfully loaded ${images.length} frames for animation`);
        
        // Set height of container to match aspect ratio of first image
        images[0].onload = function() {
            const aspectRatio = this.height / this.width;
            animContainer.style.height = `${animContainer.offsetWidth * aspectRatio}px`;
        };
        
        // Animation interval
        let currentFrame = 0;
        const frameInterval = 1000 / fps;
        let animationId;
        
        // Start animation when it's visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAnimation();
                } else {
                    stopAnimation();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(animContainer);
        
        // Animation functions
        function startAnimation() {
            if (animationId) return;
            
            animationId = setInterval(() => {
                currentFrame = (currentFrame + 1) % images.length;
                imgElement.src = images[currentFrame].src;
                
                // If not looping and we've reached the end, stop
                if (!loop && currentFrame === images.length - 1) {
                    stopAnimation();
                }
            }, frameInterval);
        }
        
        function stopAnimation() {
            if (animationId) {
                clearInterval(animationId);
                animationId = null;
            }
        }
        
        // Start animation immediately if in viewport
        if (isElementInViewport(animContainer)) {
            startAnimation();
        }
    }
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Initialize the animation
    initAnimation();
}

// Function to add a play button if autoplay fails (especially on mobile)
function addVideoPlayButton(container, videoElement) {
    const playButton = document.createElement('button');
    playButton.classList.add('video-play-fallback');
    playButton.innerHTML = '▶';
    container.appendChild(playButton);
    
    playButton.addEventListener('click', () => {
        videoElement.play();
        playButton.style.display = 'none';
    });
}

// Function to add glitch effect to an element
function addGlitchEffect(element) {
    // Create random glitch effect by briefly adding and removing classes
    const glitchEffect = () => {
        const glitchClass = `glitch-${Math.floor(Math.random() * 3) + 1}`;
        element.classList.add(glitchClass);
        
        setTimeout(() => {
            element.classList.remove(glitchClass);
        }, 100 + Math.random() * 200);
    };
    
    // Apply multiple random glitches
    const glitchCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < glitchCount; i++) {
        setTimeout(glitchEffect, Math.random() * 500);
    }
} 