document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const fadeElements = document.querySelectorAll('.fade-in-out');
    const observerOptions = { threshold: [0, 0.1, 0.9, 1.0] };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const rect = entry.boundingClientRect;
            if (entry.isIntersecting) {
                if (entry.intersectionRatio > 0.1) {
                    entry.target.classList.add('visible');
                    entry.target.classList.remove('scrolled-out');
                }
            } else if (rect.top < 0) {
                entry.target.classList.add('scrolled-out');
                entry.target.classList.remove('visible');
            } else {
                entry.target.classList.remove('visible', 'scrolled-out');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // Counter Animation Logic
    const counters = document.querySelectorAll('.counter');
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = prefix + target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = prefix + Math.floor(current) + suffix;
            }
        }, stepTime);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // Robust Smooth Scroll & Course Pre-selection
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        // Handle Course Pre-selection
        const courseName = anchor.getAttribute('data-course');
        if (courseName) {
            const courseSelect = document.getElementById('course-select');
            if (courseSelect) {
                courseSelect.value = courseName;
            }
        }

        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Focus first input if targeting contact form
        if (targetId === '#contact') {
            setTimeout(() => {
                const firstInput = targetElement.querySelector('input[type="text"]');
                if (firstInput) firstInput.focus();
            }, 800);
        }
    });

    // Form Validation & WhatsApp Redirection
    const enrollForm = document.querySelector('.enroll-form');
    if (enrollForm) {
        enrollForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const data = {
                name: this.querySelector('input[type="text"]')?.value || "N/A",
                email: this.querySelector('input[type="email"]')?.value || "N/A",
                phone: this.querySelector('input[type="tel"]')?.value || "N/A",
                course: this.querySelector('select')?.value || ""
            };

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showFormMessage(this, 'Please enter a valid email address.', 'error');
                return;
            }

            if (!data.course) {
                showFormMessage(this, 'Please select a course.', 'error');
                return;
            }

            btn.disabled = true;
            btn.textContent = 'Redirecting...';

            const whatsappNumber = "923334574281";
            const message = `*NEW ENROLLMENT REQUEST*%0A%0A*Name:* ${data.name}%0A*Email:* ${data.email}%0A*Phone:* ${data.phone}%0A*Course:* ${data.course}%0A%0APlease guide me further.`;
            const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

            setTimeout(() => {
                showFormMessage(this, 'Success! Redirecting to WhatsApp...', 'success');
                window.open(waUrl, '_blank');
                this.reset();
                btn.disabled = false;
                btn.textContent = 'Enroll Now';
            }, 800);
        });
    }

    // Newsletter Logic
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            btn.disabled = true;
            btn.textContent = '...';
            setTimeout(() => {
                alert('Thank you for subscribing!');
                this.reset();
                btn.disabled = false;
                btn.textContent = 'Join Newsletter';
            }, 1000);
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');

            // Toggle body scroll
            document.body.style.overflow = isOpen ? 'hidden' : '';

            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';

                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});
// Function to handle Method section video play
function playMainVideo() {
    const driveVideoUrl = 'https://drive.google.com/file/d/1KQdtem6MY7qtPN9BdYsRF1cRlH356wbx/preview';
    openVideoModal(driveVideoUrl);
}

// Function to handle Interviews section video play (YouTube)
function playVideo(videoId) {
    const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    openVideoModal(youtubeUrl);
}

// Function for in-place video playback (Student Interviews)
let activeInterviewsCard = null;

