/**
 * Advanced Drawing Tools Utility
 * Provides drawing capabilities for memes
 * 100% FREE - on-device processing
 */

export type DrawingTool =
  | 'pen'
  | 'marker'
  | 'highlighter'
  | 'eraser'
  | 'arrow'
  | 'line'
  | 'circle'
  | 'rectangle';

export interface DrawingPoint {
  x: number;
  y: number;
  pressure?: number;
}

export interface DrawingPath {
  id: string;
  tool: DrawingTool;
  points: DrawingPoint[];
  color: string;
  width: number;
  opacity: number;
}

export interface DrawingSettings {
  tool: DrawingTool;
  color: string;
  width: number;
  opacity: number;
}

// Default drawing settings
export const DEFAULT_DRAWING_SETTINGS: DrawingSettings = {
  tool: 'pen',
  color: '#000000',
  width: 4,
  opacity: 1,
};

// Brush width presets
export const BRUSH_WIDTHS = {
  pen: [1, 2, 4, 6, 8, 12],
  marker: [8, 12, 16, 20, 24],
  highlighter: [12, 16, 20, 24, 32],
  eraser: [8, 12, 16, 20, 24, 32],
  arrow: [2, 3, 4, 6, 8],
  line: [1, 2, 4, 6, 8, 12],
  circle: [2, 4, 6, 8],
  rectangle: [2, 4, 6, 8],
};

// Default opacity by tool
export const TOOL_OPACITY = {
  pen: 1,
  marker: 1,
  highlighter: 0.4,
  eraser: 1,
  arrow: 1,
  line: 1,
  circle: 1,
  rectangle: 1,
};

// Drawing colors
export const DRAWING_COLORS = [
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
];

