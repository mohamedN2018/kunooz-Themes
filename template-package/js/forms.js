/**
 * ملف وظائف النماذج (إنشاء وتعديل المنشورات)
 * تم استخراجه من create_post.html و edit_post.html
 */

// ========================
// نظام عداد الأحرف التلقائي
// ========================
function initCharacterCounters() {
    const charCounters = {
        'id_title': 200,
        'id_excerpt': 300,
        'id_seo_title': 200,
        'id_seo_description': 300
    };

    Object.keys(charCounters).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                const maxLength = charCounters[fieldId];

                if (field) {
                    function updateCounter() {
                        const currentLength = field.value.length;
                        const remaining = maxLength - currentLength;

                        // البحث عن العداد أو إنشاؤه
                        let counter = document.getElementById(`${fieldId}_counter`);
                        if (!counter) {
                            counter = document.createElement('div');
                            counter.id = `${fieldId}_counter`;
                            counter.className = 'character-counter';
                            field.parentNode.insertBefore(counter, field.nextSibling);
                        }

                        counter.innerHTML = `
                    <span class="${remaining < 0 ? 'text-red-500' : (remaining < 20 ? 'text-yellow-500' : 'text-gray-500')}">
                        ${currentLength}/${maxLength} حرف
                        ${remaining < 0 ? ` (تجاوزت الحد بـ ${Math.abs(remaining)} حرف)` : ''}
                    </span>
                `;
                counter.classList.toggle('over-limit', remaining < 0);
                
                // تغيير مظهر الحقل
                if (remaining < 0) {
                    field.style.borderColor = '#ef4444';
                    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    field.classList.add('input-error');
                } else if (remaining < 10) {
                    field.style.borderColor = '#f59e0b';
                    field.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    field.classList.remove('input-error');
                    field.classList.add('input-alert');
                } else {
                    field.style.borderColor = '';
                    field.style.boxShadow = '';
                    field.classList.remove('input-error', 'input-alert');
                }
                
                // تحديث المعاينة لـ SEO
                updateSEOPreview(fieldId, field.value);
            }
            
            field.addEventListener('input', updateCounter);
            field.addEventListener('focus', updateCounter);
            updateCounter();
        }
    });
}

// ========================
// تحديث معاينة SEO
// ========================
function updateSEOPreview(fieldId, value) {
    if (fieldId === 'id_seo_title') {
        const preview = document.getElementById('seo_title_preview');
        if (preview) preview.textContent = value || 'عنوان SEO سيظهر هنا';
    }
    if (fieldId === 'id_seo_description') {
        const preview = document.getElementById('seo_description_preview');
        if (preview) preview.textContent = value || 'وصف SEO سيظهر هنا...';
    }
}

// ========================
// معاينة الصور
// ========================
function initImagePreviews() {
    function previewImage(inputId, previewId, imgId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const img = document.getElementById(imgId);
        
        if (input && preview && img) {
            input.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        img.src = e.target.result;
                        preview.classList.remove('hidden');
                    }
                    reader.readAsDataURL(this.files[0]);
                } else {
                    preview.classList.add('hidden');
                }
            });
        }
    }

    previewImage('id_featured_image', 'featured_image_preview', 'featured_image_preview_img');
    previewImage('id_image', 'image_preview', 'image_preview_img');
}

// ========================
// نظام البلوكات (Drag & Drop)
// ========================
let blocks = [];
let blockCounter = 0;
let draggedBlock = null;

function initBlocksSystem(existingBlocks = []) {
    blocks = existingBlocks;
    if (blocks.length > 0) {
        blockCounter = Math.max(...blocks.map(b => parseInt(b.id.replace('block_', '')) || 0)) + 1;
    }
    renderBlocks();
    initDragAndDrop();
}

function addTextBlock(content = '') {
    const blockId = `block_${blockCounter++}`;
    const block = {
        id: blockId,
        type: 'text',
        content: content,
        order: blocks.length
    };
    blocks.push(block);
    renderBlocks();
    
    setTimeout(() => {
        const textarea = document.querySelector(`#${blockId} textarea`);
        if (textarea) textarea.focus();
    }, 100);
}

function addImageBlock(imageUrl = '') {
    const blockId = `block_${blockCounter++}`;
    const block = {
        id: blockId,
        type: 'image',
        content: imageUrl,
        order: blocks.length
    };
    blocks.push(block);
    renderBlocks();
}

function updateBlock(id, content) {
    const block = blocks.find(b => b.id === id);
    if (block) {
        block.content = content;
        updateBlocksData();
    }
}

function removeBlock(id) {
    blocks = blocks.filter(b => b.id !== id);
    blocks.forEach((block, index) => { block.order = index; });
    renderBlocks();
}

function moveBlockUp(id) {
    const index = blocks.findIndex(b => b.id === id);
    if (index > 0) {
        [blocks[index], blocks[index-1]] = [blocks[index-1], blocks[index]];
        blocks.forEach((block, i) => block.order = i);
        renderBlocks();
    }
}

function moveBlockDown(id) {
    const index = blocks.findIndex(b => b.id === id);
    if (index < blocks.length - 1) {
        [blocks[index], blocks[index+1]] = [blocks[index+1], blocks[index]];
        blocks.forEach((block, i) => block.order = i);
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