document.addEventListener('DOMContentLoaded', function () {
    // Scroll to the top when the button is clicked
    var scrollToTopButton = document.getElementById('scroll-to-top-button');
    scrollToTopButton.addEventListener('click', function () {
        scrollToTop();
    });

       // Touch events for mobile browsers
    scrollToTopButton.addEventListener('touchstart', function (event) {
        event.preventDefault(); // Prevent the default touch behavior
        scrollToTop();
    });

     function scrollToTop() {
        var scrollOptions = {
            top: 0,
            behavior: 'smooth' // Use smooth scrolling
        };
    
        window.scrollTo(scrollOptions);
    }
});





