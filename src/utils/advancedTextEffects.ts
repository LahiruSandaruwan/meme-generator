/**
 * Advanced Text Effects
 * Provides gradient fills, neon effects, retro styles, and preset text styles
 * All rendered on-device (100% FREE)
 */

export type AdvancedEffect =
  | 'none'
  | 'gradient-rainbow'
  | 'gradient-sunset'
  | 'gradient-ocean'
  | 'gradient-fire'
  | 'gradient-purple'
  | 'gradient-gold'
  | 'neon-blue'
  | 'neon-pink'
  | 'neon-green'
  | 'retro-80s'
  | 'retro-70s'
  | 'retro-vhs'
  | 'comic-book'
  | 'glitch'
  | 'chrome'
  | 'wood'
  | 'metal';

export interface AdvancedTextStyle {
  id: string;
  name: string;
  effect: AdvancedEffect;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '700' | '800' | '900';
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowOffset?: { x: number; y: number };
  shadowRadius?: number;
  gradientColors?: string[];
  gradientAngle?: number;
  glowColor?: string;
  glowIntensity?: number;
  transform?: string;
  letterSpacing?: number;
}

export interface TextEffectCategory {
  id: string;
  name: string;
  icon: string;
  effects: AdvancedEffect[];
}

// Categories for browsing effects
export const TEXT_EFFECT_CATEGORIES: TextEffectCategory[] = [
  {
    id: 'gradients',
    name: 'Gradients',
    icon: 'color-palette',
    effects: [
      'gradient-rainbow',
      'gradient-sunset',
      'gradient-ocean',
      'gradient-fire',
      'gradient-purple',
      'gradient-gold',
    ],
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: 'flash',
    effects: ['neon-blue', 'neon-pink', 'neon-green'],
  },
  {
    id: 'retro',
    name: 'Retro',
    icon: 'tv',
    effects: ['retro-80s', 'retro-70s', 'retro-vhs'],
  },
  {
    id: 'special',
    name: 'Special',
    icon: 'sparkles',
    effects: ['comic-book', 'glitch', 'chrome', 'wood', 'metal'],
  },
];

