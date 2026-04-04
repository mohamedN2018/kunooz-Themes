/**
 * ملف وظائف التعليقات والمشاركة الاجتماعية
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ comments.js loaded successfully');

    // ========================
    // 1. وظائف المشاركة الاجتماعية
    // ========================
    window.shareOnFacebook = function() {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    };

    window.shareOnTwitter = function() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
    };

    window.shareOnWhatsApp = function() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`https://wa.me/?text=${title}%20${url}`, '_blank');
    };

    window.shareOnLinkedIn = function() {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
    };

    window.copyLink = function() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('✅ تم نسخ الرابط إلى الحافظة!');
        }).catch(() => {
            alert('❌ حدث خطأ في نسخ الرابط');
        });
    };

    // ========================
    // 2. التمرير لنموذج التعليق
    // ========================
    window.scrollToCommentForm = function() {
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            document.querySelector('[name="name"]') ? .focus();
        }
    };

    // ========================
    // 3. إضافة فئات Tailwind لحقول النموذج
    // ========================
    const formInputs = document.querySelectorAll('#commentForm input, #commentForm textarea');
    formInputs.forEach(input => {
        input.classList.add('w-full', 'px-4', 'py-3', 'border', 'border-gray-300', 'dark:border-gray-600',
            'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
            'dark:bg-gray-700', 'dark:text-white', 'transition', 'duration-200');
    });

    // ========================
    // 4. تأثيرات للتعليقات
    // ========================
    const comments = document.querySelectorAll('.comment-item');
    comments.forEach((comment, index) => {
        comment.style.animationDelay = `${index * 0.1}s`;
        comment.classList.add('animate-fade-in');
    });

    // ========================
    // 5. إرسال التعليق (AJAX - محاكاة)
    // ========================
    const commentForm = document.querySelector('#commentForm form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('[name="name"]') ? .value;
            const email = this.querySelector('[name="email"]') ? .value;
            const content = this.querySelector('[name="content"]') ? .value;

            if (!name || !email || !content) {
                alert('الرجاء ملء جميع الحقول');
                return;
            }

            alert('✅ تم إرسال تعليقك بنجاح! سيتم مراجعته قريباً.');
            this.reset();
        });
    }
});