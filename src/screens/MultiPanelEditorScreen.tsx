import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { LayoutSelector } from '../components/LayoutSelector';
import { FontPicker } from '../components/FontPicker';
import {
  LayoutType,
  PanelData,
  createInitialPanels,
  getLayoutByType,
  calculatePanelDimensions,
  addTextToPanel,
  updatePanelText,
  deleteTextFromPanel,
  updatePanelImage,
  type PanelText,
} from '../utils/multiPanelLayouts';
import { saveMeme } from '../utils/storage';

type MultiPanelEditorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MultiPanelEditor'
>;

type MultiPanelEditorScreenProps = {
  navigation: MultiPanelEditorScreenNavigationProp;
};

const CANVAS_WIDTH = Dimensions.get('window').width - 32;
const CANVAS_HEIGHT = CANVAS_WIDTH;

const MultiPanelEditorScreen: React.FC<MultiPanelEditorScreenProps> = ({ navigation }) => {
  const [layoutType, setLayoutType] = useState<LayoutType>('2x2');
  const [panels, setPanels] = useState<PanelData[]>(() => {
    const layout = getLayoutByType('2x2');
    return layout ? createInitialPanels(layout) : [];
  });
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(0);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const viewShotRef = useRef<ViewShot>(null);

  const selectedPanel = panels[selectedPanelIndex];

  const handleLayoutChange = (newLayoutType: LayoutType) => {
    const newLayout = getLayoutByType(newLayoutType);
    if (!newLayout) return;

    Alert.alert(
      'Change Layout?',
      'Changing the layout will reset all panels. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: () => {
            setLayoutType(newLayoutType);
            setPanels(createInitialPanels(newLayout));
            setSelectedPanelIndex(0);
          },
        },
      ]
    );
  };

  const handleAddImage = async (panelIndex: number) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const updatedPanels = [...panels];
        updatedPanels[panelIndex] = updatePanelImage(
          updatedPanels[panelIndex],
          result.assets[0].uri
        );
        setPanels(updatedPanels);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleAddText = () => {
    if (!selectedPanel) return;

    const updatedPanel = addTextToPanel(selectedPanel);
    const updatedPanels = [...panels];
    updatedPanels[selectedPanelIndex] = updatedPanel;
    setPanels(updatedPanels);
  };

  const handleUpdateText = (textId: string, updates: Partial<PanelText>) => {
    if (!selectedPanel) return;

    const updatedPanel = updatePanelText(selectedPanel, textId, updates);
    const updatedPanels = [...panels];
    updatedPanels[selectedPanelIndex] = updatedPanel;
    setPanels(updatedPanels);
  };

  const handleDeleteText = (textId: string) => {
    if (!selectedPanel) return;

    Alert.alert('Delete Text?', 'Are you sure you want to delete this text?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedPanel = deleteTextFromPanel(selectedPanel, textId);
          const updatedPanels = [...panels];
          updatedPanels[selectedPanelIndex] = updatedPanel;
          setPanels(updatedPanels);
          if (editingTextId === textId) {
            setEditingTextId(null);
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need permission to save to gallery.');
        setSaving(false);
        return;
      }

      if (!viewShotRef.current) {
        Alert.alert('Error', 'Failed to capture meme');
        setSaving(false);
        return;
      }

      const uri = await viewShotRef.current.capture();
      await saveMeme(uri);

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Memes', asset, false);

      Alert.alert(
        'Success!',
        'Your multi-panel meme has been saved!',
        [
          {
            text: 'View Gallery',
            onPress: () => navigation.navigate('Main', { screen: 'Gallery' }),
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save meme. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderPanel = (panel: PanelData, index: number) => {
    const dimensions = calculatePanelDimensions(
      panel.position,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

    const isSelected = index === selectedPanelIndex;

    return (
      <TouchableOpacity
        key={panel.id}
        style={[
          styles.panel,
          {
            width: dimensions.width,
            height: dimensions.height,
            left: dimensions.x,
            top: dimensions.y,
            backgroundColor: panel.backgroundColor,
          },
          isSelected && styles.selectedPanel,
        ]}
        onPress={() => setSelectedPanelIndex(index)}
        activeOpacity={0.8}
      >
        {panel.imageUri ? (
          <Image source={{ uri: panel.imageUri }} style={styles.panelImage} />
        ) : (
          <View style={styles.emptyPanel}>
            <Ionicons name="image-outline" size={32} color={colors.textLight} />
            <Text style={styles.emptyPanelText}>Tap to add image</Text>
          </View>
        )}

        {/* Render texts */}
        {panel.texts.map(text => (
          <View
            key={text.id}
            style={[
              styles.textContainer,
              {
                left: `${text.x}%`,
                top: `${text.y}%`,
              },
            ]}
          >
            <Text
              style={[
                styles.memeText,
                {
                  fontSize: text.fontSize,
                  color: text.color,
                  textAlign: text.textAlign,
                  fontFamily: text.fontFamily !== 'System' ? text.fontFamily : undefined,
                },
              ]}
              numberOfLines={undefined}
            >
              {text.text || 'TAP TO EDIT'}
            </Text>
          </View>
        ))}

        {/* Add image button */}
        <TouchableOpacity
          style={styles.addImageButton}
          onPress={() => handleAddImage(index)}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
        </TouchableOpacity>

        {/* Panel number badge */}
        <View style={styles.panelBadge}>
          <Text style={styles.panelBadgeText}>{index + 1}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Multi-Panel Meme</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.headerButton, styles.saveButton]}
          disabled={saving}
        >
          <Ionicons name="save" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Canvas */}
        <ViewShot
          ref={viewShotRef}
          style={[
            styles.canvas,
            { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
          ]}
          options={{ format: 'png', quality: 1 }}
        >
          {panels.map((panel, index) => renderPanel(panel, index))}
        </ViewShot>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Layout Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowLayoutSelector(true)}
          >
            <Ionicons name="grid" size={20} color={colors.primary} />
            <Text style={styles.controlButtonText}>Layout</Text>
          </TouchableOpacity>

          {/* Add Text Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleAddText}
          >
            <Ionicons name="text" size={20} color={colors.primary} />
            <Text style={styles.controlButtonText}>Add Text</Text>
          </TouchableOpacity>

          {/* Font Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowFontPicker(true)}
          >
            <Ionicons name="color-palette" size={20} color={colors.primary} />
            <Text style={styles.controlButtonText}>Font</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Panel Info */}
        {selectedPanel && (
          <View style={styles.panelInfo}>
            <Text style={styles.panelInfoTitle}>
              Panel {selectedPanelIndex + 1} Selected
            </Text>
            <Text style={styles.panelInfoText}>
              {selectedPanel.texts.length} text{selectedPanel.texts.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* Text List */}
        {selectedPanel && selectedPanel.texts.length > 0 && (
          <View style={styles.textList}>
            <Text style={styles.sectionTitle}>Panel {selectedPanelIndex + 1} Texts</Text>
            {selectedPanel.texts.map((text) => (
              <View key={text.id} style={styles.textItem}>
                <View style={styles.textItemContent}>
                  <TextInput
                    style={styles.textInput}
                    value={text.text}
                    onChangeText={(value) => handleUpdateText(text.id, { text: value })}
                    placeholder="Enter text..."
                    placeholderTextColor={colors.textLight}
                    multiline
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteText(text.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <LayoutSelector
        visible={showLayoutSelector}
        onClose={() => setShowLayoutSelector(false)}
        onSelectLayout={handleLayoutChange}
        currentLayout={layoutType}
      />

      <FontPicker
        visible={showFontPicker}
        onClose={() => setShowFontPicker(false)}
        onFontSelect={(font) => {
          if (editingTextId) {
            handleUpdateText(editingTextId, { fontFamily: font.family });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  headerButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  canvas: {
    backgroundColor: colors.white,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  panel: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  selectedPanel: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  panelImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyPanel: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  emptyPanelText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
  },
  textContainer: {
    position: 'absolute',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    maxWidth: '90%',
  },
  memeText: {
    fontWeight: '900',
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 1,
  },
  addImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  panelBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  panelInfo: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  panelInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  panelInfoText: {
    fontSize: 14,
    color: colors.textLight,
  },
  textList: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  textItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textItemContent: {
    flex: 1,
  },
  textInput: {
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  deleteButton: {
    padding: 8,
  },
});

export default MultiPanelEditorScreen;