// Preset configurations for each effect
export const EFFECT_PRESETS: Record<AdvancedEffect, Partial<AdvancedTextStyle>> = {
  none: {
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 2,
  },

  // Gradient effects
  'gradient-rainbow': {
    gradientColors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
    gradientAngle: 90,
    strokeColor: '#FFFFFF',
    strokeWidth: 3,
  },
  'gradient-sunset': {
    gradientColors: ['#FF512F', '#DD2476', '#9D50BB'],
    gradientAngle: 45,
    strokeColor: '#FFFFFF',
    strokeWidth: 2,
  },
  'gradient-ocean': {
    gradientColors: ['#2E3192', '#1BFFFF'],
    gradientAngle: 135,
    strokeColor: '#001F3F',
    strokeWidth: 2,
  },
  'gradient-fire': {
    gradientColors: ['#FF0000', '#FF4500', '#FFD700'],
    gradientAngle: 0,
    strokeColor: '#8B0000',
    strokeWidth: 3,
  },
  'gradient-purple': {
    gradientColors: ['#667eea', '#764ba2'],
    gradientAngle: 90,
    strokeColor: '#4B0082',
    strokeWidth: 2,
  },
  'gradient-gold': {
    gradientColors: ['#FFD700', '#FFA500', '#FF8C00'],
    gradientAngle: 180,
    strokeColor: '#8B4513',
    strokeWidth: 3,
  },

  // Neon effects
  'neon-blue': {
    color: '#00D9FF',
    strokeColor: '#0066FF',
    strokeWidth: 4,
    glowColor: '#00D9FF',
    glowIntensity: 20,
    shadowColor: '#00D9FF',
    shadowOpacity: 1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 15,
  },
  'neon-pink': {
    color: '#FF10F0',
    strokeColor: '#FF006E',
    strokeWidth: 4,
    glowColor: '#FF10F0',
    glowIntensity: 20,
    shadowColor: '#FF10F0',
    shadowOpacity: 1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 15,
  },
  'neon-green': {
    color: '#39FF14',
    strokeColor: '#00FF00',
    strokeWidth: 4,
    glowColor: '#39FF14',
    glowIntensity: 20,
    shadowColor: '#39FF14',
    shadowOpacity: 1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 15,
  },

  // Retro effects
  'retro-80s': {
    color: '#FF10F0',
    strokeColor: '#00D9FF',
    strokeWidth: 6,
    fontWeight: '900',
    shadowColor: '#FF10F0',
    shadowOpacity: 0.8,
    shadowOffset: { x: 4, y: 4 },
    shadowRadius: 0,
    letterSpacing: 2,
  },
  'retro-70s': {
    gradientColors: ['#FF6B35', '#F7931E', '#FFD700'],
    gradientAngle: 90,
    strokeColor: '#8B4513',
    strokeWidth: 5,
    fontWeight: '900',
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    shadowOffset: { x: 3, y: 3 },
    shadowRadius: 0,
  },
  'retro-vhs': {
    color: '#FFFFFF',
    strokeColor: '#FF0000',
    strokeWidth: 3,
    shadowColor: '#00FFFF',
    shadowOpacity: 0.7,
    shadowOffset: { x: 2, y: 0 },
    shadowRadius: 0,
  },

  // Special effects
  'comic-book': {
    color: '#FFFF00',
    strokeColor: '#000000',
    strokeWidth: 6,
    fontWeight: '900',
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowOffset: { x: 4, y: 4 },
    shadowRadius: 0,
  },
  glitch: {
    color: '#FF0000',
    strokeColor: '#00FFFF',
    strokeWidth: 2,
    shadowColor: '#00FF00',
    shadowOpacity: 0.8,
    shadowOffset: { x: 3, y: -2 },
    shadowRadius: 0,
  },
  chrome: {
    gradientColors: ['#C0C0C0', '#FFFFFF', '#808080'],
    gradientAngle: 90,
    strokeColor: '#000000',
    strokeWidth: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowOffset: { x: 2, y: 2 },
    shadowRadius: 4,
  },
  wood: {
    color: '#8B4513',
    strokeColor: '#654321',
    strokeWidth: 4,
    fontWeight: '900',
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    shadowOffset: { x: 2, y: 2 },
    shadowRadius: 2,
  },
  metal: {
    gradientColors: ['#708090', '#C0C0C0', '#2F4F4F'],
    gradientAngle: 45,
    strokeColor: '#000000',
    strokeWidth: 3,
    fontWeight: '800',
    shadowColor: '#000000',
    shadowOpacity: 0.7,
    shadowOffset: { x: 3, y: 3 },
    shadowRadius: 5,
  },
};

// Get effect display name
export const getEffectName = (effect: AdvancedEffect): string => {
  const names: Record<AdvancedEffect, string> = {
    none: 'None',
    'gradient-rainbow': 'Rainbow',
    'gradient-sunset': 'Sunset',
    'gradient-ocean': 'Ocean',
    'gradient-fire': 'Fire',
    'gradient-purple': 'Purple Dream',
    'gradient-gold': 'Golden',
    'neon-blue': 'Neon Blue',
    'neon-pink': 'Neon Pink',
    'neon-green': 'Neon Green',
    'retro-80s': '80s Retro',
    'retro-70s': '70s Retro',
    'retro-vhs': 'VHS Glitch',
    'comic-book': 'Comic Book',
    glitch: 'Glitch',
    chrome: 'Chrome',
    wood: 'Wood',
    metal: 'Metal',
  };
  return names[effect];
};

// Get effect description
export const getEffectDescription = (effect: AdvancedEffect): string => {
  const descriptions: Record<AdvancedEffect, string> = {
    none: 'No special effect',
    'gradient-rainbow': 'Vibrant rainbow gradient',
    'gradient-sunset': 'Warm sunset colors',
    'gradient-ocean': 'Cool ocean waves',
    'gradient-fire': 'Blazing fire gradient',
    'gradient-purple': 'Purple dream gradient',
    'gradient-gold': 'Golden shimmer',
    'neon-blue': 'Electric blue neon glow',
    'neon-pink': 'Hot pink neon glow',
    'neon-green': 'Bright green neon glow',
    'retro-80s': 'Synthwave 80s style',
    'retro-70s': 'Groovy 70s vibes',
    'retro-vhs': 'VHS tape glitch',
    'comic-book': 'Bold comic style',
    glitch: 'Digital glitch effect',
    chrome: 'Shiny chrome finish',
    wood: 'Carved wood texture',
    metal: 'Metallic finish',
  };
  return descriptions[effect];
};

