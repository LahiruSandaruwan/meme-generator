/**
 * Background Removal Modal
 * UI for removing backgrounds from images
 * Provides presets and manual controls
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  RemovalMode,
  BackgroundRemovalOptions,
  REMOVAL_PRESETS,
  DEFAULT_REMOVAL_OPTIONS,
  removeBackground,
  REMOVAL_TIPS,
  FEATURE_NOTICE,
  BACKGROUND_REPLACEMENTS,
} from '../utils/backgroundRemoval';

interface BackgroundRemovalModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onApply: (processedUri: string) => void;
}

export const BackgroundRemovalModal: React.FC<BackgroundRemovalModalProps> = ({
  visible,
  imageUri,
  onClose,
  onApply,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(REMOVAL_PRESETS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState<BackgroundRemovalOptions>(
    DEFAULT_REMOVAL_OPTIONS
  );

  const handleSelectPreset = (preset: typeof REMOVAL_PRESETS[0]) => {
    setSelectedPreset(preset);
    setOptions(preset.options);
  };

  const handleApply = async () => {
    if (!imageUri) return;

    try {
      setIsProcessing(true);

      // Process image with selected options
      const processedUri = await removeBackground(imageUri, options);

      setIsProcessing(false);
      onApply(processedUri);
      onClose();
    } catch (error) {
      console.error('Error applying background removal:', error);
      setIsProcessing(false);
      Alert.alert(
        'Processing Error',
        'Failed to process image. Please try again or use a different preset.'
      );
    }
  };

  const showFeatureInfo = () => {
    Alert.alert(
      FEATURE_NOTICE.title,
      FEATURE_NOTICE.message,
      [
        {
          text: 'Got it',
          style: 'default',
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
              <Ionicons name="cut" size={24} color={colors.primary} />
              <Text style={styles.title}>Background Removal</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={showFeatureInfo}
                style={styles.infoButton}
              >
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
            {/* Image Preview */}
            {imageUri && (
              <View style={styles.previewContainer}>
                <Text style={styles.sectionTitle}>Preview</Text>
                <Image source={{ uri: imageUri }} style={styles.preview} />
              </View>
            )}

            {/* Removal Presets */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Removal Method</Text>
              <View style={styles.presetsGrid}>
                {REMOVAL_PRESETS.map(preset => {
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
                      <View style={styles.presetIcon}>
                        <Ionicons
                          name={preset.icon as any}
                          size={28}
                          color={isSelected ? colors.primary : colors.textLight}
                        />
                      </View>
                      <Text
                        style={[
                          styles.presetName,
                          isSelected && styles.presetNameSelected,
                        ]}
                      >
                        {preset.name}
                      </Text>
                      <Text style={styles.presetDescription}>
                        {preset.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Background Replacement Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Replace With</Text>
              <View style={styles.replacementGrid}>
                {BACKGROUND_REPLACEMENTS.map(replacement => (
                  <TouchableOpacity
                    key={replacement.id}
                    style={styles.replacementOption}
                  >
                    <View
                      style={[
                        styles.replacementPreview,
                        {
                          backgroundColor:
                            replacement.value === 'transparent'
                              ? colors.background
                              : replacement.value === 'blur' ||
                                replacement.value === 'gradient'
                              ? colors.primary
                              : replacement.value,
                        },
                      ]}
                    >
                      {replacement.value === 'transparent' && (
                        <Ionicons
                          name="square-outline"
                          size={24}
                          color={colors.textLight}
                        />
                      )}
                    </View>
                    <Text style={styles.replacementName}>{replacement.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tips */}
            <View style={styles.tipsCard}>
              <Ionicons name="bulb" size={20} color={colors.warning} />
              <View style={styles.tipsContent}>
                <Text style={styles.tipsTitle}>Tips for Best Results</Text>
                <Text style={styles.tipsText}>
                  {REMOVAL_TIPS.map((tip, index) => `• ${tip}`).join('\n')}
                </Text>
              </View>
            </View>

            {/* Info Notice */}
            <View style={styles.noticeCard}>
              <Ionicons
                name="information-circle"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.noticeText}>
                This feature uses color-based removal for images with solid
                backgrounds. For advanced AI removal, see info above.
              </Text>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              disabled={isProcessing || !imageUri}
            >
              {isProcessing ? (
                <>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.applyButtonText}>Processing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark" size={24} color={colors.white} />
                  <Text style={styles.applyButtonText}>Apply Removal</Text>
                </>
              )}
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
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.background,
    resizeMode: 'contain',
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
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetCardSelected: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  presetIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  presetNameSelected: {
    color: colors.primary,
  },
  presetDescription: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 14,
  },
  replacementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  replacementOption: {
    alignItems: 'center',
    gap: 6,
  },
  replacementPreview: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  replacementName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.warning}10`,
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
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
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
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
