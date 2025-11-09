import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { colors } from '../constants/colors';
import { SavedMeme } from '../types';
import { getSavedMemes, deleteMeme, incrementMemeViewCount, resetMemeViewCount } from '../utils/storage';
import { CustomButton } from '../components/CustomButton';
import { adManager } from '../utils/adManager';
import {
  getAllMemesWithMetadata,
  toggleFavorite,
  getFavorites,
  createFolder,
  getFolders,
  moveMemeToFolder,
  addTagToMeme,
  removeTagFromMeme,
  getAllTags,
  searchMemes,
  MemeMetadata,
  Folder,
} from '../utils/memeDatabase';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

type ViewMode = 'all' | 'favorites' | 'folders';
type SortMode = 'recent' | 'views' | 'favorites';

const GalleryScreen: React.FC = () => {
  const [memes, setMemes] = useState<SavedMeme[]>([]);
  const [metadata, setMetadata] = useState<MemeMetadata[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<SavedMeme | null>(null);
  const [selectedMetadata, setSelectedMetadata] = useState<MemeMetadata | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const loadMemes = async () => {
    try {
      setIsLoading(true);
      const savedMemes = await getSavedMemes();
      const memesMetadata = await getAllMemesWithMetadata();
      const foldersList = await getFolders();
      setMemes(savedMemes);
      setMetadata(memesMetadata);
      setFolders(foldersList);
    } catch (error) {
      if (__DEV__) { console.error('Error loading memes:', error); }
      Alert.alert('Error', 'Failed to load your memes');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMemes();
    }, [])
  );

  const getFilteredMemes = () => {
    let filtered = [...memes];

    // Apply search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((meme) => {
        const meta = metadata.find((m) => m.uri === meme.uri);
        return (
          meta?.templateName?.toLowerCase().includes(lowerQuery) ||
          meta?.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      });
    }

    // Apply view mode
    if (viewMode === 'favorites') {
      filtered = filtered.filter((meme) => {
        const meta = metadata.find((m) => m.uri === meme.uri);
        return meta?.isFavorite;
      });
    } else if (viewMode === 'folders' && selectedFolder) {
      filtered = filtered.filter((meme) => {
        const meta = metadata.find((m) => m.uri === meme.uri);
        return meta?.folderId === selectedFolder.id;
      });
    }

    // Apply sort
    filtered.sort((a, b) => {
      const metaA = metadata.find((m) => m.uri === a.uri);
      const metaB = metadata.find((m) => m.uri === b.uri);

      if (sortMode === 'recent') {
        return (metaB?.timestamp || 0) - (metaA?.timestamp || 0);
      } else if (sortMode === 'views') {
        return (metaB?.views || 0) - (metaA?.views || 0);
      } else if (sortMode === 'favorites') {
        if (metaA?.isFavorite && !metaB?.isFavorite) return -1;
        if (!metaA?.isFavorite && metaB?.isFavorite) return 1;
        return (metaB?.timestamp || 0) - (metaA?.timestamp || 0);
      }
      return 0;
    });

    return filtered;
  };

  const handleMemePress = async (meme: SavedMeme) => {
    const meta = metadata.find((m) => m.uri === meme.uri);
    setSelectedMeme(meme);
    setSelectedMetadata(meta || null);
    setModalVisible(true);

    // Track view count and show interstitial ad after every 3 views
    const viewCount = await incrementMemeViewCount();
    if (viewCount % 3 === 0) {
      setTimeout(() => {
        adManager.showInterstitialAd();
        resetMemeViewCount();
      }, 1000);
    }
  };

  const handleToggleFavorite = async () => {
    if (!selectedMetadata) return;
    try {
      await toggleFavorite(selectedMetadata.id);
      await loadMemes();
      const updatedMeta = metadata.find((m) => m.id === selectedMetadata.id);
      if (updatedMeta) {
        setSelectedMetadata(updatedMeta);
      }
    } catch (error) {
      if (__DEV__) { console.error('Error toggling favorite:', error); }
    }
  };

  const handleDeleteMeme = async (meme: SavedMeme) => {
    Alert.alert(
      'Delete Meme',
      'Are you sure you want to delete this meme?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMeme(meme.id);
              await loadMemes();
              setModalVisible(false);
              Alert.alert('Success', 'Meme deleted successfully');
            } catch (error) {
              if (__DEV__) { console.error('Error deleting meme:', error); }
              Alert.alert('Error', 'Failed to delete meme');
            }
          },
        },
      ]
    );
  };

  const handleShareMeme = async (meme: SavedMeme) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(meme.uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share your meme',
      });

      // Show interstitial ad after sharing
      setTimeout(() => {
        adManager.showInterstitialAd();
      }, 500);
    } catch (error) {
      if (__DEV__) { console.error('Error sharing meme:', error); }
      Alert.alert('Error', 'Failed to share meme');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }
    try {
      await createFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderDialog(false);
      await loadMemes();
      Alert.alert('Success', 'Folder created successfully');
    } catch (error) {
      if (__DEV__) { console.error('Error creating folder:', error); }
      Alert.alert('Error', 'Failed to create folder');
    }
  };

  const handleMoveToFolder = async (folderId: string) => {
    if (!selectedMetadata) return;
    try {
      await moveMemeToFolder(selectedMetadata.id, folderId);
      await loadMemes();
      setShowFolderSelector(false);
      Alert.alert('Success', 'Meme moved to folder');
    } catch (error) {
      if (__DEV__) { console.error('Error moving to folder:', error); }
      Alert.alert('Error', 'Failed to move meme');
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim() || !selectedMetadata) return;
    try {
      await addTagToMeme(selectedMetadata.id, newTag.trim());
      setNewTag('');
      await loadMemes();
      const updatedMeta = metadata.find((m) => m.id === selectedMetadata.id);
      if (updatedMeta) {
        setSelectedMetadata(updatedMeta);
      }
    } catch (error) {
      if (__DEV__) { console.error('Error adding tag:', error); }
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!selectedMetadata) return;
    try {
      await removeTagFromMeme(selectedMetadata.id, tag);
      await loadMemes();
      const updatedMeta = metadata.find((m) => m.id === selectedMetadata.id);
      if (updatedMeta) {
        setSelectedMetadata(updatedMeta);
      }
    } catch (error) {
      if (__DEV__) { console.error('Error removing tag:', error); }
    }
  };

  const handleFolderPress = (folder: Folder) => {
    setSelectedFolder(folder);
    setViewMode('folders');
  };

  const handleBackFromFolder = () => {
    setSelectedFolder(null);
  };

  const renderMemeItem = ({ item }: { item: SavedMeme }) => {
    const meta = metadata.find((m) => m.uri === item.uri);
    const isFavorite = meta?.isFavorite || false;

    return (
      <TouchableOpacity
        style={styles.memeItem}
        onPress={() => handleMemePress(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.uri }} style={styles.memeImage} resizeMode="cover" />

        {/* Favorite Badge */}
        {isFavorite && (
          <View style={styles.favoriteBadge}>
            <Ionicons name="heart" size={20} color="#FF4081" />
          </View>
        )}

        {/* Tags */}
        {meta && meta.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <View style={styles.tagBadge}>
              <Ionicons name="pricetag" size={10} color={colors.white} />
              <Text style={styles.tagCount}>{meta.tags.length}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFolderItem = ({ item }: { item: Folder }) => {
    const folderMemes = memes.filter((meme) => {
      const meta = metadata.find((m) => m.uri === meme.uri);
      return meta?.folderId === item.id;
    });
    const coverUri = folderMemes[0]?.uri;

    return (
      <TouchableOpacity
        style={styles.folderItem}
        onPress={() => handleFolderPress(item)}
        activeOpacity={0.8}
      >
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.folderCover} resizeMode="cover" />
        ) : (
          <View style={styles.emptyFolderCover}>
            <Ionicons name="folder-open-outline" size={60} color={colors.textLight} />
          </View>
        )}

        <View style={styles.folderInfo}>
          <Text style={styles.folderName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.folderCount}>{folderMemes.length} memes</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or tags..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textLight}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* View Mode Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'all' && styles.tabActive]}
          onPress={() => {
            setViewMode('all');
            setSelectedFolder(null);
          }}
        >
          <Text style={[styles.tabText, viewMode === 'all' && styles.tabTextActive]}>
            All ({memes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'favorites' && styles.tabActive]}
          onPress={() => {
            setViewMode('favorites');
            setSelectedFolder(null);
          }}
        >
          <Text style={[styles.tabText, viewMode === 'favorites' && styles.tabTextActive]}>
            Favorites ({metadata.filter((m) => m.isFavorite).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'folders' && styles.tabActive]}
          onPress={() => {
            setViewMode('folders');
            setSelectedFolder(null);
          }}
        >
          <Text style={[styles.tabText, viewMode === 'folders' && styles.tabTextActive]}>
            Folders ({folders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort and Actions Bar */}
      {viewMode !== 'folders' || selectedFolder ? (
        <View style={styles.actionsBar}>
          {selectedFolder ? (
            <>
              <TouchableOpacity style={styles.backButton} onPress={handleBackFromFolder}>
                <Ionicons name="arrow-back" size={20} color={colors.primary} />
                <Text style={styles.backText}>Back to Folders</Text>
              </TouchableOpacity>
              <Text style={styles.folderTitle}>{selectedFolder.name}</Text>
            </>
          ) : (
            <>
              <Text style={styles.resultCount}>
                {getFilteredMemes().length} memes
              </Text>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setShowSortMenu(true)}
              >
                <Ionicons name="filter" size={18} color={colors.primary} />
                <Text style={styles.sortText}>
                  {sortMode === 'recent' ? 'Recent' : sortMode === 'views' ? 'Most Viewed' : 'Favorites'}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.primary} />
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : null}

      {/* Create Folder Button */}
      {viewMode === 'folders' && !selectedFolder && (
        <TouchableOpacity
          style={styles.createFolderButton}
          onPress={() => setShowNewFolderDialog(true)}
        >
          <Ionicons name="add-circle" size={20} color={colors.white} />
          <Text style={styles.createFolderText}>Create New Folder</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => {
    if (viewMode === 'folders' && !selectedFolder) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={80} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No folders yet!</Text>
          <Text style={styles.emptyDescription}>
            Create folders to organize your memes
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name="images-outline" size={80} color={colors.textLight} />
        <Text style={styles.emptyTitle}>
          {viewMode === 'favorites' ? 'No favorites yet!' : 'No memes yet!'}
        </Text>
        <Text style={styles.emptyDescription}>
          {viewMode === 'favorites'
            ? 'Tap the heart icon to add memes to favorites'
            : 'Create your first meme and it will appear here'}
        </Text>
      </View>
    );
  };

  const filteredMemes = getFilteredMemes();

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your memes...</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader}
          data={viewMode === 'folders' && !selectedFolder ? folders : filteredMemes}
          renderItem={viewMode === 'folders' && !selectedFolder ? renderFolderItem : renderMemeItem}
          keyExtractor={(item) => 'id' in item ? item.id : (item as SavedMeme).uri}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.listContent,
            (viewMode === 'folders' && !selectedFolder ? folders.length === 0 : filteredMemes.length === 0) && styles.emptyListContent,
          ]}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Sort Menu Modal */}
      <Modal
        visible={showSortMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowSortMenu(false)}
        >
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Sort by</Text>
            {(['recent', 'views', 'favorites'] as SortMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={styles.menuItem}
                onPress={() => {
                  setSortMode(mode);
                  setShowSortMenu(false);
                }}
              >
                <Text style={styles.menuItemText}>
                  {mode === 'recent' ? 'Most Recent' : mode === 'views' ? 'Most Viewed' : 'Favorites First'}
                </Text>
                {sortMode === mode && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* New Folder Dialog */}
      <Modal
        visible={showNewFolderDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNewFolderDialog(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowNewFolderDialog(false)}
        >
          <View style={styles.dialogContent}>
            <Text style={styles.dialogTitle}>Create New Folder</Text>
            <TextInput
              style={styles.dialogInput}
              placeholder="Folder name..."
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.dialogButtonCancel]}
                onPress={() => {
                  setShowNewFolderDialog(false);
                  setNewFolderName('');
                }}
              >
                <Text style={styles.dialogButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.dialogButtonConfirm]}
                onPress={handleCreateFolder}
              >
                <Text style={styles.dialogButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Folder Selector Modal */}
      <Modal
        visible={showFolderSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFolderSelector(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowFolderSelector(false)}
        >
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Move to Folder</Text>
            <ScrollView style={styles.folderList}>
              {folders.map((folder) => (
                <TouchableOpacity
                  key={folder.id}
                  style={styles.menuItem}
                  onPress={() => handleMoveToFolder(folder.id)}
                >
                  <Ionicons name="folder" size={20} color={colors.primary} />
                  <Text style={styles.menuItemText}>{folder.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Tag Editor Modal */}
      <Modal
        visible={showTagEditor}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTagEditor(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowTagEditor(false)}
        >
          <View style={styles.dialogContent}>
            <Text style={styles.dialogTitle}>Manage Tags</Text>

            {/* Current Tags */}
            <View style={styles.currentTags}>
              {selectedMetadata && selectedMetadata.tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>#{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <Ionicons name="close-circle" size={18} color={colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Add New Tag */}
            <View style={styles.addTagContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add new tag..."
                value={newTag}
                onChangeText={setNewTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
                <Ionicons name="add" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeTagEditorButton}
              onPress={() => setShowTagEditor(false)}
            >
              <Text style={styles.closeTagEditorText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Meme Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-circle" size={36} color={colors.white} />
            </TouchableOpacity>

            {selectedMeme && (
              <>
                <Image
                  source={{ uri: selectedMeme.uri }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />

                {/* Meme Info */}
                {selectedMetadata && (
                  <View style={styles.memeInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="eye" size={16} color={colors.textLight} />
                      <Text style={styles.infoText}>{selectedMetadata.views} views</Text>
                    </View>
                    {selectedMetadata.tags.length > 0 && (
                      <View style={styles.infoRow}>
                        <Ionicons name="pricetag" size={16} color={colors.textLight} />
                        <Text style={styles.infoText}>
                          {selectedMetadata.tags.slice(0, 3).map((t) => `#${t}`).join(' ')}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.actionIconButton}
                    onPress={handleToggleFavorite}
                  >
                    <Ionicons
                      name={selectedMetadata?.isFavorite ? 'heart' : 'heart-outline'}
                      size={24}
                      color={selectedMetadata?.isFavorite ? '#FF4081' : colors.white}
                    />
                    <Text style={styles.actionIconText}>Favorite</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionIconButton}
                    onPress={() => setShowFolderSelector(true)}
                  >
                    <Ionicons name="folder" size={24} color={colors.white} />
                    <Text style={styles.actionIconText}>Folder</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionIconButton}
                    onPress={() => setShowTagEditor(true)}
                  >
                    <Ionicons name="pricetag" size={24} color={colors.white} />
                    <Text style={styles.actionIconText}>Tags</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionIconButton}
                    onPress={() => handleShareMeme(selectedMeme)}
                  >
                    <Ionicons name="share-social" size={24} color={colors.white} />
                    <Text style={styles.actionIconText}>Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionIconButton}
                    onPress={() => handleDeleteMeme(selectedMeme)}
                  >
                    <Ionicons name="trash" size={24} color="#FF4444" />
                    <Text style={[styles.actionIconText, { color: '#FF4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tabTextActive: {
    color: colors.white,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  folderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  createFolderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  createFolderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  memeItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  memeImage: {
    width: '100%',
    height: '100%',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 6,
  },
  tagsContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagCount: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  folderItem: {
    width: ITEM_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  folderCover: {
    width: '100%',
    height: ITEM_WIDTH * 0.7,
  },
  emptyFolderCover: {
    width: '100%',
    height: ITEM_WIDTH * 0.7,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderInfo: {
    padding: 12,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  folderCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: width - 80,
    maxHeight: 400,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  folderList: {
    maxHeight: 300,
  },
  dialogContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: width - 80,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  dialogButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dialogButtonCancel: {
    backgroundColor: colors.background,
  },
  dialogButtonConfirm: {
    backgroundColor: colors.primary,
  },
  dialogButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  dialogButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  currentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagChipText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  addTagContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  addTagButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeTagEditorButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeTagEditorText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  modalImage: {
    width: width - 40,
    height: width - 40,
    marginBottom: 20,
  },
  memeInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.white,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
  },
  actionIconButton: {
    alignItems: 'center',
    gap: 6,
  },
  actionIconText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
});

export default GalleryScreen;
