/**
 * Face Blur Modal Component
 * Interface for adding privacy blur to faces in images
 * Manual selection with preset templates
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  BlurRegion,
  BlurStyle,
  BLUR_PRESETS,
  FACE_REGION_TEMPLATES,
  createBlurRegion,
  applyBlurToRegions,
  PRIVACY_TIPS,
  EMOJI_COVERS,
  FEATURE_NOTICE,
  generateRegionId,
} from '../utils/faceBlur';

const { width } = Dimensions.get('window');
const PREVIEW_WIDTH = width - 64;

interface FaceBlurModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onApply: (blurredUri: string, regions: BlurRegion[]) => void;
}

export const FaceBlurModal: React.FC<FaceBlurModalProps> = ({
  visible,
  imageUri,
  onClose,
  onApply,
}) => {
  const [regions, setRegions] = useState<BlurRegion[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(BLUR_PRESETS[0]);
  const [selectedStyle, setSelectedStyle] = useState<BlurStyle>('gaussian');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddRegion = () => {
    const newRegion = createBlurRegion(40, 30, 20, 25, selectedPreset.intensity);
    setRegions([...regions, newRegion]);
    setSelectedRegionId(newRegion.id);
  };

  const handleSelectTemplate = (templateKey: keyof typeof FACE_REGION_TEMPLATES) => {
    const template = FACE_REGION_TEMPLATES[templateKey];
    const newRegions = template.regions.map(r => ({
      ...r,
      id: generateRegionId(),
      intensity: selectedPreset.intensity,
    }));
    setRegions(newRegions);
    if (newRegions.length > 0) {
      setSelectedRegionId(newRegions[0].id);
    }
  };

  const handleRemoveRegion = (regionId: string) => {
    setRegions(regions.filter(r => r.id !== regionId));
    if (selectedRegionId === regionId) {
      setSelectedRegionId(null);
    }
  };

  const handleSelectPreset = (preset: typeof BLUR_PRESETS[0]) => {
    setSelectedPreset(preset);
    setSelectedStyle(preset.style);

    // Update intensity for all regions
    setRegions(regions.map(r => ({ ...r, intensity: preset.intensity })));
  };

  const handleApply = async () => {
    if (!imageUri) return;

    if (regions.length === 0) {
      Alert.alert(
        'No Regions Selected',
        'Please add at least one blur region or use a template.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsProcessing(true);

      const blurredUri = await applyBlurToRegions(imageUri, regions, selectedStyle);

      setIsProcessing(false);
      onApply(blurredUri, regions);
      onClose();
    } catch (error) {
      console.error('Error applying face blur:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to apply blur. Please try again.');
    }
  };

  const showFeatureInfo = () => {
    Alert.alert(FEATURE_NOTICE.title, FEATURE_NOTICE.message, [{ text: 'Got it' }]);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Regions',
      'Remove all blur regions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setRegions([]);
            setSelectedRegionId(null);
          },
        },
      ]
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
              <Ionicons name="eye-off" size={24} color={colors.primary} />
              <Text style={styles.title}>Face Blur & Privacy</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={showFeatureInfo} style={styles.infoButton}>
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={colors.textLight}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Image Preview with Regions */}
            {imageUri && (
              <View style={styles.previewContainer}>
                <Text style={styles.sectionTitle}>Preview</Text>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: imageUri }} style={styles.preview} />
                  {/* Blur region overlays */}
                  {regions.map(region => (
                    <View
                      key={region.id}
                      style={[
                        styles.regionOverlay,
                        {
                          left: `${region.x}%`,
                          top: `${region.y}%`,
                          width: `${region.width}%`,
                          height: `${region.height}%`,
                        },
                        selectedRegionId === region.id && styles.regionSelected,
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.regionDeleteButton}
                        onPress={() => handleRemoveRegion(region.id)}
                      >
                        <Ionicons name="close-circle" size={24} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={styles.previewActions}>
                  <TouchableOpacity
                    style={styles.previewActionButton}
                    onPress={handleAddRegion}
                  >
                    <Ionicons name="add-circle" size={20} color={colors.primary} />
                    <Text style={styles.previewActionText}>Add Region</Text>
                  </TouchableOpacity>
                  {regions.length > 0 && (
                    <TouchableOpacity
                      style={styles.previewActionButton}
                      onPress={handleClearAll}
                    >
                      <Ionicons name="trash" size={20} color={colors.error} />
                      <Text style={[styles.previewActionText, { color: colors.error }]}>
                        Clear All
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Templates */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Templates</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.templatesScroll}
              >
                {Object.entries(FACE_REGION_TEMPLATES).map(([key, template]) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.templateCard}
                    onPress={() =>
                      handleSelectTemplate(key as keyof typeof FACE_REGION_TEMPLATES)
                    }
                  >
                    <View style={styles.templateIcon}>
                      <Ionicons name="people" size={24} color={colors.primary} />
                      <Text style={styles.templateCount}>
                        {template.regions.length}
                      </Text>
                    </View>
                    <Text style={styles.templateName}>{template.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Blur Presets */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Blur Style</Text>
              <View style={styles.presetsGrid}>
                {BLUR_PRESETS.map(preset => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      style={[
                        styles.presetCard,
                        isSelected && styles.presetCardSelected,
                      ]}
                      onPress={() => handleSelectPreset(preset)}
                    >
                      <Ionicons
                        name={preset.icon as any}
                        size={24}
                        color={isSelected ? colors.primary : colors.textLight}
                      />
                      <Text
                        style={[
                          styles.presetName,
                          isSelected && styles.presetNameSelected,
                        ]}
                      >
                        {preset.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Emoji Covers */}
            {selectedStyle === 'emoji' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Emoji Cover</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.emojiScroll}
                >
                  {EMOJI_COVERS.map(emoji => (
                    <TouchableOpacity key={emoji} style={styles.emojiOption}>
                      <Text style={styles.emojiText}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Privacy Tips */}
            <View style={styles.tipsCard}>
              <Ionicons name="shield-checkmark" size={20} color={colors.success} />
              <View style={styles.tipsContent}>
                <Text style={styles.tipsTitle}>Privacy Tips</Text>
                <Text style={styles.tipsText}>
                  {PRIVACY_TIPS.slice(0, 4).map((tip, i) => `• ${tip}`).join('\n')}
                </Text>
              </View>
            </View>

            {/* Stats */}
            {regions.length > 0 && (
              <View style={styles.statsCard}>
                <Text style={styles.statsText}>
                  {regions.length} {regions.length === 1 ? 'region' : 'regions'} selected
                </Text>
                <Text style={styles.statsSubtext}>
                  Style: {selectedPreset.name} • Intensity: {selectedPreset.intensity}/10
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.applyButton, isProcessing && styles.applyButtonDisabled]}
              onPress={handleApply}
              disabled={isProcessing || !imageUri}
            >
              <Ionicons
                name={isProcessing ? 'hourglass' : 'checkmark-circle'}
                size={24}
                color={colors.white}
              />
              <Text style={styles.applyButtonText}>
                {isProcessing ? 'Processing...' : 'Apply Blur'}
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
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  infoButton: {
    padding: 4,
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
  previewContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  preview: {
    width: '100%',
    height: PREVIEW_WIDTH * 0.75,
    resizeMode: 'contain',
  },
  regionOverlay: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionSelected: {
    borderColor: colors.success,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    borderWidth: 3,
  },
  regionDeleteButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  previewActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  previewActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  templatesScroll: {
    gap: 12,
  },
  templateCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  templateCount: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  templateName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetCard: {
    width: '30%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetCardSelected: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  presetName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  presetNameSelected: {
    color: colors.primary,
  },
  emojiScroll: {
    gap: 10,
  },
  emojiOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  emojiText: {
    fontSize: 32,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.success}10`,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 16,
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
  statsCard: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  statsSubtext: {
    fontSize: 12,
    color: colors.textLight,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  applyButtonDisabled: {
    opacity: 0.6,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
