/**
 * Collage Maker Utility
 * Provides layouts and logic for combining multiple images into collages
 * 100% FREE - on-device processing
 */

export type CollageLayoutType =
  | '1x1' // Single image
  | '1x2' // 2 images horizontal
  | '2x1' // 2 images vertical
  | '2x2' // 4 images grid
  | '3x1' // 3 images horizontal
  | '1x3' // 3 images vertical
  | '3x2' // 6 images grid
  | '2x3' // 6 images grid
  | '4x1' // 4 images horizontal
  | '1x4' // 4 images vertical
  | 'custom'; // Custom layout

export interface CollageSlot {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage 0-100
  height: number; // Percentage 0-100
  imageUri?: string;
}

export interface CollageLayout {
  id: string;
  type: CollageLayoutType;
  name: string;
  rows: number;
  cols: number;
  slots: CollageSlot[];
  aspectRatio: number; // width/height
}

export interface CollageSettings {
  borderWidth: number; // 0-20
  borderColor: string;
  backgroundColor: string;
  spacing: number; // 0-20
  cornerRadius: number; // 0-20
}

// Generate slot ID
const generateSlotId = (index: number) => `slot_${index}`;

// Create grid layout
const createGridLayout = (
  rows: number,
  cols: number,
  spacing: number = 2
): CollageSlot[] => {
  const slots: CollageSlot[] = [];
  const slotWidth = (100 - spacing * (cols - 1)) / cols;
  const slotHeight = (100 - spacing * (rows - 1)) / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      slots.push({
        id: generateSlotId(row * cols + col),
        x: col * (slotWidth + spacing),
        y: row * (slotHeight + spacing),
        width: slotWidth,
        height: slotHeight,
      });
    }
  }

  return slots;
};

// Preset collage layouts
export const COLLAGE_LAYOUTS: CollageLayout[] = [
  // Single image
  {
    id: '1x1',
    type: '1x1',
    name: 'Single',
    rows: 1,
    cols: 1,
    aspectRatio: 1,
    slots: [
      { id: 'slot_0', x: 0, y: 0, width: 100, height: 100 },
    ],
  },

  // 2 images
  {
    id: '1x2',
    type: '1x2',
    name: '2 Horizontal',
    rows: 1,
    cols: 2,
    aspectRatio: 2,
    slots: createGridLayout(1, 2),
  },
  {
    id: '2x1',
    type: '2x1',
    name: '2 Vertical',
    rows: 2,
    cols: 1,
    aspectRatio: 0.5,
    slots: createGridLayout(2, 1),
  },

  // 4 images
  {
    id: '2x2',
    type: '2x2',
    name: '4 Grid',
    rows: 2,
    cols: 2,
    aspectRatio: 1,
    slots: createGridLayout(2, 2),
  },

  // 3 images
  {
    id: '3x1',
    type: '3x1',
    name: '3 Horizontal',
    rows: 1,
    cols: 3,
    aspectRatio: 3,
    slots: createGridLayout(1, 3),
  },
  {
    id: '1x3',
    type: '1x3',
    name: '3 Vertical',
    rows: 3,
    cols: 1,
    aspectRatio: 0.33,
    slots: createGridLayout(3, 1),
  },

  // 6 images
  {
    id: '3x2',
    type: '3x2',
    name: '6 Grid (3x2)',
    rows: 2,
    cols: 3,
    aspectRatio: 1.5,
    slots: createGridLayout(2, 3),
  },
  {
    id: '2x3',
    type: '2x3',
    name: '6 Grid (2x3)',
    rows: 3,
    cols: 2,
    aspectRatio: 0.67,
    slots: createGridLayout(3, 2),
  },

  // 4 images special
  {
    id: '4x1',
    type: '4x1',
    name: '4 Horizontal',
    rows: 1,
    cols: 4,
    aspectRatio: 4,
    slots: createGridLayout(1, 4),
  },
  {
    id: '1x4',
    type: '1x4',
    name: '4 Vertical',
    rows: 4,
    cols: 1,
    aspectRatio: 0.25,
    slots: createGridLayout(4, 1),
  },
];

// Get layout by type
export const getLayoutByType = (type: CollageLayoutType): CollageLayout | undefined => {
  return COLLAGE_LAYOUTS.find(layout => layout.type === type);
};

// Get layout by ID
export const getLayoutById = (id: string): CollageLayout | undefined => {
  return COLLAGE_LAYOUTS.find(layout => layout.id === id);
};

