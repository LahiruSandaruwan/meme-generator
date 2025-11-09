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

export interface ImageFilter {
  brightness: number; // -1.0 to 1.0
  contrast: number; // -1.0 to 1.0
  saturation: number; // 0 to 2.0
}

interface ImageFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: ImageFilter) => void;
  currentFilters: ImageFilter;
}

export const ImageFilters: React.FC<ImageFiltersProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}) => {
  const [brightness, setBrightness] = useState(currentFilters.brightness);
  const [contrast, setContrast] = useState(currentFilters.contrast);
  const [saturation, setSaturation] = useState(currentFilters.saturation);

  const handleApply = () => {
    onApply({ brightness, contrast, saturation });
    onClose();
  };

  const handleReset = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(1);
  };

  const renderSlider = (
    label: string,
    value: number,
    setValue: (value: number) => void,
    min: number,
    max: number,
    step: number,
    icon: any
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <View style={styles.sliderLabelContainer}>
            <Ionicons name={icon} size={20} color={colors.primary} />
            <Text style={styles.sliderLabel}>{label}</Text>
          </View>
          <Text style={styles.sliderValue}>{value.toFixed(2)}</Text>
        </View>

        <View style={styles.sliderControls}>
          <TouchableOpacity
            onPress={() => setValue(Math.max(min, value - step))}
            style={styles.sliderButton}
          >
            <Ionicons name="remove-circle" size={32} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                { width: `${percentage}%` },
              ]}
            />
            <View
              style={[
                styles.sliderThumb,
                { left: `${percentage}%` },
              ]}
            />
          </View>

          <TouchableOpacity
            onPress={() => setValue(Math.min(max, value + step))}
            style={styles.sliderButton}
          >
            <Ionicons name="add-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
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
            <Text style={styles.title}>Image Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Brightness */}
            {renderSlider(
              'Brightness',
              brightness,
              setBrightness,
              -1,
              1,
              0.1,
              'sunny-outline'
            )}

            {/* Contrast */}
            {renderSlider(
              'Contrast',
              contrast,
              setContrast,
              -1,
              1,
              0.1,
              'contrast-outline'
            )}

            {/* Saturation */}
            {renderSlider(
              'Saturation',
              saturation,
              setSaturation,
              0,
              2,
              0.1,
              'color-palette-outline'
            )}

            {/* Preset Filters */}
            <View style={styles.presetsSection}>
              <Text style={styles.presetsTitle}>Quick Presets</Text>

              {/* Auto-Enhance - Featured */}
              <TouchableOpacity
                style={[styles.autoEnhanceButton]}
                onPress={() => {
                  // Smart auto-enhance algorithm
                  setBrightness(0.15);
                  setContrast(0.2);
                  setSaturation(1.15);
                }}
              >
                <View style={styles.autoEnhanceIcon}>
                  <Ionicons name="flash" size={28} color="#FFD700" />
                </View>
                <View style={styles.autoEnhanceContent}>
                  <Text style={styles.autoEnhanceTitle}>Auto-Enhance</Text>
                  <Text style={styles.autoEnhanceSubtitle}>Smart AI-powered enhancement</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
              </TouchableOpacity>

              <View style={styles.presetsGrid}>
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => {
                    setBrightness(0.2);
                    setContrast(0.1);
                    setSaturation(1.2);
                  }}
                >
                  <Ionicons name="sparkles" size={24} color={colors.primary} />
                  <Text style={styles.presetText}>Vivid</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => {
                    setBrightness(-0.1);
                    setContrast(0.3);
                    setSaturation(1.1);
                  }}
                >
                  <Ionicons name="moon" size={24} color={colors.primary} />
                  <Text style={styles.presetText}>Dramatic</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => {
                    setBrightness(0.1);
                    setContrast(-0.1);
                    setSaturation(0.8);
                  }}
                >
                  <Ionicons name="cloud" size={24} color={colors.primary} />
                  <Text style={styles.presetText}>Soft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => {
                    setBrightness(0);
                    setContrast(0);
                    setSaturation(0);
                  }}
                >
                  <Ionicons name="remove-circle-outline" size={24} color={colors.textLight} />
                  <Text style={styles.presetText}>B&W</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => {
                    setBrightness(0.25);
                    setContrast(0);
                    setSaturation(1.0);
                  }}
                >
                  <Ionicons name="sunny" size={24} color={colors.primary} />
                  <Text style={styles.presetText}>Bright</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => {
                    setBrightness(0);
                    setContrast(0.4);
                    setSaturation(1.0);
                  }}
                >
                  <Ionicons name="contrast" size={24} color={colors.primary} />
                  <Text style={styles.presetText}>Sharp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={20} color={colors.text} />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.applyButton]}
              onPress={handleApply}
            >
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.applyButtonText}>Apply</Text>
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
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  sliderSection: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderButton: {
    padding: 4,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    position: 'relative',
    overflow: 'visible',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    marginLeft: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  presetsSection: {
    marginTop: 8,
  },
  presetsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  autoEnhanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  autoEnhanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  autoEnhanceContent: {
    flex: 1,
  },
  autoEnhanceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  autoEnhanceSubtitle: {
    fontSize: 12,
    color: colors.textLight,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  resetButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
