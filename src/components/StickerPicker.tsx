import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  STICKER_CATEGORIES,
  stickers,
  getStickersByCategory,
  searchStickers,
  Sticker,
} from '../utils/stickerData';

interface StickerPickerProps {
  visible: boolean;
  onClose: () => void;
  onStickerSelect: (sticker: Sticker) => void;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({
  visible,
  onClose,
  onStickerSelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [searchQuery, setSearchQuery] = useState('');

  const displayedStickers = useMemo(() => {
    if (searchQuery.trim()) {
      return searchStickers(searchQuery);
    }
    return getStickersByCategory(selectedCategory);
  }, [selectedCategory, searchQuery]);

  const handleStickerPress = (sticker: Sticker) => {
    onStickerSelect(sticker);
    onClose();
  };

  const renderSticker = ({ item }: { item: Sticker }) => (
    <TouchableOpacity
      style={styles.stickerItem}
      onPress={() => handleStickerPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.stickerEmoji}>{item.emoji}</Text>
    </TouchableOpacity>
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
            <Text style={styles.title}>Add Sticker</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search stickers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textLight}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Tabs */}
          {!searchQuery && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
              contentContainerStyle={styles.categoryContent}
            >
              {STICKER_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTab,
                    selectedCategory === category && styles.categoryTabActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category && styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Stickers Grid */}
          <FlatList
            data={displayedStickers}
            renderItem={renderSticker}
            keyExtractor={(item) => item.id}
            numColumns={6}
            contentContainerStyle={styles.stickerGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="sad-outline" size={48} color={colors.textLight} />
                <Text style={styles.emptyText}>No stickers found</Text>
                <Text style={styles.emptySubtext}>Try a different search term</Text>
              </View>
            }
          />
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
    paddingBottom: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  categoryContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.white,
  },
  stickerGrid: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  stickerItem: {
    width: '16.666%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  stickerEmoji: {
    fontSize: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
  },
});
