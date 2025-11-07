import React, { useState, useRef } from 'react';
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
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { colors } from '../constants/colors';
import { RootStackParamList, MemeText } from '../types';
import { saveMeme } from '../utils/storage';
import { saveImageToGallery, generateUniqueId } from '../utils/imageUtils';
import { TEXT_CONFIG, APP_CONFIG } from '../constants/config';
import { CustomButton } from '../components/CustomButton';
import { AdBanner } from '../components/AdBanner';
import { adManager } from '../utils/adManager';

const { width } = Dimensions.get('window'); }
const MEME_WIDTH = width - 32;

type EditorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Editor'>;
type EditorScreenRouteProp = RouteProp<RootStackParamList, 'Editor'>;

type EditorScreenProps = {
  navigation: EditorScreenNavigationProp;
  route: EditorScreenRouteProp;
};

const EditorScreen: React.FC<EditorScreenProps> = ({ navigation, route }) => {
  const { templateUri } = route.params;
  const viewShotRef = useRef<ViewShot>(null); }

  const [topText, setTopText] = useState(''); }
  const [bottomText, setBottomText] = useState(''); }
  const [fontSize, setFontSize] = useState(TEXT_CONFIG.defaultFontSize); }
  const [textColor, setTextColor] = useState(TEXT_CONFIG.defaultColor); }
  const [showWatermark, setShowWatermark] = useState(true); }
  const [isSaving, setIsSaving] = useState(false); }

  const textColors = ['#FFFFFF', '#000000', '#FF0000', '#FFFF00', '#00FF00', '#0000FF'];

  const handleSaveMeme = async () => {
    try {
      setIsSaving(true); }

      if (!viewShotRef.current) {
        throw new Error('ViewShot ref not available'); }
      }

      // Capture the meme
      const uri = await viewShotRef.current.capture(); }

      // Save to gallery
      await saveImageToGallery(uri); }

      // Save to app storage
      const meme = {
        id: generateUniqueId(),
        uri,
        timestamp: Date.now(),
        templateId: route.params.templateId,
      };
      await saveMeme(meme); }

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
      ); }

      // Show interstitial ad after saving
      setTimeout(() => {
        adManager.showInterstitialAd(); }
      }, 500); }
    } catch (error) {
      if (__DEV__) { console.error('Error saving meme:', error); }
      Alert.alert('Error', 'Failed to save meme. Please try again.'); }
    } finally {
      setIsSaving(false); }
    }
  };

  const handleShareMeme = async () => {
    try {
      if (!viewShotRef.current) {
        throw new Error('ViewShot ref not available'); }
      }

      const uri = await viewShotRef.current.capture(); }

      const isAvailable = await Sharing.isAvailableAsync(); }
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device'); }
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share your meme',
      }); }

      // Show interstitial ad after sharing
      setTimeout(() => {
        adManager.showInterstitialAd(); }
      }, 500); }
    } catch (error) {
      if (__DEV__) { console.error('Error sharing meme:', error); }
      Alert.alert('Error', 'Failed to share meme. Please try again.'); }
    }
  };

  const handleRemoveWatermark = async () => {
    const isReady = adManager.isRewardedAdReady(); }

    if (!isReady) {
      Alert.alert(
        'Ad Not Ready',
        'The reward ad is still loading. Please try again in a moment.',
        [{ text: 'OK' }]
      ); }
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
              setShowWatermark(false); }
              Alert.alert('Success!', 'Watermark removed!'); }
            }); }

            if (!success) {
              Alert.alert('Error', 'Failed to load reward ad. Please try again.'); }
            }
          },
        },
      ]
    ); }
  };

  return (
    <View style={styles.container}>
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

              {/* Top Text */}
              {topText ? (
                <Text
                  style={[
                    styles.memeText,
                    styles.topText,
                    {
                      fontSize,
                      color: textColor,
                    },
                  ]}
                >
                  {topText.toUpperCase()}
                </Text>
              ) : null}

              {/* Bottom Text */}
              {bottomText ? (
                <Text
                  style={[
                    styles.memeText,
                    styles.bottomText,
                    {
                      fontSize,
                      color: textColor,
                    },
                  ]}
                >
                  {bottomText.toUpperCase()}
                </Text>
              ) : null}

              {/* Watermark */}
              {showWatermark && (
                <Text style={styles.watermark}>{APP_CONFIG.watermarkText}</Text>
              )}
            </View>
          </ViewShot>
        </View>

        {/* Text Inputs */}
        <View style={styles.controlsContainer}>
          <Text style={styles.sectionTitle}>Add Text</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="text" size={20} color={colors.primary} />
            <TextInput
              style={styles.textInput}
              placeholder="Top text"
              value={topText}
              onChangeText={setTopText}
              placeholderTextColor={colors.textLight}
              maxLength={50}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="text" size={20} color={colors.primary} />
            <TextInput
              style={styles.textInput}
              placeholder="Bottom text"
              value={bottomText}
              onChangeText={setBottomText}
              placeholderTextColor={colors.textLight}
              maxLength={50}
            />
          </View>

          {/* Font Size Control */}
          <Text style={styles.controlLabel}>Font Size: {fontSize}</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              onPress={() => setFontSize(Math.max(TEXT_CONFIG.minFontSize, fontSize - 5))}
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
                      ((fontSize - TEXT_CONFIG.minFontSize) /
                        (TEXT_CONFIG.maxFontSize - TEXT_CONFIG.minFontSize)) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <TouchableOpacity
              onPress={() => setFontSize(Math.min(TEXT_CONFIG.maxFontSize, fontSize + 5))}
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
                  textColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setTextColor(color)}
              />
            ))}
          </View>

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

      {/* Ad Banner */}
      <AdBanner />
    </View>
  ); }
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
  memeText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontWeight: '900',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    textShadowColor: TEXT_CONFIG.defaultStrokeColor,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  topText: {
    top: 20,
  },
  bottomText: {
    bottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
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
    marginBottom: 24,
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
}); }

export default EditorScreen;
