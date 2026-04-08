document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }

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

/* ===== SCROLL TO TOP FUNCTIONALITY ===== */
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        // Smooth scroll to top on click
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

/* ===== ACCORDION FUNCTIONALITY ===== */
document.addEventListener('DOMContentLoaded', () => {
    const lunchDinner = document.querySelector('#lunch-dinner');
    const drinks = document.querySelector('#drinks');
    
    if (lunchDinner) createAccordions(lunchDinner, 'lunch-dinner');
    if (drinks) createAccordions(drinks, 'drinks');
});

function createAccordions(section, sectionId) {
    const h3Elements = section.querySelectorAll('h3');
    const accordionItems = [];

    h3Elements.forEach((h3) => {
        const nextDiv = h3.nextElementSibling;
        
        if (nextDiv && (nextDiv.classList.contains('grid-items') || nextDiv.classList.contains('drink-box') || nextDiv.classList.contains('simple-list'))) {
            // Store original data
            accordionItems.push({
                title: h3.textContent,
                content: nextDiv.cloneNode(true)
            });
            
            // Hide original h3 and div
            h3.style.display = 'none';
            nextDiv.style.display = 'none';
        }
    });

    if (accordionItems.length === 0) return;

    // Create controls container
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'accordion-controls';
    controlsDiv.innerHTML = `
        <button class="accordion-btn" data-action="expand-all" title="Expand all sections">
            ▼ Expand All
        </button>
        <button class="accordion-btn" data-action="collapse-all" title="Collapse all sections">
            ▲ Collapse All
        </button>
    `;

    // Create accordions container
    const accordionsDiv = document.createElement('div');
    accordionsDiv.className = 'accordions-container';

    // Create accordion items
    accordionItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'accordion-item';
        itemDiv.innerHTML = `
            <button class="accordion-header" data-index="${index}">
                <span>${item.title}</span>
                <span class="accordion-toggle">▼</span>
            </button>
            <div class="accordion-content" data-index="${index}">
                <div class="accordion-body">
                    ${item.content.innerHTML}
                </div>
            </div>
        `;
        accordionsDiv.appendChild(itemDiv);
    });

    // Insert controls and accordions before first h3
    const firstH3 = section.querySelector('h3');
    if (firstH3) {
        firstH3.parentNode.insertBefore(controlsDiv, firstH3);
        firstH3.parentNode.insertBefore(accordionsDiv, firstH3);
    }

    // Add accordion functionality
    const headers = section.querySelectorAll('.accordion-header');
    headers.forEach((header) => {
        header.addEventListener('click', function() {
            const index = this.dataset.index;
            const content = section.querySelector(`.accordion-content[data-index="${index}"]`);
            const isActive = this.classList.contains('active');

            // Toggle current
            this.classList.toggle('active');
            content.classList.toggle('active');
        });
    });

    // Add expand/collapse all functionality
    const expandBtn = section.querySelector('[data-action="expand-all"]');
    const collapseBtn = section.querySelector('[data-action="collapse-all"]');

    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            headers.forEach((header) => {
                const index = header.dataset.index;
                const content = section.querySelector(`.accordion-content[data-index="${index}"]`);
                header.classList.add('active');
                content.classList.add('active');
            });
        });
    }

    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            headers.forEach((header) => {
                const index = header.dataset.index;
                const content = section.querySelector(`.accordion-content[data-index="${index}"]`);
                header.classList.remove('active');
                content.classList.remove('active');
            });
        });
    }
}
