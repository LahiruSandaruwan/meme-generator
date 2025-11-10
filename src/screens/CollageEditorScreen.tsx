/**
 * Collage Editor Screen
 * Combine multiple images into a single collage
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ViewShot from 'react-native-view-shot';
import { colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { saveImageToGallery } from '../utils/imageUtils';
import {
  CollageLayout,
  CollageSlot,
  CollageSettings,
  COLLAGE_LAYOUTS,
  LAYOUT_CATEGORIES,
  DEFAULT_COLLAGE_SETTINGS,
  BORDER_COLORS,
  BACKGROUND_COLORS,
  getLayoutById,
  calculateCanvasDimensions,
  assignImagesToSlots,
  swapSlots,
  getSlotCount,
} from '../utils/collage';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 32;

type CollageEditorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CollageEditor'
>;
type CollageEditorScreenRouteProp = RouteProp<RootStackParamList, 'CollageEditor'>;

type CollageEditorScreenProps = {
  navigation: CollageEditorScreenNavigationProp;
  route: CollageEditorScreenRouteProp;
};

const CollageEditorScreen: React.FC<CollageEditorScreenProps> = ({
  navigation,
  route,
}) => {
  const viewShotRef = useRef<ViewShot>(null);

  const [selectedLayout, setSelectedLayout] = useState<CollageLayout>(
    COLLAGE_LAYOUTS[3] // Default to 2x2
  );
  const [slots, setSlots] = useState<CollageSlot[]>(selectedLayout.slots);
  const [settings, setSettings] = useState<CollageSettings>(DEFAULT_COLLAGE_SETTINGS);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Calculate canvas dimensions
  const canvasDimensions = calculateCanvasDimensions(selectedLayout, CANVAS_WIDTH);

  // Handle layout change
  const handleLayoutChange = (layout: CollageLayout) => {
    setSelectedLayout(layout);
    const newSlots = assignImagesToSlots(layout, slots.map(s => s.imageUri || ''));
    setSlots(newSlots);
    setSelectedSlotIndex(null);
  };

  // Handle image selection for slot
  const handleSelectImageForSlot = async (index: number) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photos to add images to the collage.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const newSlots = [...slots];
        newSlots[index].imageUri = result.assets[0].uri;
        setSlots(newSlots);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error picking image:', error);
      }
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Handle slot tap (for swapping)
  const handleSlotTap = (index: number) => {
    if (selectedSlotIndex === null) {
      setSelectedSlotIndex(index);
    } else {
      const newSlots = swapSlots(slots, selectedSlotIndex, index);
      setSlots(newSlots);
      setSelectedSlotIndex(null);
    }
  };

  // Handle save collage
  const handleSaveCollage = async () => {
    try {
      // Check if all slots have images
      const emptySlots = slots.filter(s => !s.imageUri);
      if (emptySlots.length > 0) {
        Alert.alert(
          'Incomplete Collage',
          `Please add images to all ${slots.length} slots before saving.`,
          [{ text: 'OK' }]
        );
        return;
      }

      setIsSaving(true);

      if (!viewShotRef.current || !viewShotRef.current.capture) {
        throw new Error('ViewShot ref not available');
      }

      // Capture the collage
      const uri = await viewShotRef.current.capture();

      // Save to gallery
      await saveImageToGallery(uri);

      Alert.alert(
        'Success!',
        'Your collage has been saved to your gallery!',
        [
          {
            text: 'Create Another',
            onPress: () => {
              setSlots(selectedLayout.slots);
              setSelectedSlotIndex(null);
            },
          },
          { text: 'Done', onPress: () => navigation.goBack() },
        ]
      );
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving collage:', error);
      }
      Alert.alert('Error', 'Failed to save collage. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Render a single slot
  const renderSlot = (slot: CollageSlot, index: number) => {
    const isSelected = selectedSlotIndex === index;
    const hasImage = !!slot.imageUri;

    return (
      <TouchableOpacity
        key={slot.id}
        style={[
          styles.slot,
          {
            left: `${slot.x}%`,
            top: `${slot.y}%`,
            width: `${slot.width}%`,
            height: `${slot.height}%`,
          },
          isSelected && styles.slotSelected,
        ]}
        onPress={() => {
          if (hasImage) {
            handleSlotTap(index);
          } else {
            handleSelectImageForSlot(index);
          }
        }}
        activeOpacity={0.7}
      >
        {hasImage ? (
          <>
            <Image source={{ uri: slot.imageUri }} style={styles.slotImage} />
            {isSelected && (
              <View style={styles.selectedOverlay}>
                <Ionicons name="swap-horizontal" size={32} color={colors.white} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptySlot}>
            <Ionicons name="add-circle" size={48} color={colors.textLight} />
            <Text style={styles.emptySlotText}>Tap to Add</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collage Maker</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Canvas */}
        <View style={styles.canvasContainer}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'jpg', quality: 0.9 }}
            style={[
              styles.canvas,
              {
                width: canvasDimensions.width,
                height: canvasDimensions.height,
                backgroundColor: settings.backgroundColor,
                borderWidth: settings.borderWidth,
                borderColor: settings.borderColor,
                borderRadius: settings.cornerRadius,
              },
            ]}
          >
            {slots.map((slot, index) => renderSlot(slot, index))}
          </ViewShot>
        </View>

        {selectedSlotIndex !== null && (
          <View style={styles.swapHint}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.swapHintText}>
              Tap another image to swap positions
            </Text>
          </View>
        )}

        {/* Layout Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Layout ({selectedLayout.name})</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.layoutScroll}
            contentContainerStyle={styles.layoutScrollContent}
          >
            {COLLAGE_LAYOUTS.map(layout => (
              <TouchableOpacity
                key={layout.id}
                style={[
                  styles.layoutButton,
                  selectedLayout.id === layout.id && styles.layoutButtonSelected,
                ]}
                onPress={() => handleLayoutChange(layout)}
              >
                <View style={styles.layoutPreview}>
                  <View
                    style={[
                      styles.layoutGrid,
                      {
                        aspectRatio: layout.aspectRatio,
                      },
                    ]}
                  >
                    {layout.slots.map((slot, index) => (
                      <View
                        key={slot.id}
                        style={[
                          styles.layoutSlot,
                          {
                            left: `${slot.x}%`,
                            top: `${slot.y}%`,
                            width: `${slot.width}%`,
                            height: `${slot.height}%`,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.layoutLabel}>{layout.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Customization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customize</Text>

          {/* Border Color */}
          <Text style={styles.controlLabel}>Border Color</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.colorScroll}
            contentContainerStyle={styles.colorScrollContent}
          >
            {BORDER_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  settings.borderColor === color && styles.colorButtonSelected,
                ]}
                onPress={() => setSettings({ ...settings, borderColor: color })}
              >
                {settings.borderColor === color && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={color === '#FFFFFF' ? '#000000' : '#FFFFFF'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Background Color */}
          <Text style={styles.controlLabel}>Background Color</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.colorScroll}
            contentContainerStyle={styles.colorScrollContent}
          >
            {BACKGROUND_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  settings.backgroundColor === color && styles.colorButtonSelected,
                ]}
                onPress={() =>
                  setSettings({ ...settings, backgroundColor: color })
                }
              >
                {settings.backgroundColor === color && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={color === '#FFFFFF' ? '#000000' : '#FFFFFF'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Border Width */}
          <Text style={styles.controlLabel}>
            Border Width: {settings.borderWidth}px
          </Text>
          <View style={styles.sliderContainer}>
            {[0, 2, 4, 8, 12, 16, 20].map(width => (
              <TouchableOpacity
                key={width}
                style={[
                  styles.sliderButton,
                  settings.borderWidth === width && styles.sliderButtonSelected,
                ]}
                onPress={() => setSettings({ ...settings, borderWidth: width })}
              >
                <Text
                  style={[
                    styles.sliderButtonText,
                    settings.borderWidth === width && styles.sliderButtonTextSelected,
                  ]}
                >
                  {width}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Spacing */}
          <Text style={styles.controlLabel}>Spacing: {settings.spacing}px</Text>
          <View style={styles.sliderContainer}>
            {[0, 2, 4, 8, 12, 16, 20].map(spacing => (
              <TouchableOpacity
                key={spacing}
                style={[
                  styles.sliderButton,
                  settings.spacing === spacing && styles.sliderButtonSelected,
                ]}
                onPress={() => {
                  setSettings({ ...settings, spacing });
                  // Recalculate layout with new spacing
                  const newLayout = { ...selectedLayout };
                  setSelectedLayout(newLayout);
                }}
              >
                <Text
                  style={[
                    styles.sliderButtonText,
                    settings.spacing === spacing && styles.sliderButtonTextSelected,
                  ]}
                >
                  {spacing}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveCollage}
          disabled={isSaving}
        >
          <Ionicons name="save" size={20} color={colors.white} />
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Collage'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerSpacer: {
    width: 32,
  },
  canvasContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
  },
  canvas: {
    position: 'relative',
  },
  slot: {
    position: 'absolute',
    overflow: 'hidden',
  },
  slotSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  slotImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptySlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  emptySlotText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.primary}10`,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  swapHintText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  section: {
    padding: 16,
    backgroundColor: colors.white,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  layoutScroll: {
    marginTop: 8,
  },
  layoutScrollContent: {
    gap: 12,
  },
  layoutButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  layoutButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  layoutPreview: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layoutGrid: {
    width: 60,
    position: 'relative',
    backgroundColor: '#DDD',
    borderRadius: 4,
  },
  layoutSlot: {
    position: 'absolute',
    backgroundColor: '#999',
    borderRadius: 2,
  },
  layoutLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  colorScroll: {
    marginTop: 8,
  },
  colorScrollContent: {
    gap: 12,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  colorButtonSelected: {
    borderColor: colors.text,
    borderWidth: 3,
  },
  sliderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sliderButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sliderButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  sliderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  sliderButtonTextSelected: {
    color: colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default CollageEditorScreen;
