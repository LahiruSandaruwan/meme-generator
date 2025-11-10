/**
 * Shape & Border Library
 * Provides decorative shapes, frames, and speech bubbles for memes
 * All rendered on-device with React Native graphics (100% FREE)
 */

import { Path } from 'react-native-svg';

export type ShapeType =
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'speech-bubble'
  | 'thought-bubble'
  | 'callout-left'
  | 'callout-right'
  | 'explosion'
  | 'cloud';

export type FrameType =
  | 'none'
  | 'simple'
  | 'double'
  | 'rounded'
  | 'vintage'
  | 'polaroid'
  | 'film'
  | 'comic'
  | 'neon'
  | 'shadow'
  | 'gradient-border'
  | 'dashed'
  | 'dotted';

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  fillColor?: string;
  strokeWidth: number;
  opacity: number;
}

export interface Frame {
  id: string;
  type: FrameType;
  color: string;
  width: number;
  padding: number;
  cornerRadius?: number;
  shadowOpacity?: number;
  gradientColors?: string[];
}

export interface ShapeCategory {
  id: string;
  name: string;
  icon: string;
  shapes: ShapeType[];
}

// Shape categories for easy browsing
export const SHAPE_CATEGORIES: ShapeCategory[] = [
  {
    id: 'basic',
    name: 'Basic Shapes',
    icon: 'square-outline',
    shapes: ['rectangle', 'circle', 'triangle'],
  },
  {
    id: 'symbols',
    name: 'Symbols',
    icon: 'heart-outline',
    shapes: ['heart', 'star'],
  },
  {
    id: 'arrows',
    name: 'Arrows',
    icon: 'arrow-forward',
    shapes: ['arrow-right', 'arrow-left', 'arrow-up', 'arrow-down'],
  },
  {
    id: 'bubbles',
    name: 'Speech Bubbles',
    icon: 'chatbubble-outline',
    shapes: ['speech-bubble', 'thought-bubble', 'callout-left', 'callout-right'],
  },
  {
    id: 'special',
    name: 'Special',
    icon: 'flash-outline',
    shapes: ['explosion', 'cloud'],
  },
];

// SVG path data for shapes (normalized to 100x100)
export const SHAPE_PATHS: Record<ShapeType, string> = {
  rectangle: 'M 10 10 H 90 V 90 H 10 Z',
  circle: 'M 50 10 A 40 40 0 1 1 49.99 10 Z',
  triangle: 'M 50 10 L 90 90 L 10 90 Z',

  star: 'M 50 5 L 61 38 L 95 38 L 68 58 L 79 91 L 50 71 L 21 91 L 32 58 L 5 38 L 39 38 Z',

  heart: 'M 50 85 L 20 50 Q 10 30 25 20 Q 40 10 50 25 Q 60 10 75 20 Q 90 30 80 50 Z',

  'arrow-right': 'M 10 40 H 60 V 20 L 90 50 L 60 80 V 60 H 10 Z',
  'arrow-left': 'M 90 40 H 40 V 20 L 10 50 L 40 80 V 60 H 90 Z',
  'arrow-up': 'M 40 90 V 40 H 20 L 50 10 L 80 40 H 60 V 90 Z',
  'arrow-down': 'M 40 10 V 60 H 20 L 50 90 L 80 60 H 60 V 10 Z',

  'speech-bubble': 'M 15 15 Q 10 15 10 20 V 70 Q 10 75 15 75 H 30 L 40 90 L 45 75 H 85 Q 90 75 90 70 V 20 Q 90 15 85 15 Z',

  'thought-bubble': 'M 50 10 Q 25 10 15 30 Q 10 45 20 60 Q 30 70 50 70 Q 70 70 80 60 Q 90 45 85 30 Q 75 10 50 10 M 25 75 Q 22 72 25 69 Q 28 72 25 75 M 15 85 Q 11 80 15 75 Q 19 80 15 85',

  'callout-left': 'M 20 20 Q 15 20 15 25 V 65 Q 15 70 20 70 H 85 Q 90 70 90 65 V 25 Q 90 20 85 20 H 50 L 30 10 L 40 20 Z',

  'callout-right': 'M 15 20 Q 10 20 10 25 V 65 Q 10 70 15 70 H 60 L 70 10 L 50 20 H 85 Q 90 20 90 25 V 65 Q 90 70 85 70 H 15',

  explosion: 'M 50 5 L 55 30 L 80 15 L 65 40 L 95 45 L 70 55 L 90 80 L 60 65 L 55 95 L 50 70 L 45 95 L 40 65 L 10 80 L 30 55 L 5 45 L 35 40 L 20 15 L 45 30 Z',

  cloud: 'M 20 50 Q 15 40 25 35 Q 30 20 45 20 Q 55 10 65 20 Q 80 20 85 35 Q 95 40 90 50 Q 90 60 80 60 H 20 Q 10 60 10 50',
};

