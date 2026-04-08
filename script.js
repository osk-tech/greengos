document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sticky-nav a');
    const stickyNav = document.querySelector('.sticky-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    // Intersection Observer for active section highlighting
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));

    // Menu toggle functionality
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navContainer.classList.toggle('open');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navContainer.classList.remove('open');
        });
    });

    // Auto-collapse on scroll
    let lastScroll = 0;
    let isNavVisible = true;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const scrollDifference = currentScroll - lastScroll;

        // Close mobile menu when scrolling
        if (Math.abs(scrollDifference) > 10) {
            menuToggle.classList.remove('active');
            navContainer.classList.remove('open');
        }

        // Hide nav on scroll down, show on scroll up
        if (scrollDifference > 50 && isNavVisible) {
            stickyNav.classList.add('scrolled');
            stickyNav.classList.remove('scrolled-up');
            isNavVisible = false;
        } else if (scrollDifference < -50 && !isNavVisible) {
            stickyNav.classList.remove('scrolled');
            stickyNav.classList.add('scrolled-up');
            isNavVisible = true;
        }

        // Add shadow when scrolled
        if (currentScroll > 50) {
            stickyNav.classList.add('scrolled-shadow');
        } else {
            stickyNav.classList.remove('scrolled-shadow');
        }

        lastScroll = currentScroll;
    });
});
