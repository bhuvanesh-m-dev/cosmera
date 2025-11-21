/**
 * script.js
 * Handles all dynamic functionality for the Cosmera website.
 * - Three.js 3D Scene (Starfield + Tech Planet)
 * - Mobile navigation (hamburger menu)
 * - Scroll-to-top button visibility
 * - Sticky navigation bar background change
 * - Rotating hero section quotes
 */

document.addEventListener('DOMContentLoaded', function () {

    // --- Three.js 3D Scene ---
    const canvas = document.getElementById('star-canvas');
    if (canvas) {
        // Scene Setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // --- Starfield ---
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const starPositions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 200; // Spread stars across a large area
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // --- Tech Planet (Wireframe Icosahedron) ---
        const planetGeometry = new THREE.IcosahedronGeometry(10, 2);
        const planetMaterial = new THREE.MeshBasicMaterial({
            color: 0x7F00FF,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        scene.add(planet);

        // Inner Core (Glowing Points)
        const coreGeometry = new THREE.IcosahedronGeometry(9, 1);
        const coreMaterial = new THREE.PointsMaterial({
            color: 0x00FFFF,
            size: 0.15,
            transparent: true,
            opacity: 0.6
        });
        const core = new THREE.Points(coreGeometry, coreMaterial);
        planet.add(core);

        // --- Mouse Interaction ---
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        // --- Animation Loop ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            // Rotate Planet
            planet.rotation.y += 0.002;
            planet.rotation.x += 0.001;

            // Rotate Stars slightly
            stars.rotation.y -= 0.0005;

            // Smooth Camera Movement based on Mouse
            camera.rotation.y += 0.05 * (targetX - camera.rotation.y);
            camera.rotation.x += 0.05 * (targetY - camera.rotation.x);

            renderer.render(scene, camera);
        }

        animate();

        // Handle Window Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
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
