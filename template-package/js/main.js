/**
 * الملف الرئيسي للوظائف العامة
 * يشمل: Dark Mode, Mobile Menu, Back to Top, Loading Overlay, GSAP
 */

// ========================
// 1. إخفاء شاشة التحميل (Loading Overlay) - حل قوي
// ========================
(function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;

    function hideOverlay() {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }

    if (document.readyState === 'complete') {
        hideOverlay();
    } else {
        window.addEventListener('load', hideOverlay);
    }

    // Fallback بعد 2 ثانية
    setTimeout(hideOverlay, 2000);
})();

// ========================
// 2. انتظار تحميل DOM
// ========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ main.js loaded successfully');

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

    // إغلاق القائمة بالضغط على Escape
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
    // 6. نظام الوضع الداكن (Dark Mode)
    // ========================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    function setTheme(theme) {
        const isDark = theme === 'dark';
        if (isDark) {
            htmlElement.classList.add('dark');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="tooltip hidden md:inline-block absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded">الوضع الفاتح</span>';
            }
            localStorage.setItem('theme', 'dark');
            document.cookie = "theme=dark; path=/; max-age=31536000";
        } else {
            htmlElement.classList.remove('dark');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i><span class="tooltip hidden md:inline-block absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded">الوضع الداكن</span>';
            }
            localStorage.setItem('theme', 'light');
            document.cookie = "theme=light; path=/; max-age=31536000";
        }
    }

    function initTheme() {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const isDark = htmlElement.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
        });
    }
    initTheme();

    // ========================
    // 7. القائمة المنسدلة للمستخدم
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
    // 8. GSAP Animations (إذا كانت موجودة)
    // ========================
    if (typeof gsap !== 'undefined') {
        // حركة الناف بار
        gsap.from('nav', {
            duration: 0.8,
            y: -50,
            opacity: 0
        });

        // تأثير hover على الأزرار
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
    // 9. تحسين الصور (Lazy Loading)
    // ========================
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

    // ========================
    // 10. AOS Animation
    // ========================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true
        });
    }

    // ========================
    // 11. إصلاح مشكلة الـ tooltip
    // ========================
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.classList.add('hidden', 'md:inline-block');
    });
});