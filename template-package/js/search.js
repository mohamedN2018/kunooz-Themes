/**
 * ملف وظائف البحث والاقتراحات
 * تم استخراجه من base.html
 */

// ========================
// نظام البحث المتقدم
// ========================
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');
    const searchSuggestions = document.getElementById('search-suggestions');
    const liveResults = document.getElementById('live-search-results');
    const emptyState = document.getElementById('search-empty-state');
    const loadingState = document.getElementById('search-loading');
    const searchStats = document.getElementById('search-stats');
    const resultsCount = document.getElementById('results-count');
    const recentSearchesDiv = document.getElementById('recent-searches');
    const recentSearchesList = document.getElementById('recent-searches-list');

    let searchTimeout;
    let isSearching = false;

    // تحميل عمليات البحث السابقة
    function loadRecentSearches() {
        const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        if (recent.length > 0 && recentSearchesDiv) {
            recentSearchesDiv.classList.remove('hidden');
            if (recentSearchesList) {
                recentSearchesList.innerHTML = '';

                recent.slice(0, 5).forEach(term => {
                    const item = document.createElement('div');
                    item.className = 'flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group';
                    item.innerHTML = `
                        <button onclick="setSearchTerm('${escapeHtml(term)}')" class="flex-1 text-left">
                            <div class="flex items-center">
                                <i class="fas fa-history text-gray-400 dark:text-gray-500 ml-2 text-sm"></i>
                                <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    ${escapeHtml(term)}
                                </span>
                            </div>
                        </button>
                        <button onclick="removeRecentSearch('${escapeHtml(term)}')" class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                            <i class="fas fa-times text-sm"></i>
                        </button>
                    `;
                    recentSearchesList.appendChild(item);
                });
            }
        } else if (recentSearchesDiv) {
            recentSearchesDiv.classList.add('hidden');
        }
    }

    // حفظ عملية البحث
    function saveRecentSearch(term) {
        if (!term.trim()) return;

        let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        recent = recent.filter(t => t !== term);
        recent.unshift(term);
        recent = recent.slice(0, 10);
        localStorage.setItem('recentSearches', JSON.stringify(recent));
        loadRecentSearches();
    }

    // تعيين مصطلح البحث
    window.setSearchTerm = function(term) {
        if (searchInput) {
            searchInput.value = term;
            searchInput.focus();
            performSearch(term);
        }
    }

    // إزالة بحث سابق
    window.removeRecentSearch = function(term) {
        let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        recent = recent.filter(t => t !== term);
        localStorage.setItem('recentSearches', JSON.stringify(recent));
        loadRecentSearches();
    }

    // مسح عمليات البحث السابقة
    window.clearRecentSearches = function() {
        if (confirm('هل تريد مسح كل عمليات البحث السابقة؟')) {
            localStorage.removeItem('recentSearches');
            loadRecentSearches();
        }
    }

    // تنفيذ البحث
    async function performSearch(query) {
        if (!query.trim() || query.length < 2) {
            hideSuggestions();
            return;
        }

        isSearching = true;
        showLoading();

        try {
            const response = await fetch(`/autocomplete_search/?term=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.length > 0) {
                showResults(data);
                if (resultsCount) resultsCount.textContent = data.length;
                if (searchStats) searchStats.style.opacity = '1';
            } else {
                showEmptyState();
                if (resultsCount) resultsCount.textContent = '0';
                if (searchStats) searchStats.style.opacity = '1';
            }
        } catch (error) {
            console.error('Search error:', error);
            showEmptyState();
        } finally {
            isSearching = false;
            hideLoading();
        }
    }

    // عرض النتائج
    function showResults(results) {
        if (liveResults) {
            liveResults.innerHTML = '';

            results.forEach((item, index) => {
                const result = document.createElement('a');
                result.href = item.url;
                result.className = `block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 
                                border-b border-gray-100 dark:border-gray-700 last:border-b-0 
                                transition-colors duration-200 group animate-fadeIn`;
                result.style.animationDelay = `${index * 50}ms`;

                result.innerHTML = `
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 
                                    flex items-center justify-center text-white ml-3">
                            <i class="fas fa-file-alt text-sm"></i>
                        </div>
                        <div class="flex-1">
                            <h5 class="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 
                                    transition-colors truncate">
                                ${escapeHtml(item.title)}
                            </h5>
                            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                ${escapeHtml(item.url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}
                            </p>
                        </div>
                        <i class="fas fa-chevron-left text-gray-300 dark:text-gray-600 
                                group-hover:text-blue-500 dark:group-hover:text-blue-400 
                                transition-colors transform group-hover:translate-x-1"></i>
                    </div>
                `;
                liveResults.appendChild(result);
            });
        }

        showSuggestions();
    }

    // عرض حالة عدم وجود نتائج
    function showEmptyState() {
        if (liveResults) liveResults.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        showSuggestions();
    }

    // عرض حالة التحميل
    function showLoading() {
        if (loadingState) loadingState.classList.remove('hidden');
        if (liveResults) liveResults.innerHTML = '';
        if (emptyState) emptyState.classList.add('hidden');
    }

    // إخفاء حالة التحميل
    function hideLoading() {
        if (loadingState) loadingState.classList.add('hidden');
    }

    // عرض الاقتراحات
    function showSuggestions() {
        if (searchSuggestions) {
            searchSuggestions.style.display = 'block';
            setTimeout(() => {
                searchSuggestions.classList.remove('opacity-0', 'translate-y-2');
            }, 10);
        }
    }

    // إخفاء الاقتراحات
    function hideSuggestions() {
        if (searchSuggestions) {
            searchSuggestions.classList.add('opacity-0', 'translate-y-2');
            if (searchStats) searchStats.style.opacity = '0';
            setTimeout(() => {
                if (searchSuggestions) searchSuggestions.style.display = 'none';
            }, 300);
        }
    }

    // أحداث البحث
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();

            if (query.length < 2) {
                hideSuggestions();
                return;
            }

            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });

        searchInput.addEventListener('focus', function() {
            if (this.value.trim().length >= 2) {
                performSearch(this.value);
            } else {
                showSuggestions();
                if (liveResults) liveResults.innerHTML = '';
                if (emptyState) emptyState.classList.add('hidden');
                if (searchStats) searchStats.style.opacity = '0';
            }
        });
    }

    // عند إرسال النموذج
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const query = searchInput ? .value.trim();
            if (query) {
                saveRecentSearch(query);
            }
        });
    }

    // إغلاق الاقتراحات عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (searchForm && !searchForm.contains(e.target)) {
            hideSuggestions();
        }
    });

    // اختصارات لوحة المفاتيح
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideSuggestions();
        }

        if (e.key === 'Enter' && document.activeElement === searchInput && searchInput ? .value.trim()) {
            saveRecentSearch(searchInput.value.trim());
        }

        // Ctrl/Cmd + K للبحث
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput ? .focus();
        }
    });

    // تحسين الوصول
    if (searchInput) {
        searchInput.setAttribute('aria-label', 'بحث عن محتوى تعليمي');
        searchInput.setAttribute('aria-describedby', 'search-description');

        // إضافة وصف للوصول
        if (searchForm && !document.getElementById('search-description')) {
            const description = document.createElement('div');
            description.id = 'search-description';
            description.className = 'sr-only';
            description.textContent = 'استخدم هذا الحقل للبحث عن كورسات، مقالات، منح، كتب وملخصات. استخدم مفاتيح الأسهم للتنقل بين الاقتراحات واضغط Enter للبحث.';
            searchForm.appendChild(description);
        }
    }

    // تحميل عمليات البحث السابقة عند البدء
    loadRecentSearches();
});

// دالة مساعدة لتشفير HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}