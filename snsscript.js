let currentSlide = 0;
let autoSlideInterval;
let slidePixelWidth = 0;
const carouselTrack = document.getElementById('carousel-track');
const carouselViewport = document.getElementById('carousel-viewport');
const slides = carouselTrack ? carouselTrack.children : [];
const totalSlides = slides.length;
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const dotsContainer = document.getElementById('carousel-dots');
const carousel = document.getElementById('carousel');
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const modal = document.getElementById('portfolio-modal');
const modalTitle = document.getElementById('modal-title-text');
const modalWrapper = document.getElementById('modal-content-wrapper');

function syncCarouselLayout() {
    if (!carouselTrack || !carouselViewport || !totalSlides) {
        return;
    }

    slidePixelWidth = carouselViewport.getBoundingClientRect().width;

    Array.from(slides).forEach((slide) => {
        slide.style.flex = `0 0 ${slidePixelWidth}px`;
        slide.style.minWidth = `${slidePixelWidth}px`;
        slide.style.maxWidth = `${slidePixelWidth}px`;
    });

    carouselTrack.style.width = `${slidePixelWidth * totalSlides}px`;
}

function updateCarousel() {
    if (!carouselTrack || !dotsContainer || !totalSlides) {
        return;
    }

    if (!slidePixelWidth) {
        syncCarouselLayout();
    }

    carouselTrack.style.transform = `translate3d(-${currentSlide * slidePixelWidth}px, 0, 0)`;
    
    const dots = dotsContainer.querySelectorAll('button');
    dots.forEach((dot, index) => {
        dot.style.background = index === currentSlide ? '#5C8061' : '#8CB092';
        dot.style.width = index === currentSlide ? '12px' : '10px';
        dot.style.height = index === currentSlide ? '12px' : '10px';
    });
}

function nextSlide() {
    if (!totalSlides) {
        return;
    }

    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    if (!totalSlides) {
        return;
    }

    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function startAutoSlide() {
    if (!totalSlides) {
        return;
    }

    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 4000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

if (carouselTrack && prevBtn && nextBtn && dotsContainer && carousel) {
    prevBtn.addEventListener('click', () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });
    nextBtn.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.borderRadius = '50%';
        dot.style.background = '#8CB092';
        dot.style.border = 'none';
        dot.style.cursor = 'pointer';
        dot.style.transition = 'all 0.3s';
        dot.addEventListener('click', () => {
            stopAutoSlide();
            currentSlide = i;
            updateCarousel();
            startAutoSlide();
        });
        dotsContainer.appendChild(dot);
    }

    syncCarouselLayout();
    updateCarousel();
    startAutoSlide();
    window.addEventListener('resize', () => {
        syncCarouselLayout();
        updateCarousel();
    });

    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
}

function setMobileMenuState(isOpen) {
    if (!mobileMenu || !mobileMenuBtn) {
        return;
    }

    mobileMenu.classList.toggle('hidden', !isOpen);
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));

    if (mobileMenuIcon) {
        mobileMenuIcon.classList.toggle('ph-list', !isOpen);
        mobileMenuIcon.classList.toggle('ph-x', isOpen);
    }

    document.body.classList.toggle('mobile-menu-open', isOpen);
}

if (mobileMenuBtn && mobileMenu) {
    setMobileMenuState(false);

    mobileMenuBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = mobileMenu.classList.contains('hidden');
        setMobileMenuState(isOpen);
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            setMobileMenuState(false);
        });
    });

    document.addEventListener('click', (event) => {
        if (
            !mobileMenu.classList.contains('hidden') &&
            !mobileMenu.contains(event.target) &&
            !mobileMenuBtn.contains(event.target)
        ) {
            setMobileMenuState(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            setMobileMenuState(false);
        }
    });
}

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
            navbar.classList.replace('bg-brand-pink/90', 'bg-white/95');
        } else {
            navbar.classList.remove('shadow-md');
            navbar.classList.replace('bg-white/95', 'bg-brand-pink/90');
        }
    });
}

function openModal(categoryName) {
    if (!modal || !modalTitle || !modalWrapper) {
        return;
    }

    modalTitle.textContent = categoryName + " Designs";
    modal.classList.remove('hidden');
    
    modalWrapper.classList.remove('modal-enter-active');
    void modalWrapper.offsetWidth; 
    modalWrapper.classList.add('modal-enter-active');

    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal || !modalWrapper) {
        return;
    }

    modalWrapper.classList.remove('modal-enter-active');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') {
        return;
    }

    if (modal && !modal.classList.contains('hidden')) {
        closeModal();
    }

    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        setMobileMenuState(false);
    }
});