function playInPlace(element) {
    const videoId = element.getAttribute('data-video-id');
    if (!videoId) return;

    // Reset previously playing card if it exists
    if (activeInterviewsCard && activeInterviewsCard !== element) {
        resetVideoCard(activeInterviewsCard);
    }

    // Save original thumbnail structure if not already saved
    if (!element.getAttribute('data-original-content')) {
        element.setAttribute('data-original-content', element.innerHTML);
    }

    // Extract thumbnail for poster (for local videos)
    const thumbDiv = element.querySelector('.video-thumb');
    let posterUrl = '';
    if (thumbDiv) {
        const bgImg = thumbDiv.style.backgroundImage;
        posterUrl = bgImg.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
    }

    // Determine source URL and playback method
    let contentHtml;
    if (videoId.endsWith('.mp4')) {
        // Local MP4 Video
        contentHtml = `
            <div style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 10; background: #000;">
                <video 
                    src="${videoId}" 
                    poster="${posterUrl}"
                    autoplay 
                    controls 
                    playsinline
                    style="width: 100%; height: 100%; object-fit: cover; display: block;">
                </video>
            </div>`;
        // Replace content for in-place playback
        element.innerHTML = contentHtml;
        element.onclick = null;
        element.style.cursor = 'default';
        activeInterviewsCard = element;
    } else if (videoId.length === 11) {
        // YouTube ID
        const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
        openVideoModal(videoUrl);
    } else {
        // Google Drive ID — open in modal for better playback
        const videoUrl = `https://drive.google.com/file/d/${videoId}/preview`;
        openVideoModal(videoUrl);
    }
}

function resetVideoCard(card) {
    const originalContent = card.getAttribute('data-original-content');
    if (originalContent) {
        card.innerHTML = originalContent;
        // Re-attach the click listener
        card.onclick = function () { playInPlace(this); };
        card.style.cursor = 'pointer';
    }
}



// Auto resize fix
window.addEventListener('resize', () => {
    // Other resize logic if needed
});


// Global UI Logic (Independent of Sliders)
document.addEventListener('DOMContentLoaded', () => {
    // Back to Top Logic
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form Validation & WhatsApp Redirection
    const enrollForm = document.querySelector('.enroll-form');
    if (enrollForm) {
        enrollForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button');

            // Explicitly selecting inputs to be more robust
            const nameInput = this.querySelector('input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const phoneInput = this.querySelector('input[type="tel"]');
            const courseSelect = this.querySelector('select');

            const name = nameInput ? nameInput.value : "N/A";
            const email = emailInput ? emailInput.value : "N/A";
            const phone = phoneInput ? phoneInput.value : "N/A";
            const course = courseSelect ? courseSelect.value : "N/A";

            // Simple Regex for validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\+?[\d\s-]{8,}$/;

            if (!emailRegex.test(email)) {
                showFormMessage(this, 'Please enter a valid email address.', 'error');
                return;
            }

            if (!phoneRegex.test(phone)) {
                showFormMessage(this, 'Please enter a valid phone number.', 'error');
                return;
            }

            if (!course || course === "") {
                showFormMessage(this, 'Please select a course.', 'error');
                return;
            }

            // Redirection logic
            btn.disabled = true;
            btn.textContent = 'Redirecting to WhatsApp...';

            const whatsappNumber = "923334574281";
            const message = `*NEW ENROLLMENT REQUEST*%0A%0A` +
                `*Name:* ${name}%0A` +
                `*Email:* ${email}%0A` +
                `*Phone:* ${phone}%0A` +
                `*Course:* ${course}%0A%0A` +
                `Please guide me with the next steps.`;

            const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

            setTimeout(() => {
                showFormMessage(this, 'Success! Redirecting you to WhatsApp...', 'success');
                window.open(waUrl, '_blank');
                this.reset();
                btn.disabled = false;
                btn.textContent = 'Enroll Now';
            }, 800);
        });
    }

    // Newsletter Logic
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            btn.disabled = true;
            btn.textContent = '...';

            setTimeout(() => {
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
                btn.disabled = false;
                btn.textContent = 'Join';
            }, 1000);
        });
    }
});

// Modal Logic
function openVideoModal(url) {
    const modal = document.getElementById('videoModal');
    const holder = document.getElementById('modal-iframe-holder');

    if (!modal || !holder) return;

    holder.innerHTML = `<iframe src="${url}" width="100%" height="100%" allow="autoplay" allowfullscreen frameborder="0"></iframe>`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const holder = document.getElementById('modal-iframe-holder');

    if (!modal || !holder) return;

    modal.classList.remove('active');
    setTimeout(() => {
        holder.innerHTML = ''; // Stop video
        document.body.style.overflow = ''; // Restore scroll
    }, 300);
}



