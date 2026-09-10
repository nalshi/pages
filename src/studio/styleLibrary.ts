export type StoreStylePresetId =
  | 'modern-soft'
  | 'glass'
  | 'luxury'
  | 'minimal'
  | 'tech'
  | 'fashion'
  | 'bold'
  | 'organic'
  | 'futuristic'
  | 'premium'
  | 'classic'
  | 'market';

export interface StoreStylePreset {
  id: StoreStylePresetId;
  name: string;
  label: string;
  description: string;
  accent: string;
  cardRadius: string;
  buttonStyle: 'rounded' | 'pill' | 'square';
  buttonRadius: string;
  animation: 'lift' | 'glow' | 'scale' | 'none';
  displayMode: 'by_categories_sections' | 'tabs_by_category' | 'all_flat_grid' | 'featured_first';
  cardStyle: 'classic' | 'minimal' | 'bold' | 'landscape_row' | 'magazine' | 'glass' | string;
  cardOrientation: 'portrait' | 'landscape';
  navbarStyle: 'solid' | 'glass' | 'floating';
  spacing: 'compact' | 'normal' | 'relaxed';
  botPersona: 'classic' | 'premium' | 'futuristic' | 'luxury' | 'fashion' | 'tech' | 'wellness' | 'beauty';
  botButtonStyle: 'pill' | 'bubble' | 'minimal';
  botAvatarStyle: 'pulse' | 'orb' | 'halo' | 'hover';
}

