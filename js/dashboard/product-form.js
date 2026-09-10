/**
 * product-form.js — نموذج إضافة وتعديل المنتج والخيارات والضغط والنشر
 * يُحمَّل عند الحاجة (Lazy Loaded)
 */
(function () {
    'use strict';

    window.isProductFormDirty = false;
    window.pendingTabToSwitch = null;
    let variantsCount = 0;

    // ===== حقن نموذج المنتج وشاشة القفل ديناميكياً =====
    window.ensureProductFormHTML = function () {
        const mgtSec = document.getElementById('management');
        if (!mgtSec) return;

        // لا تترك مربعات التحميل خلف نموذج الإضافة أو التعديل.
        mgtSec.querySelectorAll(':scope > .section-skeleton').forEach(skeleton => skeleton.remove());

        if (!document.getElementById('publish-lock-overlay')) {
            const overlayHtml = `
            <div id="publish-lock-overlay" class="publish-lock-overlay">
                <div class="publish-content-box">
                    <div id="publish-icon"><div class="publish-spinner"></div></div>
                    <h2 class="publish-lock-text" id="publish-lock-text" style="color: var(--text-main); font-size: 1.25rem; font-weight: 900; margin-bottom: 4px;">جاري التجهيز...</h2>
                    <p class="publish-lock-subtext" id="publish-lock-subtext" style="color: var(--text-muted); margin-bottom: 18px; font-size: 0.85rem; font-weight: 700;">الرجاء عدم إغلاق هذه الصفحة</p>
                    <div style="width: 100%; height: 5px; background: var(--bg-body); border-radius: 10px; overflow: hidden; border: 1px solid var(--border-glass);">
                        <div id="publish-progress" style="height: 100%; width: 0%; background: linear-gradient(90deg, var(--primary), var(--accent-cyan)); transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', overlayHtml);
        }

        if (!document.getElementById('product-form-view')) {
            const formHtml = `
            <div id="product-form-view" style="display: none;">
                <div class="card-4d" style="padding: 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom: 1px dashed var(--border-glass); padding-bottom: 12px;">
                        <h2 id="form-title" class="page-title" style="margin:0; font-size: 1.25rem;">إضافة منتج</h2>
                        <button type="button" class="btn-main" style="width:auto; background:var(--bg-body); color:var(--text-main); border:1px solid var(--border-glass); box-shadow:none; padding:6px 12px; font-size:0.85rem;" onclick="showProductList()"><i class="fas fa-arrow-right"></i> رجوع</button>
                    </div>

                    <form id="p-form" onsubmit="saveP(event)">
                        <input type="hidden" id="p-id" name="id">
                        
                        <div class="box-container" id="basic-info-group" style="padding: 14px;">
                            <div class="box-title" style="font-size:0.95rem;"><i class="fas fa-info-circle"></i> البيانات الأساسية</div>
                            <div class="input-group" style="margin-bottom: 12px;"><label>الاسم <span style="color:var(--danger)">*</span></label><input type="text" id="p-name" name="name" class="modern-input" required></div>
                            
                            <div class="box-title" style="font-size:0.95rem; margin-top: 12px; border-top: 1px dashed var(--border-glass); padding-top: 12px;">
                                <i class="fas fa-tags"></i> فئة المنتج <span style="color:var(--danger)">*</span>
                            </div>
                            <div style="margin-bottom: 12px; position: relative;">
                                <select id="single-category-select" name="category_id" class="modern-input" required onchange="handleFlatCatChange(this)">
                                    <option value="">اختر الفئة...</option>
                                    <option value="new" style="color:var(--primary); font-weight:bold;">✨ + إضافة فئة جديدة</option>
                                </select>
                                
                                <div class="new-cat-input-wrapper" id="new-cat-wrapper" style="display:none; margin-top:8px; background: rgba(37, 99, 235, 0.04); padding: 12px; border-radius: 10px; border: 1px dashed var(--primary);">
                                    <div style="margin-bottom: 10px;">
                                        <label style="font-size: 0.8rem; font-weight: bold; color: var(--primary); margin-bottom: 4px; display: block;">اسم الفئة الجديدة</label>
                                        <input type="text" id="new-cat-input-text" class="modern-input" placeholder="مثال: سامسونج">
                                    </div>

                                    <div style="margin-bottom: 10px;">
                                        <label style="font-size: 0.8rem; font-weight: bold; color: var(--primary); margin-bottom: 4px; display: block;">نوع الفئة</label>
                                        <div class="segment-group">
                                            <button type="button" class="segment-btn active" id="new-cat-mode-main" onclick="setNewCatMode('main')"><i class="fas fa-folder"></i> رئيسية</button>
                                            <button type="button" class="segment-btn" id="new-cat-mode-sub" onclick="setNewCatMode('sub')"><i class="fas fa-folder-tree"></i> فرعية</button>
                                        </div>
                                    </div>

                                    <div id="new-cat-parent-wrapper" style="display:none; margin-bottom: 10px;">
                                        <label style="font-size: 0.8rem; font-weight: bold; color: var(--primary); margin-bottom: 4px; display: block;">اختر الفئة الأم</label>
                                        <select id="new-cat-parent" class="modern-input">
                                            <option value="">-- كفئة رئيسية --</option>
                                        </select>
                                    </div>

                                    <div style="display:flex; gap:6px;">
                                        <button type="button" class="btn-main" style="flex:1;" onclick="confirmFlatNewCat()"><i class="fas fa-check"></i> إضافة الفئة</button>
                                        <button type="button" class="btn-main" style="background:rgba(239, 68, 68, 0.1); color:var(--danger); width:auto;" onclick="cancelFlatNewCat()"><i class="fas fa-times"></i></button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="input-group" style="margin-bottom: 12px;"><label>الوصف <span style="color:var(--danger)">*</span></label><textarea id="p-desc" name="mainDescription" class="modern-input" rows="3" required></textarea></div>
                            <div class="input-group full-width">
                                <label>الصورة الرئيسية <span style="color:var(--danger)">*</span></label>
                                <label class="modern-file-upload" style="padding: 16px; display: block; margin:0;">
                                    <input type="file" id="img-upload-file" name="image_file" class="file-input-hidden" accept="image/jpeg, image/png, image/webp" onchange="previewMainImg(this)">
                                    <div class="file-upload-label" id="main-img-label"><i class="fas fa-cloud-upload-alt"></i><span>اختر صورة</span></div>
                                    <div class="img-preview-wrapper" id="main-img-preview-box" style="display:none;"><img id="main-img-preview" src=""></div>
                                </label>
                                <input type="hidden" id="existing_image" name="existing_image">
                            </div>
                        </div>
                        
                        <div class="box-container" id="inventory-pricing-group" style="padding: 14px;">
                            <div class="box-title" style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                                <span><i class="fas fa-tags"></i> التسعير والمخزون</span>
                                <label style="cursor:pointer; display:flex; align-items:center; gap:4px; font-size:0.82rem; background:rgba(37,99,235,0.08); padding:4px 8px; border-radius:8px; color:var(--primary); font-weight:bold;"><input type="checkbox" id="has-variants-cb" onchange="toggleVariantsBuilder()"> منتج متعدد (مقاس/لون)</label>
                            </div>
                            
                            <div class="form-grid" style="margin-bottom: 12px; border-bottom: 1px dashed var(--border-glass); padding-bottom: 12px;">
                                 <div class="input-group">
                                     <label>العملة وسعر البيع <span style="color:var(--danger)">*</span></label>
                                     <div style="display: flex; gap: 6px; align-items: center;">
                                         <div style="flex: 1;">
                                             <select id="p-currency" name="currency" class="modern-input" required>
                                                 <option value="YER">يمني (YER)</option>
                                                 <option value="SAR">سعودي (SAR)</option>
                                                 <option value="USD">دولار (USD)</option>
                                             </select>
                                         </div>
                                         <input type="number" id="p-price" name="price" class="modern-input" required step="0.01" placeholder="0.00" style="flex: 2;">
                                     </div>
                                 </div>
                                 <div class="input-group"><label>التكلفة</label><input type="number" id="p-cost" name="cost_price" class="modern-input" required step="0.01" value="0"></div>
                                 <div class="input-group"><label>نسبة الخصم (%)</label><input type="number" id="p-discount" name="discount" class="modern-input" step="1" min="0" max="100" value="0"></div>
                            </div>

                            <div id="simple-pricing-group">
                                <div class="form-grid">
                                    <div class="input-group">
                                        <label>نوع المخزون</label>
                                        <select id="p-qty-type" name="quantity_type" class="modern-input" onchange="toggleMainQtyInput()">
                                            <option value="tracked">محدودة</option>
                                            <option value="unlimited">متجددة دائماً</option>
                                        </select>
                                    </div>
                                    <div class="input-group" id="main-qty-wrapper"><label>الكمية <span style="color:var(--danger)">*</span></label><input type="number" id="p-qty" name="quantity" class="modern-input" value="1" min="1"></div>
                                </div>
                            </div>
                            
                            <div id="variants-builder-group" style="display:none;">
                                <div class="variants-container" id="variants-list"></div>
                                <button type="button" class="btn-main" style="background:var(--bg-body); color:var(--primary); border:1px dashed var(--primary); box-shadow:none; padding:8px; font-size:0.9rem;" onclick="addVariantRow()"><i class="fas fa-plus"></i> إضافة خيار</button>
                            </div>
                            
                            <div class="input-group" style="margin-top: 12px;">
                                <label>إتاحة المنتج في المتجر</label>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="isAvailable" name="isAvailable" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                        <button type="submit" id="btn-save" class="btn-main"><i class="fas fa-save"></i> <span>حفظ ونشر المنتج</span></button>
                    </form>
                </div>
            </div>`;
            mgtSec.insertAdjacentHTML('beforeend', formHtml);
            window.bindProductFormEvents();
        }
    };

    // ===== إظهار وإخفاء نموذج المنتج =====
    window.setProductViewVisibility = function (view, visible) {
        const element = document.getElementById(view);
        if (!element) return;
        element.hidden = !visible;
        element.setAttribute('aria-hidden', visible ? 'false' : 'true');
        element.style.setProperty('display', visible ? 'block' : 'none', 'important');
    };

    window.showProductForm = async function (isEdit = false) {
        if (typeof window.startTabProgress === 'function') window.startTabProgress();
        window.ensureProductFormHTML();
        await window.ModuleLoader.load('categories');
        if (typeof window.initDynamicCategories === 'function') window.initDynamicCategories();

        const listView = document.getElementById('product-list-view');
        const formView = document.getElementById('product-form-view');
        const catView = document.getElementById('category-manager-view');

        window.setProductViewVisibility('product-list-view', false);
        window.setProductViewVisibility('category-manager-view', false);
        if (formView) {
            window.setProductViewVisibility('product-form-view', true);
            formView.classList.remove('product-view-enter');
            void formView.offsetWidth; // trigger reflow for smooth enter
            formView.classList.add('product-view-enter');
        }

        const formTitle = document.getElementById('form-title');
        if (formTitle) formTitle.textContent = isEdit ? 'تعديل منتج' : 'إضافة منتج';

        const btnSave = document.getElementById('btn-save');

        if (!isEdit) {
            const form = document.getElementById('p-form');
            if (form) form.reset();
            const pIdInput = document.getElementById('p-id');
            if (pIdInput) pIdInput.value = '';

            const mainImgLabel = document.getElementById('main-img-label');
            if (mainImgLabel) mainImgLabel.style.display = 'flex';
            const mainImgPreviewBox = document.getElementById('main-img-preview-box');
            if (mainImgPreviewBox) mainImgPreviewBox.style.display = 'none';
            const existingImg = document.getElementById('existing_image');
            if (existingImg) existingImg.value = '';

            window.resetVariantsBuilder();
            const isAvail = document.getElementById('isAvailable');
            if (isAvail) isAvail.checked = true;

            const pCurrencySel = document.getElementById('p-currency');
            if (pCurrencySel) {
                pCurrencySel.value = 'YER';
                if (typeof window.updateCustomSelect === 'function') window.updateCustomSelect(pCurrencySel);
            }
            const pQtyTypeSel = document.getElementById('p-qty-type');
            if (pQtyTypeSel) {
                pQtyTypeSel.value = 'tracked';
                if (typeof window.updateCustomSelect === 'function') window.updateCustomSelect(pQtyTypeSel);
            }
            window.toggleMainQtyInput();

            const catSel = document.getElementById('single-category-select');
            if (catSel) {
                catSel.value = '';
                if (typeof window.updateCustomSelect === 'function') window.updateCustomSelect(catSel);
            }

            if (btnSave) {
                btnSave.disabled = false;
                btnSave.style.opacity = '1';
                btnSave.style.cursor = 'pointer';
                btnSave.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> <span>حفظ ونشر المنتج</span>';
            }

            window.isProductFormDirty = false;
            window.originalProductData = window.captureCurrentFormData();
            if (typeof window.finishTabProgress === 'function') window.finishTabProgress();
        } else {
            if (btnSave) {
                btnSave.innerHTML = '<i class="fas fa-save"></i> <span>حفظ التعديلات</span>';
            }
        }

        const isLowPerf = document.documentElement.classList.contains('low-performance');
        window.scrollTo({ top: 0, behavior: isLowPerf ? 'auto' : 'smooth' });
    };

    window.executeShowProductList = function () {
        if (typeof window.startTabProgress === 'function') window.startTabProgress();
        const formView = document.getElementById('product-form-view');
        const listView = document.getElementById('product-list-view');
        const catView = document.getElementById('category-manager-view');
        window.setProductViewVisibility('product-form-view', false);
        window.setProductViewVisibility('category-manager-view', false);
        if (listView) {
            window.setProductViewVisibility('product-list-view', true);
            listView.classList.remove('product-view-enter');
            void listView.offsetWidth;
            listView.classList.add('product-view-enter');
        }
        window.isProductFormDirty = false;
        if (typeof window.finishTabProgress === 'function') window.finishTabProgress();
    };

    window.showProductList = function () {
        if (window.isProductFormDirty) {
            window.pendingTabToSwitch = null;
            window.openM('unsaved-modal');
            return;
        }
        window.executeShowProductList();
    };

    window.confirmLeaveForm = function () {
        window.closeM('unsaved-modal');
        window.isProductFormDirty = false;
        window.executeShowProductList();
        if (window.pendingTabToSwitch) {
            const tab = window.pendingTabToSwitch;
            window.pendingTabToSwitch = null;
            if (typeof window.switchT === 'function') window.switchT(tab);
        }
    };

    // ===== تعديل منتج فوري وسريع مع إضاءة شريط التقدم =====
    window.editProduct = async function (p) {
        if (!p) return;
        if (typeof window.startTabProgress === 'function') window.startTabProgress();

        await window.showProductForm(true);

        const pId = document.getElementById('p-id');
        if (pId) pId.value = p.global_product_id || p.id;
        const pName = document.getElementById('p-name');
        if (pName) pName.value = p.name || '';
        const pDesc = document.getElementById('p-desc');
        if (pDesc) pDesc.value = p.mainDescription || p.description || '';
        const pPrice = document.getElementById('p-price');
        if (pPrice) pPrice.value = p.price !== undefined ? p.price : '';
        const pCost = document.getElementById('p-cost');
        if (pCost) pCost.value = p.cost_price || 0;
        const pDiscount = document.getElementById('p-discount');
        if (pDiscount) pDiscount.value = p.discount || 0;

        const pCurrency = document.getElementById('p-currency');
        if (pCurrency) {
            pCurrency.value = p.currency || 'YER';
            if (typeof window.updateCustomSelect === 'function') window.updateCustomSelect(pCurrency);
        }

        const pQtyType = document.getElementById('p-qty-type');
        if (pQtyType) {
            pQtyType.value = p.quantity_type || 'tracked';
            if (typeof window.updateCustomSelect === 'function') window.updateCustomSelect(pQtyType);
        }
        window.toggleMainQtyInput();

        let catId = p.category_id || '';
        if (!catId && p.type && window.flatCategoriesList && window.flatCategoriesList.length > 0) {
            const foundCat = window.flatCategoriesList.find(c => c.name === p.type);
            if (foundCat) catId = foundCat.id;
        }
        const catSelect = document.getElementById('single-category-select');
        if (catSelect) {
            catSelect.value = catId ? String(catId) : '';
            if (typeof window.updateCustomSelect === 'function') window.updateCustomSelect(catSelect);
        }

        const isAvailEl = document.getElementById('isAvailable');
        if (isAvailEl) {
            isAvailEl.checked = (p.is_available == '1' || p.is_available === true || p.isAvailable == '1' || p.isAvailable === true || p.is_available === undefined);
        }

        if (p.image) {
            const mainLabel = document.getElementById('main-img-label');
            if (mainLabel) mainLabel.style.display = 'none';
            const previewBox = document.getElementById('main-img-preview-box');
            if (previewBox) previewBox.style.display = 'block';
            const previewImg = document.getElementById('main-img-preview');
            if (previewImg) previewImg.src = p.image;
            const existImg = document.getElementById('existing_image');
            if (existImg) existImg.value = p.image;
        } else {
            const mainLabel = document.getElementById('main-img-label');
            if (mainLabel) mainLabel.style.display = 'flex';
            const previewBox = document.getElementById('main-img-preview-box');
            if (previewBox) previewBox.style.display = 'none';
            const existImg = document.getElementById('existing_image');
            if (existImg) existImg.value = '';
        }

        let productOptions = p.options;
        if (typeof productOptions === 'string') {
            try { productOptions = JSON.parse(productOptions); } catch (e) { productOptions = []; }
        }
        if (!Array.isArray(productOptions)) productOptions = [];

        if (productOptions.length === 0) {
            const hasVar = document.getElementById('has-variants-cb');
            if (hasVar) hasVar.checked = false;
            window.toggleVariantsBuilder();
            const pQty = document.getElementById('p-qty');
            if (pQty) pQty.value = p.quantity || 1;
        } else {
            const hasVar = document.getElementById('has-variants-cb');
            if (hasVar) hasVar.checked = true;
            window.toggleVariantsBuilder();
            const vList = document.getElementById('variants-list');
            if (vList) vList.innerHTML = '';
            productOptions.forEach(opt => {
                const useMain = (opt.use_main_image == 1 || opt.use_main_image === true || !opt.image);
                window.addVariantRow(opt.name, opt.quantity_type, opt.quantity, opt.image, useMain, opt.custom_price);
            });
        }

        requestAnimationFrame(() => {
            window.originalProductData = window.captureCurrentFormData();
            const btnSave = document.getElementById('btn-save');
            if (btnSave) {
                btnSave.disabled = true;
                btnSave.style.opacity = "0.5";
                btnSave.style.cursor = "not-allowed";
                btnSave.innerHTML = '<i class="fas fa-save"></i> <span>حفظ التعديلات</span>';
            }
            window.isProductFormDirty = false;
            if (typeof window.finishTabProgress === 'function') window.finishTabProgress();
        });
    };

    // ===== تتبع التغييرات في النموذج =====
    window.captureCurrentFormData = function () {
        const isAvailEl = document.getElementById('isAvailable');
        const data = {
            name: document.getElementById('p-name')?.value.trim() || '',
            desc: document.getElementById('p-desc')?.value.trim() || '',
            price: String(document.getElementById('p-price')?.value || ''),
            cost: String(document.getElementById('p-cost')?.value || ''),
            discount: String(document.getElementById('p-discount')?.value || '0'),
            currency: document.getElementById('p-currency')?.value || 'YER',
            cat: document.getElementById('single-category-select')?.value || '',
            qty: String(document.getElementById('p-qty')?.value || ''),
            qty_type: document.getElementById('p-qty-type')?.value || 'tracked',
            available: isAvailEl ? isAvailEl.checked : true,
            has_variants: document.getElementById('has-variants-cb')?.checked || false
        };
        if (data.has_variants) {
            const variants = [];
            document.querySelectorAll('.variant-card').forEach(card => {
                variants.push({
                    name: card.querySelector('.v-name')?.value.trim() || '',
                    qty: String(card.querySelector('.v-qty')?.value || ''),
                    price: String(card.querySelector('.v-custom-price')?.value || '')
                });
            });
            data.variants = variants;
        }
        return JSON.stringify(data);
    };

    window.checkFormChanges = function () {
        const pId = document.getElementById('p-id')?.value;
        const btnSave = document.getElementById('btn-save');
        if (!btnSave) return;
        if (!pId || pId === '') {
            btnSave.disabled = false;
            btnSave.style.opacity = "1";
            btnSave.style.cursor = "pointer";
            return;
        }
        try {
            const currentData = window.captureCurrentFormData();
            if (currentData === window.originalProductData) {
                btnSave.disabled = true;
                btnSave.style.opacity = "0.5";
                btnSave.style.cursor = "not-allowed";
                window.isProductFormDirty = false;
            } else {
                btnSave.disabled = false;
                btnSave.style.opacity = "1";
                btnSave.style.cursor = "pointer";
                window.isProductFormDirty = true;
            }
        } catch (e) {
            btnSave.disabled = false;
            btnSave.style.opacity = "1";
            btnSave.style.cursor = "pointer";
        }
    };

    // ===== معاينة وضغط الصور =====
    window.previewMainImg = function (inp) {
        if (inp.files && inp.files[0]) {
            if (typeof window.validateImageSignature === 'function') {
                window.validateImageSignature(inp.files[0], v => {
                    if (!v) {
                        window.showT('ملف غير مدعوم', 'error');
                        inp.value = '';
                        return;
                    }
                    const r = new FileReader();
                    r.onload = e => {
                        document.getElementById('main-img-label').style.display = 'none';
                        document.getElementById('main-img-preview-box').style.display = 'block';
                        document.getElementById('main-img-preview').src = e.target.result;
                    };
                    r.readAsDataURL(inp.files[0]);
                });
            }
        }
    };

    window.compressAndConvertToWebP = async function (file, { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = {}) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width, height = img.height;
                    if (width > height) {
                        if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
                    } else {
                        if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('فشل تحويل الصورة'));
                    }, 'image/webp', quality);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    // ===== خيارات المنتج (Variants) =====
    window.toggleVariantsBuilder = function () {
        const hv = document.getElementById('has-variants-cb')?.checked;
        const simpleGroup = document.getElementById('simple-pricing-group');
        const varGroup = document.getElementById('variants-builder-group');
        if (simpleGroup) simpleGroup.style.display = hv ? 'none' : 'block';
        if (varGroup) varGroup.style.display = hv ? 'block' : 'none';
        if (hv && variantsCount === 0) window.addVariantRow();
    };

    window.resetVariantsBuilder = function () {
        const hv = document.getElementById('has-variants-cb');
        if (hv) hv.checked = false;
        const vList = document.getElementById('variants-list');
        if (vList) vList.innerHTML = '';
        variantsCount = 0;
        window.toggleVariantsBuilder();
    };

    window.toggleMainQtyInput = function () {
        const qtyWrapper = document.getElementById('main-qty-wrapper');
        const qtyType = document.getElementById('p-qty-type');
        const qtyInput = document.getElementById('p-qty');
        if (!qtyWrapper || !qtyType) return;
        qtyWrapper.style.display = qtyType.value === 'unlimited' ? 'none' : 'flex';
        if (qtyType.value === 'unlimited' && qtyInput) qtyInput.value = 9999;
    };

    window.addVariantRow = function (n = '', qt = 'tracked', q = 1, img = null, um = true, cp = null) {
        const id = 'v_' + Date.now();
        const sName = window.escapeHTML(n);
        const pt = cp !== null ? 'custom' : 'default';
        const pd = pt === 'custom' ? 'flex' : 'none';
        variantsCount++;

        const vList = document.getElementById('variants-list');
        if (!vList) return;

        vList.insertAdjacentHTML('beforeend', `
        <div class="variant-card" id="${id}">
            <button type="button" class="variant-card-remove" onclick="document.getElementById('${id}').remove()"><i class="fas fa-times"></i></button>
            <div class="v-img-section">
                <label class="v-use-main-toggle"><input type="checkbox" class="v-main-img-cb" ${um ? 'checked' : ''} onchange="document.getElementById('v-preview-box-${id}').style.display=this.checked?'none':'flex'"> نفس الصورة</label>
                <div class="v-img-preview ${img ? 'has-img' : ''}" id="v-preview-box-${id}" style="display:${um ? 'none' : 'flex'};" onclick="document.getElementById('vfile_${id}').click()"><i class="fas fa-camera"></i><img id="vimg_${id}" src="${img || ''}"></div>
                <input type="file" id="vfile_${id}" accept="image/jpeg, image/png, image/webp" style="display:none;" onchange="previewVariantImg(this, '${id}')">
                <input type="hidden" class="v-img-data" value="${img || ''}">
            </div>
            <div class="v-details-section">
                <div class="input-group"><label>الاسم <span style="color:var(--danger)">*</span></label><input type="text" class="modern-input v-name" value="${sName}" required></div>
                <div class="input-group"><label>السعر</label><select class="modern-input v-price-type" onchange="const w=this.closest('.variant-card').querySelector('.v-price-wrapper'); if(this.value==='custom'){w.style.display='flex';w.querySelector('input').required=true;}else{w.style.display='none';w.querySelector('input').required=false;}"><option value="default" ${pt === 'default' ? 'selected' : ''}>أساسي</option><option value="custom" ${pt === 'custom' ? 'selected' : ''}>خاص</option></select></div>
                <div class="input-group v-price-wrapper" style="display:${pd};"><label>السعر الخاص <span style="color:var(--danger)">*</span></label><input type="number" step="0.01" class="modern-input v-custom-price" value="${cp || ''}"></div>
                <div class="input-group"><label>المخزون</label><select class="modern-input v-qty-type" onchange="this.closest('.variant-card').querySelector('.v-qty-wrapper').style.display=this.value==='unlimited'?'none':'flex'"><option value="tracked" ${qt === 'tracked' ? 'selected' : ''}>محدودة</option><option value="unlimited" ${qt === 'unlimited' ? 'selected' : ''}>متجددة</option></select></div>
                <div class="input-group v-qty-wrapper" style="display:${qt === 'unlimited' ? 'none' : 'flex'};"><label>الكمية</label><input type="number" class="modern-input v-qty" value="${q}" min="0"></div>
            </div>
        </div>`);

        if (typeof window.updateCustomSelect === 'function') {
            document.querySelectorAll(`#${id} select.modern-input`).forEach(window.updateCustomSelect);
        }
    };

    window.previewVariantImg = function (inp, rId) {
        if (inp.files && inp.files[0]) {
            if (typeof window.validateImageSignature === 'function') {
                window.validateImageSignature(inp.files[0], v => {
                    if (!v) return;
                    const r = new FileReader();
                    r.onload = e => {
                        const img = document.getElementById('vimg_' + rId);
                        if (img) {
                            img.src = e.target.result;
                            img.parentElement.classList.add('has-img');
                        }
                    };
                    r.readAsDataURL(inp.files[0]);
                });
            }
        }
    };

    window.buildVariantsJson = async function (globalCurrency = 'YER') {
        if (!document.getElementById('has-variants-cb')?.checked) {
            return { json: '', totalQty: 0, isUnlimited: false };
        }
        const v = [];
        let errorMsg = null, totalQty = 0, isUnlimited = false;
        const variantCards = document.querySelectorAll('.variant-card');

        for (const c of variantCards) {
            const n = c.querySelector('.v-name').value.trim();
            if (!n) continue;
            const qt = c.querySelector('.v-qty-type').value;
            const q = qt === 'unlimited' ? 9999 : (parseInt(c.querySelector('.v-qty').value) || 0);
            const um = c.querySelector('.v-main-img-cb').checked;
            const pt = c.querySelector('.v-price-type').value;
            let cp = null;
            if (qt === 'unlimited') isUnlimited = true;
            if (qt === 'tracked') totalQty += q;
            if (pt === 'custom') {
                let rawPrice = c.querySelector('.v-custom-price').value.replace(/[٠-٩]/g, d => "٠١٢٣٥٦٧٨٩".indexOf(d));
                cp = parseFloat(rawPrice);
                if (isNaN(cp) || cp < 0) { errorMsg = `السعر الخاص للخيار "${n}" غير صحيح.`; break; }
            }

            let finalImageUrl = null;
            if (!um) {
                const fileInput = c.querySelector('input[type="file"]');
                if (fileInput && fileInput.files.length > 0) {
                    try {
                        const imageBlob = await window.compressAndConvertToWebP(fileInput.files[0], { quality: 0.7 });
                        const imgData = new FormData();
                        imgData.append('image_data', imageBlob, 'variant.webp');
                        const uploadRes = await window.apiReq('upload_image', imgData, 'POST', true);
                        if (uploadRes.status === 'success') finalImageUrl = uploadRes.url;
                        else { errorMsg = `فشل رفع صورة الخيار "${n}".`; break; }
                    } catch (e) { errorMsg = `خطأ أثناء معالجة صورة الخيار "${n}".`; break; }
                } else {
                    finalImageUrl = c.querySelector('.v-img-data').value;
                }
            }

            v.push({
                id: 'opt_' + Math.random().toString(36).substr(2, 8),
                name: n,
                quantity_type: qt,
                quantity: q,
                use_main_image: um,
                image: finalImageUrl,
                custom_price: cp,
                currency: globalCurrency
            });
        }
        if (errorMsg) return { error: errorMsg };
        return { json: v.length > 0 ? JSON.stringify(v) : '', totalQty: totalQty, isUnlimited: isUnlimited };
    };

    // ===== قفل الشاشة أثناء الحفظ =====
    function preventBackNavigation() {
        if (window.isSavingProductLock) {
            history.pushState(null, null, location.href);
            window.showT('جاري الحفظ...', 'warning');
        }
    }
    function preventKeyboardActions(e) {
        if (window.isSavingProductLock) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    function preventTouchScroll(e) {
        if (window.isSavingProductLock) e.preventDefault();
    }

    window.lockScreenCompletely = function () {
        history.pushState(null, null, location.href);
        window.addEventListener('popstate', preventBackNavigation);
        document.addEventListener('keydown', preventKeyboardActions, true);
        document.body.classList.add('publish-locked-noscroll');
        document.addEventListener('touchmove', preventTouchScroll, { passive: false });
    };

    window.unlockScreenCompletely = function () {
        window.removeEventListener('popstate', preventBackNavigation);
        document.removeEventListener('keydown', preventKeyboardActions, true);
        document.body.classList.remove('publish-locked-noscroll');
        document.removeEventListener('touchmove', preventTouchScroll, { passive: false });
    };

    // ===== حفظ ونشر المنتج =====
    window.saveP = async function (e) {
        if (e) e.preventDefault();
        if (window.isSavingProductLock) return;

        // التحقق المسبق الصارم من الحقول الأساسية قبل أي إجراء
        const nameInput = document.getElementById('p-name');
        const nameVal = nameInput ? nameInput.value.trim() : '';
        if (!nameVal || nameVal.length < 2) {
            window.showT('يرجى إدخال اسم صحيح للمنتج (حرفين على الأقل)', 'error');
            if (nameInput) {
                nameInput.focus();
                nameInput.style.borderColor = 'var(--danger)';
                setTimeout(() => nameInput.style.borderColor = '', 2000);
            }
            return;
        }

        const priceInput = document.getElementById('p-price');
        const rawPrice = priceInput ? priceInput.value.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).trim() : '';
        const priceVal = parseFloat(rawPrice);
        if (isNaN(priceVal) || priceVal < 0) {
            window.showT('يرجى إدخال سعر صحيح وموجب للمنتج', 'error');
            if (priceInput) {
                priceInput.focus();
                priceInput.style.borderColor = 'var(--danger)';
                setTimeout(() => priceInput.style.borderColor = '', 2000);
            }
            return;
        }

        const catSelect = document.getElementById('single-category-select');
        const catVal = catSelect ? catSelect.value : '';
        if (!catVal || catVal === 'new') {
            window.showT('يرجى اختيار فئة المنتج أولاً', 'error');
            return;
        }

        const pId = document.getElementById('p-id') ? document.getElementById('p-id').value : '';
        const isEdit = pId !== '';

        const executeSave = async () => {
            window.isSavingProductLock = true;
            window.lockScreenCompletely();

            const overlay = document.getElementById('publish-lock-overlay');
            const progress = document.getElementById('publish-progress');
            const title = document.getElementById('publish-lock-text');
            const subtext = document.getElementById('publish-lock-subtext');
            const icon = document.getElementById('publish-icon');
            const btnSave = document.getElementById('btn-save');

            if (btnSave) {
                btnSave.disabled = true;
                btnSave.style.opacity = '0.7';
                btnSave.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>جاري المعالجة...</span>';
            }

            if (icon) icon.innerHTML = '<div class="publish-spinner"></div>';
            if (overlay) overlay.classList.add('active');
            if (progress) progress.style.width = '25%';
            if (title) title.innerText = 'جاري ضغط وتجهيز البيانات...';
            if (subtext) subtext.innerText = 'الرجاء الانتظار لحظات';

            try {
                const formElement = document.getElementById('p-form');
                const f = new FormData(formElement);

                const isAvailCheckbox = document.getElementById('isAvailable');
                const isAvailValue = (isAvailCheckbox && isAvailCheckbox.checked) ? '1' : '0';
                f.set('isAvailable', isAvailValue);
                f.append('idempotency_key', 'prod_' + Date.now());

                const rawCatValueCheck = f.get('category_id');
                if (!rawCatValueCheck || rawCatValueCheck === 'new') {
                    throw new Error('يرجى اختيار فئة المنتج، أو الضغط على "إضافة" لتأكيد الفئة الجديدة أولاً');
                }

                const rawCatValue = f.get('category_id');
                if (rawCatValue && String(rawCatValue).startsWith('NEW:')) {
                    const { names, anchorId } = window.buildPendingCategoryChain(rawCatValue);
                    if (names.length === 0) throw new Error('يرجى اختيار فئة صحيحة للمنتج');
                    f.set('category_id', 'NEW_CHAIN');
                    f.set('category_chain_names', JSON.stringify(names));
                    f.set('category_anchor_id', anchorId || 0);
                }

                const explicitCurrency = document.getElementById('p-currency').value || 'YER';
                f.set('currency', explicitCurrency);

                if (document.getElementById('has-variants-cb').checked) {
                    const variantData = await window.buildVariantsJson(explicitCurrency);
                    if (variantData.error) throw new Error(variantData.error);
                    f.set('sizes', variantData.json);
                    f.set('quantity', variantData.isUnlimited ? 9999 : variantData.totalQty);
                    f.set('quantity_type', variantData.isUnlimited ? 'unlimited' : 'tracked');
                }

                if (progress) progress.style.width = '55%';
                if (title) title.innerText = 'جاري معالجة الصور بجودة فائقة...';

                const fileInput = document.getElementById('img-upload-file');
                if (fileInput && fileInput.files.length > 0) {
                    const webpBlob = await window.compressAndConvertToWebP(fileInput.files[0]);
                    f.set('image_file', webpBlob, 'product.webp');
                }

                if (progress) progress.style.width = '85%';
                if (title) title.innerText = 'يتم الآن التحديث في المتجر...';

                const res = await window.apiReq('save_product', f, 'POST', true);

                if (res.status === 'success') {
                    window.isProductFormDirty = false;
                    if (progress) progress.style.width = '100%';
                    if (title) title.innerText = 'تم المعالجة بنجاح! 🎉';
                    if (subtext) subtext.innerText = 'تم التحديث الفوري في المتجر';
                    if (icon) {
                        icon.innerHTML = '<i class="fas fa-check-circle publish-success-icon"></i>';
                    }

                    setTimeout(async () => {
                        if (overlay) overlay.classList.remove('active');
                        window.executeShowProductList();
                        window.showT(isEdit ? 'تم تحديث بيانات المنتج بنجاح ✅' : 'تم حفظ ونشر المنتج بنجاح ✅', 'success');

                        const catSelect = document.getElementById('single-category-select');
                        const catId = catSelect ? catSelect.value : '';
                        const catName = catSelect && catSelect.selectedIndex >= 0 ? catSelect.options[catSelect.selectedIndex].text.replace(/ ↳ /g, ' > ') : 'عام';

                        const newProductData = {
                            id: res.id || pId,
                            global_product_id: res.id || pId,
                            name: f.get('name') || '',
                            mainDescription: f.get('mainDescription') || '',
                            price: parseFloat(f.get('price')) || 0,
                            cost_price: parseFloat(f.get('cost_price')) || 0,
                            discount: parseFloat(f.get('discount')) || 0,
                            image: document.getElementById('main-img-preview') ? document.getElementById('main-img-preview').src : '',
                            type: catName,
                            category_id: catId,
                            quantity_type: f.get('quantity_type') || 'tracked',
                            quantity: f.get('quantity_type') === 'unlimited' ? 9999 : parseInt(f.get('quantity')) || 0,
                            is_available: f.get('isAvailable') === '1',
                            currency: explicitCurrency,
                            options: f.get('sizes') ? (() => { try { return JSON.parse(f.get('sizes')); } catch (e) { return []; } })() : [],
                            updated_at: Date.now()
                        };

                        window.AppStore.updateProduct(newProductData);
                        window.currentPage = 1;
                        if (typeof window.filterP === 'function') window.filterP();

                        window.isSavingProductLock = false;
                        window.unlockScreenCompletely();
                        if (icon) icon.innerHTML = '<div class="publish-spinner"></div>';
                    }, 650);

                } else {
                    throw new Error(res.message || 'فشل حفظ المنتج.');
                }
            } catch (error) {
                window.showT(error.message, 'error');
                if (overlay) overlay.classList.remove('active');
                if (btnSave) {
                    btnSave.disabled = false;
                    btnSave.style.opacity = '1';
                    btnSave.innerHTML = isEdit ? '<i class="fas fa-save"></i> <span>حفظ التعديلات</span>' : '<i class="fas fa-cloud-upload-alt"></i> <span>حفظ ونشر المنتج</span>';
                }
                if (icon) icon.innerHTML = '<div class="publish-spinner"></div>';
                window.isSavingProductLock = false;
                window.unlockScreenCompletely();
            }
        };

        executeSave();
    };

    // ربط مستمعي النموذج
    window.bindProductFormEvents = function () {
        const pForm = document.getElementById('p-form');
        if (pForm && !pForm.dataset.eventsBound) {
            pForm.dataset.eventsBound = '1';
            pForm.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.preventDefault(); });
            let formCheckTimeout;
            const checkChanges = () => {
                clearTimeout(formCheckTimeout);
                formCheckTimeout = setTimeout(() => window.checkFormChanges(), 500);
            };
            pForm.addEventListener('input', checkChanges);
            pForm.addEventListener('change', checkChanges);
        }
    };

    window.ensureProductFormHTML();

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('product-form');

})();
