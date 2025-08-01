(function () {
    "use strict";
    function init() {
        console.log("Script initialized");
    }

    document.addEventListener("DOMContentLoaded", function () {
        init();
        // Smooth scrolling for navigation links
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute("href"));
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            });
        });

        // Mobile Menu
        const menu = document.querySelector(".nav-links");
        const menuToggle = document.querySelector(".menu-toggle");
        const menuOverlay = document.querySelector(".menu-overlay");

        if (menuToggle && menu && menuOverlay) {
            const closeMenu = () => {
                menu.classList.remove("is-active");
                menuToggle.classList.remove("is-active");
                menuOverlay.classList.remove("is-active");
                menuToggle.setAttribute("aria-expanded", "false");
            };

            menuToggle.addEventListener("click", () => {
                const isActive = menu.classList.contains("is-active");
                if (isActive) {
                    closeMenu();
                } else {
                    menu.classList.add("is-active");
                    menuToggle.classList.add("is-active");
                    menuOverlay.classList.add("is-active");
                    menuToggle.setAttribute("aria-expanded", "true");
                }
            })
            menuOverlay.addEventListener("click", closeMenu);
            document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
        }


        // Khởi tạo Swiper
        const projectSwiper = new Swiper('.project-swiper', {
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            loop: false,
            keyboard: {
                enabled: true,
            },
        });

        // Lấy modal và nút đóng
        const modal = document.getElementById('projectModal');
        const closeModal = document.getElementById('closeModal');

        // Xử lý sự kiện click trên các project card
        document.querySelectorAll('.js-open-modal').forEach(project => {
            project.addEventListener('click', function () {
                // Lấy danh sách ảnh từ data attribute
                const images = this.getAttribute('data-img-src').split(',').map(img => img.trim());

                // Xóa các slide cũ
                projectSwiper.removeAllSlides();

                // Thêm slide mới từ danh sách ảnh
                images.forEach(image => {
                    projectSwiper.appendSlide(`
                    <div class="swiper-slide">
                        <img src="${image}" alt="Hình ảnh dự án">
                    </div>
                `);
                });

                // Hiển thị modal
                modal.classList.add('active');

                // Cập nhật Swiper
                projectSwiper.update();
                projectSwiper.slideTo(0);
            });
        });

        // Đóng modal khi click nút đóng
        closeModal.addEventListener('click', function () {
            modal.classList.remove('active');
        });

        // Đóng modal khi click bên ngoài nội dung
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Đóng modal bằng phím ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });

        // FAQ Accordion
        const faqItems = document.querySelectorAll(".faq-item");
        faqItems.forEach((item) => {
            const question = item.querySelector(".faq-question");
            question.addEventListener("click", () => {
                const currentlyActive = document.querySelector(".faq-item.active");
                if (currentlyActive && currentlyActive !== item) {
                    currentlyActive.classList.remove("active");
                }
                item.classList.toggle("active");
            });
        });

        // Modal for contact form
        const contactForm = document.querySelector('.contact-form-main');
        const successModal = document.getElementById('success-modal');

        // Xử lý sự kiện submit form
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Ngăn form submit theo cách thông thường

            // Giả lập gửi form thành công (trong thực tế bạn sẽ gọi AJAX ở đây)
            // Ví dụ với fetch API:
            /*
            fetch('your-api-endpoint', {
                method: 'POST',
                body: new FormData(contactForm)
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    showSuccessModal();
                    contactForm.reset(); // Reset form sau khi gửi thành công
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
            */

            // Tạm thời giả lập thành công
            showSuccessModal();
            contactForm.reset(); // Reset form sau khi gửi thành công
        });

        // Hàm hiển thị modal thành công
        function showSuccessModal() {
            successModal.classList.add('active');
        }

        // Xử lý đóng modal
        const closeBtn = document.querySelector('.modal-close-btn');
        closeBtn.addEventListener('click', function () {
            successModal.classList.remove('active');
        });

        // Đóng modal khi click bên ngoài
        successModal.addEventListener('click', function (e) {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });

        // Kích hoạt hiệu ứng social buttons khi trang load
        setTimeout(() => {
            document.querySelector('.fixed-social-buttons').classList.add('loaded');
        }, 1000);

        // Scroll to Top Button
        const scrollToTopBtn = document.getElementById("scrollToTopBtn");

        if (scrollToTopBtn) {
            // Hiển thị/ẩn nút khi scroll
            function toggleScrollButton() {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add("visible");
                } else {
                    scrollToTopBtn.classList.remove("visible");
                }
            }

            // Kiểm tra ngay khi load trang
            toggleScrollButton();

            // Thêm sự kiện scroll
            window.addEventListener("scroll", toggleScrollButton);

            // Scroll mượt lên đầu trang
            scrollToTopBtn.addEventListener("click", (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                // Thêm hiệu ứng nhấn (optional)
                scrollToTopBtn.classList.add("clicked");
                setTimeout(() => {
                    scrollToTopBtn.classList.remove("clicked");
                }, 300);
            });
        }

        // Fixed Call Button (Mobile Only)

        // Kiểm tra nếu nút tồn tại
        const fixedCallBtn = document.querySelector(".fixed-call-btn");
        const heroSection = document.querySelector(".hero");

        if (fixedCallBtn && heroSection) {
            // Chỉ kích hoạt trên mobile
            function isMobile() {
                return window.innerWidth <= 768;
            }

            // Tính toán ngưỡng cuộn
            const showButtonThreshold = heroSection.offsetHeight * 0.75;

            // Xử lý scroll
            function handleScroll() {
                if (!isMobile()) return;

                if (window.pageYOffset > showButtonThreshold) {
                    fixedCallBtn.classList.add("visible");
                } else {
                    fixedCallBtn.classList.remove("visible");
                }
            }

            // Xử lý resize
            function handleResize() {
                if (!isMobile()) {
                    fixedCallBtn.classList.remove("visible");
                } else {
                    handleScroll();
                }
            }

            // Thêm hiệu ứng click
            fixedCallBtn.addEventListener('click', function () {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);

                // Analytics tracking (tùy chọn)
                console.log('Call button clicked - Tel: 0909-887-778');
            });

            // Gọi hàm khi load và resize
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleResize);

            // Kiểm tra ban đầu
            handleResize();
        }

        // Scroll-triggered Animation
        // Danh sách các class fade cần xử lý
        const fadeClasses = [
            'fade-in',
            'fade-in-left',
            'fade-in-right',
            'fade-in-scale'
        ];

        // Tạo selector query cho tất cả các class fade
        const fadeSelector = fadeClasses.map(cls => `.${cls}`).join(', ');

        if ('IntersectionObserver' in window) {
            const fadeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Bỏ theo dõi sau khi hiệu ứng kích hoạt để tối ưu hiệu suất
                        fadeObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -150px 0px' // Kích hoạt sớm hơn 150px so với viewport
            });

            // Theo dõi tất cả các phần tử có class fade
            document.querySelectorAll(fadeSelector).forEach(element => {
                fadeObserver.observe(element);
            });
        } else {
            // Fallback cho trình duyệt cũ
            function checkFadeElements() {
                document.querySelectorAll(fadeSelector).forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    if (elementTop < window.innerHeight - 100) {
                        element.classList.add('visible');
                    }
                });
            }

            // Chạy ngay khi load trang
            checkFadeElements();

            // Thêm sự kiện scroll với debounce
            let isScrolling;
            window.addEventListener('scroll', function () {
                clearTimeout(isScrolling);
                isScrolling = setTimeout(checkFadeElements, 50);
            });
        }

    });
})();