
// =========================================================================
// ملف chatbot.js - مساعد التسوق الذكي (نالش) المطور V6 (إدارة سلة، مقاسات، ومعالجة تأخير)
// =========================================================================

console.log("🤖 جاري تهيئة المساعد الذكي نالش (الإصدار السادس الفائق)...");

if (!window.NalshBotUI) {

    window.NalshBotUI = {
        template: `
            <div id="robot-speech" class="robot-speech-bubble"></div>
            <div class="cyber-robot" onclick="openNalshChat()">
                <div class="cyber-antenna"></div>
                <div class="cyber-visor">
                    <div class="cyber-eye left"></div>
                    <div class="cyber-eye right"></div>
                </div>
                <div class="cyber-wing left"></div>
                <div class="cyber-wing right"></div>
            </div>

            <div id="nalsh-chat-overlay">
                <div class="nalsh-chat-window">
                    <div class="nalsh-chat-header">
                        <div class="nalsh-avatar"><i class="fas fa-robot"></i></div>
                        <div class="info">
                            <h4 id="chat-store-name">مساعد المتجر</h4>
                            <p>متصل الذكاء الاصطناعي 🟢 <span style="opacity:0.75; font-size:0.78em;">(نسخة تجريبية)</span></p>
                        </div>
                        <i class="fas fa-times nalsh-chat-close"></i>
                    </div>
                    <div id="nalsh-chat-messages"></div>
                    <div class="nalsh-chat-input-area">
                        <input type="text" id="nalsh-user-input" placeholder="اسألني، ابحث، عدل سلتك، أو تتبع طلبك...">
                        <button id="nalsh-send-btn"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `,

        init: function() {
            if (!document.getElementById('nalsh-chat-overlay')) {
                document.body.insertAdjacentHTML('beforeend', this.template);
                setupNalshBot();
                this.setupDraggableRobot();
                console.log("✅ تم حقن المساعد الذكي بنجاح!");
            }
        },

        // خاصية السحب العمودي البطيء للروبوت
        setupDraggableRobot: function() {
            const robot = document.querySelector('.cyber-robot');
            const speech = document.getElementById('robot-speech');
            if (!robot) return;

            let isDragging = false;
            let startY = 0;
            let startBottom = 0;
            let hasMoved = false;

            const startDrag = (e) => {
                if (robot.classList.contains('intro-mode')) return;
                isDragging = true;
                hasMoved = false;
                
                startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
                startBottom = parseFloat(window.getComputedStyle(robot).bottom) || 80;
                
                robot.style.transition = 'none'; 
                if(speech) speech.style.transition = 'none';
            };

            const moveDrag = (e) => {
                if (!isDragging) return;
                
                const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
                // حركة سحب بطيئة (30% من سرعة الإصبع) ليعطي شعور ببطئ الحركة المطلوبة
                const deltaY = (startY - currentY) * 0.3; 
                
                if (Math.abs(deltaY) > 2) hasMoved = true;
                
                let newBottom = startBottom + deltaY;
                
                const maxBottom = window.innerHeight - 150;
                const minBottom = 20;
                
                if (newBottom < minBottom) newBottom = minBottom;
                if (newBottom > maxBottom) newBottom = maxBottom;
                
                robot.style.setProperty('bottom', newBottom + 'px', 'important');
                if (speech) {
                    speech.style.setProperty('bottom', (newBottom + 70) + 'px', 'important');
                }
            };

            const endDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                
                robot.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s, opacity 0.4s, right 0.4s ease, border-radius 0.4s ease';
                if(speech) speech.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            };

            robot.addEventListener('mousedown', startDrag);
            window.addEventListener('mousemove', moveDrag);
            window.addEventListener('mouseup', endDrag);

            robot.addEventListener('touchstart', startDrag, { passive: true });
            window.addEventListener('touchmove', moveDrag, { passive: true });
            window.addEventListener('touchend', endDrag);

            // إيقاف فتح نافذة الشات في حال كان المستخدم يسحب الروبوت
            robot.addEventListener('click', (e) => {
                if (hasMoved) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }, true);
        }
    };

    // ==========================================
    // قاعدة المعرفة الذكية (Intents)
    // ==========================================
    window.nalshKnowledgeBase = [
        { intent: 'greetings', keywords: ['مرحبا', 'اهلا', 'السلام عليكم', 'هلا', 'هلو', 'مرحبتين', 'صباح الخير', 'مساء الخير', 'هاي', 'يا هلا'], action: 'nalshHandleGreeting' },
        { intent: 'delivery', keywords: ['توصيل', 'يوصل', 'التوصيل', 'شحن', 'بكم التوصيل', 'متى يوصل', 'سعر التوصيل', 'كم ياخذ التوصيل', 'مدة التوصيل', 'تصل متى'], answer: 'نعم نوفر توصيل سريع 🚚! سعر التوصيل يحسب تلقائياً بناءً على المسافة بينك وبين المتجر. حدد موقعك وسأحسبه لك!' },
        { intent: 'payment', keywords: ['الدفع', 'ادفع', 'الفلوس', 'الحساب', 'كاش', 'طرق الدفع', 'كيف ادفع', 'فيزا', 'تحويل بنكي', 'دفع الكتروني'], answer: 'طريقة الدفع في متجرنا حالياً هي "الدفع عند الاستلام" 💵. عاين طلبك براحتك ثم ادفع للمندوب.' },
        { intent: 'contact_merchant', keywords: ['رقم التاجر', 'رقمكم', 'تواصل', 'واتساب', 'صاحب المتجر', 'اكلمكم', 'رقم المتجر', 'استفسار', 'سؤال', 'كلمني', 'ابغى اكلم احد', 'خدمة العملاء'], action: 'nalshHandleInquiry' },
        { intent: 'complaint', keywords: ['شكوى', 'شكوي', 'شكاوي', 'شكاوى', 'مشكلة', 'مشكله', 'اشتكي', 'ابي اشتكي', 'ابغى اشتكي', 'المنتج تالف', 'وصلني تالف', 'وصلني خربان', 'وصلني غلط', 'منتج خطأ', 'خطأ بالطلب', 'استلمت شي غلط', 'زعلان', 'مو راضي', 'مو راضي عن الخدمة', 'خدمة سيئة', 'تجربة سيئة', 'رديء', 'سيء جدا', 'استرجاع', 'ارجاع المنتج', 'استبدال المنتج', 'ابي ارجع المنتج'], action: 'nalshHandleComplaint' },
        { intent: 'thanks', keywords: ['شكرا', 'مشكور', 'يعطيك العافية', 'تسلم', 'حلو', 'ممتاز', 'تسلم ايدك', 'الله يعطيك العافية'], answer: 'العفو! في خدمتك دائماً 🥰' },
        { intent: 'cart_management', keywords: ['سله', 'سلة', 'سلتي', 'عربتي', 'عربه', 'تعديل السلة', 'شوف السلة', 'انقص', 'ازيد', 'احذف'], action: 'nalshShowCartChat' },
        { intent: 'track_order', keywords: ['طلبي', 'وين طلبي', 'حالة الطلب', 'تتبع', 'ايش صار بطلبي', 'وصل طلبي'], action: 'nalshHandleTrackOrder' },
        { intent: 'delayed_order', keywords: ['تاخر', 'طول', 'وين المندوب', 'تاخرتو', 'ابطا', 'ما وصل'], action: 'nalshHandleLateOrder' },
        { intent: 'browse_categories', keywords: ['اريد', 'أريد', 'ابغى', 'أبغى', 'ودي', 'اقسام', 'فئات', 'تصنيفات', 'عروض'], action: 'nalshShowCategoriesChat' },
        { intent: 'checkout', keywords: ['اعتمد الطلب', 'كمل الطلب', 'شراء', 'ادفع الان', 'انهاء الطلب', 'حاسبني', 'ادفع', 'اشتري السلة'], action: 'nalshStartCheckoutFlow' },
        { intent: 'bot_identity', keywords: ['مين انت', 'من انت', 'ايش اسمك', 'شو اسمك', 'انت بشري', 'انت روبوت', 'ذكاء اصطناعي', 'مين صممك'], action: 'nalshHandleIdentity' },
        { intent: 'smalltalk', keywords: ['كيف حالك', 'شخبارك', 'اخبارك', 'شلونك', 'كيفك', 'شنو الاخبار'], answer: 'الحمدلله بخير وبخدمتك دايم 😄 وش أقدر أسوي لك اليوم؟' },
        { intent: 'farewell', keywords: ['باي', 'مع السلامة', 'الى اللقاء', 'وداعا', 'تصبح على خير', 'يعطيك العافيه مع السلامه'], answer: 'مع السلامة! 🌟 تعال لأي وقت تحتاجني، أنا هنا دايماً بخدمتك.' }
    ];

    window.getNalshAssistantConfig = function() {
        const rootCfg = window.currentStorefrontConfig || {};
        const messages = rootCfg.messages || rootCfg.store_messages || (window.App && window.App.storeData && window.App.storeData.messages) || {};
        const assistant = messages.ai_assistant || {};
        const greeting = assistant.greeting || messages.chatbot_greeting || 'أنا المساعد الذكي الخاص بالمتجر، أقدر أساعدك باختيار المنتجات ومتابعة الطلبات.';

        let quickActions = assistant.quick_actions;
        if (typeof quickActions === 'string') {
            quickActions = quickActions.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (!Array.isArray(quickActions) || quickActions.length === 0) {
            quickActions = ['🛒 سلة مشترياتي', '📦 تتبع طلباتي', '📞 تواصل مع البائع'];
        }

        return {
            enabled: assistant.enabled !== false,
            name: assistant.name || 'مساعد المتجر',
            avatar_icon: assistant.avatar_icon || 'fa-robot',
            accent_color: assistant.accent_color || '#4F46E5',
            button_style: assistant.button_style || 'pill',
            avatar_style: assistant.avatar_style || 'pulse',
            position: assistant.position || 'bottom-right',
            status_text: assistant.status_text || 'متصل للرد الفوري',
            greeting: greeting,
            quick_actions: quickActions,
            ...assistant
        };
    };

    window.applyNalshBotConfig = function() {
        const cfg = window.getNalshAssistantConfig();
        const robot = document.querySelector('.cyber-robot');
        const speech = document.getElementById('robot-speech');
        const overlay = document.getElementById('nalsh-chat-overlay');

        // 1. التفعيل أو الإخفاء الكامل
        if (cfg.enabled === false) {
            if (robot) robot.style.setProperty('display', 'none', 'important');
            if (speech) speech.style.setProperty('display', 'none', 'important');
            if (overlay) {
                overlay.classList.remove('open');
                overlay.style.display = 'none';
            }
            return;
        }

        if (robot) robot.style.display = '';
        if (speech) speech.style.display = '';
        if (overlay) overlay.style.display = '';

        // 2. الاسم والأيقونة
        const title = document.getElementById('chat-store-name');
        if (title) title.textContent = cfg.name || 'مساعد المتجر';

        const avatarIcon = document.querySelector('.nalsh-avatar i');
        if (avatarIcon) avatarIcon.className = 'fas ' + (cfg.avatar_icon || 'fa-robot');

        // 3. نص الحالة
        const statusTextEl = document.querySelector('.nalsh-chat-header .info p');
        if (statusTextEl && cfg.status_text) {
            statusTextEl.innerHTML = `${cfg.status_text} 🟢 <span style="opacity:0.75; font-size:0.78em;">(نسخة ذكية)</span>`;
        }

        // 4. ألوان التمييز والتدرج
        const accent = cfg.accent_color || '#4F46E5';
        if (robot) {
            robot.style.background = `linear-gradient(135deg, ${accent}, ${accent}cc)`;
            robot.style.boxShadow = `0 8px 22px ${accent}55`;
        }
        const header = document.querySelector('.nalsh-chat-header');
        if (header) {
            header.style.background = `linear-gradient(135deg, ${accent}, ${accent}bb)`;
        }
        const sendBtn = document.getElementById('nalsh-send-btn');
        if (sendBtn) {
            sendBtn.style.background = accent;
        }

        // 5. الموضع (يمين أو يسار)
        if (robot) {
            if (cfg.position === 'bottom-left') {
                robot.style.right = 'auto';
                robot.style.left = '18px';
                if (speech) {
                    speech.style.right = 'auto';
                    speech.style.left = '18px';
                    speech.style.borderRadius = '20px 20px 20px 0';
                    speech.style.transformOrigin = 'bottom left';
                }
            } else {
                robot.style.right = '18px';
                robot.style.left = 'auto';
                if (speech) {
                    speech.style.right = '18px';
                    speech.style.left = 'auto';
                    speech.style.borderRadius = '20px 20px 0 20px';
                    speech.style.transformOrigin = 'bottom right';
                }
            }

            // 6. شكل الزر (Button Style)
            if (cfg.button_style === 'bubble') {
                robot.style.borderRadius = '50%';
                robot.style.width = '52px';
                robot.style.height = '52px';
            } else if (cfg.button_style === 'minimal') {
                robot.style.borderRadius = '14px';
                robot.style.width = '46px';
                robot.style.height = '46px';
            } else {
                robot.style.borderRadius = '40% 40% 50% 50% / 60% 60% 40% 40%';
                robot.style.width = '48px';
                robot.style.height = '56px';
            }
        }

        // 7. رسالة الترحيب الحية في الروبوت أثناء المعاينة
        const greeting = cfg.greeting || (window.currentStorefrontConfig?.messages?.chatbot_greeting) || 'أهلاً بك! كيف يمكنني مساعدتك؟ 🤖';
        if (typeof window.robotSpeak === 'function' && window.parent && window.parent !== window) {
            window.robotSpeak(greeting, 'happy', 3500);
        }
    };

    // ==========================================
    // سجل محادثة المساعد الذكي (يُرسَل مع كل رسالة لربط الأسئلة بسياقها)
    // ==========================================
    window.nalshAiHistory = window.nalshAiHistory || [];

    // ==========================================
    // تطبيع النصوص العربية (لزيادة ذكاء وفهم البوت لاختلاف الكتابة)
    // يوحّد الهمزات، الألف المقصورة، التاء المربوطة، ويزيل التشكيل والتطويل
    // ==========================================
    window.normalizeArabic = function(text) {
        if (!text) return '';
        return String(text)
            .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // إزالة التشكيل والتطويل
            .replace(/[إأآا]/g, 'ا')
            .replace(/ى/g, 'ي')
            .replace(/ؤ/g, 'و')
            .replace(/ئ/g, 'ي')
            .replace(/ة/g, 'ه')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // ==========================================
    // وظائف التحكم المركزية وتجميد الأزرار
    // ==========================================
    window.robotSpeechTimeout = null;
    window.robotSpeak = function(message, expression = 'normal', duration = 4000) {
        const robot = document.querySelector('.cyber-robot'), speech = document.getElementById('robot-speech');
        if (!robot || !speech) return;
        
        robot.classList.remove('eyes-closed', 'eyes-happy', 'look-up', 'discount-magic');
        if (expression === 'closed') robot.classList.add('eyes-closed');
        if (expression === 'happy') { robot.classList.add('eyes-happy'); }
        
        speech.innerHTML = message.replace(/\n/g, '<br>'); 
        speech.classList.add('show');
        
        clearTimeout(window.robotSpeechTimeout); 
        window.robotSpeechTimeout = setTimeout(() => { 
            speech.classList.remove('show'); 
            robot.classList.remove('eyes-closed', 'eyes-happy'); 
        }, duration);
    };

    window.openNalshChat = function() {
        if (window.getNalshAssistantConfig().enabled === false) return;
        const overlay = document.getElementById('nalsh-chat-overlay');
        overlay.classList.add('open'); 
        if (typeof lockBodyScroll === 'function') lockBodyScroll(true); 
        document.documentElement.classList.add('nalsh-chat-locked'); // احتياط إضافي لمنع تمرير الخلفية
        const robot = document.querySelector('.cyber-robot');
        if (robot) robot.style.display = 'none';
        startNalshConversation(); 
        window.nalshStartViewportTracking();
    };

    window.closeNalshChat = function() {
        const overlay = document.getElementById('nalsh-chat-overlay');
        overlay.classList.remove('open'); 
        if (typeof lockBodyScroll === 'function') lockBodyScroll(false); 
        document.documentElement.classList.remove('nalsh-chat-locked');
        const robot = document.querySelector('.cyber-robot');
        if (robot) robot.style.display = ''; 
        window.nalshStopViewportTracking();
    };

    // ⭐ تتبع الارتفاع الفعلي للشاشة (Visual Viewport) بدل الاعتماد فقط على dvh
    // لأن أغلب متصفحات الأندرويد لا تُصغّر وحدات dvh/vh تلقائياً عند فتح
    // لوحة المفاتيح، فتبقى نافذة المحادثة بارتفاعها الأصلي وتُغطى جزئياً.
    let nalshViewportHandler = null;
    window.nalshStartViewportTracking = function() {
        if (!window.visualViewport) return;
        const updateHeight = () => {
            document.documentElement.style.setProperty('--nalsh-vh', window.visualViewport.height + 'px');
            // ⭐ عند فتح لوحة المفاتيح يتقلص ارتفاع النافذة، فنعيد التمرير لآخر
            // رسالة حتى تظل ظاهرة بالكامل فوق الكيبورد ولا تنقطع نصفها.
            // نستخدم تأخير بسيط لأن حجم الحاوية يحتاج لحظة ليعاد حسابه فعلياً.
            clearTimeout(window.nalshViewportScrollTimeout);
            window.nalshViewportScrollTimeout = setTimeout(() => window.nalshScrollToBottom(true), 120);
        };
        updateHeight();
        nalshViewportHandler = updateHeight;
        window.visualViewport.addEventListener('resize', nalshViewportHandler);
        window.visualViewport.addEventListener('scroll', nalshViewportHandler);
    };
    window.nalshStopViewportTracking = function() {
        if (!window.visualViewport || !nalshViewportHandler) return;
        window.visualViewport.removeEventListener('resize', nalshViewportHandler);
        window.visualViewport.removeEventListener('scroll', nalshViewportHandler);
        nalshViewportHandler = null;
    };

    // ⭐ دالة موحّدة للتمرير لآخر الرسائل، تُستخدم في كل مكان بدل تكرار الكود
    // isSmooth=true تُستخدم بعد ظهور الكيبورد أو الرسائل الجديدة لإحساس أنسيابي،
    // بينما false تبقى فورية (مثل أول فتح للمحادثة) لتفادي وميض غير مرغوب
    window.nalshScrollToBottom = function(isSmooth = false) {
        const messagesContainer = document.getElementById('nalsh-chat-messages');
        if (!messagesContainer) return;
        if (isSmooth) {
            messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
        } else {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    // دالة تعطيل وإتاحة حقل الإدخال والأزرار (تجميد كامل)
    window.toggleNalshInput = function(disabled) {
        const input = document.getElementById('nalsh-user-input');
        const btn = document.getElementById('nalsh-send-btn');
        
        if (input) {
            input.disabled = disabled;
            input.style.opacity = disabled ? '0.6' : '1';
        }
        if (btn) {
            btn.disabled = disabled;
            btn.style.opacity = disabled ? '0.6' : '1';
            btn.style.pointerEvents = disabled ? 'none' : 'auto';
        }
        
        // تجميد جميع أزرار المحادثة (الردود السريعة، أزرار السلة، الخ)
        document.querySelectorAll('.nalsh-chat-messages button, .nalsh-chat-messages .chat-action-btn').forEach(b => {
            b.disabled = disabled;
            b.style.opacity = disabled ? '0.5' : '1';
            b.style.pointerEvents = disabled ? 'none' : 'auto';
        });

        // ⭐ تم إلغاء التركيز التلقائي (auto-focus) على الحقل هنا عمداً — كان يفتح
        // لوحة المفاتيح تلقائياً بعد كل رد من البوت أو اختيار خيار سريع، وهذا
        // مزعج للمستخدم. الآن الكيبورد يفتح فقط لما يضغط المستخدم بنفسه على الحقل.
    };

    // ==========================================
    // 1. الأقسام، الاستفسارات، والسلة
    // ==========================================
    window.nalshHandleGreeting = function() {
        const storeName = (window.App && window.App.storeData) ? window.App.storeData.name : 'متجرنا';
        addNalshMessage({
            text: `أهلاً بك في ${storeName}! 👋 كيف أقدر أخدمك اليوم؟`,
            replies: [
                { text: "🛍️ عرض الأقسام", action: "show_categories" },
                { text: "🛒 سلة مشترياتي", action: "show_cart" },
                { text: "📞 تواصل مع البائع", action: "inquiry" }
            ]
        });
    };

    window.nalshShowCategoriesChat = function() {
        let cats = [];
        if (window.App && window.App.storeData && window.App.storeData.categories) {
            cats = window.App.storeData.categories.map(c => c.name).slice(0, 5);
        }
        if (cats.length > 0) {
            let replies = cats.map(c => ({ text: `🏷️ ${c}`, action: `search_cat_${c}` }));
            addNalshMessage({ text: "تفضل، هذه أبرز الأقسام عندنا. اختار اللي يناسبك أو اكتب اسم المنتج مباشرة:", replies: replies });
        } else {
            addNalshMessage("أقدر أبحث لك عن أي منتج، بس اكتب لي اسمه! 🔍");
        }
    };

    window.nalshHandleInquiry = function() {
        const store = window.App ? window.App.storeData : null;
        let waNum = '967770094456'; 
        let storeName = 'متجرنا';

        if (store) {
            storeName = store.name || storeName;
            // ⭐ رقم صاحب المتجر: يُقرأ أولاً من ملف info.json الخاص بهذا المتجر تحديداً (store.phone)
            // ثم نرجع لإعدادات المتجر (settings) كخطة بديلة، ولا نستخدم الرقم الافتراضي إلا كحل أخير
            if (store.phone) {
                waNum = store.phone;
            } else {
                let settings = typeof store.settings === 'string' ? JSON.parse(store.settings || '{}') : (store.settings || {});
                if (settings.phone) waNum = settings.phone;
                else if (settings.whatsapp) waNum = settings.whatsapp;
                else if (settings.whatsappNumber) waNum = settings.whatsappNumber;
            }
        }

        waNum = waNum.replace(/\D/g, '');
        if (waNum.startsWith('0')) waNum = '967' + waNum.substring(1);

        addNalshMessage(`يمكنك التواصل مع إدارة (${storeName}) مباشرة عبر الواتساب للاستفسارات 💬`);
        addNalshMessage(`<a href="https://wa.me/${waNum}" target="_blank" style="display:inline-block; background:#25D366; color:white; padding:10px 15px; border-radius:10px; text-decoration:none; font-weight:bold; margin-top:5px;"><i class="fab fa-whatsapp"></i> تواصل مع المتجر</a>`, true);
    };

    // دالة موحدة لجلب رقم واتساب صاحب المتجر الحالي (من info.json الخاص بمتجره فقط)
    window.nalshGetMerchantWhatsapp = function() {
        const store = window.App ? window.App.storeData : null;
        let waNum = '967770094456';
        if (store) {
            if (store.phone) {
                waNum = store.phone;
            } else {
                let settings = typeof store.settings === 'string' ? JSON.parse(store.settings || '{}') : (store.settings || {});
                waNum = settings.phone || settings.whatsapp || settings.whatsappNumber || waNum;
            }
        }
        waNum = waNum.replace(/\D/g, '');
        if (waNum.startsWith('0')) waNum = '967' + waNum.substring(1);
        return waNum;
    };

    // ==========================================
    // هوية المساعد الذكي (نسخة تجريبية)
    // ==========================================
    window.nalshHandleIdentity = function() {
        const storeName = (window.App && window.App.storeData) ? window.App.storeData.name : 'المتجر';
        addNalshMessage(`أنا المساعد الذكي الخاص بمتجر ${storeName} 🤖\nأقدر أساعدك بالبحث عن المنتجات، إدارة سلتك، تتبع طلبك، واستقبال استفساراتك وشكاويك وتوصيلها لصاحب المتجر مباشرة.\n\n🧪 هذي نسخة تجريبية، ونشتغل باستمرار على تطوير ذكائي وتحسين ردودي!`);
    };

    // ==========================================
    // نظام الشكاوى الذكي (يوجه الشكوى مباشرة لرقم صاحب المتجر)
    // ==========================================
    window.nalshAwaitingComplaintText = false;

    window.nalshHandleComplaint = function() {
        addNalshMessage({
            text: "يؤسفني سماع أنك واجهت مشكلة 😔 ساعدني أوضح شكواك لصاحب المتجر بسرعة، وش نوعها بالضبط؟",
            replies: [
                { text: "📦 منتج تالف أو ناقص", action: "complaint_cat_تالف" },
                { text: "🚚 تأخر التوصيل", action: "complaint_cat_تأخير" },
                { text: "❌ خطأ في الطلب المستلم", action: "complaint_cat_خطأ" },
                { text: "✍️ أوضح المشكلة بنفسي", action: "complaint_cat_custom" }
            ]
        });
    };

    window.nalshSendComplaintToMerchant = function(details) {
        const store = window.App ? window.App.storeData : null;
        const storeName = store && store.name ? store.name : 'المتجر';
        const waNum = window.nalshGetMerchantWhatsapp();
        const customerName = (window.user && window.user.full_name) ? window.user.full_name : 'عميل';

        const msgText = `⚠️ شكوى عميل عبر المساعد الذكي\nالمتجر: ${storeName}\nالعميل: ${customerName}\nتفاصيل الشكوى: ${details}`;
        const prefilled = encodeURIComponent(msgText);

        addNalshMessage("تم تجهيز شكواك ✅. اضغط الزر بالأسفل لإرسالها مباشرة لصاحب المتجر عبر واتساب ليتم حلها بأسرع وقت ممكن 🙏");
        addNalshMessage(`<a href="https://wa.me/${waNum}?text=${prefilled}" target="_blank" style="display:block; text-align:center; background:#25D366; color:white; padding:10px; border-radius:10px; text-decoration:none; font-weight:bold; margin-top:5px;"><i class="fab fa-whatsapp"></i> إرسال الشكوى لصاحب المتجر</a>`, true);
        addNalshMessage({ text: "هل أقدر أساعدك بشي ثاني؟", replies: [{ text: "🛍️ متابعة التسوق", action: "show_categories" }] });
    };

    // ==========================================
    // 2. إدارة السلة من المحادثة (الجديد)
    // ==========================================
    window.nalshShowCartChat = function(isCheckoutFlow = false) {
        if (!window.cart || window.cart.length === 0) {
            addNalshMessage({ text: "سلتك فارغة حالياً 🛒. تحب تتصفح المنتجات؟", replies: [{ text: "🛍️ تصفح الأقسام", action: "show_categories" }] });
            return;
        }

        let html = `<div style="background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:10px; margin-top:5px; width:100%;">`;
        let total = 0;
        let currency = window.cart[0].currency || 'YER';

        window.cart.forEach(item => {
            total += parseFloat(item.price) * item.qty;
            let safeName = escapeHTML(item.name);
            let sizeHTML = item.size_name ? `<div style="font-size:0.75rem; color:var(--primary); font-weight:bold;">مقاس/خيار: ${escapeHTML(item.size_name)}</div>` : '';
            
            html += `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid var(--border);">
                <img src="${item.image}" style="width:50px; height:50px; border-radius:8px; object-fit:cover; border:1px solid var(--border);">
                <div style="flex:1;">
                    <div style="font-weight:bold; font-size:0.85rem; line-height:1.2;">${safeName}</div>
                    ${sizeHTML}
                    <div style="color:var(--text-main); font-weight:900; font-size:0.9rem;">${parseFloat(item.price).toLocaleString()} ${currency}</div>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; gap:5px; background:var(--bg-body); border-radius:8px; padding:2px;">
                    <button class="chat-action-btn" onclick="nalshUpdateCartItem('${item.cartId}', 1)" style="border:none; background:none; color:var(--primary); padding:5px; cursor:pointer;"><i class="fas fa-plus"></i></button>
                    <span style="font-weight:bold; font-size:0.9rem;">${item.qty}</span>
                    <button class="chat-action-btn" onclick="nalshUpdateCartItem('${item.cartId}', -1)" style="border:none; background:none; color:${item.qty === 1 ? 'var(--danger)' : 'var(--text-main)'}; padding:5px; cursor:pointer;"><i class="${item.qty === 1 ? 'fas fa-trash-alt' : 'fas fa-minus'}"></i></button>
                </div>
            </div>`;
        });

        html += `<div style="display:flex; justify-content:space-between; font-weight:900; font-size:1rem; margin-top:10px; color:var(--primary);"><span>الإجمالي:</span><span>${total.toLocaleString()} ${currency}</span></div>`;
        html += `</div>`;

        addNalshMessage(html, true);

        if (isCheckoutFlow) {
            addNalshMessage({
                text: "هذه منتجاتك بالسلة، هل أنت جاهز لفحص المخزون واعتماد الطلب؟",
                replies: [
                    { text: "🚀 نعم، اعتمد الطلب", action: "verify_checkout" },
                    { text: "🛒 إضافة منتجات أخرى", action: "show_categories" }
                ]
            });
        } else {
            addNalshMessage({
                text: "وش تحب تسوي الحين؟",
                replies: [
                    { text: "💳 إتمام الطلب", action: "checkout_flow" },
                    { text: "🛍️ متابعة التسوق", action: "show_categories" }
                ]
            });
        }
    };

    window.nalshUpdateCartItem = function(cartId, delta) {
        if (typeof updateCartQty === 'function') {
            updateCartQty(cartId, delta);
            // إظهار رسالة تحديث صامتة ومسحها لإعطاء شعور بالتفاعل دون إزعاج
            const tempId = 'temp-' + Date.now();
            addNalshMessage(`<div id="${tempId}" style="color:var(--success); font-size:0.85rem; font-weight:bold;"><i class="fas fa-check-circle"></i> تم تحديث السلة!</div>`, true);
            setTimeout(() => {
                const el = document.getElementById(tempId);
                if(el) el.parentElement.parentElement.remove();
                window.nalshShowCartChat(false); // إعادة رسم السلة
            }, 800);
        }
    };

    // ==========================================
    // 3. تتبع الطلبات وتأخير التوصيل
    // ==========================================
    window.nalshHandleLateOrder = function() { window.nalshHandleTrackOrder(true); };

    window.nalshHandleTrackOrder = async function(isLate = false) {
        return new Promise(async (resolve) => {
            if (!window.user || !window.user.loggedIn) {
                addNalshMessage({ text: "لازم تسجل دخول أولاً عشان أقدر أشوف طلباتك 🔒", replies: [{ text: "🔑 تسجيل الدخول", action: "login" }] });
                resolve(); return;
            }

            const typingId = 'typing-' + Date.now();
            addNalshMessage(`<div id="${typingId}" style="color:var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> جاري فحص سجل طلباتك...</div>`, true);

            if (typeof fetchOrdersSilently === 'function') await fetchOrdersSilently(true);

            setTimeout(() => {
                const tEl = document.getElementById(typingId); if (tEl) tEl.parentElement.parentElement.remove();

                if (!window.currentUserOrders || window.currentUserOrders.length === 0) {
                    addNalshMessage("بحث في النظام، وما حصلت لك أي طلبات سابقة 📦. تحب أساعدك تتسوق؟");
                    resolve(); return;
                }

                let latestOrder = null;
                for (let group of window.currentUserOrders) {
                    for (let order of group.sub_orders) {
                        if (['pending_merchant_approval', 'pending_verification', 'confirmed', 'accepted_by_delivery', 'out_for_delivery', 'confirmed_by_store'].includes(order.status)) {
                            latestOrder = order; break;
                        }
                    }
                    if(latestOrder) break;
                }

                if (!latestOrder) latestOrder = window.currentUserOrders[0].sub_orders[0]; 

                const statusMap = { 
                    'pending_merchant_approval': 'قيد المراجعة من المتجر ⏳', 
                    'pending_verification': 'قيد التجهيز ⚙️',
                    'confirmed_by_store': 'تم التجهيز وبانتظار المندوب 📦',
                    'accepted_by_delivery': 'مع مندوب التوصيل 🛵',
                    'out_for_delivery': 'في الطريق إليك الآن! 🚀',
                    'completed': 'مكتمل وتم التسليم ✅',
                    'cancelled': 'ملغي ❌'
                };

                let msg = `وجدت طلبك! 🕵️‍♂️\n\n🏷️ **رقم الطلب:** #${latestOrder.id.substring(0,8)}\n🛒 **المتجر:** ${latestOrder.merchant_name}\n📊 **الحالة الآن:** ${statusMap[latestOrder.status] || latestOrder.status}\n`;
                if (latestOrder.delivery_code && ['confirmed', 'accepted_by_delivery', 'out_for_delivery', 'confirmed_by_store'].includes(latestOrder.status)) {
                    msg += `🔑 **كود الاستلام السري:** ${latestOrder.delivery_code}\n`;
                }

                addNalshMessage(msg);

                // معالجة حالة تأخير الطلب
                if (isLate && ['pending_merchant_approval', 'pending_verification', 'confirmed', 'accepted_by_delivery', 'out_for_delivery', 'confirmed_by_store'].includes(latestOrder.status)) {
                    addNalshMessage("نعتذر جداً عن التأخير! 😔\nالمنتجات بيتم تجهيزها وتوصيلها، وباقي وقت قليل وتكون عندك إن شاء الله.");
                    
                    const waNum = window.nalshGetMerchantWhatsapp();
                    let prefilledMsg = encodeURIComponent(`مرحبا، بخصوص طلبي رقم #${latestOrder.id.substring(0,8)}، لقد تأخر وصوله. أرجو المتابعة.`);
                    
                    addNalshMessage(`<div style="margin-top:10px;"><a href="https://wa.me/${waNum}?text=${prefilledMsg}" target="_blank" style="display:block; text-align:center; background:#25D366; color:white; padding:10px; border-radius:10px; text-decoration:none; font-weight:bold;"><i class="fab fa-whatsapp"></i> تواصل مع الدعم لحل المشكلة</a></div>`, true);
                }

                resolve();
            }, 1000);
        });
    };

    // ==========================================
    // 4. الذكاء الفائق (عملية إتمام الطلب المعقدة)
    // ==========================================
    const safeCalcDist = typeof calculateDistance === 'function' ? calculateDistance : function(lat1, lon1, lat2, lon2) {
        const R = 6371; const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };
    const safeCalcFee = typeof calculateDeliveryFee === 'function' ? calculateDeliveryFee : function(d) { return Math.ceil((300 + (d * 100)) / 50) * 50; };
    const safeExtractCoords = typeof extractCoords === 'function' ? extractCoords : function(u) { const m = u.match(/(-?\d+\.\d+),(-?\d+\.\d+)/); return m ? {lat:parseFloat(m[1]), lng:parseFloat(m[2])} : null; };

    window.nalshStartCheckoutFlow = function() {
        if (!window.user || !window.user.loggedIn) {
            addNalshMessage({ text: "عشان نكمل الطلب، يرجى تسجيل الدخول أولاً 🔐", replies: [{text: "تسجيل الدخول", action: "login"}] }); return;
        }
        window.nalshShowCartChat(true); // عرض السلة قبل الإتمام
    };

    window.nalshVerifyAndCheckout = async function() {
        if (!window.cart || window.cart.length === 0) {
            addNalshMessage("سلتك فارغة حالياً!"); return;
        }

        const typingId = 'typing-' + Date.now();
        addNalshMessage(`<div id="${typingId}" style="color:var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> جاري فحص المخزون والأسعار بالسيرفر...</div>`, true);

        if (typeof window.apiRequest !== 'function') {
            const tEl = document.getElementById(typingId); if (tEl) tEl.parentElement.parentElement.remove();
            console.error("❌ [Chatbot] window.apiRequest غير معرّفة بعد (مشكلة بترتيب تحميل الملفات؟).");
            addNalshMessage('حدث خطأ تقني، يرجى تحديث الصفحة والمحاولة مرة أخرى.<br><small style="color:var(--text-muted); direction:ltr; display:block; margin-top:5px;">تفاصيل تقنية: apiRequest not loaded</small>', true);
            return;
        }

        try {
            const verifyResponse = await window.apiRequest('verify_cart_live', { items: window.cart }, 'POST', true);
            const tEl = document.getElementById(typingId); if (tEl) tEl.parentElement.parentElement.remove();

            if (!verifyResponse || verifyResponse.can_proceed === false) {
                addNalshMessage("⚠️ عذراً، حصل تغيير في الأسعار أو نفد المخزون لبعض المنتجات. قمت بتحديث سلتك، يرجى مراجعتها.");
                window.cart = verifyResponse?.new_cart || [];
                if (typeof saveCartToLocalStorage === 'function') saveCartToLocalStorage();
                if (typeof updateCartCounters === 'function') updateCartCounters();
                window.nalshShowCartChat(false);
                return;
            }

            let productTotal = window.cart.reduce((s, i) => s + (parseFloat(i.price) * i.qty), 0);
            let deliveryFee = 1500; let distanceTxt = "غير محدد"; let canSubmit = false;

            if (window.user.address && window.user.address.includes('http')) {
                const userCoords = safeExtractCoords(window.user.address);
                const mSettings = typeof getMerchantSettings === 'function' ? getMerchantSettings(window.cart[0].merchant_id, window.cart[0].merchant_name) : {};
                
                if (userCoords && mSettings && mSettings.location) {
                    const mCoords = safeExtractCoords(mSettings.location);
                    if (mCoords) {
                        const dist = safeCalcDist(userCoords.lat, userCoords.lng, mCoords.lat, mCoords.lng);
                        deliveryFee = safeCalcFee(dist); distanceTxt = `${dist.toFixed(1)} كم`; canSubmit = true;
                    }
                }
            }

            let grandTotal = productTotal + deliveryFee;
            let summaryHTML = `<div style="background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:15px; margin-top:5px;">`;
            summaryHTML += `<h4 style="margin:0 0 10px; color:var(--success);"><i class="fas fa-check-circle"></i> المخزون متوفر!</h4>`;
            summaryHTML += `<div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>المنتجات:</span> <strong>${productTotal.toLocaleString()} ريال</strong></div>`;
            
            if (canSubmit) {
                summaryHTML += `<div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>التوصيل (${distanceTxt}):</span> <strong>${deliveryFee.toLocaleString()} ريال</strong></div>`;
                summaryHTML += `<hr style="border-color:var(--border); margin:10px 0;">`;
                summaryHTML += `<div style="display:flex; justify-content:space-between; font-size:1.1rem; color:var(--primary);"><span>الإجمالي:</span> <strong>${grandTotal.toLocaleString()} ريال</strong></div>`;
                summaryHTML += `</div>`;

                addNalshMessage(summaryHTML, true);
                addNalshMessage({
                    text: "موقعك محفوظ لدي 📍. هل أنت جاهز لاعتماد وإرسال الطلب الآن؟",
                    replies: [
                        { text: "🚀 نعم، أرسل الطلب", action: "submit_final_order" },
                        { text: "📍 تغيير موقعي", action: "change_location_then_submit" }
                    ]
                });
            } else {
                summaryHTML += `<div style="color:var(--danger); font-size:0.9rem; margin-top:10px;"><i class="fas fa-exclamation-triangle"></i> أحتاج منك تحديد موقعك على الخريطة لحساب التوصيل بدقة.</div></div>`;
                addNalshMessage(summaryHTML, true);
                addNalshMessage({
                    text: "الرجاء تحديد موقعك أولاً 📍. (بعد تحديد الموقع ارجع هنا واضغط إتمام)",
                    replies: [
                        { text: "🗺️ فتح الخريطة", action: "change_location_then_submit" },
                        { text: "💳 إتمام الطلب", action: "verify_checkout" } // زر دائم لمحاولة الإتمام
                    ]
                });
            }

        } catch(e) {
            console.error("❌ [Chatbot] فشل التحقق من السلة:", e);
            // ⭐ نعرض تفاصيل الخطأ الفعلي بالمحادثة نفسها (مش بس بالـ Console) عشان
            // يسهل تشخيص السبب الحقيقي (شبكة/CORS/رد غير متوقع من السيرفر...)
            const detail = (e && e.message) ? e.message : 'سبب غير معروف';
            addNalshMessage(`حدث خطأ في الاتصال، يرجى المحاولة من زر السلة الأساسي للموقع.<br><small style="color:var(--text-muted); direction:ltr; display:block; margin-top:5px;">تفاصيل تقنية: ${detail}</small>`, true);
        }
    };

    window.nalshSubmitFinalOrder = async function() {
        const typingId = 'typing-' + Date.now();
        addNalshMessage(`<div id="${typingId}" style="color:var(--primary); font-weight:bold;"><i class="fas fa-rocket fa-bounce"></i> جاري رفع الطلب للسيرفر...</div>`, true);

        try {
            const idempotencyKey = 'order-chat-' + Math.random().toString(36).substring(2);
            const address = window.user.address; const gpsMatch = address.match(/https?:\/\/[^\s|]+/); const gps = gpsMatch ? gpsMatch[0] : '';

            const result = await window.apiRequest('create_order', { customer: { name: window.user.full_name, address, gps }, idempotency_key: idempotencyKey, local_cart: window.cart });

            const tEl = document.getElementById(typingId); if (tEl) tEl.parentElement.parentElement.remove();

            if (result.status === 'success') {
                window.cart = [];
                if(typeof saveCartToLocalStorage === 'function') saveCartToLocalStorage();
                if(typeof updateCartCounters === 'function') updateCartCounters();
                if(typeof window.renderCartContent === 'function') window.renderCartContent();
                
                addNalshMessage("🎉 ألف مبروك! تم اعتماد وإرسال طلبك بنجاح للتاجر.");
                addNalshMessage({
                    text: "تقدر تتابع حالة الطلب من قسم طلباتي، أو تسألني في أي وقت 'وين طلبي'.",
                    replies: [{ text: "📦 عرض طلباتي", action: "go_orders" }]
                });
                if (typeof fetchOrdersSilently === 'function') fetchOrdersSilently(true);
            } else {
                addNalshMessage("⚠️ عذراً، رفض السيرفر الطلب: " + result.message);
            }
        } catch(e) {
            addNalshMessage("حدث خطأ غير متوقع، الرجاء إتمام الطلب من السلة الرئيسية.");
        }
    };

    // ==========================================
    // معالجة الأزرار (Actions) مع نظام القفل
    // ==========================================
    window.handleNalshAction = function(action, text) {
        window.toggleNalshInput(true); // قفل الإدخال تماماً
        addUserMessageToNalsh(text);
        
        setTimeout(async () => {
            if (action === 'show_categories') {
                addNalshMessage("تفضل، تم توجيهك للأقسام! 🛒");
                setTimeout(() => { window.closeNalshChat(); if (typeof changeView === 'function') changeView('all'); window.toggleNalshInput(false); }, 1000);
            } else if (action === 'inquiry') {
                window.nalshHandleInquiry(); window.toggleNalshInput(false);
            } else if (action === 'complaint') {
                window.nalshHandleComplaint(); window.toggleNalshInput(false);
            } else if (action === 'checkout_flow') {
                window.nalshStartCheckoutFlow(); window.toggleNalshInput(false);
            } else if (action === 'show_cart') {
                window.nalshShowCartChat(false); window.toggleNalshInput(false);
            } else if (action === 'verify_checkout') {
                await window.nalshVerifyAndCheckout(); window.toggleNalshInput(false);
            } else if (action === 'login') {
                window.closeNalshChat(); if(typeof toggleAuthPage === 'function') toggleAuthPage(true); window.toggleNalshInput(false);
            } else if (action === 'change_location_then_submit') {
                window.closeNalshChat();
                if(typeof openAddressEditor === 'function') openAddressEditor(true);
                // تذكير المستخدم أنه يمكنه الإتمام لاحقاً
                addNalshMessage({ text: "بعد تحديد موقعك، اضغط على إتمام الطلب لإنهاء الشراء 👇", replies: [{ text: "💳 إتمام الطلب الآن", action: "verify_checkout" }] });
                window.toggleNalshInput(false);
            } else if (action === 'submit_final_order') {
                await window.nalshSubmitFinalOrder(); window.toggleNalshInput(false);
            } else if (action === 'go_orders') {
                window.closeNalshChat(); if(typeof OrdersApp !== 'undefined') OrdersApp.openProfilePage(); window.toggleNalshInput(false);
            } else if (action === 'track_order') {
                await window.nalshHandleTrackOrder(false); window.toggleNalshInput(false);
            } else if (action.startsWith('search_cat_')) {
                const catName = action.replace('search_cat_', '');
                window.closeNalshChat();
                if (typeof StoreUI !== 'undefined' && StoreUI.openCategoryFullView) StoreUI.openCategoryFullView(catName);
                window.toggleNalshInput(false);
            } else if (action.startsWith('complaint_cat_')) {
                const cat = action.replace('complaint_cat_', '');
                if (cat === 'custom') {
                    window.nalshAwaitingComplaintText = true;
                    addNalshMessage("تفضل، اكتب لي تفاصيل المشكلة بالضبط وسأجهزها لصاحب المتجر مباشرة ✍️");
                    window.toggleNalshInput(false);
                } else {
                    const labels = { 'تالف': 'منتج تالف أو ناقص عند الاستلام', 'تأخير': 'تأخر واضح في التوصيل', 'خطأ': 'خطأ في الطلب المستلم (منتج غير مطابق)' };
                    window.nalshSendComplaintToMerchant(labels[cat] || cat);
                    window.toggleNalshInput(false);
                }
            } else {
                window.toggleNalshInput(false);
            }
        }, 600);
    };

    window.setupNalshBot = function() {
        const closeBtn = document.querySelector('.nalsh-chat-close'), userInput = document.getElementById('nalsh-user-input'), sendBtn = document.getElementById('nalsh-send-btn');
        closeBtn.addEventListener('click', window.closeNalshChat);
        sendBtn.addEventListener('click', processUserTextMessage);
        userInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') processUserTextMessage(); });
        // ⭐ لما يضغط العميل على حقل الكتابة، نمرر فوراً لآخر رسالة (وبعدها نعيد
        // التمرير مرة ثانية من nalshStartViewportTracking عند استقرار الكيبورد)
        // حتى تبقى آخر رسالة كان يقرأها ظاهرة بالكامل وما تنغطي بالكيبورد.
        userInput.addEventListener('focus', () => {
            window.nalshScrollToBottom(true);
            setTimeout(() => window.nalshScrollToBottom(true), 300);
        });
    };

    window.startNalshConversation = function() {
        const cfg = window.getNalshAssistantConfig();
        const storeName = (window.App && window.App.storeData) ? window.App.storeData.name : 'المتجر';
        const assistantName = cfg.name || 'مساعد المتجر';
        const titleEl = document.getElementById('chat-store-name');
        if (titleEl) titleEl.innerText = assistantName;

        const messagesContainer = document.getElementById('nalsh-chat-messages');
        if (messagesContainer && messagesContainer.children.length > 0) { window.nalshScrollToBottom(false); return; }

        const userName = (window.user && window.user.full_name) ? ` ${window.user.full_name.split(' ')[0]}` : '';
        const greetingText = cfg.greeting || `يا هلا والله بك${userName}! 👋 نورت ${storeName}.`;
        const replyActions = (cfg.quick_actions && cfg.quick_actions.length > 0)
            ? cfg.quick_actions.map((label) => ({ text: label, action: label.includes('سلة') ? 'checkout_flow' : label.includes('طلب') ? 'track_order' : 'inquiry' }))
            : [
                { text: "🛒 سلة مشترياتي", action: "checkout_flow" },
                { text: "📦 تتبع طلباتي", action: "track_order" },
                { text: "📞 تواصل مع البائع", action: "inquiry" }
            ];

        setTimeout(() => addNalshMessage(greetingText), 500);
        setTimeout(() => addNalshMessage({
            text: cfg.greeting ? `${cfg.greeting} هل ترغب بالاستمرار؟` : "أنا المساعد الذكي (نسخة تجريبية 🧪)، أقدر أبحث لك عن منتج، أراجع وأعدل سلتك، أخلص طلبك بالكامل، وأوصل استفسارك أو شكواك لصاحب المتجر مباشرة. تحب نجرب؟",
            replies: replyActions
        }), 1500);
    };

    window.addNalshMessage = function(messageData, isHTML = false, isSystem = false) {
        const messagesContainer = document.getElementById('nalsh-chat-messages'); if (!messagesContainer) return;
        
        const wrapper = document.createElement('div'); wrapper.className = 'nalsh-message-wrapper bot';
        const messageDiv = document.createElement('div'); messageDiv.className = 'nalsh-message'; 
        if (isSystem) messageDiv.classList.add('system');

        if (isHTML) messageDiv.innerHTML = messageData;
        else if (typeof messageData === 'string') messageDiv.innerHTML = messageData.replace(/\n/g, '<br>'); 
        else {
            messageDiv.textContent = messageData.text;
            if (messageData.replies) {
                const repliesContainer = document.createElement('div'); repliesContainer.className = 'nalsh-quick-reply-container';
                messageData.replies.forEach(reply => { 
                    const replyBtn = document.createElement('button'); replyBtn.className = 'nalsh-quick-reply'; replyBtn.textContent = reply.text; 
                    replyBtn.onclick = () => handleNalshAction(reply.action, reply.text); 
                    repliesContainer.appendChild(replyBtn); 
                });
                messageDiv.appendChild(repliesContainer);
            }
        }
        wrapper.appendChild(messageDiv); messagesContainer.appendChild(wrapper); window.nalshScrollToBottom(true);
    };

    window.addUserMessageToNalsh = function(text) {
        const messagesContainer = document.getElementById('nalsh-chat-messages');
        const wrapper = document.createElement('div'); wrapper.className = 'nalsh-message-wrapper user';
        const messageDiv = document.createElement('div'); messageDiv.className = 'nalsh-message'; messageDiv.textContent = text;
        wrapper.appendChild(messageDiv); messagesContainer.appendChild(wrapper); window.nalshScrollToBottom(true);
        messagesContainer.querySelectorAll('.nalsh-quick-reply-container').forEach(qr => qr.remove());
    };

    window.createNalshProductCard = function(p) {
        const currentPrice = parseFloat(p.price) || parseFloat(p.current_price) || 0;
        const hasOptions = (p.options && p.options.length > 0) || (p.sizes && p.sizes.length > 0);
        const safeProduct = JSON.stringify(p).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        
        // إذا كان المنتج يحتوي على مقاسات، نفتح تفاصيل المنتج بدلاً من الإضافة المباشرة
        const btnAction = hasOptions 
            ? `onclick="closeNalshChat(); if(typeof ProductDetailUI !== 'undefined') ProductDetailUI.open('${p.id}');"` 
            : `onclick="addFromChatToCart(${safeProduct})"`;
            
        const btnText = hasOptions ? '<i class="fas fa-list"></i> عرض المقاسات' : '<i class="fas fa-cart-plus"></i> أضف للسلة';
        const btnBg = hasOptions ? 'background:var(--text-main);' : 'background:var(--primary);';

        return `<div class="nalsh-product-card" style="border:1px solid var(--border); padding:10px; border-radius:12px; margin-bottom:10px; background:var(--bg-card); box-shadow:var(--shadow-sm);">
            <div style="display:flex; gap:10px; align-items:center;">
                <img src="${p.image}" style="width:60px; height:60px; object-fit:cover; border-radius:8px; border:1px solid var(--border);">
                <div style="flex:1;">
                    <div style="font-weight:900; font-size:0.95rem; color:var(--text-main); line-height:1.2;">${p.name}</div>
                    <div style="color:var(--primary); font-weight:900; margin-top:5px;">${currentPrice} ريال</div>
                </div>
            </div>
            <button class="chat-action-btn" ${btnAction} style="width:100%; margin-top:10px; padding:10px; ${btnBg} color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
                ${btnText}
            </button>
        </div>`;
    };

    window.addFromChatToCart = function(productStr) {
        if (typeof window.addToCart === 'function') {
            window.addToCart(productStr);
            addNalshMessage({
                text: `✅ ممتاز! تمت إضافة "${productStr.name}" إلى سلتك.`,
                replies: [
                    { text: "🛒 عرض السلة وتأكيد الطلب", action: "checkout_flow" },
                    { text: "🛍️ متابعة التسوق", action: "show_categories" }
                ]
            });
        }
    };

    window.cleanSearchQuery = function(text) {
        const stopWords = ['اريد', 'أريد', 'ابغى', 'أبغى', 'ابي', 'أبي', 'ودي', 'ابحث عن', 'أبحث عن', 'ممكن', 'هل يوجد', 'عندكم', 'في', 'لو سمحت', 'اشتري', 'بكم', 'سعر', 'فين', 'وين', 'احصل', 'موجود'];
        let cleaned = window.normalizeArabic(text);
        stopWords.forEach(word => { const regex = new RegExp('\\b' + window.normalizeArabic(word) + '\\b', 'gi'); cleaned = cleaned.replace(regex, ''); });
        return cleaned.replace(/[^\w\sا-ي]/gi, '').trim(); 
    };

    window.processUserTextMessage = async function() {
        const userInput = document.getElementById('nalsh-user-input');
        const originalMessage = userInput.value.trim(); 
        if (!originalMessage) return;
        
        window.toggleNalshInput(true); // قفل الإدخال أثناء التفكير
        addUserMessageToNalsh(originalMessage); 
        userInput.value = '';

        // إذا كان البوت بانتظار تفاصيل شكوى مكتوبة من العميل، نلتقطها فوراً هنا
        if (window.nalshAwaitingComplaintText) {
            window.nalshAwaitingComplaintText = false;
            setTimeout(() => {
                window.nalshSendComplaintToMerchant(originalMessage);
                window.toggleNalshInput(false);
            }, 500);
            return;
        }

        const typingId = 'typing-' + Date.now();
        addNalshMessage(`<div id="${typingId}" class="nalsh-typing-indicator"><span></span><span></span><span></span></div>`, true);
        window.nalshScrollToBottom(true);

        setTimeout(async () => {
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.parentElement.parentElement.remove();

            // 1. فحص الكلمات المفتاحية الذكية (بعد تطبيع النص لفهم أدق لاختلاف الكتابة)
            let intentMatched = false;
            const normalizedMsg = window.normalizeArabic(originalMessage);

            if (typeof Fuse !== 'undefined') {
                let allKeywords = [];
                window.nalshKnowledgeBase.forEach(item => { 
                    item.keywords.forEach(kw => { 
                        allKeywords.push({ keyword: window.normalizeArabic(kw), intent: item.intent, data: item }); 
                    }); 
                });

                const fuseIntents = new Fuse(allKeywords, { keys: ['keyword'], threshold: 0.34, ignoreLocation: true });
                const intentResults = fuseIntents.search(normalizedMsg);

                if (intentResults.length > 0) {
                    const bestMatch = intentResults[0].item.data;
                    if (bestMatch.action) {
                        const actionResult = window[bestMatch.action]();
                        if (actionResult instanceof Promise) await actionResult;
                    } else {
                        addNalshMessage(bestMatch.answer);
                    }
                    intentMatched = true; window.toggleNalshInput(false); return;
                }
            }

            if (intentMatched) return;

            // 2. البحث عن المنتجات بذكاء 
            const cleanedSearch = window.cleanSearchQuery(originalMessage);

            if (cleanedSearch.length > 1 && typeof window.allProducts !== 'undefined' && window.allProducts.length > 0) {
                let productResults = [];
                if (typeof Fuse !== 'undefined') {
                    const fuseProducts = new Fuse(window.allProducts, { keys: [ { name: 'name', weight: 0.7 }, { name: 'category', weight: 0.2 }, { name: 'description', weight: 0.1 } ], threshold: 0.3, ignoreLocation: true });
                    const searchResults = fuseProducts.search(cleanedSearch);
                    productResults = searchResults.map(res => res.item).slice(0, 3);
                } else {
                    productResults = window.allProducts.filter(p => p.name.includes(cleanedSearch)).slice(0, 3);
                }

                if (productResults.length > 0) {
                    let htmlProducts = productResults.map(p => createNalshProductCard(p)).join('');
                    addNalshMessage(`بحثت في المتجر وحصلت لك هذه المنتجات بخصوص "${cleanedSearch}":`); 
                    addNalshMessage(`<div>${htmlProducts}</div>`, true);
                    window.toggleNalshInput(false); return;
                }
            }

            // 3. لا يوجد تطابق كلمات مفتاحية ولا منتج - نحوّل السؤال للمساعد
            // الذكي الحقيقي الخاص بهذا التاجر (إن كان مفعّلاً من لوحة التاجر)
            // ✅ نستخدم window.currentMerchantId المُجهّز مسبقاً في app.js
            // (loadStoreData) بدل تخمين حقل داخل storeData - هو نفس المعرّف
            // المستخدم فعلياً بباقي الميزة (راجع console.log "Store Context").
            //
            // 🧠 سجل محادثة المساعد الذكي: نحتفظ بآخر الرسائل المتبادلة فعلياً
            // مع الـ AI (وليس كل تفاعلات الأزرار المحلية) ونرسله مع كل طلب،
            // حتى يقدر يربط سؤال العميل الحالي بسياق ما قبله عبر عدة رسائل.
            const merchantId = window.currentMerchantId || null;
            let handledByAi = false;

            if (merchantId && typeof window.apiRequest === 'function') {
                try {
                    const aiRes = await window.apiRequest('ai_chat', {
                        merchant_id: merchantId,
                        message: originalMessage,
                        history: window.nalshAiHistory || [],
                    }, 'POST', true);

                    // 🛡️ الرد قادم مُعقّماً (HTML-escaped) من السيرفر أصلاً
                    if (aiRes && aiRes.status === 'success' && aiRes.reply) {
                        addNalshMessage(aiRes.reply);
                        handledByAi = true;

                        // نحدّث السجل المحلي بآخر تبادل (سؤال العميل + رد المساعد)
                        // ونحدّه بعدد معقول من الرسائل لتفادي تضخّم كل طلب لاحق
                        if (!window.nalshAiHistory) window.nalshAiHistory = [];
                        window.nalshAiHistory.push({ role: 'user', message: originalMessage });
                        window.nalshAiHistory.push({ role: 'assistant', message: aiRes.reply });
                        if (window.nalshAiHistory.length > 20) {
                            window.nalshAiHistory = window.nalshAiHistory.slice(-20);
                        }
                    }
                } catch (e) {
                    console.warn('⚠️ تعذّر الوصول للمساعد الذكي:', e);
                }
            }

            // 4. فشل آمن: لو المساعد الذكي غير مفعّل/متعطل، ترجع الرسالة الافتراضية القديمة
            if (!handledByAi) {
                addNalshMessage({
                    text: "عذراً، ما فهمت عليك تماماً أو ما حصلت المنتج اللي تدور عليه 🧐\nتقدر تعيد صياغة طلبك، أو تتواصل مع المتجر مباشرة، أو تتصفح الأقسام.",
                    replies:[
                        { text: "📞 تواصل مع المتجر", action: "inquiry" },
                        { text: "😔 عندي شكوى", action: "complaint" },
                        { text: "🛍️ عرض الأقسام", action: "show_categories" }
                    ]
                });
            }
            window.toggleNalshInput(false);
        }, 800);
    };

    if (typeof window.initStorefront === 'function') {
        const originalInitStorefront = window.initStorefront;
        window.initStorefront = function(config, ...args) {
            const result = originalInitStorefront.apply(this, [config, ...args]);
            if (typeof window.applyNalshBotConfig === 'function') {
                window.applyNalshBotConfig();
            }
            return result;
        };
    }

    window.addEventListener('message', function(event) {
        if (!event.data || typeof event.data !== 'object') return;
        const updateType = event.data.type;
        if (updateType === 'NALSH_CONFIG_UPDATE' || updateType === 'NALSH_THEME_UPDATE' || updateType === 'STORE_CONFIG_UPDATED') {
            const newConfig = event.data.config || event.data.payload;
            if (newConfig) {
                window.currentStorefrontConfig = newConfig;
            }
            if (typeof window.applyNalshBotConfig === 'function') {
                window.applyNalshBotConfig();
            }
        }
    });

    if (typeof window.applyNalshBotConfig === 'function') {
        window.applyNalshBotConfig();
    }

    window.NalshBotUI.init();
}