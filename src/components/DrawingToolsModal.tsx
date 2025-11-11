/**
 * Drawing Tools Modal
 * Interface for selecting drawing tools, colors, and brush sizes
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  DrawingTool,
  DrawingSettings,
  TOOL_CATEGORIES,
  DRAWING_COLORS,
  BRUSH_WIDTHS,
  getToolName,
  getToolIcon,
} from '../utils/drawing';

interface DrawingToolsModalProps {
  visible: boolean;
  onClose: () => void;
  settings: DrawingSettings;
  onSettingsChange: (settings: DrawingSettings) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const DrawingToolsModal: React.FC<DrawingToolsModalProps> = ({
  visible,
  onClose,
  settings,
  onSettingsChange,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}) => {
  const handleToolChange = (tool: DrawingTool) => {
    onSettingsChange({ ...settings, tool });
  };

  const handleColorChange = (color: string) => {
    onSettingsChange({ ...settings, color });
  };

  const handleWidthChange = (width: number) => {
    onSettingsChange({ ...settings, width });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="brush" size={24} color={colors.primary} />
              <Text style={styles.title}>Drawing Tools</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Tool Selection */}
            {TOOL_CATEGORIES.map(category => (
              <View key={category.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{category.name}</Text>
                <View style={styles.toolGrid}>
                  {category.tools.map(tool => {
                    const isSelected = settings.tool === tool;
                    const iconName = getToolIcon(tool);
                    return (
                      <TouchableOpacity
                        key={tool}
                        style={[
                          styles.toolButton,
                          isSelected && styles.toolButtonSelected,
                        ]}
                        onPress={() => handleToolChange(tool)}
                      >
                        <Ionicons
                          name={iconName as any}
                          size={28}
                          color={isSelected ? colors.white : colors.text}
                        />
                        <Text
                          style={[
                            styles.toolLabel,
                            isSelected && styles.toolLabelSelected,
                          ]}
                        >
                          {getToolName(tool)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            {/* Color Selection */}
            {settings.tool !== 'eraser' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Color</Text>
                <View style={styles.colorGrid}>
                  {DRAWING_COLORS.map(color => {
                    const isSelected = settings.color === color;
                    return (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorButton,
                          { backgroundColor: color },
                          isSelected && styles.colorButtonSelected,
                        ]}
                        onPress={() => handleColorChange(color)}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={24}
                            color={color === '#000000' ? '#FFFFFF' : '#000000'}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Brush Width */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {settings.tool === 'eraser' ? 'Eraser' : 'Brush'} Size: {settings.width}px
              </Text>
              <View style={styles.widthGrid}>
                {BRUSH_WIDTHS[settings.tool].map(width => {
                  const isSelected = settings.width === width;
                  return (
                    <TouchableOpacity
                      key={width}
                      style={[
                        styles.widthButton,
                        isSelected && styles.widthButtonSelected,
                      ]}
                      onPress={() => handleWidthChange(width)}
                    >
                      <View
                        style={[
                          styles.widthPreview,
                          {
                            width: Math.min(width * 2, 40),
                            height: Math.min(width * 2, 40),
                            borderRadius: Math.min(width, 20),
                            backgroundColor: isSelected
                              ? colors.primary
                              : colors.textLight,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.widthLabel,
                          isSelected && styles.widthLabelSelected,
                        ]}
                      >
                        {width}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Actions</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    !canUndo && styles.actionButtonDisabled,
                  ]}
                  onPress={onUndo}
                  disabled={!canUndo}
                >
                  <Ionicons
                    name="arrow-undo"
                    size={20}
                    color={canUndo ? colors.primary : colors.textLight}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      !canUndo && styles.actionTextDisabled,
                    ]}
                  >
                    Undo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    !canRedo && styles.actionButtonDisabled,
                  ]}
                  onPress={onRedo}
                  disabled={!canRedo}
                >
                  <Ionicons
                    name="arrow-redo"
                    size={20}
                    color={canRedo ? colors.primary : colors.textLight}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      !canRedo && styles.actionTextDisabled,
                    ]}
                  >
                    Redo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onClear}
                >
                  <Ionicons name="trash" size={20} color={colors.error} />
                  <Text style={[styles.actionText, { color: colors.error }]}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tips */}
            <View style={styles.tipsCard}>
              <Ionicons name="bulb" size={20} color={colors.warning} />
              <View style={styles.tipsContent}>
                <Text style={styles.tipsTitle}>Drawing Tips</Text>
                <Text style={styles.tipsText}>
                  • Use the highlighter for emphasis{'\n'}
                  • Draw arrows to point at details{'\n'}
                  • Tap eraser to remove strokes{'\n'}
                  • Use shapes for clean annotations
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 4,
  },
  toolButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  toolLabelSelected: {
    color: colors.white,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  widthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  widthButton: {
    width: 70,
    height: 70,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  widthButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  widthPreview: {
    // Dynamic styles applied inline
  },
  widthLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
  },
  widthLabelSelected: {
    color: colors.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  actionTextDisabled: {
    color: colors.textLight,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.warning}10`,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginTop: 8,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  tipsText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
  },
});
