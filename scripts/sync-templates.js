import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.resolve(rootDir, 'templates');
const themesSubDir = path.resolve(templatesDir, 'themes');

/**
 * فحص واكتشاف كافة قوالب الـ JSON تلقائياً في templates/themes/ و templates/
 * وبناء ملف themes.json الموحد بدون أي حاجة لملف manifest.json يدوي.
 */
export function scanAndSyncThemes() {
  console.log('🎨 [Templates Sync] جاري فحص واكتشاف قوالب المتجر في مجلد templates/ ...');

  const discoveredItems = [];
  const visitedIds = new Set();

  function processJsonFile(filePath, relativePath) {
    try {
      if (!fs.existsSync(filePath)) return;
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      const filename = path.basename(filePath);
      // استبعاد ملفات النظام غير المخصصة كقوالب متاجر
      if (['manifest.json', 'fonts.json', 'layouts.json', 'navigation.json', 'bots.json', 'themes-index.json'].includes(filename)) {
        return;
      }
      if (filename === 'themes.json') return;

      if (data && typeof data === 'object') {
        const id = String(data.id || filename.replace(/\.json$/i, '').replace(/^theme_/, '')).trim().toLowerCase();
        if (!id || visitedIds.has(id)) return;
        visitedIds.add(id);

        const config = data.config || (data.light_theme ? data : null);
        const lightColors = config?.light_theme?.colors || data.preview || {};

        const themeItem = {
          id,
          name: data.name || `قالب ${id}`,
          description: data.description || 'تصميم جاهز قابل للتخصيص لمتجرك.',
          category: data.category || 'قوالب المتجر',
          preview: {
            primary: data.preview?.primary || lightColors.primary || '#4F46E5',
            accent: data.preview?.accent || lightColors.accent || '#06B6D4',
            background: data.preview?.background || lightColors.bg_body || '#F8FAFC'
          },
          sourceFile: relativePath.replace(/\\/g, '/'),
          config: config || {}
        };

        discoveredItems.push(themeItem);
        console.log(`  ✓ تم اكتشاف القالب: "${themeItem.name}" [${id}] من (${relativePath})`);
      }
    } catch (err) {
      console.warn(`  ⚠️ تعذر قراءة ملف القالب ${relativePath}:`, err.message);
    }
  }

  // 1. فحص مجلد templates/themes/
  if (fs.existsSync(themesSubDir)) {
    const files = fs.readdirSync(themesSubDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        processJsonFile(path.join(themesSubDir, file), `/templates/themes/${file}`);
      }
    }
  }

  // 2. فحص مجلد templates/ لأي ملفات theme_*.json إضافية
  if (fs.existsSync(templatesDir)) {
    const files = fs.readdirSync(templatesDir);
    for (const file of files) {
      if (file.endsWith('.json') && (file.startsWith('theme') || file.includes('theme'))) {
        if (file !== 'themes.json') {
          processJsonFile(path.join(templatesDir, file), `/templates/${file}`);
        }
      }
    }
  }

  // 3. كتابة ملف themes.json المحدث ليكون الفهرس الرسمي الجاهز بدون أي حاجة لـ manifest
  const outputThemes = {
    version: 2,
    updated_at: new Date().toISOString(),
    count: discoveredItems.length,
    items: discoveredItems
  };

  const themesJsonPath = path.join(templatesDir, 'themes.json');
  fs.writeFileSync(themesJsonPath, JSON.stringify(outputThemes, null, 2), 'utf8');
  console.log(`✅ [Templates Sync] تم تحديث مكتبة القوالب بنجاح (${discoveredItems.length} قالب متاح) في templates/themes.json`);

  return discoveredItems;
}

// تشغيل مباشر
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  scanAndSyncThemes();
}
