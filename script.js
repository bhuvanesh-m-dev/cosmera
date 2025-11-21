/**
 * script.js
 * Handles all dynamic functionality for the Cosmera website.
 * - Starfield background animation
 * - Mobile navigation (hamburger menu)
 * - Scroll-to-top button visibility
 * - Sticky navigation bar background change
 * - Rotating hero section quotes
 */

document.addEventListener('DOMContentLoaded', function () {
    
    // --- Starfield Animation ---
    const canvas = document.getElementById('star-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Configuration for the starfield animation
        const config = {
            text: 'COSMERA',
            font: 'bold 90px "Poppins", sans-serif',
            scatterDelay: 4000, // Time before text scatters
            numStars: 1500, // Total number of stars
            starSpeed: 0.1, // Speed of stars moving towards the viewer
            maxRadius: 1.5, // Maximum radius of a star
            mouseInfluence: 0.5, // How much mouse movement affects the starfield center
        };

        let particles = [];
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let animationState = 'text'; // Can be 'text', 'scattering', or 'starfield'
        let timeouts = [];

        // Particle class for each star
        class Particle {
            constructor(x, y) {
                this.x = x; // Initial X position (from text)
                this.y = y; // Initial Y position (from text)
                this.originX = x;
                this.originY = y;
                
                // Target 3D coordinates for starfield
                this.tx = (Math.random() - 0.5) * window.innerWidth;
                this.ty = (Math.random() - 0.5) * window.innerHeight;
                this.z = window.innerWidth * 1.5;
                this.pz = this.z; // Previous Z for motion trail
            }

            // Update particle position based on animation state
            update() {
                if (animationState === 'scattering') {
                    // Move from text position to a random star position
                    this.x += (this.tx - this.x) * 0.03;
                    this.y += (this.ty - this.y) * 0.03;
                    this.z += (Math.random() * window.innerWidth - this.z) * 0.03;
                } else if (animationState === 'starfield') {
                    // Move star towards the viewer
                    this.z -= config.starSpeed;

                    // Reset star if it passes the viewer
                    if (this.z < 1) {
                        this.z = window.innerWidth;
                        this.tx = (Math.random() - 0.5) * window.innerWidth;
                        this.ty = (Math.random() - 0.5) * window.innerHeight;
                        this.x = center.x + this.tx / (window.innerWidth / this.z);
                        this.y = center.y + this.ty / (window.innerWidth / this.z);
                        this.pz = this.z;
                    }
                }
            }

            // Draw the particle on the canvas
            draw() {
                let sx, sy, radius, scale;
                
                if (animationState === 'text') {
                    ctx.fillStyle = 'rgba(224, 224, 224, 0.9)';
                    ctx.fillRect(this.x, this.y, 1.5, 1.5);
                } else {
                    scale = window.innerWidth / this.z;
                    sx = center.x + this.tx * scale;
                    sy = center.y + this.ty * scale;

                    // Only draw if within canvas bounds
                    if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
                        radius = Math.max(0, (1 - this.z / window.innerWidth) * config.maxRadius);
                        
                        ctx.beginPath();
                        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(224, 224, 224, ${0.8 * (1 - this.z / window.innerWidth)})`;
                        ctx.fill();
                        
                        // Draw motion trail
                        const prevScale = window.innerWidth / this.pz;
                        const prev_sx = center.x + this.tx * prevScale;
                        const prev_sy = center.y + this.ty * prevScale;
                        this.pz = this.z;

                        ctx.beginPath();
                        ctx.moveTo(prev_sx, prev_sy);
                        ctx.lineTo(sx, sy);
                        ctx.strokeStyle = `rgba(127, 0, 255, ${0.4 * (1 - this.z / window.innerWidth)})`;
                        ctx.lineWidth = radius;
                        ctx.stroke();
                    }
                }
            }
        }

        // Initialize the canvas and particles
        function init() {
            timeouts.forEach(clearTimeout);
            timeouts = [];
            animationState = 'text';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            if (canvas.width === 0 || canvas.height === 0) return;

            mouse = { x: canvas.width / 2, y: canvas.height / 2 };
            center = { x: canvas.width / 2, y: canvas.height / 2 };

            // Use a temporary canvas to get pixel data from the text
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            
            tempCtx.fillStyle = 'white';
            tempCtx.font = config.font;
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            tempCtx.fillText(config.text, tempCanvas.width / 2, (tempCanvas.height / 2) - 180);
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            
            particles = [];
            for (let y = 0; y < imageData.height; y += 4) {
                for (let x = 0; x < imageData.width; x += 4) {
                    if (imageData.data[(y * imageData.width + x) * 4 + 3] > 128) {
                        particles.push(new Particle(x, y));
                    }
                }
            }
            
            // Add random stars to fill up the scene
            while (particles.length < config.numStars) {
                const p = new Particle(Math.random() * canvas.width, Math.random() * canvas.height);
                p.z = Math.random() * window.innerWidth;
                particles.push(p);
            }

            // Set timeouts to transition animation states
            const scatterTimeout = setTimeout(() => {
                animationState = 'scattering';
                const starfieldTimeout = setTimeout(() => {
                    animationState = 'starfield';
                    particles.forEach(p => {
                        p.tx = (Math.random() - 0.5) * window.innerWidth * 2;
                        p.ty = (Math.random() - 0.5) * window.innerHeight * 2;
                        p.z = Math.random() * window.innerWidth;
                    });
                }, 2500);
                timeouts.push(starfieldTimeout);
            }, config.scatterDelay);
            timeouts.push(scatterTimeout);
        }

        // Main animation loop
        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Fading effect for trails
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Smoothly move starfield center towards mouse
            center.x += (mouse.x - center.x) * config.mouseInfluence;
            center.y += (mouse.y - center.y - 100) * config.mouseInfluence * 0.5;

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        // Event listeners for mouse movement and window resize
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('resize', init);
        
        init();
        animate();
    }

    // --- UI Interactions ---

    // Hamburger Menu Toggle
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburgerButton && mobileMenu) {
        hamburgerButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when a link inside it is clicked
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Sticky Navbar Background on Scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-black/80');
            } else {
                navbar.classList.remove('bg-black/80');
            }
        });
    }

    // Rotating Quotes
    const quotesContainer = document.getElementById('quotes-container');
    if (quotesContainer) {
        const quotes = quotesContainer.querySelectorAll('.quote');
        if (quotes.length > 0) {
            let currentQuoteIndex = 0;
            setInterval(() => {
                quotes[currentQuoteIndex].classList.remove('active');
                currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
                quotes[currentQuoteIndex].classList.add('active');
            }, 8000); // Change quote every 8 seconds
        }
    }
});
