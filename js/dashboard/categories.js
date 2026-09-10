/**
 * categories.js — إدارة الفئات والشجرة الهرمية للفئات
 * يُحمَّل عند الحاجة (Lazy Loaded)
 */
(function () {
    'use strict';

    window.flatCategoriesList = window.flatCategoriesList || [];
    let pendingCatCounter = 0;

    // ===== حقن واجهة إدارة الفئات ديناميكياً =====
    window.ensureCategoriesHTML = function () {
        const mgtSec = document.getElementById('management');
        if (!mgtSec) return;

        if (!document.getElementById('category-manager-view')) {
            const html = `
            <div id="category-manager-view" style="display: none;">
                <div class="card-4d" style="padding: 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom: 1px dashed var(--border-glass); padding-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                        <h2 class="page-title" style="margin:0; font-size: 1.25rem;"><i class="fas fa-tags"></i> إدارة الفئات</h2>
                        <button type="button" class="btn-main" style="width:auto; background:var(--bg-body); color:var(--text-main); border:1px solid var(--border-glass); box-shadow:none; padding:6px 12px; font-size:0.85rem;" onclick="hideCategoryManager()"><i class="fas fa-arrow-right"></i> رجوع</button>
                    </div>

                    <div style="background: rgba(37, 99, 235, 0.05); border: 1px dashed var(--primary); border-radius: 10px; padding: 10px 12px; margin-bottom: 16px; font-size: 0.82rem; color: var(--text-muted); display:flex; align-items:flex-start; gap:8px;">
                        <i class="fas fa-info-circle" style="color:var(--primary); margin-top:2px;"></i>
                        <span>الفئة الجديدة تظهر هنا مباشرة وتصبح جاهزة للاستخدام، لكنها تُحفظ نهائياً في متجرك فقط عند إضافة أول منتج بها.</span>
                    </div>

                    <div class="box-container" style="padding: 14px; margin-bottom: 16px;">
                        <div class="box-title" style="font-size:0.95rem;"><i class="fas fa-plus-circle"></i> إضافة فئة جديدة</div>

                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 0.82rem; font-weight: bold; color: var(--primary); margin-bottom: 4px; display: block;">اسم الفئة</label>
                            <input type="text" id="cm-new-cat-input" class="modern-input" placeholder="مثال: سامسونج">
                        </div>

                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 0.82rem; font-weight: bold; color: var(--primary); margin-bottom: 4px; display: block;">نوع الفئة</label>
                            <div class="segment-group">
                                <button type="button" class="segment-btn active" id="cm-cat-mode-main" onclick="setCatManagerMode('main')"><i class="fas fa-folder"></i> رئيسية</button>
                                <button type="button" class="segment-btn" id="cm-cat-mode-sub" onclick="setCatManagerMode('sub')"><i class="fas fa-folder-tree"></i> فرعية</button>
                            </div>
                        </div>

                        <div id="cm-cat-parent-wrapper" style="display:none; margin-bottom: 10px;">
                            <label style="font-size: 0.82rem; font-weight: bold; color: var(--primary); margin-bottom: 4px; display: block;">اختر الفئة الأم</label>
                            <select id="cm-new-cat-parent" class="modern-input">
                                <option value="">-- كفئة رئيسية --</option>
                            </select>
                        </div>

                        <button type="button" class="btn-main" style="width:100%;" onclick="addCategoryFromManager()"><i class="fas fa-check"></i> إضافة الفئة</button>
                    </div>

                    <div class="box-container" style="padding: 14px;">
                        <div class="box-title" style="font-size:0.95rem;"><i class="fas fa-list-tree"></i> كل الفئات</div>
                        <div class="input-group" style="margin-bottom: 12px; flex-direction: row; align-items: center; position: relative;">
                            <i class="fas fa-search" style="position: absolute; right: 12px; color: var(--text-muted);"></i>
                            <input type="text" id="cm-search" class="modern-input" placeholder="ابحث عن فئة..." style="padding-right: 36px;" oninput="renderCategoryManagerTree()">
                        </div>
                        <div id="cm-tree-list"></div>
                    </div>
                </div>
            </div>`;
            mgtSec.insertAdjacentHTML('beforeend', html);
        }
    };

    // ===== جلب شجرة الفئات من الخادم =====
    window.fetchCategoryTree = async function () {
        if (typeof window.isDashboardRealtimeReady === 'function'
            && window.isDashboardRealtimeReady()
            && Array.isArray(window.flatCategoriesList)) {
            window.initDynamicCategories();
            if (typeof window.refreshProductCategoryNames === 'function') {
                window.refreshProductCategoryNames();
            }
            return;
        }
        try {
            const res = await window.apiReq('get_categories_tree', {}, 'POST', false, true);
            if (res && res.status === 'success' && Array.isArray(res.data)) {
                window.flatCategoriesList = res.data;
            } else {
                window.flatCategoriesList = [];
            }
            window.initDynamicCategories();
            if (typeof window.refreshProductCategoryNames === 'function') {
                window.refreshProductCategoryNames();
            }
        } catch (e) {
            window.flatCategoriesList = [];
            window.initDynamicCategories();
        }
    };

    // ===== تهيئة قائمة الفئات في نموذج المنتج =====
    window.initDynamicCategories = function (opts = {}) {
        const select = document.getElementById('single-category-select');
        const parentSelect = document.getElementById('new-cat-parent');
        if (!select) return;

        const desiredValue = opts.selectValue !== undefined ? String(opts.selectValue) : select.value;
        const desiredParentValue = parentSelect ? parentSelect.value : '';

        let categoriesMap = {};
        let roots = [];

        (window.flatCategoriesList || []).forEach(cat => {
            categoriesMap[cat.id] = { ...cat, children: [] };
        });

        (window.flatCategoriesList || []).forEach(cat => {
            if (cat.parent_id && categoriesMap[cat.parent_id]) {
                categoriesMap[cat.parent_id].children.push(categoriesMap[cat.id]);
            } else {
                roots.push(categoriesMap[cat.id]);
            }
        });

        let htmlOptions = '<option value="">اختر الفئة...</option><option value="new" style="color:var(--primary); font-weight:bold;">✨ + إضافة فئة جديدة</option>';
        let parentOptions = '<option value="">-- كفئة رئيسية --</option>';

        function buildOptions(nodes, prefix = '') {
            nodes.forEach(node => {
                const displayPrefix = prefix ? prefix + ' ↳ ' : '';
                const pendingTag = node._pending ? ' (جديدة)' : '';
                const label = window.escapeHTML(displayPrefix + node.name) + pendingTag;
                htmlOptions += `<option value="${node.id}">${label}</option>`;
                parentOptions += `<option value="${node.id}">${label}</option>`;
                if (node.children && node.children.length > 0) {
                    buildOptions(node.children, displayPrefix + node.name);
                }
            });
        }

        buildOptions(roots);

        select.innerHTML = htmlOptions;
        if (parentSelect) parentSelect.innerHTML = parentOptions;

        if (desiredValue && Array.from(select.options).some(o => o.value === desiredValue)) {
            select.value = desiredValue;
        }
        if (parentSelect && desiredParentValue && Array.from(parentSelect.options).some(o => o.value === desiredParentValue)) {
            parentSelect.value = desiredParentValue;
        }

        if (typeof window.updateCustomSelect === 'function') {
            window.updateCustomSelect(select);
            if (parentSelect) window.updateCustomSelect(parentSelect);
        }

        const isNewProduct = !document.getElementById('p-id')?.value;
        if ((!window.flatCategoriesList || window.flatCategoriesList.length === 0) && isNewProduct && !opts.selectValue) {
            select.value = 'new';
            window.handleFlatCatChange(select);
            const catInp = document.getElementById('new-cat-input-text');
            if (catInp) catInp.placeholder = "اكتب فئة المنتج هنا...";
        }
    };

    window.handleFlatCatChange = function (selectEl) {
        const wrapper = document.getElementById('new-cat-wrapper');
        if (!wrapper) return;
        if (selectEl.value === 'new') {
            wrapper.style.display = 'block';
            const selWrap = selectEl.closest('.custom-select-wrapper');
            if (selWrap) selWrap.style.display = 'none';
            const catInp = document.getElementById('new-cat-input-text');
            if (catInp) catInp.focus();
        } else {
            wrapper.style.display = 'none';
        }
    };

    window.setNewCatMode = function (mode) {
        const mainBtn = document.getElementById('new-cat-mode-main');
        const subBtn = document.getElementById('new-cat-mode-sub');
        const parentWrapper = document.getElementById('new-cat-parent-wrapper');
        const parentSelect = document.getElementById('new-cat-parent');
        if (!mainBtn || !subBtn || !parentWrapper) return;

        if (mode === 'sub') {
            mainBtn.classList.remove('active');
            subBtn.classList.add('active');
            parentWrapper.style.display = 'block';
        } else {
            subBtn.classList.remove('active');
            mainBtn.classList.add('active');
            parentWrapper.style.display = 'none';
            if (parentSelect) parentSelect.value = '';
        }
    };

    window.confirmFlatNewCat = function () {
        const input = document.getElementById('new-cat-input-text');
        const select = document.getElementById('single-category-select');
        const parentSelect = document.getElementById('new-cat-parent');
        if (!input || !select) return;

        const val = input.value.trim();
        const parentId = parentSelect ? (parentSelect.value || 0) : 0;

        if (!val) {
            window.showT('يرجى كتابة اسم الفئة', 'error');
            input.focus();
            return;
        }

        const duplicate = (window.flatCategoriesList || []).some(c =>
            String(c.parent_id || 0) === String(parentId || 0) &&
            (c.name || '').trim().toLowerCase() === val.toLowerCase()
        );
        if (duplicate) {
            window.showT('هذه الفئة موجودة مسبقاً', 'info');
            window.cancelFlatNewCat();
            return;
        }

        const tempId = 'NEW:' + (++pendingCatCounter) + '_' + Date.now();
        window.flatCategoriesList.push({ id: tempId, name: val, parent_id: parentId || 0, _pending: true });

        window.initDynamicCategories({ selectValue: tempId });

        const wrapper = document.getElementById('new-cat-wrapper');
        if (wrapper) wrapper.style.display = 'none';
        const selWrap = select.closest('.custom-select-wrapper');
        if (selWrap) selWrap.style.display = 'block';
        input.value = '';
        window.setNewCatMode('main');

        window.showT(`تمت إضافة الفئة "${val}"`, 'success');
    };

    window.buildPendingCategoryChain = function (leafId) {
        const names = [];
        let currentId = leafId;
        const visited = new Set();

        while (currentId && String(currentId).startsWith('NEW:') && !visited.has(currentId)) {
            visited.add(currentId);
            const node = (window.flatCategoriesList || []).find(c => String(c.id) === String(currentId));
            if (!node) break;
            names.unshift(node.name);
            currentId = node.parent_id || 0;
        }

        const anchorId = (currentId && !String(currentId).startsWith('NEW:')) ? currentId : 0;
        return { names, anchorId };
    };

    window.cancelFlatNewCat = function () {
        const select = document.getElementById('single-category-select');
        const parentSelect = document.getElementById('new-cat-parent');
        if (select) select.value = '';
        const newCatWrap = document.getElementById('new-cat-wrapper');
        if (newCatWrap) newCatWrap.style.display = 'none';
        if (select) {
            const selWrap = select.closest('.custom-select-wrapper');
            if (selWrap) selWrap.style.display = 'block';
        }
        const textInp = document.getElementById('new-cat-input-text');
        if (textInp) textInp.value = '';
        if (parentSelect) {
            parentSelect.value = '';
            if (typeof window.updateCustomSelect === 'function') window.updateCustomSelect(parentSelect);
        }
        if (select && typeof window.updateCustomSelect === 'function') window.updateCustomSelect(select);
        window.setNewCatMode('main');
    };

    // ===== نافذة إدارة الفئات (Category Manager) =====
    window.showCategoryManager = function () {
        window.ensureCategoriesHTML();
        const pList = document.getElementById('product-list-view');
        const pForm = document.getElementById('product-form-view');
        const cmView = document.getElementById('category-manager-view');
        if (typeof window.setProductViewVisibility === 'function') {
            window.setProductViewVisibility('product-list-view', false);
            window.setProductViewVisibility('product-form-view', false);
            window.setProductViewVisibility('category-manager-view', true);
        } else {
            if (pList) pList.style.display = 'none';
            if (pForm) pForm.style.display = 'none';
            if (cmView) cmView.style.display = 'block';
        }

        const cmInput = document.getElementById('cm-new-cat-input');
        if (cmInput) cmInput.value = '';
        const cmSearch = document.getElementById('cm-search');
        if (cmSearch) cmSearch.value = '';
        window.setCatManagerMode('main');

        if (!window.flatCategoriesList || window.flatCategoriesList.length === 0) {
            window.fetchCategoryTree().then(() => {
                window.buildCmParentOptions();
                window.renderCategoryManagerTree();
            });
        } else {
            window.buildCmParentOptions();
            window.renderCategoryManagerTree();
        }
    };

    window.hideCategoryManager = function () {
        const cmView = document.getElementById('category-manager-view');
        const pList = document.getElementById('product-list-view');
        if (cmView) cmView.style.display = 'none';
        if (pList) pList.style.display = 'block';
    };

    window.setCatManagerMode = function (mode) {
        const mainBtn = document.getElementById('cm-cat-mode-main');
        const subBtn = document.getElementById('cm-cat-mode-sub');
        const parentWrapper = document.getElementById('cm-cat-parent-wrapper');
        const parentSelect = document.getElementById('cm-new-cat-parent');
        if (!mainBtn || !subBtn || !parentWrapper) return;

        if (mode === 'sub') {
            mainBtn.classList.remove('active');
            subBtn.classList.add('active');
            parentWrapper.style.display = 'block';
        } else {
            subBtn.classList.remove('active');
            mainBtn.classList.add('active');
            parentWrapper.style.display = 'none';
            if (parentSelect) parentSelect.value = '';
        }
    };

    window.buildCmParentOptions = function () {
        const parentSelect = document.getElementById('cm-new-cat-parent');
        if (!parentSelect) return;
        const desired = parentSelect.value;

        let categoriesMap = {}, roots = [];
        (window.flatCategoriesList || []).forEach(cat => { categoriesMap[cat.id] = { ...cat, children: [] }; });
        (window.flatCategoriesList || []).forEach(cat => {
            if (cat.parent_id && categoriesMap[cat.parent_id]) categoriesMap[cat.parent_id].children.push(categoriesMap[cat.id]);
            else roots.push(categoriesMap[cat.id]);
        });

        let optionsHtml = '<option value="">-- كفئة رئيسية --</option>';
        (function build(nodes, prefix) {
            nodes.forEach(node => {
                const displayPrefix = prefix ? prefix + ' ↳ ' : '';
                const pendingTag = node._pending ? ' (معلّقة)' : '';
                optionsHtml += `<option value="${node.id}">${window.escapeHTML(displayPrefix + node.name)}${pendingTag}</option>`;
                if (node.children && node.children.length > 0) build(node.children, displayPrefix + node.name);
            });
        })(roots, '');

        parentSelect.innerHTML = optionsHtml;
        if (desired && Array.from(parentSelect.options).some(o => o.value === desired)) parentSelect.value = desired;
        if (typeof window.updateCustomSelect === 'function') window.updateCustomSelect(parentSelect);
    };

    window.addCategoryFromManager = function () {
        const input = document.getElementById('cm-new-cat-input');
        const parentSelect = document.getElementById('cm-new-cat-parent');
        if (!input) return;
        let val = input.value.trim();
        if (typeof window.SecurityGuard?.sanitizeString === 'function') {
            val = window.SecurityGuard.sanitizeString(val);
        }
        const parentId = parentSelect ? (parentSelect.value || 0) : 0;

        if (!val || val.length < 2) {
            window.showT('يرجى كتابة اسم صحيح للفئة (حرفين على الأقل)', 'error');
            input.focus();
            return;
        }

        if (val.length > 60) {
            window.showT('اسم الفئة طويل جداً (الحد الأقصى 60 حرفاً)', 'error');
            return;
        }

        const duplicate = (window.flatCategoriesList || []).some(c =>
            String(c.parent_id || 0) === String(parentId || 0) &&
            (c.name || '').trim().toLowerCase() === val.toLowerCase()
        );
        if (duplicate) {
            window.showT('هذه الفئة موجودة مسبقاً', 'info');
            return;
        }

        const tempId = 'NEW:' + (++pendingCatCounter) + '_' + Date.now();
        window.flatCategoriesList.push({ id: tempId, name: val, parent_id: parentId || 0, _pending: true });

        input.value = '';
        window.setCatManagerMode('main');
        window.buildCmParentOptions();
        window.renderCategoryManagerTree();

        if (document.getElementById('single-category-select')) window.initDynamicCategories();

        window.showT(`تمت إضافة الفئة "${val}"`, 'success');
    };

    window.removeCategoryNode = function (id) {
        if (!id || id === 'undefined' || id === 'null') return;
        const node = (window.flatCategoriesList || []).find(c => String(c.id) === String(id));
        if (!node || !node._pending) return;

        const idsToRemove = new Set([String(id)]);
        let changed = true;
        while (changed) {
            changed = false;
            (window.flatCategoriesList || []).forEach(c => {
                if (c.parent_id && idsToRemove.has(String(c.parent_id)) && !idsToRemove.has(String(c.id))) {
                    idsToRemove.add(String(c.id));
                    changed = true;
                }
            });
        }

        window.flatCategoriesList = window.flatCategoriesList.filter(c => !idsToRemove.has(String(c.id)));

        window.buildCmParentOptions();
        window.renderCategoryManagerTree();
        if (document.getElementById('single-category-select')) window.initDynamicCategories();
        window.showT('تم حذف الفئة المعلّقة', 'success');
    };

    window.renderCategoryManagerTree = function () {
        const container = document.getElementById('cm-tree-list');
        if (!container) return;

        const searchEl = document.getElementById('cm-search');
        const searchTerm = searchEl ? searchEl.value.trim().toLowerCase() : '';

        if (!window.flatCategoriesList || window.flatCategoriesList.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:25px; color:var(--text-muted);"><i class="fas fa-tags" style="font-size:1.8rem; opacity:.4; margin-bottom:8px; display:block;"></i><p style="font-weight:800;">لا توجد فئات بعد.</p></div>`;
            return;
        }

        let categoriesMap = {}, roots = [];
        window.flatCategoriesList.forEach(cat => { categoriesMap[cat.id] = { ...cat, children: [] }; });
        window.flatCategoriesList.forEach(cat => {
            if (cat.parent_id && categoriesMap[cat.parent_id]) categoriesMap[cat.parent_id].children.push(categoriesMap[cat.id]);
            else roots.push(categoriesMap[cat.id]);
        });

        function matches(node) {
            if (!searchTerm) return true;
            if ((node.name || '').toLowerCase().includes(searchTerm)) return true;
            return (node.children || []).some(matches);
        }

        let html = '';
        function renderNodes(nodes, depth) {
            nodes.forEach(node => {
                if (!matches(node)) return;
                const pendingBadge = node._pending
                    ? '<span style="background:rgba(37,99,235,0.12); color:var(--primary); font-size:0.65rem; font-weight:800; padding:2px 6px; border-radius:50px; margin-right:4px;">معلّقة</span>'
                    : '';
                const deleteBtn = node._pending
                    ? `<button type="button" onclick="removeCategoryNode('${node.id}')" style="background:rgba(239,68,68,0.1); color:var(--danger); border:none; padding:4px 8px; border-radius:6px; cursor:pointer;"><i class="fas fa-trash"></i></button>`
                    : '';

                html += `
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 10px; border-bottom:1px solid var(--border-glass); padding-right:${10 + depth * 18}px;">
                        <div style="display:flex; align-items:center; gap:6px; min-width:0;">
                            <i class="fas ${depth === 0 ? 'fa-folder' : 'fa-angle-left'}" style="color:var(--primary); flex-shrink:0;"></i>
                            <span style="font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:0.9rem;">${window.escapeHTML(node.name)}</span>
                            ${pendingBadge}
                        </div>
                        ${deleteBtn}
                    </div>`;

                if (node.children && node.children.length > 0) renderNodes(node.children, depth + 1);
            });
        }

        renderNodes(roots, 0);

        if (!html) {
            html = `<div style="text-align:center; padding:25px; color:var(--text-muted);"><p style="font-weight:800;">لا توجد نتائج مطابقة.</p></div>`;
        }

        container.innerHTML = html;
    };

    window.ensureCategoriesHTML();

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('categories');

})();
