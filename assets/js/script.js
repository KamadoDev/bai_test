(function () {
    "use strict";

    // Khởi tạo ứng dụng
    function initApp() {
        console.log("Script initialized");
        
        // Các hàm khởi tạo
        initSmoothScroll();
        initMobileMenu();
        initModals();
        initFAQAccordion();
        initContactForm();
        initSocialButtons();
        initScrollToTop();
        initFixedCallButton();
        initScrollAnimations();
    }

    // 1. Smooth scrolling cho navigation links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute("href"));
                target?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    }

    // 2. Mobile Menu
    function initMobileMenu() {
        const menu = document.querySelector(".nav-links");
        const menuToggle = document.querySelector(".menu-toggle");
        const menuOverlay = document.querySelector(".menu-overlay");

        if (!menuToggle || !menu || !menuOverlay) return;

        const toggleMenu = () => {
            const isActive = !menu.classList.contains("is-active");
            menu.classList.toggle("is-active", isActive);
            menuToggle.classList.toggle("is-active", isActive);
            menuOverlay.classList.toggle("is-active", isActive);
            menuToggle.setAttribute("aria-expanded", isActive);
        };

        menuToggle.addEventListener("click", toggleMenu);
        menuOverlay.addEventListener("click", toggleMenu);
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // 3. Xử lý tất cả modal (project modal, success modal)
    function initModals() {
        // Project Modal với Swiper
        const projectModal = document.getElementById('projectModal');
        if (projectModal) {
            const projectSwiper = new Swiper('.project-swiper', {
                pagination: { el: '.swiper-pagination', type: 'fraction' },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                loop: false,
                keyboard: { enabled: true }
            });

            document.querySelectorAll('.js-open-modal').forEach(project => {
                project.addEventListener('click', function () {
                    const images = this.getAttribute('data-img-src')?.split(',').map(img => img.trim()) || [];
                    projectSwiper.removeAllSlides();
                    images.forEach(image => {
                        projectSwiper.appendSlide(`
                            <div class="swiper-slide">
                                <img src="${image}" alt="Hình ảnh dự án">
                            </div>
                        `);
                    });
                    projectModal.classList.add('active');
                    projectSwiper.update().slideTo(0);
                });
            });

            // Đóng modal
            document.getElementById('closeModal')?.addEventListener('click', () => {
                projectModal.classList.remove('active');
            });
        }

        // Xử lý chung cho tất cả modal
        document.querySelectorAll('.modal').forEach(modal => {
            // Đóng khi click bên ngoài
            modal.addEventListener('click', function (e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });

            // Đóng bằng phím ESC
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    // 4. FAQ Accordion
    function initFAQAccordion() {
        document.querySelectorAll(".faq-item").forEach(item => {
            item.querySelector(".faq-question")?.addEventListener("click", () => {
                document.querySelector(".faq-item.active")?.classList.remove("active");
                item.classList.toggle("active");
            });
        });
    }

    // 5. Contact Form
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form-main');
        const successModal = document.getElementById('success-modal');

        if (!contactForm || !successModal) return;

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Giả lập gửi form thành công
            successModal.classList.add('active');
            this.reset();
        });
    }

    // 6. Social Buttons
    function initSocialButtons() {
        const socialButtons = document.querySelector('.fixed-social-buttons');
        if (socialButtons) {
            setTimeout(() => {
                socialButtons.classList.add('loaded');
            }, 1000);
        }
    }

    // 7. Scroll to Top Button
    function initScrollToTop() {
        const scrollToTopBtn = document.getElementById("scrollToTopBtn");
        if (!scrollToTopBtn) return;

        const toggleVisibility = () => {
            scrollToTopBtn.classList.toggle("visible", window.pageYOffset > 300);
        };

        toggleVisibility();
        window.addEventListener("scroll", toggleVisibility);
        
        scrollToTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            
            // Hiệu ứng nhấn
            scrollToTopBtn.classList.add("clicked");
            setTimeout(() => scrollToTopBtn.classList.remove("clicked"), 300);
        });
    }

    // 8. Fixed Call Button (Mobile Only)
    function initFixedCallButton() {
        const fixedCallBtn = document.querySelector(".fixed-call-btn");
        const heroSection = document.querySelector(".hero");

        if (!fixedCallBtn || !heroSection) return;

        const toggleCallButton = () => {
            const shouldShow = window.innerWidth <= 768 && 
                              window.pageYOffset > heroSection.offsetHeight * 0.75;
            fixedCallBtn.classList.toggle("visible", shouldShow);
        };

        toggleCallButton();
        window.addEventListener("scroll", toggleCallButton);
        window.addEventListener("resize", toggleCallButton);
        
        fixedCallBtn.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 200);
        });
    }

    // 9. Scroll-triggered Animations
    function initScrollAnimations() {
        const fadeSelectors = [
            'fade-in',
            'fade-in-left', 
            'fade-in-right',
            'fade-in-scale'
        ].map(cls => `.${cls}`).join(', ');

        const elements = document.querySelectorAll(fadeSelectors);
        if (elements.length === 0) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -150px 0px' });

            elements.forEach(el => observer.observe(el));
        } else {
            // Fallback cho trình duyệt cũ
            const checkElements = () => {
                elements.forEach(el => {
                    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                        el.classList.add('visible');
                    }
                });
            };

            checkElements();
            window.addEventListener('scroll', () => {
                setTimeout(checkElements, 50);
            });
        }
    }

    // Khởi chạy ứng dụng khi DOM ready
    document.addEventListener("DOMContentLoaded", initApp);
})();