// Apply effect to text style
export const applyEffect = (
  effect: AdvancedEffect,
  currentStyle: Partial<AdvancedTextStyle> = {}
): Partial<AdvancedTextStyle> => {
  const preset = EFFECT_PRESETS[effect];
  return {
    ...currentStyle,
    ...preset,
    effect,
  };
};

// Preset text styles for quick access
export const PRESET_TEXT_STYLES: AdvancedTextStyle[] = [
  {
    id: 'impact',
    name: 'Impact',
    effect: 'none',
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 3,
    fontSize: 48,
    fontWeight: '900',
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    effect: 'gradient-rainbow',
    fontSize: 44,
    fontWeight: '800',
  },
  {
    id: 'neon-sign',
    name: 'Neon Sign',
    effect: 'neon-pink',
    fontSize: 42,
    fontWeight: '700',
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    effect: 'retro-80s',
    fontSize: 46,
  },
  {
    id: 'comic',
    name: 'Comic',
    effect: 'comic-book',
    fontSize: 48,
  },
  {
    id: 'fire',
    name: 'Fire',
    effect: 'gradient-fire',
    fontSize: 44,
    fontWeight: '900',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    effect: 'gradient-ocean',
    fontSize: 42,
    fontWeight: '700',
  },
  {
    id: 'golden',
    name: 'Golden',
    effect: 'gradient-gold',
    fontSize: 46,
    fontWeight: '900',
  },
  {
    id: 'chrome',
    name: 'Chrome',
    effect: 'chrome',
    fontSize: 44,
    fontWeight: '800',
  },
  {
    id: 'glitch',
    name: 'Glitch',
    effect: 'glitch',
    fontSize: 40,
    fontWeight: '700',
  },
];

// Check if effect uses gradient
export const isGradientEffect = (effect: AdvancedEffect): boolean => {
  return effect.startsWith('gradient-') || ['chrome', 'metal', 'retro-70s'].includes(effect);
};

// Check if effect uses glow/neon
export const isNeonEffect = (effect: AdvancedEffect): boolean => {
  return effect.startsWith('neon-');
};

// Get gradient colors for an effect
export const getGradientColors = (effect: AdvancedEffect): string[] | null => {
  const preset = EFFECT_PRESETS[effect];
  return preset.gradientColors || null;
};

// Get primary color for non-gradient effects
export const getPrimaryColor = (effect: AdvancedEffect): string => {
  const preset = EFFECT_PRESETS[effect];
  return preset.color || '#FFFFFF';
};

// Generate CSS gradient string (for web preview)
export const generateGradientCSS = (colors: string[], angle: number = 90): string => {
  return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
};

// Popular combinations for quick styling
export const POPULAR_COMBINATIONS = [
  {
    name: 'Viral Meme',
    style: PRESET_TEXT_STYLES[0], // Impact
  },
  {
    name: 'Party Vibes',
    style: PRESET_TEXT_STYLES[1], // Rainbow
  },
  {
    name: 'Cyberpunk',
    style: PRESET_TEXT_STYLES[2], // Neon
  },
  {
    name: 'Retro Wave',
    style: PRESET_TEXT_STYLES[3], // Synthwave
  },
  {
    name: 'Superhero',
    style: PRESET_TEXT_STYLES[4], // Comic
  },
];

// Text animation hints (for future implementation)
export type TextAnimation =
  | 'none'
  | 'fade-in'
  | 'slide-in'
  | 'bounce'
  | 'pulse'
  | 'shake';

export interface AnimationConfig {
  type: TextAnimation;
  duration: number;
  delay: number;
}

// Helper to merge styles
export const mergeTextStyles = (
  base: Partial<AdvancedTextStyle>,
  override: Partial<AdvancedTextStyle>
): Partial<AdvancedTextStyle> => {
  return {
    ...base,
    ...override,
  };
};
