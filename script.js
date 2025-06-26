// Media files data
const mediaFiles = [
    { name: '269a.jpg', type: 'image', title: 'Beautiful Lion Portrait A' },
    { name: '269b.mp4', type: 'video', title: 'Lion in Motion B' },
    { name: '269c.mp4', type: 'video', title: 'Lion in Motion C' },
    { name: '269d.mp4', type: 'video', title: 'Lion in Motion D' },
    { name: '269e.mp4', type: 'video', title: 'Lion in Motion E' },
    { name: '269f.mp4', type: 'video', title: 'Lion in Motion F' },
    { name: '269g.mp4', type: 'video', title: 'Lion in Motion G' },
    { name: '269h.jpg', type: 'image', title: 'Beautiful Lion Portrait H' },
    { name: '269i.jpg', type: 'image', title: 'Beautiful Lion Portrait I' },
    { name: '269j.mp4', type: 'video', title: 'Lion in Motion J' }
];

// DOM elements
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.getElementById('closeModal');
const loading = document.getElementById('loading');
const filterButtons = document.querySelectorAll('.filter-btn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentIndexEl = document.getElementById('currentIndex');
const totalCountEl = document.getElementById('totalCount');
const modalIndicators = document.getElementById('modalIndicators');

// State
let currentFilter = 'all';
let currentModalIndex = 0;
let filteredMediaFiles = [...mediaFiles];
let isAutoPlaying = false;
let touchStartX = 0;
let touchEndX = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    setupEventListeners();
    hideLoading();
});

// Create gallery items
function initializeGallery() {
    gallery.innerHTML = '';
    
    mediaFiles.forEach((file, index) => {
        const mediaItem = createMediaItem(file, index);
        gallery.appendChild(mediaItem);
    });
}

// Create individual media item
function createMediaItem(file, index) {
    const mediaItem = document.createElement('div');
    mediaItem.className = `media-item ${file.type}`;
    mediaItem.setAttribute('data-type', file.type);
    
    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'media-wrapper';
    
    let mediaElement;
    if (file.type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = file.name;
        mediaElement.alt = file.title;
        mediaElement.loading = 'lazy';
    } else {
        mediaElement = document.createElement('video');
        mediaElement.src = file.name;
        mediaElement.muted = true;
        mediaElement.preload = 'metadata';
        
        // Add play overlay for videos
        const playOverlay = document.createElement('div');
        playOverlay.className = 'play-overlay';
        playOverlay.innerHTML = '▶';
        mediaWrapper.appendChild(playOverlay);
    }
    
    mediaWrapper.appendChild(mediaElement);
    
    const mediaInfo = document.createElement('div');
    mediaInfo.className = 'media-info';
    
    const mediaTitle = document.createElement('h3');
    mediaTitle.className = 'media-title';
    mediaTitle.textContent = file.title;
    
    const mediaType = document.createElement('span');
    mediaType.className = `media-type ${file.type}`;
    mediaType.textContent = file.type;
    
    mediaInfo.appendChild(mediaTitle);
    mediaInfo.appendChild(mediaType);
    
    mediaItem.appendChild(mediaWrapper);
    mediaItem.appendChild(mediaInfo);
    
    // Add click event to open modal
    mediaItem.addEventListener('click', () => openModal(file, index));
    
    return mediaItem;
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
            filterMedia(filter);
        });
    });
    
    // Modal close events
    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
    
    // Modal navigation buttons
    prevBtn.addEventListener('click', showPrevMedia);
    nextBtn.addEventListener('click', showNextMedia);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModalHandler();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    showPrevMedia();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    showNextMedia();
                    break;
            }
        }
    });
    
    // Touch/swipe events for modal
    modalMedia.addEventListener('touchstart', handleTouchStart, { passive: true });
    modalMedia.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Mouse drag events for modal (optional)
    let isMouseDown = false;
    let mouseStartX = 0;
    
    modalMedia.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        mouseStartX = e.clientX;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isMouseDown && modal.style.display === 'block') {
            e.preventDefault();
        }
    });
    
    document.addEventListener('mouseup', function(e) {
        if (isMouseDown && modal.style.display === 'block') {
            const mouseEndX = e.clientX;
            const diff = mouseStartX - mouseEndX;
            
            if (Math.abs(diff) > 100) { // Minimum swipe distance
                if (diff > 0) {
                    showNextMedia();
                } else {
                    showPrevMedia();
                }
            }
        }
        isMouseDown = false;
    });
    
    // Handle video hover effects
    document.addEventListener('mouseover', function(e) {
        if (e.target.tagName === 'VIDEO' && e.target.closest('.media-item')) {
            e.target.currentTime = 0;
            e.target.play().catch(() => {
                // Handle autoplay restrictions
            });
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.tagName === 'VIDEO' && e.target.closest('.media-item')) {
            e.target.pause();
            e.target.currentTime = 0;
        }
    });
}

// Set active filter button
function setActiveFilter(filter) {
    filterButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-filter') === filter) {
            button.classList.add('active');
        }
    });
    currentFilter = filter;
}

// Filter media items
function filterMedia(filter) {
    const mediaItems = document.querySelectorAll('.media-item');
    
    // Update filtered media files array
    if (filter === 'all') {
        filteredMediaFiles = [...mediaFiles];
    } else if (filter === 'images') {
        filteredMediaFiles = mediaFiles.filter(file => file.type === 'image');
    } else if (filter === 'videos') {
        filteredMediaFiles = mediaFiles.filter(file => file.type === 'video');
    }
    
    mediaItems.forEach(item => {
        const itemType = item.getAttribute('data-type');
        
        if (filter === 'all') {
            item.classList.remove('hidden');
            item.style.animation = 'fadeIn 0.5s ease-in-out';
        } else if (filter === 'images' && itemType === 'image') {
            item.classList.remove('hidden');
            item.style.animation = 'fadeIn 0.5s ease-in-out';
        } else if (filter === 'videos' && itemType === 'video') {
            item.classList.remove('hidden');
            item.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            item.classList.add('hidden');
        }
    });
    
    // Update total count in modal
    updateModalIndicators();
}