export const STORE_STYLE_LIBRARY: Record<StoreStylePresetId, StoreStylePreset> = {
  'modern-soft': {
    id: 'modern-soft',
    name: 'Modern Soft',
    label: 'حديث ناعم',
    description: 'مظهر أنيق للمتجر الحديث مع حواف دقيقة وأزرار مريحة.',
    accent: '#6366F1',
    cardRadius: '18px',
    buttonStyle: 'pill',
    buttonRadius: '9999px',
    animation: 'lift',
    displayMode: 'by_categories_sections',
    cardStyle: 'classic',
    cardOrientation: 'portrait',
    navbarStyle: 'glass',
    spacing: 'normal',
    botPersona: 'classic',
    botButtonStyle: 'pill',
    botAvatarStyle: 'pulse'
  },
  glass: {
    id: 'glass',
    name: 'Glass',
    label: 'زجاجي',
    description: 'شبه شفاف مع طبقات زجاجية، ممتاز للتصاميم الفاخرة.',
    accent: '#8B5CF6',
    cardRadius: '24px',
    buttonStyle: 'rounded',
    buttonRadius: '16px',
    animation: 'glow',
    displayMode: 'featured_first',
    cardStyle: 'glass',
    cardOrientation: 'landscape',
    navbarStyle: 'glass',
    spacing: 'relaxed',
    botPersona: 'premium',
    botButtonStyle: 'bubble',
    botAvatarStyle: 'halo'
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury',
    label: 'فاخر',
    description: 'ألوان أنيقة، فواصل واسعة، وزاوية مميزة للعلامات الراقية.',
    accent: '#B45309',
    cardRadius: '26px',
    buttonStyle: 'pill',
    buttonRadius: '9999px',
    animation: 'scale',
    displayMode: 'featured_first',
    cardStyle: 'magazine',
    cardOrientation: 'landscape',
    navbarStyle: 'floating',
    spacing: 'relaxed',
    botPersona: 'luxury',
    botButtonStyle: 'bubble',
    botAvatarStyle: 'halo'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    label: 'بسيط',
    description: 'أقل تفاصيل وأكثر وضوح، مثالي للمتاجر العصرية.',
    accent: '#111827',
    cardRadius: '10px',
    buttonStyle: 'square',
    buttonRadius: '8px',
    animation: 'none',
    displayMode: 'all_flat_grid',
    cardStyle: 'minimal',
    cardOrientation: 'portrait',
    navbarStyle: 'solid',
    spacing: 'compact',
    botPersona: 'classic',
    botButtonStyle: 'minimal',
    botAvatarStyle: 'pulse'
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    label: 'تقني',
    description: 'أسلوب تكنولوجي مع حواف متناسقة وأدوات تمثيلية حديثة.',
    accent: '#06B6D4',
    cardRadius: '16px',
    buttonStyle: 'rounded',
    buttonRadius: '14px',
    animation: 'glow',
    displayMode: 'tabs_by_category',
    cardStyle: 'bold',
    cardOrientation: 'portrait',
    navbarStyle: 'glass',
    spacing: 'normal',
    botPersona: 'tech',
    botButtonStyle: 'minimal',
    botAvatarStyle: 'orb'
  },
  fashion: {
    id: 'fashion',
    name: 'Fashion',
    label: 'موضة',
    description: 'قوة اللون، إيقاع أنيق، ومظهر مرن لأزياء وماركات lifestyle.',
    accent: '#EC4899',
    cardRadius: '22px',
    buttonStyle: 'pill',
    buttonRadius: '9999px',
    animation: 'scale',
    displayMode: 'featured_first',
    cardStyle: 'magazine',
    cardOrientation: 'portrait',
    navbarStyle: 'floating',
    spacing: 'relaxed',
    botPersona: 'fashion',
    botButtonStyle: 'bubble',
    botAvatarStyle: 'hover'
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    label: 'جريء',
    description: 'عناصر واضحة، ألوان متينة، ومظهر تطلبي يلفت الانتباه.',
    accent: '#F59E0B',
    cardRadius: '28px',
    buttonStyle: 'rounded',
    buttonRadius: '18px',
    animation: 'scale',
    displayMode: 'featured_first',
    cardStyle: 'bold',
    cardOrientation: 'landscape',
    navbarStyle: 'floating',
    spacing: 'relaxed',
    botPersona: 'premium',
    botButtonStyle: 'bubble',
    botAvatarStyle: 'halo'
  },
  organic: {
    id: 'organic',
    name: 'Organic',
    label: 'طبيعي',
    description: 'مظهر ناعم ومريح يناسب المنتجات الصحية والطبيعية.',
    accent: '#10B981',
    cardRadius: '20px',
    buttonStyle: 'pill',
    buttonRadius: '9999px',
    animation: 'lift',
    displayMode: 'by_categories_sections',
    cardStyle: 'classic',
    cardOrientation: 'portrait',
    navbarStyle: 'glass',
    spacing: 'normal',
    botPersona: 'wellness',
    botButtonStyle: 'pill',
    botAvatarStyle: 'pulse'
  },
  futuristic: {
    id: 'futuristic',
    name: 'Futuristic',
    label: 'مستقبلي',
    description: 'أنيق، حديث، ومليء بالتأثيرات الرقمية والعاكسات.',
    accent: '#06B6D4',
    cardRadius: '30px',
    buttonStyle: 'rounded',
    buttonRadius: '16px',
    animation: 'glow',
    displayMode: 'tabs_by_category',
    cardStyle: 'glass',
    cardOrientation: 'landscape',
    navbarStyle: 'glass',
    spacing: 'relaxed',
    botPersona: 'futuristic',
    botButtonStyle: 'minimal',
    botAvatarStyle: 'orb'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    label: 'مميز',
    description: 'أسلوب مميز ينقل المتجر إلى تجربة علامة تجارية متقدمة.',
    accent: '#8B5CF6',
    cardRadius: '22px',
    buttonStyle: 'pill',
    buttonRadius: '9999px',
    animation: 'lift',
    displayMode: 'featured_first',
    cardStyle: 'magazine',
    cardOrientation: 'landscape',
    navbarStyle: 'floating',
    spacing: 'relaxed',
    botPersona: 'premium',
    botButtonStyle: 'bubble',
    botAvatarStyle: 'halo'
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    label: 'كلاسيكي',
    description: 'مظهر متوازن يعرفه الزبون ويشعره بالثقة.',
    accent: '#4F46E5',
    cardRadius: '14px',
    buttonStyle: 'rounded',
    buttonRadius: '12px',
    animation: 'lift',
    displayMode: 'by_categories_sections',
    cardStyle: 'classic',
    cardOrientation: 'portrait',
    navbarStyle: 'solid',
    spacing: 'normal',
    botPersona: 'classic',
    botButtonStyle: 'pill',
    botAvatarStyle: 'pulse'
  },
  market: {
    id: 'market',
    name: 'Market',
    label: 'تجاري',
    description: 'مناسب للمتاجر الكبيرة والمنتجات المزودة بخصومات وتجاريات.',
    accent: '#FB7185',
    cardRadius: '16px',
    buttonStyle: 'rounded',
    buttonRadius: '14px',
    animation: 'scale',
    displayMode: 'by_categories_sections',
    cardStyle: 'bold',
    cardOrientation: 'portrait',
    navbarStyle: 'solid',
    spacing: 'normal',
    botPersona: 'tech',
    botButtonStyle: 'pill',
    botAvatarStyle: 'pulse'
  }
};

export const STORE_STYLE_LIBRARY_LIST = Object.values(STORE_STYLE_LIBRARY);

export function getStoreStyleLibrary(): typeof STORE_STYLE_LIBRARY {
  return STORE_STYLE_LIBRARY;
}
