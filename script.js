const mediaFiles = [
    { name: '269a', type: 'image', title: 'Beautiful Lion Portrait A' },
    { name: '269b', type: 'video', title: 'Lion in Motion B' },
    { name: '269c', type: 'video', title: 'Lion in Motion C' },
    { name: '269d', type: 'video', title: 'Lion in Motion D' },
    { name: '269e', type: 'video', title: 'Lion in Motion E' },
    { name: '269f', type: 'video', title: 'Lion in Motion F' },
    { name: '269g', type: 'video', title: 'Lion in Motion G' },
    { name: '269h', type: 'image', title: 'Beautiful Lion Portrait H' },
    { name: '269i', type: 'image', title: 'Beautiful Lion Portrait I' },
    { name: '269j', type: 'video', title: 'Lion in Motion J' }
];

// DOM elements
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const loading = document.getElementById('loading');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentIndexEl = document.getElementById('currentIndex');
const totalCountEl = document.getElementById('totalCount');
const modalIndicators = document.getElementById('modalIndicators');

// State
let currentModalIndex = 0;
let hlsInstances = [];
let galleryHlsInstances = [];

// Initialize gallery
function initializeGallery() {
    hideLoading();
    renderGallery();
    setupEventListeners();
    updateTotalCount();
}

function renderGallery() {
    // Clean up previous gallery HLS instances
    cleanupGalleryHLS();
    
    gallery.innerHTML = '';
    
    mediaFiles.forEach((file, index) => {
        const mediaItem = createMediaItem(file, index);
        gallery.appendChild(mediaItem);
    });
}

function createMediaItem(file, index) {
    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    mediaItem.setAttribute('data-type', file.type);
    
    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'media-wrapper';
    
    let mediaElement;
    if (file.type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = `content/${file.name}.jpg`;
        mediaElement.alt = file.title;
    } else {
        // For video preview, create a video element and initialize HLS for preview
        mediaElement = document.createElement('video');
        mediaElement.id = `gallery-video-${index}`;
        mediaElement.muted = false;
        mediaElement.playsInline = true;
        mediaElement.preload = 'metadata';
        
        // Initialize HLS for gallery preview
        const source = `content/${file.name}/${file.name}.m3u8`;
        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: false,
                lowLatencyMode: false,
                autoStartLoad: true
            });
            hls.loadSource(source);
            hls.attachMedia(mediaElement);
            // Track gallery HLS instance
            galleryHlsInstances.push(hls);
        } else if (mediaElement.canPlayType("application/vnd.apple.mpegurl")) {
            mediaElement.src = source;
            galleryHlsInstances.push(null);
        }
        
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

function setupEventListeners() {
    // Modal controls
    closeModal.addEventListener('click', closeModalHandler);
    prevBtn.addEventListener('click', showPrevMedia);
    nextBtn.addEventListener('click', showNextMedia);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModalHandler();
                    break;
                case 'ArrowLeft':
                    showPrevMedia();
                    break;
                case 'ArrowRight':
                    showNextMedia();
                    break;
            }
        }
    });
    
    // Click outside modal to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
}

function updateTotalCount() {
    if (totalCountEl) {
        totalCountEl.textContent = mediaFiles.length;
    }
}

function openModal(file, index) {
    currentModalIndex = index;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    updateModalContent();
    updateModalIndicators();
    updateNavigationButtons();
    initializeSwiper();
}

function updateModalContent() {
    const file = mediaFiles[currentModalIndex];
    
    // Update modal title
    if (modalTitle) {
        modalTitle.textContent = file.title;
    }
    
    // Update counter
    if (currentIndexEl) {
        currentIndexEl.textContent = currentModalIndex + 1;
    }
    
    // Create swiper slides
    createSwiperSlides();
}

function createSwiperSlides() {
    const swiperWrap = document.querySelector('.swipe-wrap');
    swiperWrap.innerHTML = '';
    
    // Clear previous instances
    cleanupHLS();
    hlsInstances = [];
    
    mediaFiles.forEach((file, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        
        if (file.type === 'image') {
            const img = document.createElement('img');
            img.src = `content/${file.name}.jpg`;
            img.alt = file.title;
            img.id = `image${index}`;
            slide.appendChild(img);
        } else {
            const video = document.createElement('video');
            video.id = `video${index}`;
            video.muted = false;
            video.playsInline = true;
            video.controls = false;
            video.preload = 'metadata';
            
            const source = `content/${file.name}/${file.name}.m3u8`;
            
            slide.appendChild(video);
        }
        
        swiperWrap.appendChild(slide);
    });
}

