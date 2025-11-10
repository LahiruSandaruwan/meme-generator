/**
 * Multi-Panel Meme Layouts
 * Supports various grid layouts for creating multi-panel memes
 * 100% FREE - No external dependencies
 */

export type LayoutType =
  | '1x1' // Single panel (default)
  | '1x2' // Two panels horizontal
  | '2x1' // Two panels vertical
  | '2x2' // Four panels grid
  | '3x1' // Three panels horizontal
  | '1x3' // Three panels vertical
  | '3x3' // Nine panels grid
  | '4x1' // Four panels horizontal
  | '1x4'; // Four panels vertical

export interface PanelPosition {
  row: number;
  col: number;
  width: number; // Percentage of total width
  height: number; // Percentage of total height
  x: number; // X position percentage
  y: number; // Y position percentage
}

export interface PanelData {
  id: string;
  imageUri?: string;
  texts: PanelText[];
  backgroundColor: string;
  position: PanelPosition;
}

export interface PanelText {
  id: string;
  text: string;
  x: number; // Percentage position
  y: number; // Percentage position
  fontSize: number;
  color: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  strokeWidth: number;
  strokeColor: string;
}

export interface MultiPanelLayout {
  type: LayoutType;
  name: string;
  description: string;
  rows: number;
  cols: number;
  panels: PanelPosition[];
  icon: string; // Ionicons name
  popular?: boolean;
}

/**
 * All available layouts
 */
export const MULTI_PANEL_LAYOUTS: MultiPanelLayout[] = [
  {
    type: '1x1',
    name: 'Single',
    description: 'Classic single panel',
    rows: 1,
    cols: 1,
    icon: 'square',
    popular: true,
    panels: [
      { row: 0, col: 0, width: 100, height: 100, x: 0, y: 0 },
    ],
  },
  {
    type: '1x2',
    name: 'Horizontal Split',
    description: 'Two panels side by side',
    rows: 1,
    cols: 2,
    icon: 'grid',
    popular: true,
    panels: [
      { row: 0, col: 0, width: 50, height: 100, x: 0, y: 0 },
      { row: 0, col: 1, width: 50, height: 100, x: 50, y: 0 },
    ],
  },
  {
    type: '2x1',
    name: 'Vertical Split',
    description: 'Two panels stacked',
    rows: 2,
    cols: 1,
    icon: 'reorder-two',
    popular: true,
    panels: [
      { row: 0, col: 0, width: 100, height: 50, x: 0, y: 0 },
      { row: 1, col: 0, width: 100, height: 50, x: 0, y: 50 },
    ],
  },
  {
    type: '2x2',
    name: '2x2 Grid',
    description: 'Four equal panels',
    rows: 2,
    cols: 2,
    icon: 'apps',
    popular: true,
    panels: [
      { row: 0, col: 0, width: 50, height: 50, x: 0, y: 0 },
      { row: 0, col: 1, width: 50, height: 50, x: 50, y: 0 },
      { row: 1, col: 0, width: 50, height: 50, x: 0, y: 50 },
      { row: 1, col: 1, width: 50, height: 50, x: 50, y: 50 },
    ],
  },
  {
    type: '3x1',
    name: 'Triple Horizontal',
    description: 'Three panels side by side',
    rows: 1,
    cols: 3,
    icon: 'reorder-three',
    popular: true,
    panels: [
      { row: 0, col: 0, width: 33.33, height: 100, x: 0, y: 0 },
      { row: 0, col: 1, width: 33.33, height: 100, x: 33.33, y: 0 },
      { row: 0, col: 2, width: 33.33, height: 100, x: 66.66, y: 0 },
    ],
  },
  {
    type: '1x3',
    name: 'Triple Vertical',
    description: 'Three panels stacked',
    rows: 3,
    cols: 1,
    icon: 'menu',
    popular: true,
    panels: [
      { row: 0, col: 0, width: 100, height: 33.33, x: 0, y: 0 },
      { row: 1, col: 0, width: 100, height: 33.33, x: 0, y: 33.33 },
      { row: 2, col: 0, width: 100, height: 33.33, x: 0, y: 66.66 },
    ],
  },
  {
    type: '3x3',
    name: '3x3 Grid',
    description: 'Nine panel grid',
    rows: 3,
    cols: 3,
    icon: 'grid-outline',
    panels: [
      { row: 0, col: 0, width: 33.33, height: 33.33, x: 0, y: 0 },
      { row: 0, col: 1, width: 33.33, height: 33.33, x: 33.33, y: 0 },
      { row: 0, col: 2, width: 33.33, height: 33.33, x: 66.66, y: 0 },
      { row: 1, col: 0, width: 33.33, height: 33.33, x: 0, y: 33.33 },
      { row: 1, col: 1, width: 33.33, height: 33.33, x: 33.33, y: 33.33 },
      { row: 1, col: 2, width: 33.33, height: 33.33, x: 66.66, y: 33.33 },
      { row: 2, col: 0, width: 33.33, height: 33.33, x: 0, y: 66.66 },
      { row: 2, col: 1, width: 33.33, height: 33.33, x: 33.33, y: 66.66 },
      { row: 2, col: 2, width: 33.33, height: 33.33, x: 66.66, y: 66.66 },
    ],
  },
  {
    type: '4x1',
    name: 'Quad Horizontal',
    description: 'Four panels in a row',
    rows: 1,
    cols: 4,
    icon: 'reorder-four',
    panels: [
      { row: 0, col: 0, width: 25, height: 100, x: 0, y: 0 },
      { row: 0, col: 1, width: 25, height: 100, x: 25, y: 0 },
      { row: 0, col: 2, width: 25, height: 100, x: 50, y: 0 },
      { row: 0, col: 3, width: 25, height: 100, x: 75, y: 0 },
    ],
  },
  {
    type: '1x4',
    name: 'Quad Vertical',
    description: 'Four panels stacked',
    rows: 4,
    cols: 1,
    icon: 'list',
    panels: [
      { row: 0, col: 0, width: 100, height: 25, x: 0, y: 0 },
      { row: 1, col: 0, width: 100, height: 25, x: 0, y: 25 },
      { row: 2, col: 0, width: 100, height: 25, x: 0, y: 50 },
      { row: 3, col: 0, width: 100, height: 25, x: 0, y: 75 },
    ],
  },
];

