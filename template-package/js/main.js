/**
 * الملف الرئيسي للوظائف العامة (Dark Mode, Menu, Back to Top, Loading...)
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================
    // 1. إخفاء شاشة التحميل (Loading Overlay) - حل قوي
    // ========================
    const loadingOverlay = document.getElementById('loading-overlay');

    function hideLoadingOverlay() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('opacity-0');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }
    }

    // طريقة 1: الانتظار حتى تحميل الصفحة بالكامل
    if (document.readyState === 'complete') {
        hideLoadingOverlay();
    } else {
        window.addEventListener('load', hideLoadingOverlay);
    }

    // طريقة 2: تأمين إضافي - إخفاء الـ overlay بعد 3 ثواني كحد أقصى (fallback)
    setTimeout(hideLoadingOverlay, 3000);

    // طريقة 3: مراقبة جاهزية DOM
    if (loadingOverlay && document.readyState === 'interactive') {
        // إذا كانت الصفحة جاهزة جزئياً، ننتظر قليلاً ثم نخفي
        setTimeout(hideLoadingOverlay, 500);
    }

    // ========================
    // 2. القائمة الجانبية (Mobile Menu)
    // ========================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    function openMobileMenu() {
        mobileMenu ? .classList.add('active');
        mobileMenuOverlay ? .classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenuFunc() {
        mobileMenu ? .classList.remove('active');
        mobileMenuOverlay ? .classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn ? .addEventListener('click', openMobileMenu);
    closeMobileMenu ? .addEventListener('click', closeMobileMenuFunc);
    mobileMenuOverlay ? .addEventListener('click', closeMobileMenuFunc);
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeMobileMenuFunc());

    // ========================
    // 3. شريط التقدم (Progress Bar)
    // ========================
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
            progressBar.style.transform = `scaleX(${scrollPercent})`;
        };
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }

    // ========================
    // 4. زر العودة للأعلى (Back to Top)
    // ========================
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backToTopBtn ? .classList.add('show');
        else backToTopBtn ? .classList.remove('show');
    });
    backToTopBtn ? .addEventListener('click', () => window.scrollTo({
        top: 0,
        behavior: 'smooth'
    }));

    // ========================
    // 5. نظام الوضع الداكن (Dark Mode)
    // ========================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    function setTheme(theme) {
        const isDark = theme === 'dark';
        if (isDark) {
            htmlElement.classList.add('dark');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="tooltip">الوضع الفاتح</span>';
            }
            localStorage.setItem('theme', 'dark');
            document.cookie = "theme=dark; path=/; max-age=31536000";
        } else {
            htmlElement.classList.remove('dark');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i><span class="tooltip">الوضع الداكن</span>';
            }
            localStorage.setItem('theme', 'light');
            document.cookie = "theme=light; path=/; max-age=31536000";
        }
    }

    function initTheme() {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (storedTheme) setTheme(storedTheme);
        else setTheme(prefersDark ? 'dark' : 'light');
    }

    darkModeToggle ? .addEventListener('click', () => {
        setTheme(htmlElement.classList.contains('dark') ? 'light' : 'dark');
    });
    initTheme();

    // ========================
    // 6. القائمة المنسدلة للمستخدم
    // ========================
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenu = document.getElementById('user-menu');
    userMenuBtn ? .addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu ? .classList.toggle('opacity-0');
        userMenu ? .classList.toggle('invisible');
        userMenu ? .classList.toggle('scale-95');
    });
    document.addEventListener('click', (e) => {
        if (userMenuBtn && userMenu && !userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
        }
    });

    // ========================
    // 7. تأثيرات GSAP الأساسية (إذا كانت موجودة)
    // ========================
    if (typeof gsap !== 'undefined') {
        gsap.from('nav', {
            duration: 0.8,
            y: -50,
            opacity: 0
        });
        const floatingButtons = [darkModeToggle, backToTopBtn];
        floatingButtons.forEach(btn => {
            btn ? .addEventListener('mouseenter', () => gsap.to(btn, {
                scale: 1.1,
                duration: 0.3
            }));
            btn ? .addEventListener('mouseleave', () => gsap.to(btn, {
                scale: 1,
                duration: 0.3
            }));
        });
    }

    // ========================
    // 8. تحسين أداء الصفحة - منع التجميد
    // ========================
    // التأكد من أن جميع الصور يتم تحميلها بشكل غير متزامن
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    console.log('✅ تم تحميل الصفحة بنجاح وإخفاء شاشة التحميل');
});