function initializeSwiper() {
    // Destroy existing swiper if it exists
    if (window.mySwipe) {
        window.mySwipe = null;
    }
    
    window.mySwipe = new Swipe(document.getElementById("slider"), {
        startSlide: currentModalIndex,
        draggable: true,
        autoRestart: false,
        continuous: true,
        disableScroll: true,
        stopPropagation: true,
        callback: function (index, element) {
            currentModalIndex = index;
            updateModalInfo();
            updateNavigationButtons();
            updateModalIndicators();
            
            // Handle video playback
            handleVideoPlayback(index);
        },
        transitionEnd: function (index, element) {
            // Additional logic after transition
        },
    });
    
    // Initialize HLS for all videos
    initializeAllHLS();
    
    // Start playing current video if it's a video
    setTimeout(() => {
        handleVideoPlayback(currentModalIndex);
    }, 100);
}

function initializeAllHLS() {
    mediaFiles.forEach((file, index) => {
        if (file.type === 'video') {
            const video = document.getElementById(`video${index}`);
            const source = `content/${file.name}/${file.name}.m3u8`;
            
            if (Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: false,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                
                hls.loadSource(source);
                hls.attachMedia(video);
                
                hls.on(Hls.Events.ERROR, function (event, data) {
                    console.error(`HLS error for video ${index}:`, data);
                    if (data.fatal) {
                        switch(data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log('Fatal network error encountered, try to recover');
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log('Fatal media error encountered, try to recover');
                                hls.recoverMediaError();
                                break;
                            default:
                                console.log('Fatal error, cannot recover');
                                hls.destroy();
                                break;
                        }
                    }
                });
                
                hlsInstances.push(hls);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                // Fallback for Safari
                video.src = source;
                hlsInstances.push(null);
            } else {
                console.warn(`Video ${index}: HLS not supported and cannot play m3u8 files`);
                hlsInstances.push(null);
            }
            
            video.addEventListener("ended", function () {
                window.mySwipe.next();
            });
            
            video.addEventListener("loadedmetadata", function () {
                console.log(`Video ${index} metadata loaded`);
            });
            
            video.addEventListener("canplay", function () {
                console.log(`Video ${index} can start playing`);
            });
        }
    });
}

function handleVideoPlayback(index) {
    mediaFiles.forEach((file, i) => {
        if (file.type === 'video') {
            const video = document.getElementById(`video${i}`);
            if (i === index && video) {
                // Play current video
                if (video.paused) {
                    video.play().catch(e => {
                        console.log(`Could not play video ${i}:`, e);
                    });
                }
            } else if (video) {
                // Pause other videos
                if (!video.paused) {
                    video.pause();
                }
            }
        }
    });
}

function updateModalInfo() {
    const file = mediaFiles[currentModalIndex];
    if (modalTitle) {
        modalTitle.textContent = file.title;
    }
    if (currentIndexEl) {
        currentIndexEl.textContent = currentModalIndex + 1;
    }
}

function showPrevMedia() {
    if (window.mySwipe) {
        window.mySwipe.prev();
    }
}

function showNextMedia() {
    if (window.mySwipe) {
        window.mySwipe.next();
    }
}

function updateNavigationButtons() {
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentModalIndex === 0;
        nextBtn.disabled = currentModalIndex === mediaFiles.length - 1;
    }
}

function updateModalIndicators() {
    if (!modalIndicators) return;
    
    modalIndicators.innerHTML = '';
    
    mediaFiles.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        if (index === currentModalIndex) {
            dot.classList.add('active');
        }
        
        dot.addEventListener('click', () => {
            if (window.mySwipe) {
                window.mySwipe.slide(index);
            }
        });
        
        modalIndicators.appendChild(dot);
    });
}

function cleanupGalleryHLS() {
    // Cleanup gallery HLS instances
    galleryHlsInstances.forEach(hls => {
        if (hls) {
            hls.destroy();
        }
    });
    galleryHlsInstances = [];
}

function cleanupHLS() {
    // Cleanup previous HLS instances
    hlsInstances.forEach(hls => {
        if (hls) {
            hls.destroy();
        }
    });
    hlsInstances = [];
    
    // Pause all videos
    mediaFiles.forEach((file, index) => {
        if (file.type === 'video') {
            const video = document.getElementById(`video${index}`);
            if (video && !video.paused) {
                video.pause();
            }
        }
    });
}

function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Cleanup HLS and videos
    cleanupHLS();
    
    // Destroy swiper
    if (window.mySwipe) {
        window.mySwipe = null;
    }
}

function hideLoading() {
    if (loading) {
        loading.classList.add('hidden');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGallery);

// Add cleanup on page unload
window.addEventListener('beforeunload', function() {
    cleanupGalleryHLS();
    cleanupHLS();
});
