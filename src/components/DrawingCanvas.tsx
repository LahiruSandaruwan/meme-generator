/**
 * Drawing Canvas Component
 * Provides touch-based drawing overlay with SVG rendering
 * Supports multiple tools, undo/redo, and path management
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import {
  DrawingPath,
  DrawingPoint,
  DrawingSettings,
  pathToSVGString,
  smoothPath,
  generatePathId,
  DEFAULT_DRAWING_SETTINGS,
} from '../utils/drawing';

interface DrawingCanvasProps {
  width: number;
  height: number;
  settings: DrawingSettings;
  enabled: boolean;
  onPathsChange?: (paths: DrawingPath[]) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width,
  height,
  settings,
  enabled,
  onPathsChange,
}) => {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [history, setHistory] = useState<DrawingPath[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const currentPathRef = useRef<DrawingPoint[]>([]);
  const startPointRef = useRef<DrawingPoint | null>(null);

  // Handle touch start
  const handleTouchStart = (x: number, y: number) => {
    if (!enabled) return;

    const point: DrawingPoint = {
      x,
      y,
      pressure: 1,
      timestamp: Date.now(),
    };

    currentPathRef.current = [point];
    startPointRef.current = point;

    const newPath: DrawingPath = {
      id: generatePathId(),
      tool: settings.tool,
      points: [point],
      color: settings.color,
      width: settings.width,
      opacity: settings.opacity,
    };

    setCurrentPath(newPath);
  };

  // Handle touch move
  const handleTouchMove = (x: number, y: number) => {
    if (!enabled || !currentPath) return;

    const point: DrawingPoint = {
      x,
      y,
      pressure: 1,
      timestamp: Date.now(),
    };

    currentPathRef.current.push(point);

    // For shapes, we only need start and end points
    if (['arrow', 'line', 'circle', 'rectangle'].includes(settings.tool)) {
      setCurrentPath({
        ...currentPath,
        points: [startPointRef.current!, point],
      });
    } else {
      // For freehand tools, add all points
      setCurrentPath({
        ...currentPath,
        points: [...currentPathRef.current],
      });
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!enabled || !currentPath) return;

    // Smooth the path for freehand tools
    let finalPath = currentPath;
    if (!['arrow', 'line', 'circle', 'rectangle'].includes(settings.tool)) {
      const smoothedPoints = smoothPath(currentPath.points);
      finalPath = {
        ...currentPath,
        points: smoothedPoints,
      };
    }

    // Add to paths
    const newPaths = [...paths, finalPath];
    setPaths(newPaths);
    onPathsChange?.(newPaths);

    // Update history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPaths);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Reset current path
    setCurrentPath(null);
    currentPathRef.current = [];
    startPointRef.current = null;
  };

  // Pan responder for touch handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabled,
      onMoveShouldSetPanResponder: () => enabled,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        handleTouchStart(locationX, locationY);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        handleTouchMove(locationX, locationY);
      },
      onPanResponderRelease: () => {
        handleTouchEnd();
      },
      onPanResponderTerminate: () => {
        handleTouchEnd();
      },
    })
  ).current;

  // Undo last path
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousPaths = history[newIndex];
      setPaths(previousPaths);
      setHistoryIndex(newIndex);
      onPathsChange?.(previousPaths);
    } else if (historyIndex === 0) {
      setPaths([]);
      setHistoryIndex(-1);
      onPathsChange?.([]);
    }
  };

  // Redo last undone path
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextPaths = history[newIndex];
      setPaths(nextPaths);
      setHistoryIndex(newIndex);
      onPathsChange?.(nextPaths);
    }
  };

  // Clear all paths
  const clear = () => {
    setPaths([]);
    setCurrentPath(null);
    const newHistory = [...history, []];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onPathsChange?.([]);
  };

  // Render a single path
  const renderPath = (path: DrawingPath) => {
    const svgPath = pathToSVGString(path);

    // For eraser, use destination-out blend mode
    if (path.tool === 'eraser') {
      return (
        <Path
          key={path.id}
          d={svgPath}
          stroke="#FFFFFF"
          strokeWidth={path.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={1}
        />
      );
    }

    // For highlighter, fill is semi-transparent
    const fillOpacity = path.tool === 'highlighter' ? path.opacity * 0.3 : 0;

    // For shapes, add fill
    const shouldFill = ['circle', 'rectangle'].includes(path.tool);

    return (
      <Path
        key={path.id}
        d={svgPath}
        stroke={path.color}
        strokeWidth={path.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={shouldFill ? path.color : 'none'}
        fillOpacity={fillOpacity}
        opacity={path.opacity}
      />
    );
  };

  // Can undo/redo
  const canUndo = historyIndex >= 0 && (historyIndex > 0 || paths.length > 0);
  const canRedo = historyIndex < history.length - 1;

  return (
    <>
      <View
        style={[styles.container, { width, height }]}
        {...panResponder.panHandlers}
      >
        <Svg width={width} height={height} style={styles.svg}>
          <G>
            {/* Render all completed paths */}
            {paths.map(renderPath)}

            {/* Render current path being drawn */}
            {currentPath && renderPath(currentPath)}
          </G>
        </Svg>
      </View>

      {/* Expose undo/redo/clear methods via ref */}
      {React.Children.toArray([])}
    </>
  );
};