// Generate unique ID for path
export const generatePathId = (): string => {
  return `path_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create new path
export const createPath = (
  tool: DrawingTool,
  color: string,
  width: number,
  opacity: number
): DrawingPath => {
  return {
    id: generatePathId(),
    tool,
    points: [],
    color,
    width,
    opacity,
  };
};

// Add point to path
export const addPointToPath = (
  path: DrawingPath,
  point: DrawingPoint
): DrawingPath => {
  return {
    ...path,
    points: [...path.points, point],
  };
};

// Get tool display name
export const getToolName = (tool: DrawingTool): string => {
  const names: Record<DrawingTool, string> = {
    pen: 'Pen',
    marker: 'Marker',
    highlighter: 'Highlighter',
    eraser: 'Eraser',
    arrow: 'Arrow',
    line: 'Line',
    circle: 'Circle',
    rectangle: 'Rectangle',
  };
  return names[tool];
};

// Get tool icon
export const getToolIcon = (tool: DrawingTool): string => {
  const icons: Record<DrawingTool, string> = {
    pen: 'create',
    marker: 'brush',
    highlighter: 'color-fill',
    eraser: 'remove-circle',
    arrow: 'arrow-forward',
    line: 'remove',
    circle: 'ellipse-outline',
    rectangle: 'square-outline',
  };
  return icons[tool];
};

// Convert SVG path to string
export const pathToSVGString = (path: DrawingPath): string => {
  if (path.points.length === 0) return '';

  if (path.tool === 'arrow') {
    // Draw arrow with arrowhead
    if (path.points.length < 2) return '';
    const start = path.points[0];
    const end = path.points[path.points.length - 1];

    // Calculate angle
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;

    // Arrowhead points
    const arrowPoint1X = end.x - arrowLength * Math.cos(angle - arrowAngle);
    const arrowPoint1Y = end.y - arrowLength * Math.sin(angle - arrowAngle);
    const arrowPoint2X = end.x - arrowLength * Math.cos(angle + arrowAngle);
    const arrowPoint2Y = end.y - arrowLength * Math.sin(angle + arrowAngle);

    return `M ${start.x} ${start.y} L ${end.x} ${end.y} M ${arrowPoint1X} ${arrowPoint1Y} L ${end.x} ${end.y} L ${arrowPoint2X} ${arrowPoint2Y}`;
  }

  if (path.tool === 'line') {
    // Straight line from first to last point
    if (path.points.length < 2) return '';
    const start = path.points[0];
    const end = path.points[path.points.length - 1];
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  if (path.tool === 'circle') {
    // Circle from first to last point
    if (path.points.length < 2) return '';
    const start = path.points[0];
    const end = path.points[path.points.length - 1];
    const centerX = (start.x + end.x) / 2;
    const centerY = (start.y + end.y) / 2;
    const radiusX = Math.abs(end.x - start.x) / 2;
    const radiusY = Math.abs(end.y - start.y) / 2;
    return `M ${centerX - radiusX} ${centerY} A ${radiusX} ${radiusY} 0 1 0 ${centerX + radiusX} ${centerY} A ${radiusX} ${radiusY} 0 1 0 ${centerX - radiusX} ${centerY}`;
  }

  if (path.tool === 'rectangle') {
    // Rectangle from first to last point
    if (path.points.length < 2) return '';
    const start = path.points[0];
    const end = path.points[path.points.length - 1];
    return `M ${start.x} ${start.y} L ${end.x} ${start.y} L ${end.x} ${end.y} L ${start.x} ${end.y} Z`;
  }

  // Freehand drawing (pen, marker, highlighter, eraser)
  let d = `M ${path.points[0].x} ${path.points[0].y}`;

  // Use quadratic curves for smooth drawing
  for (let i = 1; i < path.points.length - 1; i++) {
    const xc = (path.points[i].x + path.points[i + 1].x) / 2;
    const yc = (path.points[i].y + path.points[i + 1].y) / 2;
    d += ` Q ${path.points[i].x} ${path.points[i].y} ${xc} ${yc}`;
  }

  // Add last point
  if (path.points.length > 1) {
    const last = path.points[path.points.length - 1];
    d += ` L ${last.x} ${last.y}`;
  }

  return d;
};

// Calculate bounding box for path
export const getPathBounds = (path: DrawingPath): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} => {
  if (path.points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = path.points[0].x;
  let minY = path.points[0].y;
  let maxX = path.points[0].x;
  let maxY = path.points[0].y;

  path.points.forEach(point => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });

  return { minX, minY, maxX, maxY };
};

// Check if point is near path (for eraser)
export const isPointNearPath = (
  x: number,
  y: number,
  path: DrawingPath,
  threshold: number = 10
): boolean => {
  return path.points.some(point => {
    const distance = Math.sqrt(
      Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
    );
    return distance < threshold + path.width / 2;
  });
};

// Smooth path using Douglas-Peucker algorithm
export const smoothPath = (
  points: DrawingPoint[],
  tolerance: number = 2
): DrawingPoint[] => {
  if (points.length < 3) return points;

  // Find point with maximum distance
  let maxDistance = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const distance = perpendicularDistance(
      points[i],
      points[0],
      points[end]
    );
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }

  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    const left = smoothPath(points.slice(0, index + 1), tolerance);
    const right = smoothPath(points.slice(index), tolerance);
    return [...left.slice(0, -1), ...right];
  }

  return [points[0], points[end]];
};

// Calculate perpendicular distance from point to line
const perpendicularDistance = (
  point: DrawingPoint,
  lineStart: DrawingPoint,
  lineEnd: DrawingPoint
): number => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  if (dx === 0 && dy === 0) {
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) +
      Math.pow(point.y - lineStart.y, 2)
    );
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) /
      (dx * dx + dy * dy)
    )
  );

  const projectionX = lineStart.x + t * dx;
  const projectionY = lineStart.y + t * dy;

  return Math.sqrt(
    Math.pow(point.x - projectionX, 2) +
    Math.pow(point.y - projectionY, 2)
  );
};

// Tool categories for UI grouping
export interface ToolCategory {
  id: string;
  name: string;
  tools: DrawingTool[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'drawing',
    name: 'Drawing',
    tools: ['pen', 'marker', 'highlighter'],
  },
  {
    id: 'shapes',
    name: 'Shapes',
    tools: ['arrow', 'line', 'circle', 'rectangle'],
  },
  {
    id: 'edit',
    name: 'Edit',
    tools: ['eraser'],
  },
];
