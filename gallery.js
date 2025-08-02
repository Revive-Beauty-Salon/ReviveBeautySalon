// Gallery JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button  
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });

    // Initialize gallery items with animation
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Review category tabs functionality (if on reviews page)
    const tabButtons = document.querySelectorAll('.tab-button');
    const reviewCards = document.querySelectorAll('.review-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            
            reviewCards.forEach(card => {
                const cardService = card.querySelector('.review-service');
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    const serviceText = cardService ? cardService.textContent.toLowerCase() : '';
                    if (serviceText.includes(category.toLowerCase())) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
});

// Lightbox functionality
function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    lightboxImage.src = imgElement.src;
    lightboxImage.alt = imgElement.alt;
    lightbox.style.display = 'block';
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
    
    // Add keyboard support
    document.addEventListener('keydown', handleLightboxKeydown);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    
    // Remove keyboard support
    document.removeEventListener('keydown', handleLightboxKeydown);
}

function handleLightboxKeydown(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
}

// Close lightbox when clicking outside the image
document.addEventListener('click', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Gallery masonry layout (optional enhancement)
function initMasonryLayout() {
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;

    // Simple masonry-like effect with CSS Grid
    const galleryItems = gallery.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img.complete) {
            setItemHeight(item, img);
        } else {
            img.addEventListener('load', () => setItemHeight(item, img));
        }
    });
}

function setItemHeight(item, img) {
    const aspectRatio = img.naturalHeight / img.naturalWidth;
    const baseHeight = 300;
    
    if (aspectRatio > 1.3) {
        item.style.gridRowEnd = 'span 2';
    } else if (aspectRatio < 0.7) {
        item.style.gridRowEnd = 'span 1';
    }
}

// Initialize masonry layout when DOM is loaded
document.addEventListener('DOMContentLoaded', initMasonryLayout);

// Reinitialize after window resize
window.addEventListener('resize', debounce(initMasonryLayout, 250));

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}