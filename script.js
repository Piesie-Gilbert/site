document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Check if the target exists before scrolling
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // "Hire me" button functionality
    const hireMeButton = document.getElementById('hireMeBtn'); // Use the ID we added in HTML

    if (hireMeButton) {
        hireMeButton.addEventListener('click', function() {
            // Opens email client with pre-filled recipient and subject
            window.location.href = 'mailto:gilbertkwame7@gmail.com?subject=Inquiry from your Portfolio Website';
        });
    }

    // You can add more JavaScript functionality here as we progress,
    // like dynamic content loading, animations, etc.
});