// Open modal with media
function openModal(file, index) {
    // Find the index in filtered media files
    currentModalIndex = filteredMediaFiles.findIndex(f => f.name === file.name);
    if (currentModalIndex === -1) currentModalIndex = 0;
    
    updateModalContent();
    updateModalIndicators();
    updateNavigationButtons();
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.transition = 'opacity 0.3s ease-in-out';
        modal.style.opacity = '1';
    }, 10);
}

// Update modal content
function updateModalContent() {
    const file = filteredMediaFiles[currentModalIndex];
    if (!file) return;
    
    modalMedia.innerHTML = '';
    
    let mediaElement;
    if (file.type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = file.name;
        mediaElement.alt = file.title;
    } else {
        mediaElement = document.createElement('video');
        mediaElement.src = file.name;
        mediaElement.controls = true;
        mediaElement.autoplay = true;
        mediaElement.muted = false;
        
        // Add event listener for auto-advance when video ends
        mediaElement.addEventListener('ended', function() {
            if (currentModalIndex < filteredMediaFiles.length - 1) {
                setTimeout(() => {
                    showNextMedia();
                }, 1000); // Wait 1 second before auto-advancing
            }
        });
    }
    
    modalMedia.appendChild(mediaElement);
    modalTitle.textContent = file.title;
    modalDescription.textContent = `${file.type === 'image' ? 'Image' : 'Video'} file: ${file.name}`;
    
    // Update counter
    currentIndexEl.textContent = currentModalIndex + 1;
    totalCountEl.textContent = filteredMediaFiles.length;
}

// Show previous media
function showPrevMedia() {
    if (currentModalIndex > 0) {
        slideToMedia(currentModalIndex - 1, 'right');
    }
}

// Show next media
function showNextMedia() {
    if (currentModalIndex < filteredMediaFiles.length - 1) {
        slideToMedia(currentModalIndex + 1, 'left');
    }
}

// Slide to specific media with animation
function slideToMedia(newIndex, direction) {
    const modalMediaEl = modalMedia;
    
    // Add slide-out animation
    modalMediaEl.classList.add(`slide-out-${direction}`);
    
    setTimeout(() => {
        currentModalIndex = newIndex;
        updateModalContent();
        updateNavigationButtons();
        updateIndicatorDots();
        
        // Reset and add slide-in animation
        modalMediaEl.classList.remove(`slide-out-${direction}`);
        modalMediaEl.classList.add(`slide-in-${direction === 'left' ? 'right' : 'left'}`);
        
        setTimeout(() => {
            modalMediaEl.classList.remove(`slide-in-${direction === 'left' ? 'right' : 'left'}`);
        }, 300);
    }, 300);
}

// Update navigation buttons state
function updateNavigationButtons() {
    prevBtn.disabled = currentModalIndex === 0;
    nextBtn.disabled = currentModalIndex === filteredMediaFiles.length - 1;
}

// Update modal indicators
function updateModalIndicators() {
    modalIndicators.innerHTML = '';
    
    filteredMediaFiles.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        if (index === currentModalIndex) {
            dot.classList.add('active');
        }
        
        dot.addEventListener('click', () => {
            if (index !== currentModalIndex) {
                const direction = index > currentModalIndex ? 'left' : 'right';
                slideToMedia(index, direction);
            }
        });
        
        modalIndicators.appendChild(dot);
    });
}

// Update indicator dots without recreating them
function updateIndicatorDots() {
    const dots = modalIndicators.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentModalIndex);
    });
}

// Close modal
function closeModalHandler() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Stop any playing videos
        const video = modalMedia.querySelector('video');
        if (video) {
            video.pause();
        }
    }, 300);
}

// Hide loading screen
function hideLoading() {
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 1000);
}

// Add fade-in animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Add smooth scrolling behavior
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Error handling for media loading
function handleMediaError(mediaElement, file) {
    console.error(`Failed to load media: ${file.name}`);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'media-error';
    errorDiv.innerHTML = `
        <div class="error-icon">⚠️</div>
        <div class="error-text">Failed to load ${file.name}</div>
    `;
    
    mediaElement.parentNode.replaceChild(errorDiv, mediaElement);
}

// Add error handling to all media elements
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
        const mediaItem = e.target.closest('.media-item');
        if (mediaItem) {
            const fileName = e.target.src.split('/').pop();
            const file = mediaFiles.find(f => f.name === fileName);
            if (file) {
                handleMediaError(e.target, file);
            }
        }
    }
}, true);

// Performance optimization: Lazy loading for videos
function setupLazyLoading() {
    const videos = document.querySelectorAll('video[data-src]');
    
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    video.src = video.dataset.src;
                    video.removeAttribute('data-src');
                    videoObserver.unobserve(video);
                }
            });
        });
        
        videos.forEach(video => {
            videoObserver.observe(video);
        });
    }
}

// Touch handling functions
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipeGesture();
}

function handleSwipeGesture() {
    const swipeThreshold = 100; // Minimum distance for swipe
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - show next
            showNextMedia();
        } else {
            // Swiped right - show previous
            showPrevMedia();
        }
    }
}

// Initialize lazy loading
setupLazyLoading(); 