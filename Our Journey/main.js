// Intersection Observer for milestone animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all milestones
document.querySelectorAll('.milestone').forEach(milestone => {
    observer.observe(milestone);
});

// Add hover effects
document.querySelectorAll('.milestone').forEach(milestone => {
    milestone.addEventListener('mouseenter', () => {
        milestone.querySelector('.milestone-marker').style.transform = 'scale(1.1)';
    });

    milestone.addEventListener('mouseleave', () => {
        milestone.querySelector('.milestone-marker').style.transform = 'scale(1)';
    });
});

// Car animation
const car = document.querySelector('.car');
const milestoneMarkers = document.querySelectorAll('.milestone-marker');
const roadPath = document.querySelector('.road-line');

// Function to get point on curved path with offset
function getPointOnPath(t, offset = 0) {
    // First curve (0 to 0.5)
    if (t <= 0.5) {
        const normalizedT = t * 2;
        const x = (1 - normalizedT) * (1 - normalizedT) * 0 + 
                 2 * (1 - normalizedT) * normalizedT * 300 + 
                 normalizedT * normalizedT * 600;
        
        const y = (1 - normalizedT) * (1 - normalizedT) * 200 + 
                 2 * (1 - normalizedT) * normalizedT * 100 + 
                 normalizedT * normalizedT * 200;
        
        // Calculate normal vector for offset
        const dx = 2 * (1 - normalizedT) * (300 - 0) + 2 * normalizedT * (600 - 300);
        const dy = 2 * (1 - normalizedT) * (100 - 200) + 2 * normalizedT * (200 - 100);
        const len = Math.sqrt(dx * dx + dy * dy);
        
        return {
            x: x + (-dy / len) * offset,
            y: y + (dx / len) * offset
        };
    }
    // Second curve (0.5 to 1)
    else {
        const normalizedT = (t - 0.5) * 2;
        const x = (1 - normalizedT) * (1 - normalizedT) * 600 + 
                 2 * (1 - normalizedT) * normalizedT * 900 + 
                 normalizedT * normalizedT * 1200;
        
        const y = (1 - normalizedT) * (1 - normalizedT) * 200 + 
                 2 * (1 - normalizedT) * normalizedT * 300 + 
                 normalizedT * normalizedT * 200;
        
        // Calculate normal vector for offset
        const dx = 2 * (1 - normalizedT) * (900 - 600) + 2 * normalizedT * (1200 - 900);
        const dy = 2 * (1 - normalizedT) * (300 - 200) + 2 * normalizedT * (200 - 300);
        const len = Math.sqrt(dx * dx + dy * dy);
        
        return {
            x: x + (-dy / len) * offset,
            y: y + (dx / len) * offset
        };
    }
}

// Function to calculate car rotation based on path tangent
function getRotationAngle(t) {
    const delta = 0.01;
    const p1 = getPointOnPath(t);
    const p2 = getPointOnPath(Math.min(1, t + delta));
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
}

// Set initial car position
function setInitialCarPosition() {
    const point = getPointOnPath(0);
    const roadRect = roadPath.getBoundingClientRect();
    const scale = roadRect.width / 1200;

    car.style.left = `${point.x * scale}px`;
    car.style.top = `${point.y * scale}px`;
    car.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg)';
}

// Animate car movement
function animateCarToPosition(targetT) {
    const duration = 1000; // 1 second
    const startTime = performance.now();
    const startT = parseFloat(car.dataset.currentT || '0');
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth movement
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentT = startT + (targetT - startT) * eased;
        
        const point = getPointOnPath(currentT);
        const rotation = getRotationAngle(currentT);
        const roadRect = roadPath.getBoundingClientRect();
        const scale = roadRect.width / 1200;

        car.style.left = `${point.x * scale}px`;
        car.style.top = `${point.y * scale}px`;
        car.style.transform = `translateX(-50%) translateY(-50%) rotate(${rotation}deg)`;
        car.dataset.currentT = currentT.toString();

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Move car to milestone
function moveCarToMilestone(marker, index) {
    const targetT = index / (milestoneMarkers.length - 1);
    animateCarToPosition(targetT);
}

// Add click handlers to milestone markers
milestoneMarkers.forEach((marker, index) => {
    marker.addEventListener('click', () => {
        moveCarToMilestone(marker, index);
    });
});

// Initialize car position
window.addEventListener('load', setInitialCarPosition);
window.addEventListener('resize', setInitialCarPosition);

// Calculate and update milestone positions along the curve
function updateMilestonePositions() {
    const milestones = document.querySelectorAll('.milestone-marker');
    const totalMilestones = milestones.length;
    
    milestones.forEach((marker, index) => {
        const progress = index / (totalMilestones - 1);
        const yOffset = Math.sin(progress * Math.PI) * 50;
        marker.style.transform = `translateY(${yOffset}px)`;
    });
}

// Update positions on load and resize
window.addEventListener('load', updateMilestonePositions);
window.addEventListener('resize', updateMilestonePositions);