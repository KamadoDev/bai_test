(function () {
    "use strict";

    // Khởi tạo ứng dụng
    function initApp() {
        console.log("Script initialized");

        // Các hàm khởi tạo riêng lẻ
        initSmoothScroll();
        initMobileMenu();
        initModals();
        initFAQAccordion();
        initContactForm();
        initSocialButtons();
        initScrollToTop();
        initFixedCallButton();
        initScrollAnimations();

        initHeaderEffects();
        initCardHoverEffects();
    }

    // 1. Smooth scrolling cho navigation links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                const target = document.querySelector(this.getAttribute("href"));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
        });
    }

    // 2. Mobile Menu
    function initMobileMenu() {
        const menu = document.querySelector(".nav-links");
        const menuToggle = document.querySelector(".menu-toggle");
        const menuOverlay = document.querySelector(".menu-overlay");

        if (!menuToggle || !menu || !menuOverlay) return;

        const toggleMenu = (isActive) => {
            menu.classList.toggle("is-active", isActive);
            menuToggle.classList.toggle("is-active", isActive);
            menuOverlay.classList.toggle("is-active", isActive);
            menuToggle.setAttribute("aria-expanded", isActive);
            document.body.classList.toggle("menu-open", isActive);
        };

        menuToggle.addEventListener("click", () =>
            toggleMenu(!menu.classList.contains("is-active"))
        );

        menuOverlay.addEventListener("click", () => toggleMenu(false));
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
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

    // 4. FAQ Accordion (Fixed version)
    function initFAQAccordion() {
        document.querySelectorAll(".faq-item").forEach(item => {
            const question = item.querySelector(".faq-question");
            if (!question) return;

            question.addEventListener("click", () => {
                const currentlyActive = item.classList.contains("active");

                // Đóng tất cả các item khác
                document.querySelectorAll(".faq-item.active").forEach(activeItem => {
                    if (activeItem !== item) {
                        activeItem.classList.remove("active");
                    }
                });

                // Toggle trạng thái của item hiện tại
                item.classList.toggle("active", !currentlyActive);
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
            scrollToTopBtn.classList.toggle("visible", window.scrollY > 300);
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

        const toggleVisibility = () => {
            const shouldShow = window.innerWidth <= 768 &&
                window.scrollY > heroSection.offsetHeight * 0.75;
            fixedCallBtn.classList.toggle("visible", shouldShow);
        };

        toggleVisibility();
        window.addEventListener("scroll", toggleVisibility);
        window.addEventListener("resize", toggleVisibility);

        fixedCallBtn.addEventListener("click", function () {
            this.style.transform = "scale(0.95)";
            setTimeout(() => this.style.transform = "", 200);
        });
    }

    // 9. Scroll-triggered Animations
    function initScrollAnimations() {
        const fadeSelectors = [
            'fade-in', 'fade-in-left',
            'fade-in-right', 'fade-in-scale'
        ].map(cls => `.${cls}`).join(', ');

        const elements = document.querySelectorAll(fadeSelectors);
        if (!elements.length) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: "0px 0px -100px 0px"
            });

            elements.forEach(el => observer.observe(el));
        } else {
            // Fallback cho trình duyệt cũ
            const checkVisibility = () => {
                elements.forEach(el => {
                    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                        el.classList.add("visible");
                    }
                });
            };

            checkVisibility();
            window.addEventListener("scroll", () => setTimeout(checkVisibility, 50));
        }
    }

    // 10. Hiệu ứng header khi scroll 
    function initHeaderEffects() {
        const header = document.querySelector("header");
        if (!header) return;

        window.addEventListener("scroll", () => {
            const opacity = Math.min(window.scrollY / 200, 0.2);
            header.style.background = `
                linear-gradient(135deg, 
                rgba(0, 105, 148, ${0.9 + opacity}), 
                rgba(0, 135, 199, ${0.9 + opacity})
            `;
        });
    }

    // 11. Hiệu ứng hover cho card 
    function initCardHoverEffects() {
        document.querySelectorAll(".feature-card, .service-card, .process-step").forEach(card => {
            card.addEventListener("mouseenter", () => {
                card.style.transform = "translateY(-5px) scale(1.02)";
                card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
                card.style.boxShadow = "";
            });
        });
    }

    // Khởi chạy ứng dụng khi DOM ready
    document.addEventListener("DOMContentLoaded", initApp);
})();