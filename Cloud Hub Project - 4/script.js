// Function to show a specific page
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');

    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.opacity = "0"; // Fade out effect
    });

    // Show the selected page with a fade-in effect
    setTimeout(() => {
        const newPage = document.getElementById(pageId);
        if (newPage) {
            newPage.classList.add('active');
            newPage.style.opacity = "1"; // Fade in effect
        } else {
            alert("Page not developed yet!"); // Show error for missing pages
        }
    }, 300); // Delay to match the transition duration
}

// Function to toggle subtopics visibility
function toggleSubtopics(moduleId) {
    const subtopics = document.getElementById(`subtopics-${moduleId}`);
    const expandIcon = document.querySelector(`.toc-item[onclick="toggleSubtopics(${moduleId})"] .expand-icon`);

    if (subtopics.style.display === "none" || subtopics.style.display === "") {
        subtopics.style.display = "block"; // Show subtopics
        expandIcon.textContent = "−"; // Change icon to minus
    } else {
        subtopics.style.display = "none"; // Hide subtopics
        expandIcon.textContent = "+"; // Change icon to plus
    }
}

// Function to handle navigation when clicking a module or subtopic
function navigateToPage(pageId) {
    const pageExists = document.getElementById(pageId);

    if (pageExists) {
        showPage(pageId);
    } else {
        alert("Page not developed yet!"); // Show error message
    }
}

// Attach click events to module names and subtopics
document.addEventListener("DOMContentLoaded", function () {
    // Attach event to modules for navigation
    document.querySelectorAll(".toc-item").forEach(item => {
        item.addEventListener("click", function (event) {
            if (event.target.classList.contains("expand-icon")) {
                return; // Prevent module navigation when clicking +
            }

            const pageId = this.getAttribute("data-page-id");
            if (pageId) {
                navigateToPage(pageId);
            }
        });
    });

    // Attach event to subtopics for navigation
    document.querySelectorAll(".subtopic-item").forEach(subtopic => {
        subtopic.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent module click event

            const pageId = this.getAttribute("data-page-id"); // Get correct submodule page ID
            if (pageId) {
                navigateToPage(pageId);
            }
        });
    });
});