// Default collage settings
export const DEFAULT_COLLAGE_SETTINGS: CollageSettings = {
  borderWidth: 4,
  borderColor: '#000000',
  backgroundColor: '#FFFFFF',
  spacing: 8,
  cornerRadius: 0,
};

// Popular border colors
export const BORDER_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#0000FF', // Blue
  '#00FF00', // Green
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#808080', // Gray
];

// Popular background colors
export const BACKGROUND_COLORS = [
  '#FFFFFF', // White
  '#000000', // Black
  '#F5F5F5', // Light Gray
  '#E8E8E8', // Gray
  '#FFE5E5', // Light Pink
  '#E5F5FF', // Light Blue
  '#E5FFE5', // Light Green
  '#FFF5E5', // Light Orange
  '#F5E5FF', // Light Purple
  '#FFFFE5', // Light Yellow
];

// Layout categories
export interface LayoutCategory {
  id: string;
  name: string;
  icon: string;
  layouts: CollageLayoutType[];
}

export const LAYOUT_CATEGORIES: LayoutCategory[] = [
  {
    id: 'basic',
    name: 'Basic',
    icon: 'grid-outline',
    layouts: ['1x1', '1x2', '2x1', '2x2'],
  },
  {
    id: 'triple',
    name: 'Triple',
    icon: 'albums-outline',
    layouts: ['3x1', '1x3'],
  },
  {
    id: 'grid',
    name: 'Grid',
    icon: 'apps-outline',
    layouts: ['3x2', '2x3'],
  },
  {
    id: 'strip',
    name: 'Strip',
    icon: 'reorder-three-outline',
    layouts: ['4x1', '1x4'],
  },
];

// Calculate canvas dimensions based on layout
export const calculateCanvasDimensions = (
  layout: CollageLayout,
  maxWidth: number
): { width: number; height: number } => {
  const width = maxWidth;
  const height = maxWidth / layout.aspectRatio;
  return { width, height };
};

// Validate if layout has enough slots for images
export const validateLayout = (
  layout: CollageLayout,
  imageCount: number
): boolean => {
  return layout.slots.length >= imageCount;
};

// Get recommended layouts for image count
export const getRecommendedLayouts = (imageCount: number): CollageLayout[] => {
  return COLLAGE_LAYOUTS.filter(layout => layout.slots.length === imageCount);
};

// Swap images in slots
export const swapSlots = (
  slots: CollageSlot[],
  fromIndex: number,
  toIndex: number
): CollageSlot[] => {
  const newSlots = [...slots];
  const tempUri = newSlots[fromIndex].imageUri;
  newSlots[fromIndex].imageUri = newSlots[toIndex].imageUri;
  newSlots[toIndex].imageUri = tempUri;
  return newSlots;
};

// Assign images to slots
export const assignImagesToSlots = (
  layout: CollageLayout,
  imageUris: string[]
): CollageSlot[] => {
  return layout.slots.map((slot, index) => ({
    ...slot,
    imageUri: imageUris[index] || undefined,
  }));
};

// Export preset templates
export const COLLAGE_PRESETS = [
  {
    name: 'Instagram Grid',
    layout: '2x2',
    settings: {
      ...DEFAULT_COLLAGE_SETTINGS,
      spacing: 4,
      borderWidth: 0,
      backgroundColor: '#FFFFFF',
    },
  },
  {
    name: 'Photo Strip',
    layout: '4x1',
    settings: {
      ...DEFAULT_COLLAGE_SETTINGS,
      spacing: 2,
      borderWidth: 2,
      borderColor: '#000000',
      backgroundColor: '#FFFFFF',
    },
  },
  {
    name: 'Meme Collection',
    layout: '3x2',
    settings: {
      ...DEFAULT_COLLAGE_SETTINGS,
      spacing: 8,
      borderWidth: 4,
      borderColor: '#000000',
      backgroundColor: '#F5F5F5',
    },
  },
  {
    name: 'Side by Side',
    layout: '1x2',
    settings: {
      ...DEFAULT_COLLAGE_SETTINGS,
      spacing: 4,
      borderWidth: 0,
      backgroundColor: '#FFFFFF',
    },
  },
];

// Get layout display name
export const getLayoutName = (type: CollageLayoutType): string => {
  const layout = getLayoutByType(type);
  return layout?.name || type;
};

// Get slot count for layout
export const getSlotCount = (layout: CollageLayout): number => {
  return layout.slots.length;
};