// Export methods for parent component to call
export const useDrawingCanvas = () => {
  const canvasRef = useRef<{
    undo: () => void;
    redo: () => void;
    clear: () => void;
    canUndo: boolean;
    canRedo: boolean;
    paths: DrawingPath[];
  } | null>(null);

  return canvasRef;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  svg: {
    backgroundColor: 'transparent',
  },
});

// Export with imperative handle for undo/redo/clear
export interface DrawingCanvasRef {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  getPaths: () => DrawingPath[];
}

export const DrawingCanvasWithRef = React.forwardRef<
  DrawingCanvasRef,
  DrawingCanvasProps
>((props, ref) => {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [history, setHistory] = useState<DrawingPath[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const currentPathRef = useRef<DrawingPoint[]>([]);
  const startPointRef = useRef<DrawingPoint | null>(null);

  // Expose methods to parent
  React.useImperativeHandle(ref, () => ({
    undo: () => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        const previousPaths = history[newIndex];
        setPaths(previousPaths);
        setHistoryIndex(newIndex);
        props.onPathsChange?.(previousPaths);
      } else if (historyIndex === 0) {
        setPaths([]);
        setHistoryIndex(-1);
        props.onPathsChange?.([]);
      }
    },
    redo: () => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        const nextPaths = history[newIndex];
        setPaths(nextPaths);
        setHistoryIndex(newIndex);
        props.onPathsChange?.(nextPaths);
      }
    },
    clear: () => {
      setPaths([]);
      setCurrentPath(null);
      const newHistory = [...history, []];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      props.onPathsChange?.([]);
    },
    canUndo: () => historyIndex >= 0 && (historyIndex > 0 || paths.length > 0),
    canRedo: () => historyIndex < history.length - 1,
    getPaths: () => paths,
  }));

  // Handle touch events
  const handleTouchStart = (x: number, y: number) => {
    if (!props.enabled) return;

    const point: DrawingPoint = { x, y, pressure: 1, timestamp: Date.now() };
    currentPathRef.current = [point];
    startPointRef.current = point;

    const newPath: DrawingPath = {
      id: generatePathId(),
      tool: props.settings.tool,
      points: [point],
      color: props.settings.color,
      width: props.settings.width,
      opacity: props.settings.opacity,
    };

    setCurrentPath(newPath);
  };

  const handleTouchMove = (x: number, y: number) => {
    if (!props.enabled || !currentPath) return;

    const point: DrawingPoint = { x, y, pressure: 1, timestamp: Date.now() };
    currentPathRef.current.push(point);

    if (['arrow', 'line', 'circle', 'rectangle'].includes(props.settings.tool)) {
      setCurrentPath({
        ...currentPath,
        points: [startPointRef.current!, point],
      });
    } else {
      setCurrentPath({
        ...currentPath,
        points: [...currentPathRef.current],
      });
    }
  };

  const handleTouchEnd = () => {
    if (!props.enabled || !currentPath) return;

    let finalPath = currentPath;
    if (!['arrow', 'line', 'circle', 'rectangle'].includes(props.settings.tool)) {
      const smoothedPoints = smoothPath(currentPath.points);
      finalPath = { ...currentPath, points: smoothedPoints };
    }

    const newPaths = [...paths, finalPath];
    setPaths(newPaths);
    props.onPathsChange?.(newPaths);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPaths);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setCurrentPath(null);
    currentPathRef.current = [];
    startPointRef.current = null;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => props.enabled,
      onMoveShouldSetPanResponder: () => props.enabled,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        handleTouchStart(locationX, locationY);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        handleTouchMove(locationX, locationY);
      },
      onPanResponderRelease: handleTouchEnd,
      onPanResponderTerminate: handleTouchEnd,
    })
  ).current;

  const renderPath = (path: DrawingPath) => {
    const svgPath = pathToSVGString(path);

    if (path.tool === 'eraser') {
      return (
        <Path
          key={path.id}
          d={svgPath}
          stroke="#FFFFFF"
          strokeWidth={path.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={1}
        />
      );
    }

    const fillOpacity = path.tool === 'highlighter' ? path.opacity * 0.3 : 0;
    const shouldFill = ['circle', 'rectangle'].includes(path.tool);

    return (
      <Path
        key={path.id}
        d={svgPath}
        stroke={path.color}
        strokeWidth={path.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={shouldFill ? path.color : 'none'}
        fillOpacity={fillOpacity}
        opacity={path.opacity}
      />
    );
  };

  return (
    <View
      style={[styles.container, { width: props.width, height: props.height }]}
      {...panResponder.panHandlers}
    >
      <Svg width={props.width} height={props.height} style={styles.svg}>
        <G>
          {paths.map(renderPath)}
          {currentPath && renderPath(currentPath)}
        </G>
      </Svg>
    </View>
  );
});

DrawingCanvasWithRef.displayName = 'DrawingCanvasWithRef';
