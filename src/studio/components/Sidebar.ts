/**
 * ========================================================
 * 🗂️ Studio Sidebar & Tab Navigator v4.5
 * لوحة تحكم متجاوبة بالكامل مع شريط عمودي للحاسوب وشريط أفقي للموبايل
 * ========================================================
 */

import { studioState } from '../state';
import { ActiveTabKey } from '../types';
import { IdentityTab } from './tabs/IdentityTab';
import { ProductsTab } from './tabs/ProductsTab';
import { MessagesTab } from './tabs/MessagesTab';
import { SectionsTab } from './tabs/SectionsTab';
import { ModalsTab } from './tabs/ModalsTab';
import { ColorsTab } from './tabs/ColorsTab';
import { AIPaletteTab } from './tabs/AIPaletteTab';
import { TypographyTab } from './tabs/TypographyTab';
import { MarketingTab } from './tabs/MarketingTab';
import { JsonTab } from './tabs/JsonTab';
import { NavigationTab } from './tabs/NavigationTab';

export class Sidebar {
    public static readonly TAB_ITEMS: Array<{ key: ActiveTabKey; label: string; icon: string; color: string; group: string; kicker: string }> = [
        { key: 'identity', label: 'الهوية', icon: 'fa-store', color: '#6366F1', group: 'أساسيات المتجر', kicker: 'بيانات المتجر والترويج' },
        { key: 'ai_palette', label: '20 ثيم', icon: 'fa-palette', color: '#A78BFA', group: 'أساسيات المتجر', kicker: 'باقة الثيمات المتناسقة' },
        { key: 'light_colors', label: 'الفاتح', icon: 'fa-sun', color: '#F59E0B', group: 'أساسيات المتجر', kicker: 'ألوان ومظهر الوضع النهاري' },
        { key: 'dark_colors', label: 'الداكن', icon: 'fa-moon', color: '#818CF8', group: 'أساسيات المتجر', kicker: 'ألوان ومظهر الوضع الليلي' },
        { key: 'products_layout', label: 'المنتجات', icon: 'fa-boxes-stacked', color: '#10B981', group: 'تخطيط المتجر', kicker: 'أعمدة وسلايدر المنتجات' },
        { key: 'sections', label: 'الأقسام', icon: 'fa-layer-group', color: '#06B6D4', group: 'تخطيط المتجر', kicker: 'ترتيب وظهور الأقسام' },
        { key: 'navigation', label: 'الأشرطة', icon: 'fa-bars', color: '#0EA5E9', group: 'تخطيط المتجر', kicker: 'أشرطة التنقل العلوية والسفلية' },
        { key: 'typography', label: 'الخطوط', icon: 'fa-font', color: '#14B8A6', group: 'تخطيط المتجر', kicker: 'الخطوط العربية وأحجام النصوص' },
        { key: 'messages', label: 'الرسائل', icon: 'fa-comments', color: '#EC4899', group: 'تجربة المستخدم', kicker: 'رسائل التنبيهات والمساعد الذكي' },
        { key: 'modals', label: 'النوافذ', icon: 'fa-window-restore', color: '#F43F5E', group: 'تجربة المستخدم', kicker: 'شيت التفاصيل وسلة المشتريات' },
        { key: 'marketing', label: 'تسويق', icon: 'fa-bullhorn', color: '#EF4444', group: 'تجربة المستخدم', kicker: 'واتساب عائم وشريط الشحن' },
        { key: 'json', label: 'JSON', icon: 'fa-code', color: '#94A3B8', group: 'متقدم', kicker: 'محرر البرومبت وملف JSON' }
    ];

    public static readonly TAB_GROUPS = [
        {
            title: 'أساسيات المتجر',
            tabs: ['identity', 'ai_palette', 'light_colors', 'dark_colors'] as ActiveTabKey[]
        },
        {
            title: 'تخطيط المتجر',
            tabs: ['products_layout', 'sections', 'navigation', 'typography'] as ActiveTabKey[]
        },
        {
            title: 'تجربة المستخدم',
            tabs: ['messages', 'modals', 'marketing'] as ActiveTabKey[]
        },
        {
            title: 'متقدم',
            tabs: ['json'] as ActiveTabKey[]
        }
    ];

