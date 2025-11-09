import { ImageFilter } from '../components/ImageFilters';

/**
 * Auto-enhance algorithm
 * Applies smart adjustments to improve image quality
 */
export const autoEnhance = (): ImageFilter => {
  return {
    brightness: 0.15,   // Slight brightness boost
    contrast: 0.2,      // Moderate contrast increase
    saturation: 1.15,   // Subtle saturation boost
  };
};

/**
 * Preset filters for quick application
 */
export const FilterPresets = {
  // Auto-enhance: Smart algorithm
  autoEnhance: (): ImageFilter => ({
    brightness: 0.15,
    contrast: 0.2,
    saturation: 1.15,
  }),

  // Vivid: Pop the colors
  vivid: (): ImageFilter => ({
    brightness: 0.2,
    contrast: 0.1,
    saturation: 1.2,
  }),

  // Dramatic: High contrast, moody
  dramatic: (): ImageFilter => ({
    brightness: -0.1,
    contrast: 0.3,
    saturation: 1.1,
  }),

  // Soft: Gentle, washed out
  soft: (): ImageFilter => ({
    brightness: 0.1,
    contrast: -0.1,
    saturation: 0.8,
  }),

  // Black & White
  blackAndWhite: (): ImageFilter => ({
    brightness: 0,
    contrast: 0,
    saturation: 0,
  }),

  // Bright: Increase brightness
  bright: (): ImageFilter => ({
    brightness: 0.25,
    contrast: 0,
    saturation: 1.0,
  }),

  // Sharp: Boost contrast
  sharp: (): ImageFilter => ({
    brightness: 0,
    contrast: 0.4,
    saturation: 1.0,
  }),

  // Vintage: Old-school look
  vintage: (): ImageFilter => ({
    brightness: -0.05,
    contrast: 0.15,
    saturation: 0.7,
  }),

  // Warm: Add warmth
  warm: (): ImageFilter => ({
    brightness: 0.1,
    contrast: 0,
    saturation: 1.3,
  }),

  // Cool: Cool tones
  cool: (): ImageFilter => ({
    brightness: -0.05,
    contrast: 0.05,
    saturation: 0.9,
  }),

  // None: Reset to defaults
  none: (): ImageFilter => ({
    brightness: 0,
    contrast: 0,
    saturation: 1,
  }),
};

/**
 * Apply filter values with safe bounds
 */
export const applyFilterWithBounds = (filter: ImageFilter): ImageFilter => {
  return {
    brightness: Math.max(-1, Math.min(1, filter.brightness)),
    contrast: Math.max(-1, Math.min(1, filter.contrast)),
    saturation: Math.max(0, Math.min(2, filter.saturation)),
  };
};

/**
 * Blend two filters together
 */
export const blendFilters = (
  filter1: ImageFilter,
  filter2: ImageFilter,
  ratio: number = 0.5
): ImageFilter => {
  const clampedRatio = Math.max(0, Math.min(1, ratio));

  return {
    brightness: filter1.brightness * (1 - clampedRatio) + filter2.brightness * clampedRatio,
    contrast: filter1.contrast * (1 - clampedRatio) + filter2.contrast * clampedRatio,
    saturation: filter1.saturation * (1 - clampedRatio) + filter2.saturation * clampedRatio,
  };
};

/**
 * Get filter description for UI
 */
export const getFilterDescription = (filterName: string): string => {
  const descriptions: Record<string, string> = {
    autoEnhance: 'Smart AI-powered enhancement',
    vivid: 'Vibrant colors and pop',
    dramatic: 'High contrast and moody',
    soft: 'Gentle and washed out',
    blackAndWhite: 'Classic monochrome',
    bright: 'Increase overall brightness',
    sharp: 'Boost contrast and clarity',
    vintage: 'Old-school retro look',
    warm: 'Add warm tones',
    cool: 'Add cool tones',
    none: 'No filter applied',
  };

  return descriptions[filterName] || 'Custom filter';
};

/**
 * Calculate filter difference (for comparison)
 */
export const filterDifference = (filter1: ImageFilter, filter2: ImageFilter): number => {
  const brightnessDiff = Math.abs(filter1.brightness - filter2.brightness);
  const contrastDiff = Math.abs(filter1.contrast - filter2.contrast);
  const saturationDiff = Math.abs(filter1.saturation - filter2.saturation);

  return brightnessDiff + contrastDiff + saturationDiff;
};

/**
 * Check if filter is applied (different from default)
 */
export const isFilterApplied = (filter: ImageFilter): boolean => {
  const defaultFilter = FilterPresets.none();
  return filterDifference(filter, defaultFilter) > 0.01;
};