/**
 * Get layout by type
 */
export const getLayoutByType = (type: LayoutType): MultiPanelLayout | undefined => {
  return MULTI_PANEL_LAYOUTS.find(layout => layout.type === type);
};

/**
 * Get popular layouts
 */
export const getPopularLayouts = (): MultiPanelLayout[] => {
  return MULTI_PANEL_LAYOUTS.filter(layout => layout.popular);
};

/**
 * Create initial panel data for a layout
 */
export const createInitialPanels = (layout: MultiPanelLayout): PanelData[] => {
  return layout.panels.map((position, index) => ({
    id: `panel-${index}`,
    texts: [],
    backgroundColor: '#FFFFFF',
    position,
  }));
};

/**
 * Calculate panel dimensions for rendering
 */
export const calculatePanelDimensions = (
  position: PanelPosition,
  containerWidth: number,
  containerHeight: number
): {
  width: number;
  height: number;
  x: number;
  y: number;
} => {
  return {
    width: (containerWidth * position.width) / 100,
    height: (containerHeight * position.height) / 100,
    x: (containerWidth * position.x) / 100,
    y: (containerHeight * position.y) / 100,
  };
};

/**
 * Add text to panel
 */
export const addTextToPanel = (
  panel: PanelData,
  text: string = 'New Text'
): PanelData => {
  const newText: PanelText = {
    id: `text-${Date.now()}`,
    text,
    x: 50,
    y: panel.texts.length === 0 ? 10 : 90,
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: 'System',
    textAlign: 'center',
    strokeWidth: 2,
    strokeColor: '#000000',
  };

  return {
    ...panel,
    texts: [...panel.texts, newText],
  };
};

/**
 * Update text in panel
 */
export const updatePanelText = (
  panel: PanelData,
  textId: string,
  updates: Partial<PanelText>
): PanelData => {
  return {
    ...panel,
    texts: panel.texts.map(text =>
      text.id === textId ? { ...text, ...updates } : text
    ),
  };
};

/**
 * Delete text from panel
 */
export const deleteTextFromPanel = (
  panel: PanelData,
  textId: string
): PanelData => {
  return {
    ...panel,
    texts: panel.texts.filter(text => text.id !== textId),
  };
};

/**
 * Update panel image
 */
export const updatePanelImage = (
  panel: PanelData,
  imageUri: string
): PanelData => {
  return {
    ...panel,
    imageUri,
  };
};

/**
 * Update panel background color
 */
export const updatePanelBackground = (
  panel: PanelData,
  backgroundColor: string
): PanelData => {
  return {
    ...panel,
    backgroundColor,
  };
};

/**
 * Clone panel data
 */
export const clonePanel = (panel: PanelData): PanelData => {
  return {
    ...panel,
    id: `panel-${Date.now()}`,
    texts: panel.texts.map(text => ({
      ...text,
      id: `text-${Date.now()}-${Math.random()}`,
    })),
  };
};

/**
 * Get panel count for layout
 */
export const getPanelCount = (layoutType: LayoutType): number => {
  const layout = getLayoutByType(layoutType);
  return layout ? layout.panels.length : 1;
};

/**
 * Check if layout supports multi-panel
 */
export const isMultiPanel = (layoutType: LayoutType): boolean => {
  return layoutType !== '1x1';
};

/**
 * Get layout dimensions (aspect ratio suggestion)
 */
export const getLayoutDimensions = (layoutType: LayoutType): {
  width: number;
  height: number;
  aspectRatio: number;
} => {
  const layout = getLayoutByType(layoutType);
  if (!layout) {
    return { width: 1080, height: 1080, aspectRatio: 1 };
  }

  // Calculate aspect ratio based on layout
  const baseSize = 1080;
  let width = baseSize;
  let height = baseSize;

  if (layout.cols > layout.rows) {
    // Wider layout
    width = baseSize * (layout.cols / layout.rows);
  } else if (layout.rows > layout.cols) {
    // Taller layout
    height = baseSize * (layout.rows / layout.cols);
  }

  return {
    width,
    height,
    aspectRatio: width / height,
  };
};

/**
 * Validate panel configuration
 */
export const validatePanels = (panels: PanelData[]): boolean => {
  if (panels.length === 0) return false;

  return panels.every(panel => {
    // Check position validity
    if (
      panel.position.width <= 0 ||
      panel.position.height <= 0 ||
      panel.position.x < 0 ||
      panel.position.y < 0
    ) {
      return false;
    }

    // Check texts validity
    return panel.texts.every(text => {
      return (
        text.x >= 0 &&
        text.x <= 100 &&
        text.y >= 0 &&
        text.y <= 100 &&
        text.fontSize > 0
      );
    });
  });
};
