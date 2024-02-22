document.addEventListener('DOMContentLoaded', function () {
    // Scroll to the top when the button is clicked
    var scrollToTopButton = document.getElementById('scroll-to-top-button');
    scrollToTopButton.addEventListener('click', function () {
        scrollToTop();
    });

    function scrollToTop() {
        var scrollStep = -window.scrollY / (50 / 15);
        var scrollInterval = setInterval(function () {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    }
});





