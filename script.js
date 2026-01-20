// Energy Frequencies - Presentation Script

// Initialize presentation
let currentSlide = 0;
const totalSlides = 9;

// Audio visualizer - simplified without Web Audio API for local files
let isVisualizerRunning = false;

function startSimpleVisualizer() {
    if (isVisualizerRunning) return;
    isVisualizerRunning = true;
    
    const bars = document.querySelectorAll('.visualizer-bar');
    
    function animate() {
        if (!musicPlaying) {
            // Reset bars when music stops
            bars.forEach(bar => bar.style.height = '4px');
            requestAnimationFrame(animate);
            return;
        }
        
        // Simulated audio-reactive animation
        bars.forEach((bar, i) => {
            const time = Date.now() / 1000;
            const height = 10 + Math.sin(time * 3 + i * 0.5) * 25 + Math.random() * 20;
            bar.style.height = height + 'px';
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Video trimming function
function setupVideoTrimming() {
    const instagramVideo = document.getElementById('instagramVideo');
    if (!instagramVideo) return;
    
    const trimStart = parseFloat(instagramVideo.dataset.trimStart) || 0;
    const trimEnd = parseFloat(instagramVideo.dataset.trimEnd) || 0;
    
    // Set start time when video loads
    instagramVideo.addEventListener('loadedmetadata', function() {
        this.currentTime = trimStart;
    });
    
    // Handle play - always start from trim point
    instagramVideo.addEventListener('play', function() {
        if (this.currentTime < trimStart) {
            this.currentTime = trimStart;
        }
    });
    
    // Stop before end trim
    instagramVideo.addEventListener('timeupdate', function() {
        const endTime = this.duration - trimEnd;
        if (this.currentTime >= endTime) {
            this.pause();
            this.currentTime = trimStart;
        }
    });
}

// Start presentation function
function startPresentation() {
    const overlay = document.getElementById('startOverlay');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle.querySelector('.music-icon');
    
    // Hide overlay
    overlay.classList.add('hidden');
    
    // Start visualizer
    startSimpleVisualizer();
    
    // Start music
    backgroundMusic.volume = 1.0;
    backgroundMusic.play().then(() => {
        musicIcon.textContent = '🔊';
        musicToggle.classList.add('playing');
        musicPlaying = true;
        console.log('Music started successfully');
    }).catch((err) => {
        console.log('Music play failed:', err);
        // Try again with user gesture
        musicIcon.textContent = '🔇';
    });
}

// Music control
let musicPlaying = false;
const backgroundMusic = document.getElementById('backgroundMusic');

function toggleMusic() {
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle.querySelector('.music-icon');
    
    if (musicPlaying) {
        backgroundMusic.pause();
        musicIcon.textContent = '🔇';
        musicToggle.classList.remove('playing');
        musicPlaying = false;
    } else {
        startSimpleVisualizer();
        backgroundMusic.play().then(() => {
            musicIcon.textContent = '🔊';
            musicToggle.classList.add('playing');
            musicPlaying = true;
        });
    }
}

// Start music on first interaction
function startMusicOnInteraction() {
    if (!musicPlaying) {
        backgroundMusic.play().then(() => {
            const musicToggle = document.getElementById('musicToggle');
            const musicIcon = musicToggle.querySelector('.music-icon');
            musicIcon.textContent = '🔊';
            musicToggle.classList.add('playing');
            musicPlaying = true;
            // Remove listeners after first play
            document.removeEventListener('click', startMusicOnInteraction);
            document.removeEventListener('keydown', startMusicOnInteraction);
        }).catch(() => {});
    }
}

// Start music automatically
function startMusicAuto() {
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle.querySelector('.music-icon');
    
    backgroundMusic.play().then(() => {
        musicIcon.textContent = '🔊';
        musicToggle.classList.add('playing');
        musicPlaying = true;
    }).catch(() => {
        // Autoplay blocked, set up listeners for first interaction
        musicIcon.textContent = '🔇';
        musicToggle.classList.remove('playing');
        musicPlaying = false;
        // Add listeners to start on first interaction
        document.addEventListener('click', startMusicOnInteraction);
        document.addEventListener('keydown', startMusicOnInteraction);
    });
}

// Auto-start music prompt
function promptMusic() {
    const musicToggle = document.getElementById('musicToggle');
    musicToggle.classList.add('pulse-attention');
    setTimeout(() => {
        musicToggle.classList.remove('pulse-attention');
    }, 3000);
}

// Create navigation dots
function createNavDots() {
    const navDots = document.getElementById('navDots');
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        navDots.appendChild(dot);
    }
}

// Update navigation dots
function updateNavDots() {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Update progress bar
function updateProgress() {
    const progress = document.getElementById('progress');
    const percentage = ((currentSlide + 1) / totalSlides) * 100;
    progress.style.width = percentage + '%';
}

// Go to specific slide
function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    slides[index].classList.add('active');
    
    currentSlide = index;
    updateNavDots();
    updateProgress();
}

// Next slide
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

// Previous slide
function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(0);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides - 1);
            break;
    }
});

// Touch/Swipe navigation
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Check if horizontal swipe is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
});

// Mouse wheel navigation
let wheelTimeout;
document.addEventListener('wheel', (e) => {
    // Debounce wheel events
    if (wheelTimeout) return;
    
    wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
    }, 500);
    
    if (e.deltaY > 0) {
        nextSlide();
    } else {
        prevSlide();
    }
});

// Add entrance animations
function addAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.slide-content > *').forEach(el => {
        observer.observe(el);
    });
}

// Parallax effect for backgrounds
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    document.querySelectorAll('.slide-bg').forEach(bg => {
        bg.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add floating particles effect to title slide
function createParticles() {
    const slide1 = document.getElementById('slide1');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        const colors = ['rgba(0, 133, 124, ', 'rgba(201, 169, 98, ', 'rgba(0, 107, 100, '];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${randomColor}${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    slide1.querySelector('.slide-bg').appendChild(particlesContainer);
    
    // Add float animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
            25% { transform: translateY(-20px) translateX(10px); opacity: 1; }
            50% { transform: translateY(-40px) translateX(-10px); opacity: 0.5; }
            75% { transform: translateY(-20px) translateX(5px); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Typewriter effect for title
function typewriterEffect() {
    const title = document.querySelector('.main-title');
    const text = title.textContent;
    title.textContent = '';
    title.style.opacity = '1';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 100);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createNavDots();
    updateProgress();
    createParticles();
    addAnimations();
    setupVideoTrimming();
    
    console.log('Energy Frequencies Presentation loaded!');
    console.log('Click anywhere to start with music');
});

// Fullscreen toggle
document.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});
