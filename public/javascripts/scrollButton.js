document.addEventListener('DOMContentLoaded', function () {
    // Scroll to the top when the button is clicked
    var scrollToTopButton = document.getElementById('scroll-to-top-button');
    scrollToTopButton.addEventListener('click', function () {
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





