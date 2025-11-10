import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  MULTI_PANEL_LAYOUTS,
  getPopularLayouts,
  type LayoutType,
  type MultiPanelLayout,
} from '../utils/multiPanelLayouts';

interface LayoutSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectLayout: (layoutType: LayoutType) => void;
  currentLayout?: LayoutType;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  visible,
  onClose,
  onSelectLayout,
  currentLayout = '1x1',
}) => {
  const [selectedTab, setSelectedTab] = useState<'popular' | 'all'>('popular');

  const popularLayouts = getPopularLayouts();
  const displayedLayouts = selectedTab === 'popular' ? popularLayouts : MULTI_PANEL_LAYOUTS;

  const handleSelectLayout = (layoutType: LayoutType) => {
    onSelectLayout(layoutType);
    onClose();
  };

  const renderLayoutPreview = (layout: MultiPanelLayout) => {
    const previewSize = 100;
    const borderWidth = 1;

    return (
      <View
        style={[
          styles.layoutPreview,
          { width: previewSize, height: previewSize },
        ]}
      >
        {layout.panels.map((panel, index) => (
          <View
            key={index}
            style={[
              styles.panelPreview,
              {
                width: `${panel.width}%`,
                height: `${panel.height}%`,
                left: `${panel.x}%`,
                top: `${panel.y}%`,
                borderWidth,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderLayoutCard = (layout: MultiPanelLayout) => {
    const isSelected = currentLayout === layout.type;

    return (
      <TouchableOpacity
        key={layout.type}
        style={[
          styles.layoutCard,
          isSelected && styles.layoutCardSelected,
        ]}
        onPress={() => handleSelectLayout(layout.type)}
        activeOpacity={0.7}
      >
        {renderLayoutPreview(layout)}
        <View style={styles.layoutInfo}>
          <Text style={styles.layoutName}>{layout.name}</Text>
          <Text style={styles.layoutDescription}>{layout.description}</Text>
          <View style={styles.layoutMeta}>
            <Ionicons name="grid-outline" size={14} color={colors.textLight} />
            <Text style={styles.layoutMetaText}>
              {layout.rows}x{layout.cols} ({layout.panels.length} panels)
            </Text>
          </View>
        </View>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
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
              <Ionicons name="grid" size={24} color={colors.primary} />
              <Text style={styles.title}>Choose Layout</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'popular' && styles.activeTab]}
              onPress={() => setSelectedTab('popular')}
            >
              <Ionicons
                name="star"
                size={20}
                color={selectedTab === 'popular' ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'popular' && styles.activeTabText,
                ]}
              >
                Popular
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
              onPress={() => setSelectedTab('all')}
            >
              <Ionicons
                name="apps"
                size={20}
                color={selectedTab === 'all' ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'all' && styles.activeTabText,
                ]}
              >
                All Layouts
              </Text>
            </TouchableOpacity>
          </View>

          {/* Layouts Grid */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.layoutsGrid}>
              {displayedLayouts.map(layout => renderLayoutCard(layout))}
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={24} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Multi-Panel Memes</Text>
                  <Text style={styles.infoText}>
                    Create complex memes with multiple panels. Each panel can have its own image and text.
                  </Text>
                </View>
              </View>

              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.tipText}>Add different images to each panel</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.tipText}>Customize text independently</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.tipText}>Perfect for before/after comparisons</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.tipText}>Great for storytelling memes</Text>
                </View>
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
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  layoutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  layoutCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  layoutCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  layoutPreview: {
    backgroundColor: colors.white,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  panelPreview: {
    position: 'absolute',
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  layoutInfo: {
    gap: 4,
  },
  layoutName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  layoutDescription: {
    fontSize: 12,
    color: colors.textLight,
  },
  layoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  layoutMetaText: {
    fontSize: 11,
    color: colors.textLight,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  infoSection: {
    marginTop: 24,
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
  },
  tipText: {
    fontSize: 13,
    color: colors.text,
  },
});