// Helper to show messages (Globally accessible)
function showFormMessage(form, text, type) {
    let msg = form.querySelector('.form-message');
    if (!msg) {
        msg = document.createElement('div');
        msg.className = `form-message ${type}`;
        form.appendChild(msg);
    }
    msg.textContent = text;
    msg.className = `form-message ${type}`;
    msg.style.display = 'block';

    setTimeout(() => {
        msg.style.display = 'none';
    }, 5000);
}

// Certificate Slider Logic
let currentCertSlide = 0;
let certAutoPlay;

function moveCertSlider(direction) {
    const track = document.getElementById('cert-track');
    const cards = document.querySelectorAll('.cert-card');
    if (!track || cards.length === 0) return;

    const totalCards = cards.length;

    // Determine how many cards are visible based on screen width
    let visibleCards = 3;
    if (window.innerWidth <= 1024) visibleCards = 2;
    if (window.innerWidth <= 600) visibleCards = 1;

    const maxSlides = Math.max(0, totalCards - visibleCards);

    // Disable slider on mobile
    if (window.innerWidth <= 600) {
        track.style.transform = 'none';
        return;
    }

    currentCertSlide += direction;

    // Loop around
    if (currentCertSlide < 0) currentCertSlide = maxSlides;
    if (currentCertSlide > maxSlides) currentCertSlide = 0;

    const gap = window.innerWidth <= 600 ? 16 : 32;
    const cardWidth = cards[0].offsetWidth + gap;
    track.style.transform = `translateX(-${currentCertSlide * cardWidth}px)`;
}

function startCertAutoPlay() {
    stopCertAutoPlay();
    certAutoPlay = setInterval(() => {
        moveCertSlider(1);
    }, 4000); // Slide every 4 seconds
}

function stopCertAutoPlay() {
    if (certAutoPlay) clearInterval(certAutoPlay);
}

// Touch events for mobile swiping on certificates
const certContainer = document.querySelector('.cert-slider-container');
if (certContainer) {
    let touchStartX = 0;
    certContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopCertAutoPlay();
    }, { passive: true });

    certContainer.addEventListener('touchend', (e) => {
        let touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) moveCertSlider(1);
        if (touchEndX - touchStartX > 50) moveCertSlider(-1);
        startCertAutoPlay();
    }, { passive: true });
}

// Update the resize listener for the cert slider
window.addEventListener('resize', () => {
    currentCertSlide = 0;
    const certTrack = document.getElementById('cert-track');
    if (certTrack) {
        certTrack.style.transition = 'none';
        certTrack.style.transform = `translateX(0)`;
        setTimeout(() => certTrack.style.transition = '', 10);
    }
});

// Ramzan Popup Logic
function initRamdanPopup() {
    const popup = document.getElementById('ramdan-popup');
    const autoCloseTimer = document.getElementById('auto-close-timer');

    if (!popup) return;

    // Show popup
    setTimeout(() => {
        popup.classList.add('active');

        // Auto-close countdown (10 seconds)
        let timeLeft = 10;
        const autoCloseInterval = setInterval(() => {
            timeLeft -= 1;
            if (autoCloseTimer) autoCloseTimer.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(autoCloseInterval);
                closeRamdanPopup();
            }
        }, 1000);
    }, 1000);

    // Countdown to Eid (March 30, 2025)
    // Adjust target date as needed
    const ramdanEndDate = new Date("March 20, 2026 00:00:00").getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = ramdanEndDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (document.getElementById("days")) {
            document.getElementById("days").innerText = days.toString().padStart(2, '0');
            document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
            document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
        }

        if (distance < 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);
}

function closeRamdanPopup() {
    const popup = document.getElementById('ramdan-popup');
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 500);
    }
}

// Ensure initRamdanPopup runs on load
document.addEventListener('DOMContentLoaded', () => {
    initRamdanPopup();
});
