/**
 * Carousel functionality for Caritas Byumba project section
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get carousel elements
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    const carousel = document.querySelector('.project-carousel');
    const cards = document.querySelectorAll('.project-card');
    
    // Calculate card width including margin
    const cardWidth = cards[0].offsetWidth + 20; // 20px is the gap between cards
    
    // Set initial index
    let currentIndex = 0;
    
    // Function to update buttons state
    function updateButtonState() {
        // Enable/disable previous button based on position
        prev.disabled = currentIndex === 0;
        prev.style.opacity = currentIndex === 0 ? "0.5" : "1";
        
        // Enable/disable next button based on position
        const maxIndex = cards.length - Math.floor(carousel.offsetWidth / cardWidth);
        next.disabled = currentIndex >= maxIndex;
        next.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    }
    
    // Previous button click handler
    prev.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            carousel.scrollTo({
                left: currentIndex * cardWidth,
                behavior: 'smooth'
            });
            updateButtonState();
        }
    });
    
    // Next button click handler
    next.addEventListener('click', function() {
        const maxIndex = cards.length - Math.floor(carousel.offsetWidth / cardWidth);
        if (currentIndex < maxIndex) {
            currentIndex++;
            carousel.scrollTo({
                left: currentIndex * cardWidth,
                behavior: 'smooth'
            });
            updateButtonState();
        }
    });
    
    // Handle manual scrolling
    let isScrolling;
    carousel.addEventListener('scroll', function() {
        // Clear timeout if scrolling is ongoing
        window.clearTimeout(isScrolling);
        
        // Set timeout to update index after scrolling stops
        isScrolling = setTimeout(function() {
            // Update current index based on scroll position
            currentIndex = Math.round(carousel.scrollLeft / cardWidth);
            updateButtonState();
        }, 100);
    });
    
    // Update button state on window resize
    window.addEventListener('resize', updateButtonState);
    
    // Initialize button states
    updateButtonState();
    
    // Touch support for mobile swipe
    let startX, scrollLeft;
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const distance = x - startX;
        carousel.scrollLeft = scrollLeft - distance;
    });
    
    carousel.addEventListener('touchend', function() {
        // Snap to closest card after touch ends
        currentIndex = Math.round(carousel.scrollLeft / cardWidth);
        carousel.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });
        updateButtonState();
    });
});