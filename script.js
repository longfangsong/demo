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

// State
let currentFilter = 'all';

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
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalHandler();
        }
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
}

// Open modal with media
function openModal(file, index) {
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
        mediaElement.loop = true;
    }
    
    modalMedia.appendChild(mediaElement);
    modalTitle.textContent = file.title;
    modalDescription.textContent = `${file.type === 'image' ? 'Image' : 'Video'} file: ${file.name}`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.transition = 'opacity 0.3s ease-in-out';
        modal.style.opacity = '1';
    }, 10);
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

// Initialize lazy loading
setupLazyLoading(); 