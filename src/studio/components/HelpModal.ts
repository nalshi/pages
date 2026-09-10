/**
 * ========================================================
 * 💡 Studio Help & Guide Modal
 * ========================================================
 */

export class HelpModal {
    public static render(): string {
        return `
        <div id="guide-modal" class="guide-modal-overlay" onclick="if(event.target === this) window.StudioUI.closeHelpModal()">
            <div class="guide-modal-card">
                <div class="guide-modal-header">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div class="guide-icon-box">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                        <div>
                            <h3 style="font-size:1.15rem; font-weight:900; color:var(--sb-text);">دليل استخدام مصمم المتجر المتقدم 🚀</h3>
                            <p style="font-size:0.8rem; color:var(--sb-muted);">خطوات وإرشادات سريعة لإنشاء وتخصيص واجهة متجرك بأعلى احترافية وسرعة</p>
                        </div>
                    </div>
                    <button class="guide-close-btn" onclick="window.StudioUI.closeHelpModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="guide-steps-list">
                    <div class="guide-step-card">
                        <div class="guide-step-num">1</div>
                        <div>
                            <strong class="guide-step-title">هوية المتجر والإعلانات</strong>
                            <p class="guide-step-desc">
                                في تبويب <strong>هوية المتجر</strong>: حدد اسم المتجر الرسمي، الشعار التسويقي، وشريط الإعلانات الترويجي الذي يظهر للزوار في قمة المتجر.
                            </p>
                        </div>
                    </div>

                    <div class="guide-step-card">
                        <div class="guide-step-num">2</div>
                        <div>
                            <strong class="guide-step-title">تخصيص العرض للجوال والكمبيوتر بشكل مستقل</strong>
                            <p class="guide-step-desc">
                                في تبويب <strong>طريقة عرض المنتجات</strong>: يمكنك تخصيص عدد الأعمدة والصفوف وشكل السلايدر للجوال (📱 عمودين باللمس) وللكمبيوتر (💻 3-4 أعمدة) بشكل منفصل وتلقائي!
                            </p>
                        </div>
                    </div>

                    <div class="guide-step-card">
                        <div class="guide-step-num">3</div>
                        <div>
                            <strong class="guide-step-title">تخصيص كل قسم على حدة (Per-Category)</strong>
                            <p class="guide-step-desc">
                                يمكنك منح أي قسم من أقسامك (مثلاً العطور أو الملابس) مظهراً فريداً ومستقلاً (كسلايدر متطور أو شبكة عمودية) دون التأثير على باقي أقسام المتجر.
                            </p>
                        </div>
                    </div>

                    <div class="guide-step-card">
                        <div class="guide-step-num">4</div>
                        <div>
                            <strong class="guide-step-title">الألوان، القوالب الجاهزة والنشر السحابي</strong>
                            <p class="guide-step-desc">
                                اختر قالباً جاهزاً بضغطة زر أو ولّد ألواناً ذكية بالذكاء الاصطناعي، ثم اضغط <strong>نشر 🚀</strong> لحفظ التعديلات وتطبيقها فوراً على متجرك للعملاء.
                            </p>
                        </div>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                    <button class="sb-btn sb-btn-primary" style="width:100%; justify-content:center; padding:12px;" onclick="window.StudioUI.closeHelpModal()">
                        فهمت، لنبدأ التخصيص! ✨
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    public static open(): void {
        const modal = document.getElementById('guide-modal');
        if (modal) modal.classList.add('show');
    }

    public static close(): void {
        const modal = document.getElementById('guide-modal');
        if (modal) modal.classList.remove('show');
    }
}