// Generate a unique ID for shapes
export const generateShapeId = (): string => {
  return `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create a new shape with default values
export const createShape = (
  type: ShapeType,
  x: number,
  y: number,
  options: Partial<Shape> = {}
): Shape => {
  return {
    id: generateShapeId(),
    type,
    x,
    y,
    width: 100,
    height: 100,
    rotation: 0,
    color: '#000000',
    fillColor: 'transparent',
    strokeWidth: 3,
    opacity: 1,
    ...options,
  };
};

// Frame presets
export const FRAME_PRESETS: Record<FrameType, Partial<Frame>> = {
  none: {
    width: 0,
    padding: 0,
  },
  simple: {
    width: 8,
    padding: 8,
    color: '#000000',
  },
  double: {
    width: 16,
    padding: 16,
    color: '#000000',
  },
  rounded: {
    width: 8,
    padding: 12,
    color: '#000000',
    cornerRadius: 20,
  },
  vintage: {
    width: 24,
    padding: 24,
    color: '#8B7355',
    shadowOpacity: 0.3,
  },
  polaroid: {
    width: 16,
    padding: 16,
    color: '#FFFFFF',
    shadowOpacity: 0.4,
  },
  film: {
    width: 20,
    padding: 20,
    color: '#333333',
  },
  comic: {
    width: 12,
    padding: 12,
    color: '#000000',
    cornerRadius: 8,
  },
  neon: {
    width: 6,
    padding: 10,
    color: '#00FF00',
    shadowOpacity: 0.8,
  },
  shadow: {
    width: 4,
    padding: 12,
    color: '#000000',
    shadowOpacity: 0.5,
  },
  'gradient-border': {
    width: 10,
    padding: 12,
    gradientColors: ['#667eea', '#764ba2'],
  },
  dashed: {
    width: 6,
    padding: 10,
    color: '#000000',
  },
  dotted: {
    width: 6,
    padding: 10,
    color: '#000000',
  },
};

// Create a new frame
export const createFrame = (
  type: FrameType,
  options: Partial<Frame> = {}
): Frame => {
  const preset = FRAME_PRESETS[type];
  return {
    id: `frame_${Date.now()}`,
    type,
    color: '#000000',
    width: 8,
    padding: 8,
    ...preset,
    ...options,
  };
};

// Default colors for quick access
export const QUICK_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
  '#FFD700', // Gold
  '#C0C0C0', // Silver
];

// Calculate shape bounds for collision detection
export const getShapeBounds = (shape: Shape) => {
  return {
    left: shape.x,
    top: shape.y,
    right: shape.x + shape.width,
    bottom: shape.y + shape.height,
    centerX: shape.x + shape.width / 2,
    centerY: shape.y + shape.height / 2,
  };
};

// Check if a point is inside a shape
export const isPointInShape = (
  x: number,
  y: number,
  shape: Shape
): boolean => {
  const bounds = getShapeBounds(shape);
  return (
    x >= bounds.left &&
    x <= bounds.right &&
    y >= bounds.top &&
    y <= bounds.bottom
  );
};

// Get shape display name
export const getShapeName = (type: ShapeType): string => {
  const names: Record<ShapeType, string> = {
    rectangle: 'Rectangle',
    circle: 'Circle',
    triangle: 'Triangle',
    star: 'Star',
    heart: 'Heart',
    'arrow-right': 'Arrow Right',
    'arrow-left': 'Arrow Left',
    'arrow-up': 'Arrow Up',
    'arrow-down': 'Arrow Down',
    'speech-bubble': 'Speech Bubble',
    'thought-bubble': 'Thought Bubble',
    'callout-left': 'Callout Left',
    'callout-right': 'Callout Right',
    explosion: 'Explosion',
    cloud: 'Cloud',
  };
  return names[type];
};

// Get frame display name
export const getFrameName = (type: FrameType): string => {
  const names: Record<FrameType, string> = {
    none: 'No Frame',
    simple: 'Simple',
    double: 'Double',
    rounded: 'Rounded',
    vintage: 'Vintage',
    polaroid: 'Polaroid',
    film: 'Film Strip',
    comic: 'Comic',
    neon: 'Neon Glow',
    shadow: 'Shadow',
    'gradient-border': 'Gradient',
    dashed: 'Dashed',
    dotted: 'Dotted',
  };
  return names[type];
};

// Preset shape configurations for quick use
export const SHAPE_PRESETS = {
  // Arrows for highlighting
  highlightArrow: (x: number, y: number) =>
    createShape('arrow-down', x, y, {
      color: '#FF0000',
      fillColor: '#FF0000',
      width: 80,
      height: 80,
    }),

  // Speech bubble for text
  textBubble: (x: number, y: number) =>
    createShape('speech-bubble', x, y, {
      color: '#000000',
      fillColor: '#FFFFFF',
      strokeWidth: 3,
      width: 150,
      height: 100,
    }),

  // Thought bubble
  thinkingBubble: (x: number, y: number) =>
    createShape('thought-bubble', x, y, {
      color: '#000000',
      fillColor: '#FFFFFF',
      strokeWidth: 2,
      width: 120,
      height: 100,
    }),

  // Explosion for impact
  comicExplosion: (x: number, y: number) =>
    createShape('explosion', x, y, {
      color: '#FF0000',
      fillColor: '#FFFF00',
      strokeWidth: 3,
      width: 120,
      height: 120,
    }),

  // Gold star
  goldStar: (x: number, y: number) =>
    createShape('star', x, y, {
      color: '#FFD700',
      fillColor: '#FFD700',
      strokeWidth: 2,
      width: 80,
      height: 80,
    }),

  // Red heart
  redHeart: (x: number, y: number) =>
    createShape('heart', x, y, {
      color: '#FF0000',
      fillColor: '#FF0000',
      strokeWidth: 2,
      width: 80,
      height: 80,
    }),

  // Cloud for text
  textCloud: (x: number, y: number) =>
    createShape('cloud', x, y, {
      color: '#000000',
      fillColor: '#FFFFFF',
      strokeWidth: 2,
      width: 140,
      height: 80,
    }),
};
