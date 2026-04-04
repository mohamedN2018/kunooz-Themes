/**
 * ملف وظائف البحث والاقتراحات
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ search.js loaded successfully');

    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');
    const searchSuggestions = document.getElementById('search-suggestions');
    const liveResults = document.getElementById('live-search-results');
    const emptyState = document.getElementById('search-empty-state');
    const loadingState = document.getElementById('search-loading');
    const resultsCount = document.getElementById('results-count');
    const recentSearchesDiv = document.getElementById('recent-searches');
    const recentSearchesList = document.getElementById('recent-searches-list');

    let searchTimeout;

    // تحميل عمليات البحث السابقة
    function loadRecentSearches() {
        const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        if (recent.length > 0 && recentSearchesDiv && recentSearchesList) {
            recentSearchesDiv.classList.remove('hidden');
            recentSearchesList.innerHTML = '';
            recent.slice(0, 5).forEach(term => {
                const item = document.createElement('div');
                item.className = 'flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded';
                item.innerHTML = `
                    <button onclick="setSearchTerm('${escapeHtml(term)}')" class="flex-1 text-right">${escapeHtml(term)}</button>
                    <button onclick="removeRecentSearch('${escapeHtml(term)}')" class="text-red-500 text-sm">✕</button>
                `;
                recentSearchesList.appendChild(item);
            });
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

    window.setSearchTerm = function(term) {
        if (searchInput) {
            searchInput.value = term;
            performSearch(term);
        }
    };

    window.removeRecentSearch = function(term) {
        let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        recent = recent.filter(t => t !== term);
        localStorage.setItem('recentSearches', JSON.stringify(recent));
        loadRecentSearches();
    };

    window.clearRecentSearches = function() {
        if (confirm('هل تريد مسح كل عمليات البحث السابقة؟')) {
            localStorage.removeItem('recentSearches');
            loadRecentSearches();
        }
    };

    // تنفيذ البحث (محاكاة)
    async function performSearch(query) {
        if (!query.trim() || query.length < 2) {
            hideSuggestions();
            return;
        }

        showLoading();

        // محاكاة بيانات البحث (للتجربة)
        const mockResults = [{
                title: 'أفضل أدوات الذكاء الاصطناعي',
                url: 'post-detail.html'
            },
            {
                title: 'تعلم اللغة الإنجليزية من الصفر',
                url: 'post-detail.html'
            },
            {
                title: 'كورسات البرمجة للمبتدئين',
                url: 'post-detail.html'
            }
        ].filter(item => item.title.includes(query) || query.includes('كورس') || query.includes('تعلم'));

        setTimeout(() => {
            if (mockResults.length > 0) {
                showResults(mockResults);
                if (resultsCount) resultsCount.textContent = mockResults.length;
            } else {
                showEmptyState();
                if (resultsCount) resultsCount.textContent = '0';
            }
            hideLoading();
        }, 300);
    }

    function showResults(results) {
        if (liveResults) {
            liveResults.innerHTML = '';
            results.forEach(item => {
                const result = document.createElement('a');
                result.href = item.url;
                result.className = 'block p-4 hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700';
                result.innerHTML = `<div class="font-medium">${escapeHtml(item.title)}</div><div class="text-sm text-gray-500">${escapeHtml(item.url)}</div>`;
                liveResults.appendChild(result);
            });
        }
        if (emptyState) emptyState.classList.add('hidden');
        showSuggestions();
    }

    function showEmptyState() {
        if (liveResults) liveResults.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        showSuggestions();
    }

    function showLoading() {
        if (loadingState) loadingState.classList.remove('hidden');
        if (liveResults) liveResults.innerHTML = '';
        if (emptyState) emptyState.classList.add('hidden');
    }

    function hideLoading() {
        if (loadingState) loadingState.classList.add('hidden');
    }

    function showSuggestions() {
        if (searchSuggestions) {
            searchSuggestions.style.display = 'block';
            setTimeout(() => searchSuggestions.classList.remove('opacity-0', 'translate-y-2'), 10);
        }
    }

    function hideSuggestions() {
        if (searchSuggestions) {
            searchSuggestions.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => searchSuggestions.style.display = 'none', 300);
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            if (query.length < 2) {
                hideSuggestions();
                return;
            }
            searchTimeout = setTimeout(() => performSearch(query), 300);
        });

        searchInput.addEventListener('focus', function() {
            if (this.value.trim().length >= 2) performSearch(this.value);
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const query = searchInput ? .value.trim();
            if (query) saveRecentSearch(query);
        });
    }

    document.addEventListener('click', function(e) {
        if (searchForm && !searchForm.contains(e.target)) hideSuggestions();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') hideSuggestions();
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput ? .focus();
        }
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadRecentSearches();
});     blocks.forEach((block, i) => block.order = i);
        renderBlocks();
    }
}

function renderBlocks() {
    const container = document.getElementById('blocks_container');
    if (!container) return;
    
    container.innerHTML = '';
    
    blocks.sort((a, b) => a.order - b.order).forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.className = 'block-item';
        blockElement.id = block.id;
        
        if (block.type === 'text') {
            blockElement.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-paragraph text-gray-500 dark:text-gray-400 ml-2"></i>
                            <span class="font-medium text-gray-700 dark:text-gray-300">كتلة نصية</span>
                        </div>
                        <textarea 
                            class="form-control" 
                            rows="4" 
                            placeholder="اكتب محتوى الكتلة النصية هنا..."
                            oninput="updateBlock('${block.id}', this.value)"
                        >${escapeHtml(block.content)}</textarea>
                    </div>
                    <div class="flex flex-col gap-1 ml-2">
                        <div class="block-handle cursor-move" title="اسحب للتغيير">
                            <i class="fas fa-grip-vertical"></i>
                        </div>
                        <div class="block-actions">
                            <button type="button" onclick="moveBlockUp('${block.id}')" class="btn-icon bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" title="نقل لأعلى">
                                <i class="fas fa-arrow-up"></i>
                            </button>
                            <button type="button" onclick="moveBlockDown('${block.id}')" class="btn-icon bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" title="نقل لأسفل">
                                <i class="fas fa-arrow-down"></i>
                            </button>
                            <button type="button" onclick="removeBlock('${block.id}')" class="btn-icon bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400" title="حذف">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else if (block.type === 'image') {
            blockElement.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-image text-gray-500 dark:text-gray-400 ml-2"></i>
                            <span class="font-medium text-gray-700 dark:text-gray-300">كتلة صورة</span>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*"
                            class="form-control"
                            onchange="handleImageUpload('${block.id}', this)"
                        >
                        ${block.content ? `
                            <div class="mt-2">
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">الصورة الحالية:</p>
                                <img src="${block.content}" class="image-preview" alt="معاينة الصورة">
                            </div>
                        ` : ''}
                    </div>
                    <div class="flex flex-col gap-1 ml-2">
                        <div class="block-handle cursor-move" title="اسحب للتغيير">
                            <i class="fas fa-grip-vertical"></i>
                        </div>
                        <div class="block-actions">
                            <button type="button" onclick="moveBlockUp('${block.id}')" class="btn-icon bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" title="نقل لأعلى">
                                <i class="fas fa-arrow-up"></i>
                            </button>
                            <button type="button" onclick="moveBlockDown('${block.id}')" class="btn-icon bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" title="نقل لأسفل">
                                <i class="fas fa-arrow-down"></i>
                            </button>
                            <button type="button" onclick="removeBlock('${block.id}')" class="btn-icon bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400" title="حذف">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.appendChild(blockElement);
    });
    
    updateBlocksData();
}

function handleImageUpload(blockId, input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updateBlock(blockId, e.target.result);
            renderBlocks();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function updateBlocksData() {
    const blocksData = blocks.map(block => ({
        id: block.id,
        type: block.type,
        content: block.content,
        order: block.order
    }));
    const blocksDataInput = document.getElementById('blocks_data');
    if (blocksDataInput) {
        blocksDataInput.value = JSON.stringify(blocksData);
    }
}

function initDragAndDrop() {
    const container = document.getElementById('blocks_container');
    if (!container) return;

    container.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('block-handle') || e.target.closest('.block-handle')) {
            draggedBlock = e.target.closest('.block-item');
            if (draggedBlock) {
                draggedBlock.classList.add('opacity-50');
                e.dataTransfer.effectAllowed = 'move';
            }
        }
    });

    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    container.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedBlock) {
            draggedBlock.classList.remove('opacity-50');
            
            const afterElement = getDragAfterElement(container, e.clientY);
            const draggedId = draggedBlock.id;
            
            const draggedIndex = blocks.findIndex(b => b.id === draggedId);
            const draggedBlockData = blocks[draggedIndex];
            blocks.splice(draggedIndex, 1);
            
            let newIndex;
            if (afterElement == null) {
                newIndex = blocks.length;
            } else {
                newIndex = blocks.findIndex(b => b.id === afterElement.id);
            }
            
            blocks.splice(newIndex, 0, draggedBlockData);
            blocks.forEach((block, index) => block.order = index);
            renderBlocks();
            draggedBlock = null;
        }
    });

    container.addEventListener('dragend', function() {
        if (draggedBlock) {
            draggedBlock.classList.remove('opacity-50');
            draggedBlock = null;
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.block-item:not(.opacity-50)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ========================
// تبويبات الصفحة
// ========================
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) tabContent.classList.add('active');
        });
    });
}

// ========================
// التحقق من النموذج قبل الإرسال
// ========================
function initFormValidation() {
    const form = document.getElementById('postForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const title = document.getElementById('id_title')?.value.trim();
            if (!title) {
                e.preventDefault();
                alert('الرجاء إدخال عنوان للمنشور');
                document.getElementById('id_title')?.focus();
                return;
            }
            
            const category = document.getElementById('id_category')?.value;
            if (!category) {
                e.preventDefault();
                alert('الرجاء اختيار فئة للمنشور');
                document.getElementById('id_category')?.focus();
                return;
            }
            
            updateBlocksData();
        });
    }
}

// ========================
// دالة مساعدة لتشفير HTML
// ========================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================
// تهيئة CKEditor
// ========================
function initCKEditor() {
    if (typeof CKEDITOR !== 'undefined' && document.getElementById('id_content')) {
        CKEDITOR.replace('id_content', {
            language: 'ar',
            height: 400,
            toolbarGroups: [
                { name: 'document', groups: ['mode', 'document', 'doctools'] },
                { name: 'clipboard', groups: ['clipboard', 'undo'] },
                { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
                { name: 'forms' },
                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
                { name: 'links' },
                { name: 'insert' },
                { name: 'styles' },
                { name: 'colors' },
                { name: 'tools' },
                { name: 'others' },
                { name: 'about' }
            ],
            removeButtons: 'Save,NewPage,Preview,Print,Templates,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Outdent,Indent,CreateDiv,Blockquote,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Anchor,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,ShowBlocks,Maximize,About',
            extraPlugins: 'colorbutton,font,justify'
        });
    }
}

// ========================
// التهيئة عند تحميل الصفحة
// ========================
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initCharacterCounters();
    initImagePreviews();
    initCKEditor();
    initFormValidation();
    
    // تهيئة نظام البلوكات
    const existingBlocksData = document.getElementById('blocks_data')?.value;
    let existingBlocks = [];
    if (existingBlocksData && existingBlocksData !== '[]') {
        try {
            existingBlocks = JSON.parse(existingBlocksData);
        } catch(e) {}
    }
    initBlocksSystem(existingBlocks);
    
    // إضافة زر إضافة نص إذا لم يكن هناك بلوكات
    if (blocks.length === 0 && document.getElementById('blocks_container')) {
        addTextBlock('ابدأ بكتابة محتوى رائع هنا...');
    }
    
    // تحديث معاينة SEO
    document.getElementById('id_seo_title')?.dispatchEvent(new Event('input'));
    document.getElementById('id_seo_description')?.dispatchEvent(new Event('input'));
});