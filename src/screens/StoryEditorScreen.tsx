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
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { saveMeme } from '../utils/storage';
import {
  STORY_TEMPLATES,
  STORY_DIMENSIONS,
  getTemplateById,
  getStoryCategories,
  getTemplatesByCategory,
  type StoryTemplate,
  type StoryTextArea,
} from '../utils/storyTemplates';

type StoryEditorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'StoryEditor'
>;

type StoryEditorScreenProps = {
  navigation: StoryEditorScreenNavigationProp;
  route: {
    params?: {
      templateId?: string;
      backgroundImage?: string;
    };
  };
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const CANVAS_WIDTH = SCREEN_WIDTH - 32;
const CANVAS_HEIGHT = CANVAS_WIDTH * (STORY_DIMENSIONS.height / STORY_DIMENSIONS.width);

const StoryEditorScreen: React.FC<StoryEditorScreenProps> = ({ navigation, route }) => {
  const initialTemplateId = route.params?.templateId || 'meme_basic';
  const initialTemplate = getTemplateById(initialTemplateId) || STORY_TEMPLATES[0];

  const [template, setTemplate] = useState<StoryTemplate>(initialTemplate);
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    route.params?.backgroundImage
  );
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const viewShotRef = useRef<ViewShot>(null);

  const handleTextChange = (id: string, value: string) => {
    setTextValues(prev => ({ ...prev, [id]: value }));
  };

  const handleAddBackgroundImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setBackgroundImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRemoveBackground = () => {
    setBackgroundImage(undefined);
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
        Alert.alert('Error', 'Failed to capture story');
        setSaving(false);
        return;
      }

      const uri = await viewShotRef.current.capture();
      await saveMeme(uri);

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Memes', asset, false);

      Alert.alert(
        'Success!',
        'Your Instagram Story has been saved! Ready to share on Instagram.',
        [
          {
            text: 'View Gallery',
            onPress: () => navigation.navigate('Main', { screen: 'Gallery' }),
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save story. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateChange = (newTemplate: StoryTemplate) => {
    setTemplate(newTemplate);
    setTextValues({});
    setShowTemplateSelector(false);
  };

  const renderTextArea = (textArea: StoryTextArea) => {
    const value = textValues[textArea.id] || '';

    return (
      <View
        key={textArea.id}
        style={[
          styles.textAreaContainer,
          {
            position: 'absolute',
            left: `${textArea.x}%`,
            top: `${textArea.y}%`,
            width: `${textArea.width}%`,
            transform: [{ translateX: -(textArea.width / 2) }, { translateY: -50 }],
          },
        ]}
      >
        {textArea.backgroundColor && (
          <View
            style={[
              styles.textBackground,
              { backgroundColor: textArea.backgroundColor },
            ]}
          />
        )}
        <Text
          style={[
            styles.storyText,
            {
              fontSize: (textArea.fontSize * CANVAS_WIDTH) / STORY_DIMENSIONS.width,
              color: textArea.color,
              fontFamily: textArea.fontFamily !== 'System' ? textArea.fontFamily : undefined,
              textAlign: textArea.textAlign,
            },
            textArea.strokeWidth && {
              textShadowColor: textArea.strokeColor || '#000',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: textArea.strokeWidth,
            },
          ]}
          numberOfLines={textArea.maxLines}
        >
          {value || textArea.placeholder}
        </Text>
      </View>
    );
  };

  const renderCanvas = () => {
    const hasGradient = template.backgroundGradient;

    return (
      <ViewShot
        ref={viewShotRef}
        style={[
          styles.canvas,
          { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
        ]}
        options={{
          format: 'jpg',
          quality: 0.9,
          width: STORY_DIMENSIONS.width,
          height: STORY_DIMENSIONS.height,
        }}
      >
        {/* Background */}
        {backgroundImage ? (
          <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} />
        ) : hasGradient ? (
          <LinearGradient
            colors={template.backgroundGradient!.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.backgroundGradient}
          />
        ) : (
          <View style={[styles.backgroundColor, { backgroundColor: template.backgroundColor }]} />
        )}

        {/* Text Areas */}
        {template.textAreas.map(textArea => renderTextArea(textArea))}
      </ViewShot>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Instagram Story</Text>
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
        <View style={styles.canvasContainer}>
          {renderCanvas()}
          <View style={styles.storyLabel}>
            <Ionicons name="logo-instagram" size={16} color={colors.white} />
            <Text style={styles.storyLabelText}>Story 9:16</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowTemplateSelector(!showTemplateSelector)}
          >
            <Ionicons name="grid" size={20} color={colors.primary} />
            <Text style={styles.controlButtonText}>Template</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleAddBackgroundImage}
          >
            <Ionicons name="image" size={20} color={colors.primary} />
            <Text style={styles.controlButtonText}>Background</Text>
          </TouchableOpacity>

          {backgroundImage && (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleRemoveBackground}
            >
              <Ionicons name="trash" size={20} color={colors.error} />
              <Text style={[styles.controlButtonText, { color: colors.error }]}>Remove BG</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Template Selector */}
        {showTemplateSelector && (
          <View style={styles.templateSelector}>
            <Text style={styles.sectionTitle}>Choose Template</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {STORY_TEMPLATES.map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.templateCard,
                    template.id === t.id && styles.templateCardActive,
                  ]}
                  onPress={() => handleTemplateChange(t)}
                >
                  <View
                    style={[
                      styles.templatePreview,
                      { backgroundColor: t.backgroundColor },
                    ]}
                  >
                    <Text style={styles.templatePreviewText}>{t.preview}</Text>
                  </View>
                  <Text style={styles.templateName}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Text Inputs */}
        <View style={styles.textInputSection}>
          <Text style={styles.sectionTitle}>Edit Text</Text>
          {template.textAreas.map(textArea => (
            <View key={textArea.id} style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{textArea.placeholder}</Text>
              <TextInput
                style={styles.textInput}
                value={textValues[textArea.id] || ''}
                onChangeText={(value) => handleTextChange(textArea.id, value)}
                placeholder={textArea.placeholder}
                placeholderTextColor={colors.textLight}
                multiline={textArea.maxLines && textArea.maxLines > 1}
                numberOfLines={textArea.maxLines}
              />
            </View>
          ))}
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Perfect for Instagram Stories</Text>
            <Text style={styles.infoText}>
              This template is optimized at 1080x1920 (9:16) for Instagram Stories. Save and share directly to your story!
            </Text>
          </View>
        </View>
      </ScrollView>
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
  canvasContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  canvas: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  backgroundGradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  backgroundColor: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textAreaContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  storyText: {
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  storyLabel: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  storyLabelText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
  templateSelector: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  templateCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  templateCardActive: {
    opacity: 1,
  },
  templatePreview: {
    width: 80,
    height: 142,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templatePreviewText: {
    fontSize: 10,
    color: colors.white,
    textAlign: 'center',
  },
  templateName: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  textInputSection: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
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

export default StoryEditorScreen;
