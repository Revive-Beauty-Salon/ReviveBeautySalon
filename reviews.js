// Reviews functionality
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    const userReviewsSection = document.getElementById('userReviewsSection');
    const userReviewsGrid = document.getElementById('userReviewsGrid');

    // Load existing reviews from localStorage
    loadUserReviews();

    // Handle form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(reviewForm);
            const reviewData = {
                id: Date.now().toString(),
                name: formData.get('reviewerName'),
                service: formData.get('reviewService'),
                rating: parseInt(formData.get('rating')),
                text: formData.get('reviewText'),
                date: new Date().toLocaleDateString(),
                timestamp: Date.now()
            };

            // Save review to localStorage
            saveReview(reviewData);
            
            // Display success message
            showSuccessMessage();
            
            // Reset form
            reviewForm.reset();
            
            // Reload reviews
            loadUserReviews();
        });
    }

    function saveReview(reviewData) {
        let reviews = JSON.parse(localStorage.getItem('reviveReviews') || '[]');
        reviews.unshift(reviewData); // Add to beginning of array
        
        // Keep only the latest 20 reviews
        if (reviews.length > 20) {
            reviews = reviews.slice(0, 20);
        }
        
        localStorage.setItem('reviveReviews', JSON.stringify(reviews));
    }

    function loadUserReviews() {
        const reviews = JSON.parse(localStorage.getItem('reviveReviews') || '[]');
        
        if (reviews.length === 0) {
            userReviewsSection.style.display = 'none';
            return;
        }

        userReviewsSection.style.display = 'block';
        userReviewsGrid.innerHTML = '';

        reviews.forEach((review, index) => {
            const reviewCard = createReviewCard(review, index === 0);
            userReviewsGrid.appendChild(reviewCard);
        });
    }

    function createReviewCard(review, isNew = false) {
        const card = document.createElement('div');
        card.className = `user-review-card ${isNew ? 'new-review' : ''}`;
        
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        card.innerHTML = `
            <div class="user-review-header">
                <div class="user-client-info">
                    <h4>${escapeHtml(review.name)}</h4>
                    <div class="user-review-stars">${stars}</div>
                </div>
                <div class="user-review-service">${escapeHtml(review.service)}</div>
            </div>
            <div class="user-review-content">
                <p>"${escapeHtml(review.text)}"</p>
            </div>
            <div class="user-review-date">${review.date}</div>
        `;
        
        return card;
    }

    function showSuccessMessage() {
        // Create success message overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const message = document.createElement('div');
        message.style.cssText = `
            background: var(--primary-green);
            color: var(--white);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border: 2px solid var(--golden);
            max-width: 400px;
            margin: 20px;
        `;

        message.innerHTML = `
            <div style="color: var(--golden); font-size: 3rem; margin-bottom: 20px;">✓</div>
            <h3 style="color: var(--golden); margin-bottom: 15px;">Thank You!</h3>
            <p>Your review has been submitted successfully and will appear on our website.</p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="margin-top: 20px; background: var(--golden); color: var(--primary-green); 
                           border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; 
                           font-weight: 600;">Close</button>
        `;

        overlay.appendChild(message);
        document.body.appendChild(overlay);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.remove();
            }
        }, 3000);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Rating stars interaction
    const ratingInputs = document.querySelectorAll('.rating-input input[type="radio"]');
    const ratingStars = document.querySelectorAll('.rating-input .star');

    ratingStars.forEach((star, index) => {
        star.addEventListener('mouseover', function() {
            highlightStars(index);
        });

        star.addEventListener('click', function() {
            const ratingValue = 5 - index;
            document.querySelector(`input[name="rating"][value="${ratingValue}"]`).checked = true;
            highlightStars(index);
        });
    });

    function highlightStars(index) {
        ratingStars.forEach((star, i) => {
            if (i <= index) {
                star.style.color = 'var(--golden)';
            } else {
                star.style.color = 'var(--light-green)';
            }
        });
    }

    // Reset star colors on mouse leave
    const ratingContainer = document.querySelector('.rating-input');
    if (ratingContainer) {
        ratingContainer.addEventListener('mouseleave', function() {
            const checkedInput = document.querySelector('input[name="rating"]:checked');
            if (checkedInput) {
                const checkedIndex = 5 - parseInt(checkedInput.value);
                highlightStars(checkedIndex);
            } else {
                ratingStars.forEach(star => {
                    star.style.color = 'var(--light-green)';
                });
            }
        });
    }
});