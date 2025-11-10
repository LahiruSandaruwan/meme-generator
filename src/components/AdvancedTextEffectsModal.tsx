/**
 * Advanced Text Effects Modal
 * Modal for selecting and customizing advanced text effects
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
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import {
  AdvancedEffect,
  AdvancedTextStyle,
  TEXT_EFFECT_CATEGORIES,
  EFFECT_PRESETS,
  PRESET_TEXT_STYLES,
  POPULAR_COMBINATIONS,
  getEffectName,
  getEffectDescription,
  applyEffect,
  isGradientEffect,
  getGradientColors,
  getPrimaryColor,
} from '../utils/advancedTextEffects';

interface AdvancedTextEffectsModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyEffect: (style: Partial<AdvancedTextStyle>) => void;
  currentEffect?: AdvancedEffect;
}

type Tab = 'effects' | 'presets' | 'popular';

export const AdvancedTextEffectsModal: React.FC<AdvancedTextEffectsModalProps> = ({
  visible,
  onClose,
  onApplyEffect,
  currentEffect = 'none',
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('effects');
  const [selectedEffect, setSelectedEffect] = useState<AdvancedEffect>(currentEffect);

  const handleApply = () => {
    const effectStyle = applyEffect(selectedEffect);
    onApplyEffect(effectStyle);
    onClose();
  };

  const handlePresetSelect = (preset: AdvancedTextStyle) => {
    onApplyEffect(preset);
    onClose();
  };

  const renderEffectPreview = (effect: AdvancedEffect) => {
    const isGradient = isGradientEffect(effect);
    const gradientColors = getGradientColors(effect);
    const primaryColor = getPrimaryColor(effect);

    if (isGradient && gradientColors) {
      return (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.effectPreviewGradient}
        >
          <Text style={styles.effectPreviewText}>Aa</Text>
        </LinearGradient>
      );
    }

    return (
      <View style={[styles.effectPreview, { backgroundColor: primaryColor }]}>
        <Text style={styles.effectPreviewText}>Aa</Text>
      </View>
    );
  };

  const renderEffectsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {TEXT_EFFECT_CATEGORIES.map((category) => (
        <View key={category.id} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Ionicons name={category.icon as any} size={20} color={colors.primary} />
            <Text style={styles.categoryTitle}>{category.name}</Text>
          </View>
          <View style={styles.effectGrid}>
            {category.effects.map((effect) => (
              <TouchableOpacity
                key={effect}
                style={[
                  styles.effectCard,
                  selectedEffect === effect && styles.effectCardSelected,
                ]}
                onPress={() => setSelectedEffect(effect)}
              >
                {renderEffectPreview(effect)}
                <Text style={styles.effectLabel}>{getEffectName(effect)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Text Effect Tips</Text>
          <Text style={styles.infoText}>
            Advanced effects work best with large, bold text. Experiment with different styles to make your memes stand out!
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderPresetsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Preset Styles</Text>
      <Text style={styles.sectionSubtitle}>
        One-tap styling for instant results
      </Text>

      <View style={styles.presetGrid}>
        {PRESET_TEXT_STYLES.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={styles.presetCard}
            onPress={() => handlePresetSelect(preset)}
          >
            <View style={styles.presetPreview}>
              {renderEffectPreview(preset.effect)}
            </View>
            <Text style={styles.presetName}>{preset.name}</Text>
            <Text style={styles.presetDescription}>
              {getEffectDescription(preset.effect)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderPopularTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Popular Combinations</Text>
      <Text style={styles.sectionSubtitle}>
        Trending styles used by top meme creators
      </Text>

      <View style={styles.popularList}>
        {POPULAR_COMBINATIONS.map((combo, index) => (
          <TouchableOpacity
            key={index}
            style={styles.popularCard}
            onPress={() => handlePresetSelect(combo.style)}
          >
            <View style={styles.popularPreview}>
              {renderEffectPreview(combo.style.effect)}
            </View>
            <View style={styles.popularContent}>
              <Text style={styles.popularName}>{combo.name}</Text>
              <Text style={styles.popularDescription}>
                {getEffectDescription(combo.style.effect)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Pro Tips */}
      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Ionicons name="bulb" size={24} color={colors.warning} />
          <Text style={styles.tipsTitle}>Pro Tips</Text>
        </View>
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.tipText}>Use neon effects for dark backgrounds</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.tipText}>Gradient text works best in uppercase</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.tipText}>Retro effects shine with bold fonts</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.tipText}>Comic style needs large font sizes</Text>
          </View>
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
              <Ionicons name="sparkles" size={24} color={colors.primary} />
              <Text style={styles.title}>Text Effects</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'effects' && styles.tabActive]}
              onPress={() => setActiveTab('effects')}
            >
              <Ionicons
                name="color-palette"
                size={20}
                color={activeTab === 'effects' ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'effects' && styles.tabTextActive,
                ]}
              >
                Effects
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
                Presets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'popular' && styles.tabActive]}
              onPress={() => setActiveTab('popular')}
            >
              <Ionicons
                name="trending-up"
                size={20}
                color={activeTab === 'popular' ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'popular' && styles.tabTextActive,
                ]}
              >
                Popular
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.content}>
            {activeTab === 'effects' && renderEffectsTab()}
            {activeTab === 'presets' && renderPresetsTab()}
            {activeTab === 'popular' && renderPopularTab()}
          </View>

          {/* Footer */}
          {activeTab === 'effects' && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
              >
                <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                <Text style={styles.applyButtonText}>Apply Effect</Text>
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
  effectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  effectCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  effectCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  effectPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  effectPreviewGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  effectPreviewText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
  },
  effectLabel: {
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 16,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  presetPreview: {
    marginBottom: 12,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  presetDescription: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
  },
  popularList: {
    gap: 12,
  },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  popularPreview: {
    width: 60,
    height: 60,
  },
  popularContent: {
    flex: 1,
  },
  popularName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  popularDescription: {
    fontSize: 13,
    color: colors.textLight,
  },
  tipsCard: {
    backgroundColor: `${colors.warning}10`,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 16,
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
