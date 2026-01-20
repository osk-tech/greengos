// Esperamos a que el contenido cargue
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sticky-nav a');

    // Configuración del observador
    const options = {
        root: null, // usa el viewport del navegador
        threshold: 0.6, // se activa cuando el 60% de la sección es visible
        rootMargin: "-80px 0px 0px 0px" // compensa la altura del menú sticky
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Removemos la clase active de todos los links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Buscamos el link que corresponde a la sección visible
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.sticky-nav a[href="#${id}"]`);
                
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, options);

    // Le decimos al observador que vigile cada sección
    sections.forEach(section => observer.observe(section));
});