// Header scroll effect
const header = document.querySelector('.main-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Hide/show header on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Burger menu functionality
const burgerMenu = document.querySelector('.burger-menu');
const navList = document.querySelector('.nav-list');
const body = document.body;

// Create menu background element
const menuBg = document.createElement('div');
menuBg.classList.add('menu-bg');
document.body.appendChild(menuBg);

function toggleMenu() {
    burgerMenu.classList.toggle('active');
    navList.classList.toggle('active');
    body.classList.toggle('menu-open');
}

burgerMenu.addEventListener('click', toggleMenu);

// Close menu when clicking on a link
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navList.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (entry.target.classList.contains('counter')) {
                startCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.animate-fade-up, .animate-fade-in, .feature-card, .service-item').forEach(el => {
    observer.observe(el);
});

// Enhanced slider functionality
class Slider {
    constructor(sliderSelector) {
        this.slider = document.querySelector(sliderSelector);
        if (!this.slider) return;

        this.sliderContainer = this.slider.querySelector('.slider-container');
        this.slides = this.slider.querySelectorAll('.slide');
        this.prevBtn = this.slider.querySelector('.slider-btn.prev');
        this.nextBtn = this.slider.querySelector('.slider-btn.next');
        
        this.currentSlide = 0;
        this.slidesCount = this.slides.length;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        if (this.slidesCount <= 1) return;

        // Clone first and last slides
        const firstClone = this.slides[0].cloneNode(true);
        const lastClone = this.slides[this.slidesCount - 1].cloneNode(true);
        this.sliderContainer.appendChild(firstClone);
        this.sliderContainer.insertBefore(lastClone, this.slides[0]);

        // Update slides collection and count
        this.slides = this.slider.querySelectorAll('.slide');
        this.slidesCount = this.slides.length;

        // Set initial position
        this.currentSlide = 1;
        this.updateSlidePosition();

        // Event listeners
        this.prevBtn?.addEventListener('click', () => this.showSlide('prev'));
        this.nextBtn?.addEventListener('click', () => this.showSlide('next'));
        
        // Touch events
        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.slider.addEventListener('touchmove', (e) => {
            if (!this.touchStartX) return;
            
            const touch = e.touches[0];
            const diff = this.touchStartX - touch.clientX;
            
            // Prevent vertical scrolling when swiping
            if (Math.abs(diff) > 5) {
                e.preventDefault();
            }
        }, { passive: false });

        this.slider.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            
            const diff = this.touchStartX - this.touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.showSlide('next');
                } else {
                    this.showSlide('prev');
                }
            }
            
            this.touchStartX = null;
            this.touchEndX = null;
        }, { passive: true });

        // Auto play with pause on hover
        this.startAutoPlay();
        
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    updateSlidePosition(animate = true) {
        const offset = -this.currentSlide * 100;
        this.sliderContainer.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        this.sliderContainer.style.transform = `translateX(${offset}%)`;
    }

    showSlide(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        if (direction === 'next') {
            this.currentSlide++;
        } else {
            this.currentSlide--;
        }

        this.updateSlidePosition();

        // Handle infinite scroll
        setTimeout(() => {
            if (this.currentSlide === this.slidesCount - 1) {
                this.currentSlide = 1;
                this.updateSlidePosition(false);
            } else if (this.currentSlide === 0) {
                this.currentSlide = this.slidesCount - 2;
                this.updateSlidePosition(false);
            }
            this.isAnimating = false;
        }, 500);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.showSlide('next'), 5000);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

// Parallax effect
const parallaxElements = document.querySelectorAll('.parallax');

window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const rect = element.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
    });
});

// Gallery filter functionality
const initGalleryFilter = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Add animation classes for smooth transitions
            galleryItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });

            setTimeout(() => {
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.classList.add('hidden');
                    }
                });
            }, 300);
        });
    });
};

// Load more functionality
const initLoadMore = () => {
    const loadMoreBtn = document.querySelector('.gallery-load-more .btn');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (!loadMoreBtn || !galleryGrid) return;

    let currentPage = 1;
    const itemsPerPage = 6;
    const totalItems = document.querySelectorAll('.gallery-item').length;

    const updateLoadMoreVisibility = () => {
        if (currentPage * itemsPerPage >= totalItems) {
            loadMoreBtn.style.display = 'none';
        }
    };

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        const start = (currentPage - 1) * itemsPerPage;
        const end = currentPage * itemsPerPage;

        const items = document.querySelectorAll('.gallery-item.hidden');
        items.forEach((item, index) => {
            if (index >= start && index < end) {
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });

        updateLoadMoreVisibility();
    });

    // Initial check
    updateLoadMoreVisibility();
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize showcase slider
    const showcaseSlider = document.querySelector('.showcase-slider');
    if (showcaseSlider) {
        const slider = new Slider('.showcase-slider');
        
        // Add click events for navigation buttons
        const prevBtn = showcaseSlider.parentElement.querySelector('.slider-btn.prev');
        const nextBtn = showcaseSlider.parentElement.querySelector('.slider-btn.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => slider.showSlide('prev'));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => slider.showSlide('next'));
        }
    }

    // Add animation classes
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-fade-up');
    });

    document.querySelectorAll('.service-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.3}s`;
        item.classList.add('animate-fade-in');
    });

    // Initialize gallery functionality
    initGalleryFilter();
    initLoadMore();
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Validate form data
            if (validateForm(formObject)) {
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';

                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    // Reset form
                    contactForm.reset();
                    
                    // Redirect to thank you page
                    window.location.href = 'thanks.html';
                }, 1500);
            }
        });
    }
});

// Form validation
function validateForm(data) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    // Clear previous error messages
    clearErrors();

    // Validate name
    if (!data.name || data.name.trim().length < 3) {
        showError('name', 'Por favor, insira um nome válido');
        isValid = false;
    }

    // Validate email
    if (!emailRegex.test(data.email)) {
        showError('email', 'Por favor, insira um email válido');
        isValid = false;
    }

    // Validate phone
    if (!phoneRegex.test(data.phone)) {
        showError('phone', 'Por favor, insira um telefone válido');
        isValid = false;
    }

    // Validate service selection
    if (!data.service) {
        showError('service', 'Por favor, selecione um serviço');
        isValid = false;
    }

    // Validate message
    if (!data.message || data.message.trim().length < 10) {
        showError('message', 'Por favor, insira uma mensagem com pelo menos 10 caracteres');
        isValid = false;
    }

    return isValid;
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc3545';
}

// Clear all error messages
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formInputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 2) {
                value = value.replace(/^(\d{2})/, '($1)');
            } else if (value.length <= 7) {
                value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else {
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }
        e.target.value = value;
    });
} 