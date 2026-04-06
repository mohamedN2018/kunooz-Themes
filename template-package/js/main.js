/**
 * الملف الرئيسي للوظائف العامة
 * يشمل: Dark Mode, Mobile Menu, Back to Top, Loading Overlay
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ main.js loaded successfully');

    // ========================
    // 1. إخفاء شاشة التحميل (Loading Overlay)
    // ========================
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        setTimeout(function() {
            loadingOverlay.style.opacity = '0';
            setTimeout(function() {
                loadingOverlay.style.display = 'none';
            }, 500);
        }, 100);

        setTimeout(function() {
            if (loadingOverlay.style.display !== 'none') {
                loadingOverlay.style.opacity = '0';
                setTimeout(function() {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }
        }, 2000);
    }

    // ========================
    // 2. نظام Dark Mode (الإصلاح الكامل)
    // ========================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    // دالة لضبط الثيم على جميع العناصر
    function applyTheme(theme) {
        const isDark = theme === 'dark';

        // تطبيق على عنصر html
        if (isDark) {
            htmlElement.classList.add('dark');
            // تحديث أيقونة الزر
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="tooltip hidden md:inline-block absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded">الوضع الفاتح</span>';
            }
        } else {
            htmlElement.classList.remove('dark');
            // تحديث أيقونة الزر
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i><span class="tooltip hidden md:inline-block absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded">الوضع الداكن</span>';
            }
        }

        // حفظ في localStorage
        localStorage.setItem('theme', theme);

        // حفظ في cookie (للتأكد من استمرارية الثيم)
        document.cookie = `theme=${theme}; path=/; max-age=31536000`;

        // تطبيق الثيم على جميع العناصر الديناميكية
        document.body.classList.toggle('dark-mode-transition', isDark);

        console.log(`🌓 Theme changed to: ${theme}`);
    }

    // دالة لتهيئة الثيم
    function initTheme() {
        // محاولة القراءة من localStorage أولاً
        let savedTheme = localStorage.getItem('theme');

        // إذا لم يوجد، حاول القراءة من cookie
        if (!savedTheme) {
            const cookieMatch = document.cookie.match(/theme=([^;]+)/);
            if (cookieMatch) {
                savedTheme = cookieMatch[1];
            }
        }

        // إذا كان هناك ثيم محفوظ، استخدمه
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            applyTheme(savedTheme);
        }
        // وإلا استخدم تفضيلات النظام
        else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    }

    // ربط حدث النقر على زر الدارك مود
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isDark = htmlElement.classList.contains('dark');
            applyTheme(isDark ? 'light' : 'dark');

            // تأثير حركة جميل
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    rotation: 360,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.set(this, {
                            rotation: 0
                        });
                    }
                });
            }
        });
    }

    // الاستماع لتغيرات تفضيلات النظام
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // فقط إذا لم يكن هناك ثيم محفوظ
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // تهيئة الثيم عند تحميل الصفحة
    initTheme();

    // ========================
    // 3. القائمة الجانبية (Mobile Menu)
    // ========================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    function openMobileMenu() {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenuFunc() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (closeMobileMenu) closeMobileMenu.addEventListener('click', closeMobileMenuFunc);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenuFunc);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMobileMenuFunc();
    });

    // ========================
    // 4. شريط التقدم (Progress Bar)
    // ========================
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
            progressBar.style.transform = `scaleX(${scrollPercent})`;
        }
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }

    // ========================
    // 5. زر العودة للأعلى (Back to Top)
    // ========================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================
    // 6. القائمة المنسدلة للمستخدم
    // ========================
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenu = document.getElementById('user-menu');

    if (userMenuBtn && userMenu) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('opacity-0');
            userMenu.classList.toggle('invisible');
            userMenu.classList.toggle('scale-95');
        });

        document.addEventListener('click', function(e) {
            if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
            }
        });
    }

    // ========================
    // 7. GSAP Animations (إذا كانت موجودة)
    // ========================
    if (typeof gsap !== 'undefined') {
        gsap.from('nav', {
            duration: 0.8,
            y: -50,
            opacity: 0
        });

        const floatingButtons = [darkModeToggle, backToTopBtn];
        floatingButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('mouseenter', () => gsap.to(btn, {
                    scale: 1.1,
                    duration: 0.3
                }));
                btn.addEventListener('mouseleave', () => gsap.to(btn, {
                    scale: 1,
                    duration: 0.3
                }));
            }
        });
    }

    // ========================
    // 8. تحسين الصور (Lazy Loading)
    // ========================
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

    // ========================
    // 9. AOS Animation
    // ========================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true
        });
    }

    console.log('✅ All systems initialized');
});