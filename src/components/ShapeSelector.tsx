/**
 * ShapeSelector Component
 * Modal for selecting and customizing shapes
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../constants/colors';
import {
  ShapeType,
  Shape,
  SHAPE_CATEGORIES,
  SHAPE_PATHS,
  createShape,
  getShapeName,
  QUICK_COLORS,
  SHAPE_PRESETS,
} from '../utils/shapes';

interface ShapeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onAddShape: (shape: Shape) => void;
  canvasWidth: number;
  canvasHeight: number;
}

type Tab = 'shapes' | 'presets' | 'customize';

export const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  visible,
  onClose,
  onAddShape,
  canvasWidth,
  canvasHeight,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('shapes');
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangle');
  const [shapeColor, setShapeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('transparent');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [showFillPicker, setShowFillPicker] = useState(false);

  const handleAddShape = (shape?: Shape) => {
    // Use provided shape or create new one
    const newShape = shape || createShape(
      selectedShape,
      canvasWidth / 2 - 50,
      canvasHeight / 2 - 50,
      {
        color: shapeColor,
        fillColor,
        strokeWidth,
      }
    );
    onAddShape(newShape);
    onClose();
  };

  const handlePresetSelect = (presetKey: keyof typeof SHAPE_PRESETS) => {
    const preset = SHAPE_PRESETS[presetKey](
      canvasWidth / 2 - 50,
      canvasHeight / 2 - 50
    );
    handleAddShape(preset);
  };

  const renderShapePreview = (shapeType: ShapeType, size: number = 60) => {
    const path = SHAPE_PATHS[shapeType];
    const viewBox = '0 0 100 100';

    return (
      <Svg width={size} height={size} viewBox={viewBox}>
        <Path
          d={path}
          stroke={shapeColor}
          strokeWidth={3}
          fill={fillColor}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    );
  };

  const renderShapesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {SHAPE_CATEGORIES.map((category) => (
        <View key={category.id} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Ionicons name={category.icon as any} size={20} color={colors.primary} />
            <Text style={styles.categoryTitle}>{category.name}</Text>
          </View>
          <View style={styles.shapeGrid}>
            {category.shapes.map((shapeType) => (
              <TouchableOpacity
                key={shapeType}
                style={[
                  styles.shapeCard,
                  selectedShape === shapeType && styles.shapeCardSelected,
                ]}
                onPress={() => setSelectedShape(shapeType)}
              >
                <Svg width={50} height={50} viewBox="0 0 100 100">
                  <Path
                    d={SHAPE_PATHS[shapeType]}
                    stroke={colors.text}
                    strokeWidth={3}
                    fill="transparent"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </Svg>
                <Text style={styles.shapeLabel}>{getShapeName(shapeType)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderPresetsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Quick Add</Text>
      <Text style={styles.sectionSubtitle}>
        Tap to add pre-styled shapes instantly
      </Text>

      <View style={styles.presetGrid}>
        {Object.entries({
          highlightArrow: { name: 'Highlight Arrow', icon: 'arrow-down' as const },
          textBubble: { name: 'Speech Bubble', icon: 'chatbubble' as const },
          thinkingBubble: { name: 'Thought Bubble', icon: 'ellipsis-horizontal-circle' as const },
          comicExplosion: { name: 'Explosion', icon: 'flash' as const },
          goldStar: { name: 'Gold Star', icon: 'star' as const },
          redHeart: { name: 'Red Heart', icon: 'heart' as const },
          textCloud: { name: 'Text Cloud', icon: 'cloud' as const },
        }).map(([key, { name, icon }]) => (
          <TouchableOpacity
            key={key}
            style={styles.presetCard}
            onPress={() => handlePresetSelect(key as keyof typeof SHAPE_PRESETS)}
          >
            <View style={styles.presetIconContainer}>
              <Ionicons name={icon} size={32} color={colors.primary} />
            </View>
            <Text style={styles.presetName}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderCustomizeTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Shape Preview */}
      <View style={styles.previewSection}>
        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewContainer}>
          {renderShapePreview(selectedShape, 100)}
        </View>
        <Text style={styles.previewLabel}>{getShapeName(selectedShape)}</Text>
      </View>

      {/* Stroke Color */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stroke Color</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.colorPicker}
          contentContainerStyle={styles.colorPickerContent}
        >
          {QUICK_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                shapeColor === color && styles.colorButtonSelected,
              ]}
              onPress={() => setShapeColor(color)}
            >
              {shapeColor === color && (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={color === '#FFFFFF' ? '#000000' : '#FFFFFF'}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Fill Color */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fill Color</Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowFillPicker(!showFillPicker)}
          >
            <Text style={styles.toggleButtonText}>
              {showFillPicker ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fillPreview}>
          <Text style={styles.fillLabel}>
            {fillColor === 'transparent' ? 'No Fill' : 'Filled'}
          </Text>
          <View
            style={[
              styles.fillColorBox,
              {
                backgroundColor: fillColor === 'transparent' ? '#EEEEEE' : fillColor,
              },
            ]}
          >
            {fillColor === 'transparent' && (
              <Ionicons name="close" size={20} color={colors.textLight} />
            )}
          </View>
        </View>

        {showFillPicker && (
          <>
            <TouchableOpacity
              style={styles.transparentButton}
              onPress={() => setFillColor('transparent')}
            >
              <Ionicons name="close-circle" size={20} color={colors.textLight} />
              <Text style={styles.transparentButtonText}>No Fill</Text>
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.colorPicker}
              contentContainerStyle={styles.colorPickerContent}
            >
              {QUICK_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    fillColor === color && styles.colorButtonSelected,
                  ]}
                  onPress={() => setFillColor(color)}
                >
                  {fillColor === color && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={color === '#FFFFFF' ? '#000000' : '#FFFFFF'}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>

      {/* Stroke Width */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stroke Width: {strokeWidth}px</Text>
        <View style={styles.strokeWidthPicker}>
          {[1, 2, 3, 4, 6, 8, 10, 12].map((width) => (
            <TouchableOpacity
              key={width}
              style={[
                styles.strokeButton,
                strokeWidth === width && styles.strokeButtonSelected,
              ]}
              onPress={() => setStrokeWidth(width)}
            >
              <Text
                style={[
                  styles.strokeButtonText,
                  strokeWidth === width && styles.strokeButtonTextSelected,
                ]}
              >
                {width}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

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
              <Ionicons name="shapes" size={24} color={colors.primary} />
              <Text style={styles.title}>Add Shape</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'shapes' && styles.tabActive]}
              onPress={() => setActiveTab('shapes')}
            >
              <Ionicons
                name="shapes"
                size={20}
                color={activeTab === 'shapes' ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'shapes' && styles.tabTextActive,
                ]}
              >
                Shapes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'presets' && styles.tabActive]}
              onPress={() => setActiveTab('presets')}
            >
              <Ionicons
                name="flash"
                size={20}
                color={activeTab === 'presets' ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'presets' && styles.tabTextActive,
                ]}
              >
                Quick Add
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'customize' && styles.tabActive]}
              onPress={() => setActiveTab('customize')}
            >
              <Ionicons
                name="color-palette"
                size={20}
                color={activeTab === 'customize' ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'customize' && styles.tabTextActive,
                ]}
              >
                Customize
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.content}>
            {activeTab === 'shapes' && renderShapesTab()}
            {activeTab === 'presets' && renderPresetsTab()}
            {activeTab === 'customize' && renderCustomizeTab()}
          </View>

          {/* Footer */}
          {(activeTab === 'shapes' || activeTab === 'customize') && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddShape()}
              >
                <Ionicons name="add-circle" size={20} color={colors.white} />
                <Text style={styles.addButtonText}>Add to Meme</Text>
              </TouchableOpacity>
            </View>
          )}
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
    maxHeight: '90%',
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
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  shapeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  shapeCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  shapeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  shapeLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  presetCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  presetName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 12,
  },
  previewSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  previewContainer: {
    marginVertical: 16,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  colorPicker: {
    marginTop: 8,
  },
  colorPickerContent: {
    gap: 12,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  colorButtonSelected: {
    borderColor: colors.text,
    borderWidth: 3,
  },
  fillPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  fillLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  fillColorBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  transparentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 12,
  },
  transparentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  strokeWidthPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  strokeButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  strokeButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  strokeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  strokeButtonTextSelected: {
    color: colors.primary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
