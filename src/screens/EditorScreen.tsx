import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Animated } from 'react-native';
import { colors } from '../constants/colors';
import { RootStackParamList, MemeText, MemeSticker, EditorHistory } from '../types';
import { saveMeme } from '../utils/storage';
import { saveImageToGallery, generateUniqueId } from '../utils/imageUtils';
import { TEXT_CONFIG, APP_CONFIG } from '../constants/config';
import { CustomButton } from '../components/CustomButton';
import { AdBanner } from '../components/AdBanner';
import { VoiceInput } from '../components/VoiceInput';
import { StickerPicker } from '../components/StickerPicker';
import { FontPicker } from '../components/FontPicker';
import { ImageFilters, ImageFilter } from '../components/ImageFilters';
import { Sticker } from '../utils/stickerData';
import { Font, getFontFamily } from '../utils/fontData';
import { adManager } from '../utils/adManager';
import { premiumManager } from '../utils/premiumManager';

const { width } = Dimensions.get('window');
const MEME_WIDTH = width - 32;

type EditorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Editor'>;
type EditorScreenRouteProp = RouteProp<RootStackParamList, 'Editor'>;

type EditorScreenProps = {
  navigation: EditorScreenNavigationProp;
  route: EditorScreenRouteProp;
};

const EditorScreen: React.FC<EditorScreenProps> = ({ navigation, route }) => {
  const { templateUri } = route.params;
  const viewShotRef = useRef<ViewShot>(null);

  // Text boxes state with undo/redo support
  const [history, setHistory] = useState<EditorHistory>({
    past: [],
    present: [],
    future: [],
  });

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [showWatermark, setShowWatermark] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  // Stickers state
  const [stickers, setStickers] = useState<MemeSticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  // Font picker state
  const [showFontPicker, setShowFontPicker] = useState(false);

  // Image filters state
  const [imageFilters, setImageFilters] = useState<ImageFilter>({
    brightness: 0,
    contrast: 0,
    saturation: 1,
  });
  const [showImageFilters, setShowImageFilters] = useState(false);

  const textColors = ['#FFFFFF', '#000000', '#FF0000', '#FFFF00', '#00FF00', '#0000FF'];

  // Check premium status on mount
  React.useEffect(() => {
    const checkPremium = async () => {
      const status = await premiumManager.getPremiumStatus();
      setIsPremium(status.isPremium);
    };
    checkPremium();
  }, []);

  // Get selected text box
  const selectedText = history.present.find(t => t.id === selectedTextId);

  // History management
  const updateHistory = useCallback((newPresent: MemeText[]) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: newPresent,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    setHistory({
      past: newPast,
      present: previous,
      future: [history.present, ...history.future],
    });
  }, [history]);

  const redo = useCallback(() => {
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    setHistory({
      past: [...history.past, history.present],
      present: next,
      future: newFuture,
    });
  }, [history]);

  // Text box management
  const addTextBox = useCallback(() => {
    const newText: MemeText = {
      id: generateUniqueId(),
      text: 'NEW TEXT',
      x: MEME_WIDTH / 2 - 50,
      y: MEME_WIDTH / 2 - 20,
      fontSize: TEXT_CONFIG.defaultFontSize,
      color: TEXT_CONFIG.defaultColor,
      strokeColor: TEXT_CONFIG.defaultStrokeColor,
      strokeWidth: 2,
    };

    const newPresent = [...history.present, newText];
    updateHistory(newPresent);
    setSelectedTextId(newText.id);
  }, [history.present, updateHistory]);

  const deleteTextBox = useCallback((id: string) => {
    const newPresent = history.present.filter(t => t.id !== id);
    updateHistory(newPresent);
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  }, [history.present, selectedTextId, updateHistory]);

  const updateTextBox = useCallback((id: string, updates: Partial<MemeText>) => {
    const newPresent = history.present.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    updateHistory(newPresent);
  }, [history.present, updateHistory]);

  const updateTextPosition = useCallback((id: string, x: number, y: number) => {
    setHistory(prev => ({
      ...prev,
      present: prev.present.map(t =>
        t.id === id ? { ...t, x, y } : t
      ),
    }));
  }, []);

  const handleEditText = useCallback(() => {
    if (!selectedText) return;
    setEditingText(selectedText.text);
    setShowTextEditor(true);
  }, [selectedText]);

  const handleSaveText = useCallback(() => {
    if (selectedTextId) {
      updateTextBox(selectedTextId, { text: editingText });
    }
    setShowTextEditor(false);
  }, [selectedTextId, editingText, updateTextBox]);

  // Sticker management
  const handleStickerSelect = useCallback((sticker: Sticker) => {
    const newSticker: MemeSticker = {
      id: generateUniqueId(),
      emoji: sticker.emoji,
      x: MEME_WIDTH / 2 - 50,
      y: MEME_WIDTH / 2 - 50,
      size: 80,
      rotation: 0,
    };
    setStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
    // Deselect text when adding sticker
    setSelectedTextId(null);
  }, []);

  const deleteSticker = useCallback((id: string) => {
    setStickers(prev => prev.filter(s => s.id !== id));
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
  }, [selectedStickerId]);

  const updateSticker = useCallback((id: string, updates: Partial<MemeSticker>) => {
    setStickers(prev => prev.map(s =>
      s.id === id ? { ...s, ...updates } : s
    ));
  }, []);

  const updateStickerPosition = useCallback((id: string, x: number, y: number) => {
    setStickers(prev => prev.map(s =>
      s.id === id ? { ...s, x, y } : s
    ));
  }, []);

  const selectedSticker = stickers.find(s => s.id === selectedStickerId);

  // Font management
  const handleFontSelect = useCallback((font: Font) => {
    if (selectedTextId) {
      updateTextBox(selectedTextId, { fontFamily: font.family });
    }
  }, [selectedTextId, updateTextBox]);

  // Image filter management
  const handleApplyFilters = useCallback((filters: ImageFilter) => {
    setImageFilters(filters);
  }, []);

  const handleSaveMeme = async () => {
    try {
      setIsSaving(true);

      if (!viewShotRef.current || !viewShotRef.current.capture) {
        throw new Error('ViewShot ref not available');
      }

      // Deselect text box and sticker before capture
      setSelectedTextId(null);
      setSelectedStickerId(null);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the meme
      const uri = await viewShotRef.current.capture();

      // Save to gallery
      await saveImageToGallery(uri);

      // Save to app storage
      const meme = {
        id: generateUniqueId(),
        uri,
        timestamp: Date.now(),
        templateId: route.params.templateId,
      };
      await saveMeme(meme);

      Alert.alert(
        'Success!',
        'Your meme has been saved!',
        [
          {
            text: 'View Gallery',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Gallery' } as any),
          },
          { text: 'Create Another', onPress: () => navigation.goBack() },
        ]
      );

      // Show interstitial ad after saving
      setTimeout(() => {
        adManager.showInterstitialAd();
      }, 500);
    } catch (error) {
      if (__DEV__) { console.error('Error saving meme:', error); }
      Alert.alert('Error', 'Failed to save meme. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareMeme = async () => {
    try {
      if (!viewShotRef.current || !viewShotRef.current.capture) {
        throw new Error('ViewShot ref not available');
      }

      // Deselect text box and sticker before capture
      setSelectedTextId(null);
      setSelectedStickerId(null);
      await new Promise(resolve => setTimeout(resolve, 100));

      const uri = await viewShotRef.current.capture();

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share your meme',
      });

      // Show interstitial ad after sharing
      setTimeout(() => {
        adManager.showInterstitialAd();
      }, 500);
    } catch (error) {
      if (__DEV__) { console.error('Error sharing meme:', error); }
      Alert.alert('Error', 'Failed to share meme. Please try again.');
    }
  };

  const handleRemoveWatermark = async () => {
    const isReady = adManager.isRewardedAdReady();

    if (!isReady) {
      Alert.alert(
        'Ad Not Ready',
        'The reward ad is still loading. Please try again in a moment.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Remove Watermark',
      'Watch a short video to remove the watermark from this meme.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Watch Video',
          onPress: async () => {
            const success = await adManager.showRewardedAd(() => {
              setShowWatermark(false);
              Alert.alert('Success!', 'Watermark removed!');
            });

            if (!success) {
              Alert.alert('Error', 'Failed to load reward ad. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Meme Preview */}
        <View style={styles.previewContainer}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'jpg', quality: 0.9 }}
            style={styles.viewShot}
          >
            <View style={styles.memeContainer}>
              <Image
                source={{ uri: templateUri }}
                style={[
                  styles.memeImage,
                  {
                    opacity: Math.max(0.1, Math.min(1, 1 + imageFilters.brightness * 0.5)),
                  },
                ]}
                resizeMode="contain"
              />

              {/* Filter Overlay for Saturation/Contrast Effects */}
              {(imageFilters.saturation !== 1 || imageFilters.contrast !== 0) && (
                <View
                  style={[
                    styles.filterOverlay,
                    {
                      backgroundColor:
                        imageFilters.saturation < 0.5
                          ? `rgba(128, 128, 128, ${(1 - imageFilters.saturation) * 0.5})`
                          : 'transparent',
                      opacity: Math.max(0.1, Math.min(1, Math.abs(imageFilters.contrast) * 0.3 + 0.7)),
                    },
                  ]}
                  pointerEvents="none"
                />
              )}

              {/* Draggable Text Boxes */}
              {Array.isArray(history.present) && history.present.map(textBox => (
                textBox && textBox.id ? (
                  <DraggableText
                    key={textBox.id}
                    textBox={textBox}
                    isSelected={selectedTextId === textBox.id}
                    onSelect={() => {
                      setSelectedTextId(textBox.id);
                      setSelectedStickerId(null);
                    }}
                    onPositionUpdate={(x, y) => updateTextPosition(textBox.id, x, y)}
                  />
                ) : null
              ))}

              {/* Draggable Stickers */}
              {Array.isArray(stickers) && stickers.map(sticker => (
                sticker && sticker.id ? (
                  <DraggableSticker
                    key={sticker.id}
                    sticker={sticker}
                    isSelected={selectedStickerId === sticker.id}
                    onSelect={() => {
                      setSelectedStickerId(sticker.id);
                      setSelectedTextId(null);
                    }}
                    onPositionUpdate={(x, y) => updateStickerPosition(sticker.id, x, y)}
                  />
                ) : null
              ))}

              {/* Watermark */}
              {showWatermark && (
                <Text style={styles.watermark}>{APP_CONFIG.watermarkText}</Text>
              )}
            </View>
          </ViewShot>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {/* Undo/Redo, Filters, and Add Buttons */}
          <View style={styles.topControls}>
            <View style={styles.undoRedoContainer}>
              <TouchableOpacity
                onPress={undo}
                disabled={history.past.length === 0}
                style={[styles.iconButton, history.past.length === 0 && styles.iconButtonDisabled]}
              >
                <Ionicons name="arrow-undo" size={24} color={history.past.length === 0 ? colors.textLight : colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={redo}
                disabled={history.future.length === 0}
                style={[styles.iconButton, history.future.length === 0 && styles.iconButtonDisabled]}
              >
                <Ionicons name="arrow-redo" size={24} color={history.future.length === 0 ? colors.textLight : colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowImageFilters(true)}
                style={[
                  styles.iconButton,
                  (imageFilters.brightness !== 0 || imageFilters.contrast !== 0 || imageFilters.saturation !== 1) && styles.filterButtonActive
                ]}
              >
                <Ionicons
                  name="color-filter"
                  size={24}
                  color={(imageFilters.brightness !== 0 || imageFilters.contrast !== 0 || imageFilters.saturation !== 1) ? colors.success : colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.addButtonsContainer}>
              <TouchableOpacity onPress={addTextBox} style={styles.addTextButton}>
                <Ionicons name="add-circle" size={20} color={colors.white} />
                <Text style={styles.addTextButtonText}>Text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowStickerPicker(true)}
                style={styles.addStickerButton}
              >
                <Ionicons name="happy-outline" size={20} color={colors.white} />
                <Text style={styles.addStickerButtonText}>Sticker</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Selected Text Controls */}
          {selectedText && (
            <View style={styles.selectedTextControls}>
              <Text style={styles.sectionTitle}>Edit Text</Text>

              <TouchableOpacity
                onPress={handleEditText}
                style={styles.editButton}
              >
                <Ionicons name="pencil" size={20} color={colors.primary} />
                <Text style={styles.editButtonText}>{selectedText.text}</Text>
              </TouchableOpacity>

              {/* Font Selector */}
              <TouchableOpacity
                onPress={() => setShowFontPicker(true)}
                style={styles.fontButton}
              >
                <Ionicons name="text" size={20} color={colors.primary} />
                <Text style={styles.fontButtonText}>
                  {selectedText.fontFamily || 'Default Font'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
              </TouchableOpacity>

              {/* Font Size Control */}
              <Text style={styles.controlLabel}>Font Size: {selectedText.fontSize}</Text>
              <View style={styles.sliderContainer}>
                <TouchableOpacity
                  onPress={() => updateTextBox(selectedText.id, {
                    fontSize: Math.max(TEXT_CONFIG.minFontSize, selectedText.fontSize - 5)
                  })}
                  style={styles.sliderButton}
                >
                  <Ionicons name="remove-circle" size={32} color={colors.primary} />
                </TouchableOpacity>
                <View style={styles.sliderBar}>
                  <View
                    style={[
                      styles.sliderFill,
                      {
                        width: `${
                          ((selectedText.fontSize - TEXT_CONFIG.minFontSize) /
                            (TEXT_CONFIG.maxFontSize - TEXT_CONFIG.minFontSize)) *
                          100
                        }%`,
                      },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => updateTextBox(selectedText.id, {
                    fontSize: Math.min(TEXT_CONFIG.maxFontSize, selectedText.fontSize + 5)
                  })}
                  style={styles.sliderButton}
                >
                  <Ionicons name="add-circle" size={32} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Color Picker */}
              <Text style={styles.controlLabel}>Text Color</Text>
              <View style={styles.colorPicker}>
                {textColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedText.color === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => updateTextBox(selectedText.id, { color })}
                  />
                ))}
              </View>

              {/* Text Effects */}
              <View style={styles.effectSection}>
                <Text style={styles.controlLabel}>Text Effects</Text>
                {!isPremium && (
                  <View style={styles.premiumBadge}>
                    <Ionicons name="diamond" size={12} color={colors.warning} />
                  </View>
                )}
              </View>
              <View style={styles.effectPicker}>
                {[
                  { value: 'none', label: 'None', icon: 'text-outline' },
                  { value: 'shadow', label: 'Shadow', icon: 'copy-outline' },
                  { value: '3d', label: '3D', icon: 'cube-outline' },
                  { value: 'glow', label: 'Glow', icon: 'sparkles-outline' },
                ].map((effect) => (
                  <TouchableOpacity
                    key={effect.value}
                    style={[
                      styles.effectOption,
                      selectedText.effect === effect.value && styles.effectOptionSelected,
                    ]}
                    onPress={() => {
                      if (effect.value !== 'none' && !isPremium) {
                        Alert.alert(
                          'Premium Feature',
                          'Text effects are a premium feature. Upgrade to unlock them!',
                          [{ text: 'OK' }]
                        );
                        return;
                      }
                      updateTextBox(selectedText.id, { effect: effect.value as any });
                    }}
                  >
                    <Ionicons
                      name={effect.icon as any}
                      size={24}
                      color={selectedText.effect === effect.value ? colors.primary : colors.text}
                    />
                    <Text style={[
                      styles.effectOptionLabel,
                      selectedText.effect === effect.value && styles.effectOptionLabelSelected,
                    ]}>
                      {effect.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => deleteTextBox(selectedText.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={20} color={colors.white} />
                <Text style={styles.deleteButtonText}>Delete Text</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Selected Sticker Controls */}
          {selectedSticker && (
            <View style={styles.selectedTextControls}>
              <Text style={styles.sectionTitle}>Edit Sticker</Text>

              {/* Size Control */}
              <Text style={styles.controlLabel}>Size: {selectedSticker.size}</Text>
              <View style={styles.sliderContainer}>
                <TouchableOpacity
                  onPress={() => updateSticker(selectedSticker.id, {
                    size: Math.max(40, selectedSticker.size - 10)
                  })}
                  style={styles.sliderButton}
                >
                  <Ionicons name="remove-circle" size={32} color={colors.primary} />
                </TouchableOpacity>
                <View style={styles.sliderBar}>
                  <View
                    style={[
                      styles.sliderFill,
                      {
                        width: `${((selectedSticker.size - 40) / (200 - 40)) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => updateSticker(selectedSticker.id, {
                    size: Math.min(200, selectedSticker.size + 10)
                  })}
                  style={styles.sliderButton}
                >
                  <Ionicons name="add-circle" size={32} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Rotation Control */}
              <Text style={styles.controlLabel}>Rotation: {selectedSticker.rotation}°</Text>
              <View style={styles.rotationButtons}>
                <TouchableOpacity
                  onPress={() => updateSticker(selectedSticker.id, {
                    rotation: (selectedSticker.rotation - 15 + 360) % 360
                  })}
                  style={styles.rotationButton}
                >
                  <Ionicons name="arrow-undo" size={24} color={colors.primary} />
                  <Text style={styles.rotationButtonText}>-15°</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateSticker(selectedSticker.id, { rotation: 0 })}
                  style={styles.rotationButton}
                >
                  <Ionicons name="refresh" size={24} color={colors.primary} />
                  <Text style={styles.rotationButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateSticker(selectedSticker.id, {
                    rotation: (selectedSticker.rotation + 15) % 360
                  })}
                  style={styles.rotationButton}
                >
                  <Ionicons name="arrow-redo" size={24} color={colors.primary} />
                  <Text style={styles.rotationButtonText}>+15°</Text>
                </TouchableOpacity>
              </View>

              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => deleteSticker(selectedSticker.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={20} color={colors.white} />
                <Text style={styles.deleteButtonText}>Delete Sticker</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Hint when no text selected */}
          {!selectedText && !selectedSticker && history.present.length === 0 && stickers.length === 0 && (
            <View style={styles.hintContainer}>
              <Ionicons name="information-circle" size={48} color={colors.textLight} />
              <Text style={styles.hintText}>Tap "Add Text" to get started!</Text>
              <Text style={styles.hintSubtext}>You can add unlimited text boxes and drag them anywhere</Text>
            </View>
          )}

          {!selectedText && !selectedSticker && (history.present.length > 0 || stickers.length > 0) && (
            <View style={styles.hintContainer}>
              <Ionicons name="hand-left" size={48} color={colors.textLight} />
              <Text style={styles.hintText}>Tap text or sticker to edit</Text>
              <Text style={styles.hintSubtext}>Drag to reposition, use controls to customize</Text>
            </View>
          )}

          {/* Watermark Control */}
          {showWatermark && (
            <TouchableOpacity
              style={styles.watermarkButton}
              onPress={handleRemoveWatermark}
            >
              <Ionicons name="star" size={20} color={colors.warning} />
              <Text style={styles.watermarkButtonText}>
                Remove Watermark (Watch Ad)
              </Text>
            </TouchableOpacity>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <CustomButton
              title="Save Meme"
              onPress={handleSaveMeme}
              loading={isSaving}
              icon={<Ionicons name="save" size={20} color={colors.white} style={{ marginRight: 8 }} />}
              style={styles.saveButton}
            />
            <CustomButton
              title="Share"
              onPress={handleShareMeme}
              variant="secondary"
              icon={<Ionicons name="share-social" size={20} color={colors.white} style={{ marginRight: 8 }} />}
              style={styles.shareButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Text Editor Modal */}
      <Modal
        visible={showTextEditor}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTextEditor(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Text</Text>
            <TextInput
              style={styles.modalInput}
              value={editingText}
              onChangeText={setEditingText}
              placeholder="Enter text"
              multiline
              autoFocus
              maxLength={100}
            />

            {/* Voice Input */}
            <VoiceInput
              onTextReceived={(text) => setEditingText(text)}
              isPremium={isPremium}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowTextEditor(false)}
                style={[styles.modalButton, styles.modalCancelButton]}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveText}
                style={[styles.modalButton, styles.modalSaveButton]}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sticker Picker Modal */}
      <StickerPicker
        visible={showStickerPicker}
        onClose={() => setShowStickerPicker(false)}
        onStickerSelect={handleStickerSelect}
      />

      {/* Font Picker Modal */}
      <FontPicker
        visible={showFontPicker}
        onClose={() => setShowFontPicker(false)}
        onFontSelect={handleFontSelect}
        currentFontId={selectedText?.fontFamily || 'default'}
      />

      {/* Image Filters Modal */}
      <ImageFilters
        visible={showImageFilters}
        onClose={() => setShowImageFilters(false)}
        onApply={handleApplyFilters}
        currentFilters={imageFilters}
      />

      {/* Ad Banner */}
      <AdBanner />
    </GestureHandlerRootView>
  );
};

// Draggable Text Component
interface DraggableTextProps {
  textBox: MemeText;
  isSelected: boolean;
  onSelect: () => void;
  onPositionUpdate: (x: number, y: number) => void;
}

const DraggableText: React.FC<DraggableTextProps> = ({
  textBox,
  isSelected,
  onSelect,
  onPositionUpdate
}) => {
  const startPos = useRef({ x: 0, y: 0 });

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { state, translationX, translationY } = event.nativeEvent;

    if (state === 2) { // BEGAN
      startPos.current = { x: textBox.x, y: textBox.y };
      onSelect();
    } else if (state === 4) { // ACTIVE
      const newX = startPos.current.x + translationX;
      const newY = startPos.current.y + translationY;
      onPositionUpdate(newX, newY);
    }
  };

  const transform = [
    { translateX: textBox.x },
    { translateY: textBox.y },
    ...(textBox.rotation ? [{ rotate: `${textBox.rotation}deg` }] : []),
  ];

  // Get text style based on effect
  const getTextEffectStyle = () => {
    const effect = textBox.effect || 'none';
    const baseStyle = {
      fontSize: textBox.fontSize,
      color: textBox.color,
      fontFamily: textBox.fontFamily || undefined,
    };

    switch (effect) {
      case 'shadow':
        return {
          ...baseStyle,
          textShadowColor: '#000000',
          textShadowOffset: { width: 3, height: 3 },
          textShadowRadius: 6,
        };
      case '3d':
        return {
          ...baseStyle,
          textShadowColor: textBox.strokeColor || '#000000',
          textShadowOffset: { width: 4, height: 4 },
          textShadowRadius: 2,
        };
      case 'glow':
        return {
          ...baseStyle,
          textShadowColor: textBox.color,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        };
      default:
        return {
          ...baseStyle,
          textShadowColor: textBox.strokeColor,
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 1,
        };
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View
        style={[
          styles.draggableContainer,
          { transform },
          isSelected && styles.selectedTextBox,
        ]}
      >
        <Text
          style={[
            styles.memeText,
            getTextEffectStyle(),
          ]}
        >
          {textBox.text.toUpperCase()}
        </Text>
      </View>
    </PanGestureHandler>
  );
};

// Draggable Sticker Component
interface DraggableStickerProps {
  sticker: MemeSticker;
  isSelected: boolean;
  onSelect: () => void;
  onPositionUpdate: (x: number, y: number) => void;
}

const DraggableSticker: React.FC<DraggableStickerProps> = ({
  sticker,
  isSelected,
  onSelect,
  onPositionUpdate
}) => {
  const startPos = useRef({ x: 0, y: 0 });

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { state, translationX, translationY } = event.nativeEvent;

    if (state === 2) { // BEGAN
      startPos.current = { x: sticker.x || 0, y: sticker.y || 0 };
      onSelect();
    } else if (state === 4) { // ACTIVE
      const newX = startPos.current.x + (translationX || 0);
      const newY = startPos.current.y + (translationY || 0);
      onPositionUpdate(newX, newY);
    }
  };

  const transform = [
    { translateX: sticker.x || 0 },
    { translateY: sticker.y || 0 },
    { rotate: `${sticker.rotation || 0}deg` },
  ];

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View
        style={[
          styles.draggableContainer,
          { transform },
          isSelected && styles.selectedStickerBox,
        ]}
      >
        <Text style={{ fontSize: sticker.size || 80 }}>
          {sticker.emoji || '❓'}
        </Text>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  previewContainer: {
    padding: 16,
  },
  viewShot: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  memeContainer: {
    width: MEME_WIDTH,
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: colors.black,
  },
  memeImage: {
    width: '100%',
    height: '100%',
  },
  filterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  draggableContainer: {
    position: 'absolute',
    padding: 8,
  },
  selectedTextBox: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 4,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  selectedStickerBox: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderStyle: 'dashed',
    borderRadius: 4,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  memeText: {
    fontWeight: '900',
    textTransform: 'uppercase',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  watermark: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    fontSize: 10,
    color: colors.white,
    opacity: 0.6,
    fontWeight: '600',
  },
  controlsContainer: {
    paddingHorizontal: 16,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  undoRedoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconButtonDisabled: {
    opacity: 0.5,
  },
  filterButtonActive: {
    backgroundColor: `${colors.success}20`,
  },
  addButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    flex: 1,
  },
  addTextButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  addStickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    flex: 1,
  },
  addStickerButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedTextControls: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  editButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  fontButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  fontButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderButton: {
    padding: 4,
  },
  sliderBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.border,
  },
  colorOptionSelected: {
    borderColor: colors.primary,
    borderWidth: 4,
  },
  effectSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  effectPicker: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  effectOption: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    gap: 4,
  },
  effectOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  effectOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  effectOptionLabelSelected: {
    color: colors.primary,
  },
  rotationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  rotationButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    gap: 4,
  },
  rotationButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  hintContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
  },
  hintText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  hintSubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  watermarkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.warning,
  },
  watermarkButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
  },
  shareButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: colors.background,
  },
  modalSaveButton: {
    backgroundColor: colors.primary,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default EditorScreen;
