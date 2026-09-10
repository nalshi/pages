# دليل تعديل ونشر قوالب المتاجر بصيغة JSON

هذا النظام يعمل حاليًا بنظام **القوالب الجاهزة**:

- أنت تضيف الأشكال والقوالب في ملفات JSON.
- التاجر يرى القوالب المنشورة فقط.
- التاجر يختار قالبًا جاهزًا، يعاينه، ثم يطبقه.
- التاجر لا يغير اللون أو الخط أو التخطيط بشكل منفصل.
- المتجر يحفظ أسماء الاختيارات فقط، وليس نسخة كاملة من إعدادات القالب.

## 1. مكان الملفات

كل ملفات مكتبة القوالب موجودة هنا:

```text
e:\mmi\templates\
```

الملفات الحالية:

```text
manifest.json      تعريف الأقسام والقوالب الجاهزة
themes.json        الألوان والثيمات
fonts.json         الخطوط
layouts.json       تخطيطات المنتجات
navigation.json    شكل التنقل
bots.json          المساعد والروبوت
```

لا تغير أسماء الملفات إلا إذا عدلت جميع المسارات المرتبطة بها في `manifest.json` ومحرك المتجر.

## 2. شكل أي ملف مكتبة

كل ملف قسم يجب أن يكون بهذا الشكل:

```json
{
  "version": 1,
  "items": [
    {
      "id": "اسم-فريد-بالإنجليزية",
      "name": "الاسم الظاهر للتاجر",
      "description": "وصف مختصر للقالب",
      "preview": {
        "primary": "#4F46E5",
        "accent": "#06B6D4",
        "background": "#F8FAFC"
      },
      "config": {
        "...": "إعدادات المتجر الخاصة بهذا الاختيار"
      }
    }
  ]
}
```

## 3. قواعد مهمة للمعرف `id`

قيمة `id` هي الاسم الذي يحفظه النظام للتاجر، لذلك يجب أن تكون:

- باللغة الإنجليزية.
- بدون مسافات.
- فريدة داخل الملف نفسه.
- ثابتة بعد النشر؛ لا تغيرها إذا كان هناك تجار يستخدمونها.
- مكونة من حروف صغيرة وأرقام وشرطة فقط، مثل:

```text
indigo
luxury
grid-3
bottom-bar
my-new-theme
```

الاسم العربي يوضع في `name` وليس في `id`.

## 4. إضافة ثيم أو لون جديد

افتح:

```text
e:\mmi\templates\themes.json
```

أضف عنصرًا جديدًا داخل `items`، ولا تحذف القوسين أو الفواصل:

```json
{
  "id": "rose",
  "name": "وردي هادئ",
  "description": "ألوان ناعمة للمتاجر النسائية.",
  "preview": {
    "primary": "#DB2777",
    "accent": "#F472B6",
    "background": "#FFF1F2"
  },
  "config": {
    "light_theme": {
      "colors": {
        "primary": "#DB2777",
        "primary_hover": "#BE185D",
        "accent": "#F472B6",
        "bg_body": "#FFF1F2",
        "bg_card": "#FFFFFF",
        "text_main": "#3F1728",
        "text_muted": "#9D6078",
        "border": "#FBCFE8",
        "navbar_bg": "#FFFFFF",
        "bottom_bar_bg": "#FFFFFF",
        "bottom_bar_active": "#DB2777",
        "bottom_bar_inactive": "#9CA3AF",
        "card_bg": "#FFFFFF",
        "card_border": "#FBCFE8",
        "price_color": "#DB2777",
        "btn_primary_bg": "#DB2777",
        "btn_primary_text": "#FFFFFF"
      }
    }
  }
}
```

يفضل نسخ ثيم موجود ثم تغيير الألوان؛ بذلك تضمن بقاء جميع مفاتيح الألوان المطلوبة.

## 5. إضافة خط جديد

افتح:

```text
e:\mmi\templates\fonts.json
```

أضف:

