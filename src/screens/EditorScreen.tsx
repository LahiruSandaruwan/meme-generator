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
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { RootStackParamList, MemeText, EditorHistory } from '../types';
import { saveMeme } from '../utils/storage';
import { saveImageToGallery, generateUniqueId } from '../utils/imageUtils';
import { TEXT_CONFIG, APP_CONFIG } from '../constants/config';
import { CustomButton } from '../components/CustomButton';
import { AdBanner } from '../components/AdBanner';
import { adManager } from '../utils/adManager';

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

  const textColors = ['#FFFFFF', '#000000', '#FF0000', '#FFFF00', '#00FF00', '#0000FF'];

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

  const handleSaveMeme = async () => {
    try {
      setIsSaving(true);

      if (!viewShotRef.current || !viewShotRef.current.capture) {
        throw new Error('ViewShot ref not available');
      }

      // Deselect text box before capture
      setSelectedTextId(null);
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

      // Deselect text box before capture
      setSelectedTextId(null);
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
                style={styles.memeImage}
                resizeMode="contain"
              />

              {/* Draggable Text Boxes */}
              {history.present.map(textBox => (
                <DraggableText
                  key={textBox.id}
                  textBox={textBox}
                  isSelected={selectedTextId === textBox.id}
                  onSelect={() => setSelectedTextId(textBox.id)}
                  onPositionUpdate={(x, y) => updateTextPosition(textBox.id, x, y)}
                />
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
          {/* Undo/Redo and Add Text */}
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
            </View>

            <TouchableOpacity onPress={addTextBox} style={styles.addTextButton}>
              <Ionicons name="add-circle" size={24} color={colors.white} />
              <Text style={styles.addTextButtonText}>Add Text</Text>
            </TouchableOpacity>
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

          {/* Hint when no text selected */}
          {!selectedText && history.present.length === 0 && (
            <View style={styles.hintContainer}>
              <Ionicons name="information-circle" size={48} color={colors.textLight} />
              <Text style={styles.hintText}>Tap "Add Text" to get started!</Text>
              <Text style={styles.hintSubtext}>You can add unlimited text boxes and drag them anywhere</Text>
            </View>
          )}

          {!selectedText && history.present.length > 0 && (
            <View style={styles.hintContainer}>
              <Ionicons name="hand-left" size={48} color={colors.textLight} />
              <Text style={styles.hintText}>Tap a text box to edit it</Text>
              <Text style={styles.hintSubtext}>Drag text boxes to reposition them</Text>
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
  const translateX = useSharedValue(textBox.x);
  const translateY = useSharedValue(textBox.y);

  React.useEffect(() => {
    translateX.value = textBox.x;
    translateY.value = textBox.y;
  }, [textBox.x, textBox.y]);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      runOnJS(onSelect)();
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      runOnJS(onPositionUpdate)(translateX.value, translateY.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          styles.draggableContainer,
          animatedStyle,
          isSelected && styles.selectedTextBox,
        ]}
      >
        <Text
          style={[
            styles.memeText,
            {
              fontSize: textBox.fontSize,
              color: textBox.color,
              textShadowColor: textBox.strokeColor,
            },
          ]}
        >
          {textBox.text.toUpperCase()}
        </Text>
      </Animated.View>
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
  addTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addTextButtonText: {
    color: colors.white,
    fontSize: 16,
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
