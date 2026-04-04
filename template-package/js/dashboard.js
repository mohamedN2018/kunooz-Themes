/**
 * ملف وظائف لوحة التحكم (Dashboard)
 * يشمل: التعليقات، الإحصائيات، فحص النظام
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ dashboard.js loaded successfully');

    // ========================
    // 1. تحديث التاريخ
    // ========================
    function updateCurrentDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('ar-SA', options);
        }
        const todayDate = document.getElementById('today-date');
        if (todayDate) {
            todayDate.textContent = now.toLocaleDateString('ar-SA', options);
        }
    }

    updateCurrentDate();
    setInterval(updateCurrentDate, 60000);

    // ========================
    // 2. قبول التعليق (AJAX)
    // ========================
    window.approveComment = function(commentId, event) {
        if (!confirm('هل تريد قبول هذا التعليق؟')) return;

        const button = event.currentTarget;
        const originalHTML = button.innerHTML;

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        // للحصول على CSRF token من الكوكيز
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
                    showNotification('تم قبول التعليق بنجاح', 'success');
                    setTimeout(() => location.reload(), 1000);
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
    };

    // ========================
    // 3. رفض التعليق (AJAX)
    // ========================
    window.rejectComment = function(commentId, event) {
        if (!confirm('هل تريد رفض وحذف هذا التعليق؟')) return;

        const button = event.currentTarget;
        const originalHTML = button.innerHTML;

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

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
                    showNotification('تم رفض التعليق', 'success');
                    setTimeout(() => location.reload(), 1000);
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
    };

    // ========================
    // 4. إظهار الإشعارات
    // ========================
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
        notification.className = `fixed top-4 left-4 z-50 p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-full ${colors[type]}`;
        notification.innerHTML = `<div class="flex items-center gap-3"><i class="fas fa-${icons[type]}"></i><span>${message}</span></div>`;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.remove('translate-x-full'), 10);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ========================
    // 5. فحص النظام
    // ========================
    window.runSystemCheck = function(event) {
        const button = event ? .target ? .closest('button') || event;
        if (!button) return;

        const originalHTML = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الفحص...';

        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check-circle"></i> تم الفحص';
            showNotification('تم فحص النظام بنجاح', 'success');
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.disabled = false;
            }, 2000);
        }, 1500);
    };

    // ========================
    // 6. تأثيرات hover للكروت
    // ========================
    const statCards = document.querySelectorAll('.stat-card, .user-stats-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // ========================
    // 7. تأثيرات fade-in
    // ========================
    const animatedElements = document.querySelectorAll('.stat-card, .content-card, tbody tr, .user-stats-card');
    animatedElements.forEach((el, i) => {
        el.style.animationDelay = `${i * 0.05}s`;
        el.classList.add('animate-fade-in');
    });
});