import React, { useState, useMemo, useEffect } from 'react';
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
  FONT_CATEGORIES,
  fonts,
  getFontsByCategory,
  searchFonts,
  getPopularFonts,
  getFontById,
  Font,
} from '../utils/fontData';
import {
  getRecentlyUsedFonts,
  addRecentlyUsedFont,
  getFavoriteFonts,
  toggleFavoriteFont,
} from '../utils/fontPreferences';

interface FontPickerProps {
  visible: boolean;
  onClose: () => void;
  onFontSelect: (font: Font) => void;
  currentFontId?: string;
}

export const FontPicker: React.FC<FontPickerProps> = ({
  visible,
  onClose,
  onFontSelect,
  currentFontId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Meme');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentFontIds, setRecentFontIds] = useState<string[]>([]);
  const [favoriteFontIds, setFavoriteFontIds] = useState<string[]>([]);
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());

  // Load recent and favorite fonts
  useEffect(() => {
    if (visible) {
      loadFontPreferences();
    }
  }, [visible]);

  const loadFontPreferences = async () => {
    const recent = await getRecentlyUsedFonts();
    const favorites = await getFavoriteFonts();
    setRecentFontIds(recent);
    setFavoriteFontIds(favorites);
    setLocalFavorites(new Set(favorites));
  };

  const recentFonts = useMemo(() => {
    return recentFontIds.map(id => getFontById(id)).filter(Boolean) as Font[];
  }, [recentFontIds]);

  const favoriteFonts = useMemo(() => {
    return favoriteFontIds.map(id => getFontById(id)).filter(Boolean) as Font[];
  }, [favoriteFontIds]);

  const popularFonts = useMemo(() => getPopularFonts(), []);

  const displayedFonts = useMemo(() => {
    if (searchQuery.trim()) {
      return searchFonts(searchQuery);
    }
    return getFontsByCategory(selectedCategory);
  }, [selectedCategory, searchQuery]);

  const handleFontPress = async (font: Font) => {
    await addRecentlyUsedFont(font.id);
    onFontSelect(font);
    onClose();
  };

  const handleToggleFavorite = async (fontId: string, event: any) => {
    event.stopPropagation();
    const newState = await toggleFavoriteFont(fontId);

    // Update local state immediately for UI responsiveness
    setLocalFavorites(prev => {
      const newSet = new Set(prev);
      if (newState) {
        newSet.add(fontId);
      } else {
        newSet.delete(fontId);
      }
      return newSet;
    });

    // Reload preferences
    await loadFontPreferences();
  };

  const renderFontItem = (item: Font, showFavoriteButton: boolean = true) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.fontItem,
        currentFontId === item.id && styles.fontItemSelected,
      ]}
      onPress={() => handleFontPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.fontItemContent}>
        <View style={styles.fontHeader}>
          <Text style={styles.fontName}>{item.name}</Text>
          {showFavoriteButton && (
            <TouchableOpacity
              onPress={(e) => handleToggleFavorite(item.id, e)}
              style={styles.favoriteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={localFavorites.has(item.id) ? 'star' : 'star-outline'}
                size={20}
                color={localFavorites.has(item.id) ? '#FFD700' : colors.textLight}
              />
            </TouchableOpacity>
          )}
        </View>
        {item.description && (
          <Text style={styles.fontDescription}>{item.description}</Text>
        )}
        <Text
          style={[
            styles.fontPreview,
            item.family !== 'System' && { fontFamily: item.family },
          ]}
        >
          {item.preview}
        </Text>
      </View>
      {currentFontId === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  const renderSection = (title: string, fonts: Font[], icon: string) => {
    if (fonts.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCount}>({fonts.length})</Text>
        </View>
        <View style={styles.sectionContent}>
          {fonts.map(font => renderFontItem(font))}
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
            <View>
              <Text style={styles.title}>Choose Font</Text>
              <Text style={styles.subtitle}>{fonts.length} fonts available</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search fonts..."
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
              {FONT_CATEGORIES.map((category) => (
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

          {/* Fonts List */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {!searchQuery && (
              <>
                {/* Recently Used Section */}
                {renderSection('Recently Used', recentFonts, 'time')}

                {/* Favorites Section */}
                {renderSection('Favorites', favoriteFonts, 'star')}

                {/* Popular Fonts Section */}
                {selectedCategory === 'Meme' && renderSection('Popular', popularFonts, 'trending-up')}
              </>
            )}

            {/* Main Font List or Search Results */}
            <View style={styles.section}>
              {searchQuery && (
                <View style={styles.sectionHeader}>
                  <Ionicons name="search" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Search Results</Text>
                  <Text style={styles.sectionCount}>({displayedFonts.length})</Text>
                </View>
              )}
              {!searchQuery && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{selectedCategory} Fonts</Text>
                  <Text style={styles.sectionCount}>({displayedFonts.length})</Text>
                </View>
              )}
              <View style={styles.sectionContent}>
                {displayedFonts.length > 0 ? (
                  displayedFonts.map(font => renderFontItem(font))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="text-outline" size={48} color={colors.textLight} />
                    <Text style={styles.emptyText}>No fonts found</Text>
                    <Text style={styles.emptySubtext}>Try a different search term</Text>
                  </View>
                )}
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
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  sectionContent: {
    gap: 12,
  },
  fontItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fontItemSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  fontItemContent: {
    flex: 1,
    gap: 6,
  },
  fontHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fontName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 8,
  },
  fontDescription: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  fontPreview: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
    marginTop: 4,
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