    public static getTabInfo(tabKey: ActiveTabKey) {
        return Sidebar.TAB_ITEMS.find(item => item.key === tabKey) || Sidebar.TAB_ITEMS[0];
    }

    public static renderTabContent(tabKey: ActiveTabKey = studioState.activeTab): string {
        switch (tabKey) {
            case 'identity': return IdentityTab.render();
            case 'products_layout': return ProductsTab.render();
            case 'messages': return MessagesTab.render();
            case 'sections': return SectionsTab.render();
            case 'modals': return ModalsTab.render();
            case 'light_colors': return ColorsTab.render('light');
            case 'dark_colors': return ColorsTab.render('dark');
            case 'ai_palette': return AIPaletteTab.render();
            case 'typography': return TypographyTab.render();
            case 'navigation': return NavigationTab.render();
            case 'marketing': return MarketingTab.render();
            case 'json': return JsonTab.render();
            default: return IdentityTab.render();
        }
    }

    public static render(): string {
        const { activeTab } = studioState;
        const currentTab = Sidebar.getTabInfo(activeTab);
        const tabContentHtml = Sidebar.renderTabContent(activeTab);

        return `
        <aside class="sb-sidebar-pane">
            <!-- 1. شريط التنقل العمودي الكلاسيكي (يظهر على الشاشات الكبيرة) -->
            <nav class="sb-nav-rail" id="sb-tabs-rail" aria-label="تبويبات التخصيص">
                ${Sidebar.TAB_GROUPS.map(group => `
                    <div class="sb-rail-group">
                        <span class="sb-rail-group-title">${group.title}</span>
                        ${group.tabs.map(tabKey => {
                            const tab = Sidebar.getTabInfo(tabKey);
                            return `
                                <button class="sb-rail-btn ${activeTab === tab.key ? 'active' : ''}" 
                                        data-tab="${tab.key}"
                                        onclick="window.StudioUI.setActiveTab('${tab.key}')" 
                                        title="${tab.label}">
                                    <div class="sb-rail-icon" style="color: ${tab.color};">
                                        <i class="fas ${tab.icon}"></i>
                                    </div>
                                    <span class="sb-rail-label">${tab.label}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                `).join('')}
            </nav>

            <!-- 2. جسم لوحة التحكم الرئيسي -->
            <div class="sb-sidebar-main">
                <!-- رأس اللوحة الثابت (لا يختفي عند تبديل التبويبات) -->
                <div class="sb-sidebar-header">
                    <div>
                        <span class="sb-sidebar-kicker" id="sb-active-kicker">${currentTab.kicker}</span>
                        <div class="sb-sidebar-title-row">
                            <h2 id="sb-active-title">${currentTab.label}</h2>
                            <span class="sb-setting-count">${Sidebar.TAB_ITEMS.length} إعدادات</span>
                        </div>
                    </div>
                    <button class="sb-mini-btn" onclick="window.StudioUI.openHelpModal()" title="تعليمات الاستوديو">
                        <i class="fas fa-lightbulb" style="color:#FBBF24;"></i>
                    </button>
                </div>

                <!-- شريط التبويبات الأفقي للهواتف والأجهزة اللوحية (يظهر تلقائياً على الشاشات <900px) -->
                <nav class="sb-mobile-tabs-bar" id="sb-mobile-tabs-bar" aria-label="تبويبات الموبايل">
                    ${Sidebar.TAB_ITEMS.map(tab => `
                        <button class="sb-mobile-tab-pill ${activeTab === tab.key ? 'active' : ''}" 
                                data-tab="${tab.key}"
                                onclick="window.StudioUI.setActiveTab('${tab.key}')">
                            <i class="fas ${tab.icon}" style="color: ${tab.color};"></i>
                            <span>${tab.label}</span>
                        </button>
                    `).join('')}
                </nav>

                <!-- منطقة محتوى التبويب النشط (قابلة للتمرير الانسيابي) -->
                <div class="sb-tab-content-wrapper" id="sb-tab-content-area">
                    ${tabContentHtml}
                </div>
            </div>
        </aside>
        `;
    }
}