```json
{
  "id": "alexandria",
  "name": "Alexandria",
  "description": "خط عربي هندسي وواضح.",
  "config": {
    "typography": {
      "font_family": "Alexandria",
      "base_size": "16px",
      "heading_weight": "700"
    }
  }
}
```

يجب أن يكون اسم `font_family` اسم خط صحيحًا. الخطوط المعروفة والمدعومة حاليًا تشمل:

```text
Tajawal
Cairo
Readex Pro
Alexandria
Almarai
IBM Plex Sans Arabic
Noto Kufi Arabic
Changa
El Messiri
```

## 6. إضافة تخطيط منتجات

افتح:

```text
e:\mmi\templates\layouts.json
```

أضف عنصرًا مثل:

```json
{
  "id": "wide-4",
  "name": "شبكة واسعة",
  "description": "أربع بطاقات في الشاشات الكبيرة.",
  "config": {
    "products_settings": {
      "display_mode": "all_flat_grid",
      "portrait": {
        "grid_columns": 2,
        "card_orientation": "portrait",
        "card_style": "classic"
      },
      "landscape": {
        "grid_columns": 4,
        "card_orientation": "landscape",
        "card_style": "classic"
      }
    }
  }
}
```

قيم `display_mode` تعتمد على ما يدعمه المتجر. استخدم قيمة موجودة في تخطيط يعمل قبل ابتكار قيمة جديدة.

## 7. إضافة شكل التنقل

افتح:

```text
e:\mmi\templates\navigation.json
```

مثال:

```json
{
  "id": "soft-floating",
  "name": "عائم ناعم",
  "description": "شريط سفلي عائم بحواف ناعمة.",
  "config": {
    "navigation_settings": {
      "bottom_bar": {
        "enabled": true,
        "style": "floating"
      }
    }
  }
}
```

مهم: اسم القسم في `manifest.json` هو `navigation`، واسم الاختيار داخل القالب أيضًا يحفظ كمفتاح `navigation`.

## 8. إضافة إعداد الروبوت

افتح:

```text
e:\mmi\templates\bots.json
```

مثال:

```json
{
  "id": "support",
  "name": "مساعد الدعم",
  "description": "يركز على أسئلة الشحن والطلبات.",
  "config": {
    "assistant": {
      "enabled": true,
      "name": "مساعد الدعم",
      "behavior_mode": "support",
      "conversation_style": "balanced",
      "button_style": "bubble"
    }
  }
}
```

استخدم قيم `behavior_mode` التي يدعمها محرك المساعد. إذا كانت القيمة جديدة ولا يوجد كود يتعامل معها، ستظهر الإعدادات لكن قد لا يتغير سلوك المساعد.

## 9. إنشاء قالب جاهز يظهر للتاجر

إضافة عنصر إلى `themes.json` أو أي ملف قسم لا تجعله قالبًا جاهزًا ظاهرًا وحده. لكي يظهر كتجميعة للتاجر، أضفه إلى:

```text
e:\mmi\templates\manifest.json
```

داخل `presets` أضف:

```json
{
  "id": "rose-shop",
  "name": "متجر وردي",
  "description": "هوية ناعمة مع تخطيط واضح للمنتجات.",
  "selections": {
    "theme": "rose",
    "font": "alexandria",
    "layout": "wide-4",
    "navigation": "soft-floating",
    "bot": "sales"
  }
}
```

المفاتيح الصحيحة للاختيارات هي:

```text
theme
font
layout
navigation
bot
```

يجب أن تطابق كل قيمة `id` موجودة فعلًا في الملف المقابل:

| المفتاح | الملف |
|---|---|
| `theme` | `themes.json` |
| `font` | `fonts.json` |
| `layout` | `layouts.json` |
| `navigation` | `navigation.json` |
| `bot` | `bots.json` |

إذا كتبت قيمة غير موجودة، قد يظهر القالب للتاجر لكن لن يطبق ذلك الجزء.

## 10. إضافة قسم جديد

لا تضف قسمًا جديدًا مثل `headers.json` أو `banners.json` إلا إذا كان محرك المتجر يعرف كيف يطبقه. إضافة الملف وحدها لا تكفي.

