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
    
    // Create and append each plugin
    plugins.forEach((plugin, index) => {
        setTimeout(() => {
            const pluginElement = template.content.cloneNode(true);
            
            // Set plugin data
            pluginElement.querySelector('.plugin-name').textContent = `> ${plugin.name}`;
            pluginElement.querySelector('.plugin-version').textContent = `v${plugin.version}`;
            
            const imgElement = pluginElement.querySelector('.plugin-image');
            imgElement.src = plugin.image;
            imgElement.alt = plugin.name;
            
            pluginElement.querySelector('.plugin-description').textContent = plugin.description;
            
            const downloadBtn = pluginElement.querySelector('.download-btn');
            downloadBtn.href = plugin.downloadUrl;
            downloadBtn.textContent = `DOWNLOAD ${plugin.name.toUpperCase()} .PKG`;
            
            // Add plugin element to container with delay
            pluginsContainer.appendChild(pluginElement);
            
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