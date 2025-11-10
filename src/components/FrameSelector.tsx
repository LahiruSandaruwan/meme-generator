/**
 * FrameSelector Component
 * Modal for selecting and customizing meme frames/borders
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
import { colors } from '../constants/colors';
import {
  FrameType,
  Frame,
  FRAME_PRESETS,
  createFrame,
  getFrameName,
  QUICK_COLORS,
} from '../utils/shapes';

interface FrameSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectFrame: (frame: Frame | null) => void;
  currentFrame?: Frame | null;
}

const FRAME_TYPES: FrameType[] = [
  'none',
  'simple',
  'double',
  'rounded',
  'vintage',
  'polaroid',
  'film',
  'comic',
  'neon',
  'shadow',
  'gradient-border',
  'dashed',
  'dotted',
];

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  visible,
  onClose,
  onSelectFrame,
  currentFrame,
}) => {
  const [selectedType, setSelectedType] = useState<FrameType>(
    currentFrame?.type || 'simple'
  );
  const [frameColor, setFrameColor] = useState(currentFrame?.color || '#000000');
  const [frameWidth, setFrameWidth] = useState(currentFrame?.width || 8);

  const handleApplyFrame = () => {
    if (selectedType === 'none') {
      onSelectFrame(null);
    } else {
      const frame = createFrame(selectedType, {
        color: frameColor,
        width: frameWidth,
      });
      onSelectFrame(frame);
    }
    onClose();
  };

  const renderFramePreview = (type: FrameType) => {
    if (type === 'none') {
      return (
        <View style={styles.framePreviewContainer}>
          <View style={styles.noFramePreview}>
            <Ionicons name="close" size={24} color={colors.textLight} />
          </View>
        </View>
      );
    }

    const preset = FRAME_PRESETS[type];
    const previewColor = type === 'polaroid' ? '#FFFFFF' : frameColor;
    const isDashed = type === 'dashed';
    const isDotted = type === 'dotted';
    const isGradient = type === 'gradient-border';

    return (
      <View style={styles.framePreviewContainer}>
        <View
          style={[
            styles.framePreview,
            {
              borderWidth: (preset.width || 8) / 2,
              borderColor: isGradient ? '#667eea' : previewColor,
              borderRadius: preset.cornerRadius || 0,
              borderStyle: isDashed ? 'dashed' : isDotted ? 'dotted' : 'solid',
            },
          ]}
        >
          <View style={styles.frameInner} />
        </View>
      </View>
    );
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
              <Ionicons name="image-outline" size={24} color={colors.primary} />
              <Text style={styles.title}>Add Frame</Text>
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
            {/* Frame Types */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Frame Style</Text>
              <View style={styles.frameGrid}>
                {FRAME_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.frameCard,
                      selectedType === type && styles.frameCardSelected,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    {renderFramePreview(type)}
                    <Text style={styles.frameLabel}>{getFrameName(type)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {selectedType !== 'none' && selectedType !== 'gradient-border' && (
              <>
                {/* Color Picker */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Frame Color</Text>
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
                          frameColor === color && styles.colorButtonSelected,
                        ]}
                        onPress={() => setFrameColor(color)}
                      >
                        {frameColor === color && (
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

                {/* Width Picker */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Frame Width: {frameWidth}px</Text>
                  <View style={styles.widthPicker}>
                    {[4, 6, 8, 10, 12, 16, 20, 24, 32].map((width) => (
                      <TouchableOpacity
                        key={width}
                        style={[
                          styles.widthButton,
                          frameWidth === width && styles.widthButtonSelected,
                        ]}
                        onPress={() => setFrameWidth(width)}
                      >
                        <Text
                          style={[
                            styles.widthButtonText,
                            frameWidth === width && styles.widthButtonTextSelected,
                          ]}
                        >
                          {width}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Frame Tips</Text>
                <Text style={styles.infoText}>
                  Frames add a professional finish to your memes. Try different styles to match your meme's vibe!
                </Text>
              </View>
            </View>

            {/* Popular Presets */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Styles</Text>
              <View style={styles.presetList}>
                <TouchableOpacity
                  style={styles.presetItem}
                  onPress={() => {
                    setSelectedType('polaroid');
                    setFrameColor('#FFFFFF');
                    setFrameWidth(16);
                  }}
                >
                  <Ionicons name="image" size={24} color={colors.primary} />
                  <View style={styles.presetContent}>
                    <Text style={styles.presetName}>Classic Polaroid</Text>
                    <Text style={styles.presetDescription}>White border with shadow</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetItem}
                  onPress={() => {
                    setSelectedType('vintage');
                    setFrameColor('#8B7355');
                    setFrameWidth(24);
                  }}
                >
                  <Ionicons name="camera" size={24} color={colors.primary} />
                  <View style={styles.presetContent}>
                    <Text style={styles.presetName}>Vintage Photo</Text>
                    <Text style={styles.presetDescription}>Brown frame with aged look</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetItem}
                  onPress={() => {
                    setSelectedType('neon');
                    setFrameColor('#00FF00');
                    setFrameWidth(6);
                  }}
                >
                  <Ionicons name="flash" size={24} color={colors.primary} />
                  <View style={styles.presetContent}>
                    <Text style={styles.presetName}>Neon Glow</Text>
                    <Text style={styles.presetDescription}>Bright glowing effect</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetItem}
                  onPress={() => {
                    setSelectedType('comic');
                    setFrameColor('#000000');
                    setFrameWidth(12);
                  }}
                >
                  <Ionicons name="book" size={24} color={colors.primary} />
                  <View style={styles.presetContent}>
                    <Text style={styles.presetName}>Comic Book</Text>
                    <Text style={styles.presetDescription}>Bold black border</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetItem}
                  onPress={() => {
                    setSelectedType('gradient-border');
                    setFrameWidth(10);
                  }}
                >
                  <Ionicons name="color-palette" size={24} color={colors.primary} />
                  <View style={styles.presetContent}>
                    <Text style={styles.presetName}>Gradient Border</Text>
                    <Text style={styles.presetDescription}>Purple to blue gradient</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFrame}
            >
              <Text style={styles.applyButtonText}>
                {selectedType === 'none' ? 'Remove Frame' : 'Apply Frame'}
              </Text>
            </TouchableOpacity>
          </View>
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
  frameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  frameCard: {
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
  frameCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  framePreviewContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  framePreview: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameInner: {
    width: '70%',
    height: '70%',
    backgroundColor: colors.background,
  },
  noFramePreview: {
    width: 50,
    height: 50,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
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
  widthPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  widthButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  widthButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  widthButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  widthButtonTextSelected: {
    color: colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
  presetList: {
    gap: 12,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  presetContent: {
    flex: 1,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  presetDescription: {
    fontSize: 12,
    color: colors.textLight,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
