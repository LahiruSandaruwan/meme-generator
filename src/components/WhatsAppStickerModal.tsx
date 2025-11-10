import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../constants/colors';
import {
  getStickerPacks,
  saveStickerPack,
  deleteStickerPack,
  addStickerToPack,
  removeStickerFromPack,
  convertToSticker,
  validateStickerPack,
  shareStickerPack,
  getPackStats,
  STICKER_REQUIREMENTS,
  type StickerPack,
  type Sticker,
} from '../utils/whatsappStickers';

interface WhatsAppStickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WhatsAppStickerModal: React.FC<WhatsAppStickerModalProps> = ({
  visible,
  onClose,
}) => {
  const [packs, setPacks] = useState<StickerPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<StickerPack | null>(null);
  const [showCreatePack, setShowCreatePack] = useState(false);
  const [newPackName, setNewPackName] = useState('');
  const [newPackAuthor, setNewPackAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadPacks();
    }
  }, [visible]);

  const loadPacks = async () => {
    const allPacks = await getStickerPacks();
    setPacks(allPacks);
  };

  const handleCreatePack = async () => {
    if (!newPackName.trim()) {
      Alert.alert('Error', 'Please enter a pack name');
      return;
    }
    if (!newPackAuthor.trim()) {
      Alert.alert('Error', 'Please enter author name');
      return;
    }

    try {
      const newPack = await saveStickerPack({
        name: newPackName,
        author: newPackAuthor,
        stickers: [],
      });

      setPacks([...packs, newPack]);
      setNewPackName('');
      setNewPackAuthor('');
      setShowCreatePack(false);
      setSelectedPack(newPack);

      Alert.alert('Success', 'Sticker pack created! Add stickers to get started.');
    } catch (error) {
      Alert.alert('Error', 'Failed to create sticker pack');
    }
  };

  const handleAddSticker = async () => {
    if (!selectedPack) return;

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled || !result.assets[0]) return;

      setLoading(true);

      // Convert to sticker format
      const stickerResult = await convertToSticker(result.assets[0].uri);

      // Add to pack
      await addStickerToPack(selectedPack.id, {
        uri: stickerResult.uri,
      });

      // Reload packs
      await loadPacks();

      // Update selected pack
      const updatedPacks = await getStickerPacks();
      const updatedPack = updatedPacks.find(p => p.id === selectedPack.id);
      if (updatedPack) {
        setSelectedPack(updatedPack);
      }

      Alert.alert('Success', 'Sticker added to pack!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add sticker');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSticker = async (stickerId: string) => {
    if (!selectedPack) return;

    Alert.alert(
      'Remove Sticker',
      'Are you sure you want to remove this sticker?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeStickerFromPack(selectedPack.id, stickerId);
              await loadPacks();

              const updatedPacks = await getStickerPacks();
              const updatedPack = updatedPacks.find(p => p.id === selectedPack.id);
              if (updatedPack) {
                setSelectedPack(updatedPack);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove sticker');
            }
          },
        },
      ]
    );
  };

  const handleDeletePack = async (packId: string) => {
    Alert.alert(
      'Delete Pack',
      'Are you sure you want to delete this sticker pack?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStickerPack(packId);
              await loadPacks();
              if (selectedPack?.id === packId) {
                setSelectedPack(null);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete pack');
            }
          },
        },
      ]
    );
  };

  const handleSharePack = async (pack: StickerPack) => {
    const validation = validateStickerPack(pack);
    if (!validation.valid) {
      Alert.alert('Cannot Share', validation.errors.join('\n'));
      return;
    }

    try {
      await shareStickerPack(pack);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to share pack');
    }
  };

  const renderPackList = () => {
    if (packs.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="albums-outline" size={64} color={colors.textLight} />
          <Text style={styles.emptyStateTitle}>No Sticker Packs Yet</Text>
          <Text style={styles.emptyStateText}>
            Create your first WhatsApp sticker pack from your memes!
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreatePack(true)}
          >
            <Ionicons name="add-circle" size={20} color={colors.white} />
            <Text style={styles.createButtonText}>Create Pack</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Your Sticker Packs</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreatePack(true)}
          >
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {packs.map(pack => {
          const stats = getPackStats(pack);
          return (
            <TouchableOpacity
              key={pack.id}
              style={[
                styles.packCard,
                selectedPack?.id === pack.id && styles.packCardSelected,
              ]}
              onPress={() => setSelectedPack(pack)}
            >
              <View style={styles.packInfo}>
                <Text style={styles.packName}>{pack.name}</Text>
                <Text style={styles.packAuthor}>by {pack.author}</Text>
                <Text style={styles.packStats}>
                  {stats.stickerCount} sticker{stats.stickerCount !== 1 ? 's' : ''}
                  {!stats.isValid && ' (incomplete)'}
                </Text>
              </View>
              <View style={styles.packActions}>
                <TouchableOpacity
                  onPress={() => handleSharePack(pack)}
                  disabled={!stats.isValid}
                >
                  <Ionicons
                    name="share-social"
                    size={24}
                    color={stats.isValid ? colors.primary : colors.textLight}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePack(pack.id)}>
                  <Ionicons name="trash" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const renderPackDetails = () => {
    if (!selectedPack) return null;

    const stats = getPackStats(selectedPack);

    return (
      <View style={styles.packDetails}>
        <View style={styles.packDetailsHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedPack(null)}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.packDetailsTitle}>{selectedPack.name}</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.stickerCount}/30</Text>
            <Text style={styles.statLabel}>Stickers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.remainingSlots}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name={stats.isValid ? 'checkmark-circle' : 'close-circle'}
              size={32}
              color={stats.isValid ? '#4CAF50' : colors.textLight}
            />
            <Text style={styles.statLabel}>
              {stats.isValid ? 'Ready' : 'Add more'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.addStickerButton,
            !stats.canAddMore && styles.addStickerButtonDisabled,
          ]}
          onPress={handleAddSticker}
          disabled={!stats.canAddMore || loading}
        >
          <Ionicons name="add-circle" size={20} color={colors.white} />
          <Text style={styles.addStickerButtonText}>
            {loading ? 'Converting...' : 'Add Sticker'}
          </Text>
        </TouchableOpacity>

        <ScrollView style={styles.stickersGrid} contentContainerStyle={styles.stickersGridContent}>
          {selectedPack.stickers.map(sticker => (
            <View key={sticker.id} style={styles.stickerItem}>
              <Image source={{ uri: sticker.uri }} style={styles.stickerImage} />
              <TouchableOpacity
                style={styles.removeStickerButton}
                onPress={() => handleRemoveSticker(sticker.id)}
              >
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderCreatePackForm = () => {
    return (
      <View style={styles.createPackForm}>
        <Text style={styles.formTitle}>Create Sticker Pack</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Pack Name</Text>
          <TextInput
            style={styles.input}
            value={newPackName}
            onChangeText={setNewPackName}
            placeholder="My Awesome Stickers"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Author Name</Text>
          <TextInput
            style={styles.input}
            value={newPackAuthor}
            onChangeText={setNewPackAuthor}
            placeholder="Your Name"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.formButtons}>
          <TouchableOpacity
            style={[styles.formButton, styles.cancelButton]}
            onPress={() => setShowCreatePack(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.formButton, styles.submitButton]}
            onPress={handleCreatePack}
          >
            <Text style={styles.submitButtonText}>Create</Text>
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
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              <Text style={styles.title}>WhatsApp Stickers</Text>
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
            {showCreatePack ? (
              renderCreatePackForm()
            ) : selectedPack ? (
              renderPackDetails()
            ) : (
              renderPackList()
            )}

            {/* Info */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>WhatsApp Sticker Requirements</Text>
                <Text style={styles.infoText}>
                  • {STICKER_REQUIREMENTS.minStickers}-{STICKER_REQUIREMENTS.maxStickers} stickers per pack{'\n'}
                  • {STICKER_REQUIREMENTS.size}x{STICKER_REQUIREMENTS.size}px WebP format{'\n'}
                  • Max {(STICKER_REQUIREMENTS.maxFileSize / 1024).toFixed(0)}KB per sticker
                </Text>
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalHeaderLeft: {
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    padding: 4,
  },
  packCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  packInfo: {
    flex: 1,
  },
  packName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  packAuthor: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  packStats: {
    fontSize: 12,
    color: colors.textLight,
  },
  packActions: {
    flexDirection: 'row',
    gap: 16,
  },
  packDetails: {
    flex: 1,
  },
  packDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  packDetailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  addStickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  addStickerButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  addStickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  stickersGrid: {
    flex: 1,
  },
  stickersGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stickerItem: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  stickerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  removeStickerButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  createPackForm: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 24,
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
});
