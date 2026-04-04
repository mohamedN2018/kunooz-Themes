/**
 * ملف وظائف التعليقات
 * تم استخراجه من post_detail.html
 */

// ========================
// وظائف المشاركة الاجتماعية
// ========================
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('تم نسخ الرابط إلى الحافظة!');
    }).catch(() => {
        alert('حدث خطأ في نسخ الرابط');
    });
}

// ========================
// وظائف التعليقات
// ========================
function scrollToCommentForm() {
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        const nameInput = document.querySelector('[name="name"]');
        if (nameInput) nameInput.focus();
    }
}

// ========================
// إضافة فئات Tailwind لحقول النموذج
// ========================
function initCommentFormStyles() {
    const inputs = document.querySelectorAll('#commentForm input, #commentForm textarea');
    inputs.forEach(input => {
        input.classList.add('w-full', 'px-4', 'py-3', 'border', 'border-gray-300', 'dark:border-gray-600',
            'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
            'focus:border-blue-500', 'dark:bg-gray-700', 'dark:text-white',
            'transition', 'duration-200');
    });
}

// ========================
// التهيئة عند تحميل الصفحة
// ========================
document.addEventListener('DOMContentLoaded', function() {
    initCommentFormStyles();

    // تأثيرات للتعليقات
    const comments = document.querySelectorAll('.comment-item');
    comments.forEach((comment, index) => {
        comment.style.animationDelay = `${index * 0.1}s`;
        comment.classList.add('animate-fade-in');
    });
});