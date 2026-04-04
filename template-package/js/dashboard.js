/**
 * ملف وظائف لوحة التحكم (Dashboard & Admin Dashboard)
 * تم استخراجه من admin_dashboard.html و dashboard.html
 */

// ========================
// التاريخ والتوقيت
// ========================
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('ar-SA', options);
    }
}

// ========================
// أدوات مساعدة
// ========================
function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600'
    };

    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };

    const notification = document.createElement('div');
    notification.className = `
        fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white
        transform transition-all duration-300 translate-x-full
        ${colors[type]}
    `;

    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove('translate-x-full'), 10);
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function setLoading(button, loading = true) {
    if (loading) {
        button.dataset.original = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
    } else {
        button.innerHTML = button.dataset.original;
        button.disabled = false;
    }
}

// ========================
// قبول ورفض التعليقات
// ========================
function approveComment(commentId, event) {
    if (!confirm('هل تريد قبول هذا التعليق؟')) return;

    const button = event.currentTarget;
    const originalHTML = button.innerHTML;

    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>';
    button.disabled = true;

    fetch(`/control/comments/approve/${commentId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const commentRow = document.getElementById(`comment-${commentId}`);
                if (commentRow) {
                    commentRow.style.opacity = '0.5';
                    commentRow.style.transform = 'translateX(-20px)';
                    setTimeout(() => location.reload(), 300);
                } else {
                    location.reload();
                }
            } else {
                button.innerHTML = originalHTML;
                button.disabled = false;
                showNotification(data.message || 'حدث خطأ', 'error');
            }
        })
        .catch(err => {
            button.innerHTML = originalHTML;
            button.disabled = false;
            showNotification('حدث خطأ في الاتصال', 'error');
        });
}

function rejectComment(commentId, event) {
    if (!confirm('هل تريد رفض وحذف هذا التعليق؟')) return;

    const button = event.currentTarget;
    const originalHTML = button.innerHTML;

    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>';
    button.disabled = true;

    fetch(`/control/comments/reject/${commentId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const commentRow = document.getElementById(`comment-${commentId}`);
                if (commentRow) {
                    commentRow.style.opacity = '0.3';
                    commentRow.style.transform = 'translateX(20px)';
                    setTimeout(() => location.reload(), 300);
                } else {
                    location.reload();
                }
            } else {
                button.innerHTML = originalHTML;
                button.disabled = false;
                showNotification(data.message || 'حدث خطأ', 'error');
            }
        })
        .catch(err => {
            button.innerHTML = originalHTML;
            button.disabled = false;
            showNotification('حدث خطأ في الاتصال', 'error');
        });
}

// ========================
// فحص النظام
// ========================
function runSystemCheck(event) {
    const button = event.target.closest('button');
    const original = button.innerHTML;

    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> جاري الفحص...';

    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check-circle mr-2"></i> تم الفحص';
        showNotification('تم فحص النظام بنجاح', 'success');

        setTimeout(() => {
            button.innerHTML = original;
            button.disabled = false;
        }, 2000);
    }, 1500);
}

// ========================
// تحديث الإحصائيات في الوقت الفعلي
// ========================
function updateRealTimeStats() {
    // يمكن إضافة AJAX call هنا لتحديث الإحصائيات
    setTimeout(updateRealTimeStats, 30000); // تحديث كل 30 ثانية
}

// ========================
// تأثيرات hover للكروت
// ========================
function initCardHoverEffects() {
    document.querySelectorAll('.stat-card, .user-stats-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    document.querySelectorAll('.action-button, .quick-action-card').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ========================
// تحسين تجربة الأجهزة المحمولة
// ========================
function handleMobileView() {
    if (window.innerWidth < 768) {
        document.querySelectorAll('.post-image').forEach(img => {
            img.style.width = '100%';
            img.style.height = '120px';
        });
    }
}

// ========================
// التهيئة عند تحميل الصفحة
// ========================
document.addEventListener('DOMContentLoaded', function() {
    // تحديث التاريخ
    updateCurrentDate();
    setInterval(updateCurrentDate, 60000);

    // تأثيرات التحميل للعناصر
    document.querySelectorAll('.stat-card, .content-card, tbody tr, .user-stats-card')
        .forEach((el, i) => {
            el.style.animationDelay = `${i * 0.05}s`;
            el.classList.add('animate-fade-in');
        });

    // تأثيرات hover
    initCardHoverEffects();

    // تحسين للجوال
    handleMobileView();
    window.addEventListener('resize', handleMobileView);

    // تأثير النقر على الأزرار
    document.querySelectorAll('a[href], button').forEach(element => {
        element.addEventListener('click', function(e) {
            if (!this.classList.contains('no-effect')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });

    // بدء تحديث الإحصائيات
    updateRealTimeStats();
});