عند الحاجة لقسم جديد يجب تعديل هذه الأجزاء معًا:

1. إنشاء ملف JSON داخل `templates`.
2. إضافة القسم إلى `manifest.json`.
3. إضافة مفتاحه واسم ملفه في `ThemeEngine.ts` داخل `categories`.
4. إضافة المفتاح إلى `selections` في القالب الجاهز.
5. التأكد أن محرك المتجر يطبق مفاتيح `config` الجديدة.

## 11. طريقة التجربة على الجهاز

من PowerShell:

```powershell
cd e:\mmi
npm run dev
```

ثم افتح:

```text
http://localhost:3000/merchant-dashboard.html?local_templates=1
```

اختبر بالترتيب:

1. افتح قسم **قوالب المتجر**.
2. تأكد أن القالب الجديد ظاهر باسمه.
3. اختر القالب.
4. اضغط **معاينة**.
5. تأكد من اللون والخط والتخطيط والتنقل.
6. عدل JSON.
7. أعد تحميل الصفحة مع `Ctrl + F5`.
8. اختبر القالب مرة أخرى.

إذا بقيت نتيجة قديمة، امسح التجربة من زر **مسح التجربة** أو امسح بيانات الموقع من أدوات المتصفح؛ ملفات JSON تستخدم تخزينًا مؤقتًا لتحسين السرعة.

## 12. فحص JSON قبل النشر

بعد كل تعديل شغل:

```powershell
cd e:\mmi
npm run type-check
npm run build
```

إذا نجح البناء، ستجد الملفات المنشورة داخل:

```text
e:\mmi\dist\templates\
```

لا ترفع ملفات `templates` وحدها إلى الإنتاج دون تشغيل البناء، لأن عملية البناء تنسخها إلى `dist`.

## 13. قواعد JSON التي تسبب الأخطاء

خطأ:

```json
{ "id": "rose", "name": "وردي", }
```

الصحيح إزالة الفاصلة الأخيرة:

```json
{ "id": "rose", "name": "وردي" }
```

أخطاء شائعة:

- استخدام فاصلة عربية بدل الفاصلة الإنجليزية `,`.
- استخدام علامات اقتباس عربية بدل `"`.
- تكرار `id`.
- كتابة `navigations` بدل `navigation` في `selections`.
- وضع `config` خارج العنصر أو خارج `items`.
- إضافة قالب إلى ملف القسم دون إضافته إلى `manifest.json` داخل `presets`.
- حذف مفاتيح من ثيم موجودة يعتمد عليها محرك الألوان.
- استخدام لون ليس بصيغة Hex مثل `#RRGGBB`.

## 14. أفضل طريقة لإدارة الإصدارات

- لا تغير `id` لقالب منشور؛ أنشئ `id` جديدًا.
- ارفع `version` في الملف عند تغييرات كبيرة.
- احتفظ بنسخة احتياطية من مجلد `templates`.
- اجعل كل قالب يحتوي على وصف واضح.
- استخدم أسماء IDs مفهومة وثابتة.
- اختبر قالبًا واحدًا قبل إضافة عدة قوالب.

## مثال سريع كامل

لإنشاء قالب جديد باسم **متجر وردي**:

1. أضف `rose` إلى `themes.json`.
2. أضف `alexandria` إلى `fonts.json`.
3. اختر تخطيطًا موجودًا مثل `grid-3` أو أضف تخطيطًا جديدًا.
4. اختر تنقلًا موجودًا مثل `bottom-bar`.
5. أضف preset جديدًا إلى `manifest.json`:

```json
{
  "id": "rose-shop",
  "name": "متجر وردي",
  "description": "قالب وردي جاهز.",
  "selections": {
    "theme": "rose",
    "font": "alexandria",
    "layout": "grid-3",
    "navigation": "bottom-bar",
    "bot": "sales"
  }
}
```

6. شغل `npm run build`.
7. افتح وضع التجربة.
8. عاين القالب ثم انشره.

