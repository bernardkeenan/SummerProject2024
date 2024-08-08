document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');

    // Show menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.style.transform = 'translateX(0)';
        });
    }

    // Hide menu
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.style.transform = 'translateX(-100%)';
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navMenu.contains(event.target) && event.target !== navToggle) {
            navMenu.style.transform = 'translateX(-100%)';
        }
    });
});
