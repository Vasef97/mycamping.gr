document.addEventListener('DOMContentLoaded', function () {
    // Scroll to the top when the button is clicked
    var scrollToTopButton = document.getElementById('scroll-to-top-button');
    scrollToTopButton.addEventListener('click', function () {
        scrollToTop();
    });

    // Add touch events for mobile browsers
    scrollToTopButton.addEventListener('touchstart', function () {
        scrollToTopButton.classList.add('touch-hover');
        scrollToTop();
    });

    // Remove touch class after a short delay
    scrollToTopButton.addEventListener('touchend', function () {
        setTimeout(function () {
            scrollToTopButton.classList.remove('touch-hover');
        }, 100); // Adjust the delay as needed
    });

     function scrollToTop() {
        var scrollOptions = {
            top: 0,
            behavior: 'smooth' // Use smooth scrolling
        };
    
        window.scrollTo(scrollOptions);
    }
});





