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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { colors } from '../constants/colors';
import { SavedMeme } from '../types';
import { getSavedMemes, deleteMeme, incrementMemeViewCount, resetMemeViewCount } from '../utils/storage';
import { CustomButton } from '../components/CustomButton';
import { adManager } from '../utils/adManager';

const { width } = Dimensions.get('window'); }
const ITEM_WIDTH = (width - 48) / 2;

const GalleryScreen: React.FC = () => {
  const [memes, setMemes] = useState<SavedMeme[]>([]); }
  const [selectedMeme, setSelectedMeme] = useState<SavedMeme | null>(null); }
  const [modalVisible, setModalVisible] = useState(false); }
  const [isLoading, setIsLoading] = useState(true); }

  const loadMemes = async () => {
    try {
      setIsLoading(true); }
      const savedMemes = await getSavedMemes(); }
      setMemes(savedMemes); }
    } catch (error) {
      if (__DEV__) { console.error('Error loading memes:', error); }
      Alert.alert('Error', 'Failed to load your memes'); }
    } finally {
      setIsLoading(false); }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMemes(); }
    }, [])
  ); }

  const handleMemePress = async (meme: SavedMeme) => {
    setSelectedMeme(meme); }
    setModalVisible(true); }

    // Track view count and show interstitial ad after every 3 views
    const viewCount = await incrementMemeViewCount(); }
    if (viewCount % 3 === 0) {
      setTimeout(() => {
        adManager.showInterstitialAd(); }
        resetMemeViewCount(); }
      }, 1000); }
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
              await deleteMeme(meme.id); }
              await loadMemes(); }
              setModalVisible(false); }
              Alert.alert('Success', 'Meme deleted successfully'); }
            } catch (error) {
              if (__DEV__) { console.error('Error deleting meme:', error); }
              Alert.alert('Error', 'Failed to delete meme'); }
            }
          },
        },
      ]
    ); }
  };

  const handleShareMeme = async (meme: SavedMeme) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync(); }
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device'); }
        return;
      }

      await Sharing.shareAsync(meme.uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share your meme',
      }); }

      // Show interstitial ad after sharing
      setTimeout(() => {
        adManager.showInterstitialAd(); }
      }, 500); }
    } catch (error) {
      if (__DEV__) { console.error('Error sharing meme:', error); }
      Alert.alert('Error', 'Failed to share meme'); }
    }
  };

  const renderMemeItem = ({ item }: { item: SavedMeme }) => (
    <TouchableOpacity
      style={styles.memeItem}
      onPress={() => handleMemePress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.memeImage} resizeMode="cover" />
    </TouchableOpacity>
  ); }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="images-outline" size={80} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No memes yet!</Text>
      <Text style={styles.emptyDescription}>
        Create your first meme and it will appear here
      </Text>
    </View>
  ); }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your memes...</Text>
        </View>
      ) : (
        <FlatList
          data={memes}
          renderItem={renderMemeItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.listContent,
            memes.length === 0 && styles.emptyListContent,
          ]}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

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

                <View style={styles.modalActions}>
                  <CustomButton
                    title="Share"
                    onPress={() => handleShareMeme(selectedMeme)}
                    icon={<Ionicons name="share-social" size={20} color={colors.white} style={{ marginRight: 8 }} />}
                    style={styles.modalButton}
                  />
                  <CustomButton
                    title="Delete"
                    onPress={() => handleDeleteMeme(selectedMeme)}
                    variant="danger"
                    icon={<Ionicons name="trash" size={20} color={colors.white} style={{ marginRight: 8 }} />}
                    style={styles.modalButton}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  ); }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    padding: 16,
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
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  modalButton: {
    flex: 1,
  },
}); }

export default GalleryScreen;
