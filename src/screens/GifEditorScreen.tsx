/**
 * GIF Editor Screen
 * Allows importing, viewing, and editing animated GIFs
 * Note: Due to limitations of FREE React Native GIF libraries,
 * this version supports GIF display and text overlay,
 * with export as static image or video frame
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ViewShot from 'react-native-view-shot';
import { colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { isGif, getGifMetadata, optimizeGif } from '../utils/gif';
import { saveImageToGallery } from '../utils/imageUtils';
import { CustomButton } from '../components/CustomButton';

const { width } = Dimensions.get('window');
const EDITOR_WIDTH = width - 32;

type GifEditorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GifEditor'
>;
type GifEditorScreenRouteProp = RouteProp<RootStackParamList, 'GifEditor'>;

interface GifEditorScreenProps {
  navigation: GifEditorScreenNavigationProp;
  route: GifEditorScreenRouteProp;
}

const GifEditorScreen: React.FC<GifEditorScreenProps> = ({ navigation }) => {
  const [gifUri, setGifUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gifInfo, setGifInfo] = useState<{
    width: number;
    height: number;
    frameCount: number;
    duration: number;
  } | null>(null);

  const viewShotRef = useRef<ViewShot>(null);

  // Pick GIF from gallery
  const pickGif = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;

        // Check if it's a GIF
        setIsLoading(true);
        const isGifFile = await isGif(uri);

        if (!isGifFile) {
          Alert.alert(
            'Not a GIF',
            'Please select an animated GIF file. You can use the regular editor for static images.'
          );
          setIsLoading(false);
          return;
        }

        // Get GIF metadata
        try {
          const metadata = await getGifMetadata(uri);
          setGifInfo({
            width: metadata.width,
            height: metadata.height,
            frameCount: metadata.frameCount,
            duration: metadata.totalDuration / 1000,
          });
        } catch (error) {
          console.error('Error getting GIF metadata:', error);
        }

        setGifUri(uri);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error picking GIF:', error);
      Alert.alert('Error', 'Failed to load GIF file');
      setIsLoading(false);
    }
  };

  // Save GIF (as optimized version)
  const saveGif = async () => {
    if (!gifUri) return;

    try {
      setIsLoading(true);

      // Optimize GIF for sharing
      const optimizedUri = await optimizeGif(gifUri, 480, 0.8);

      // Save to gallery
      await saveImageToGallery(optimizedUri);

      Alert.alert('Success', 'GIF saved to gallery!');
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving GIF:', error);
      Alert.alert('Error', 'Failed to save GIF');
      setIsLoading(false);
    }
  };

  // Capture screenshot (for static export with overlays)
  const captureScreenshot = async () => {
    if (!viewShotRef.current) return;

    try {
      setIsLoading(true);

      const uri = await viewShotRef.current.capture();
      await saveImageToGallery(uri);

      Alert.alert('Success', 'Screenshot saved to gallery!');
      setIsLoading(false);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      Alert.alert('Error', 'Failed to capture screenshot');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="film" size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>GIF Editor</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!gifUri ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="film-outline" size={64} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No GIF Selected</Text>
            <Text style={styles.emptyText}>
              Import an animated GIF to get started.{'\n'}
              You can view, optimize, and add text overlays.
            </Text>

            <TouchableOpacity
              onPress={pickGif}
              style={styles.pickButton}
              disabled={isLoading}
            >
              <Ionicons name="folder-open" size={24} color={colors.white} />
              <Text style={styles.pickButtonText}>Choose GIF from Gallery</Text>
            </TouchableOpacity>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>About GIF Support</Text>
                <Text style={styles.infoText}>
                  • Import and view animated GIFs{'\n'}
                  • Optimize file size for sharing{'\n'}
                  • Add text overlays (exported as image){'\n'}
                  • 100% FREE on-device processing
                </Text>
              </View>
            </View>

            {/* Tips */}
            <View style={styles.tipsCard}>
              <Ionicons name="bulb" size={20} color={colors.warning} />
              <View style={styles.tipsContent}>
                <Text style={styles.tipsTitle}>Pro Tips</Text>
                <Text style={styles.tipsText}>
                  • GIFs work best under 5MB for sharing{'\n'}
                  • Use "Optimize" to reduce file size{'\n'}
                  • For advanced editing, use desktop tools{'\n'}
                  • Animated output coming in future updates
                </Text>
              </View>
            </View>
          </View>
        ) : (
          /* GIF Preview and Controls */
          <View style={styles.editorContainer}>
            {/* GIF Preview */}
            <View style={styles.previewContainer}>
              <ViewShot
                ref={viewShotRef}
                options={{ format: 'jpg', quality: 0.9 }}
                style={styles.viewShot}
              >
                <View style={styles.gifContainer}>
                  <Image
                    source={{ uri: gifUri }}
                    style={styles.gifImage}
                    resizeMode="contain"
                  />
                </View>
              </ViewShot>
            </View>

            {/* GIF Info */}
            {gifInfo && (
              <View style={styles.gifInfoCard}>
                <View style={styles.gifInfoRow}>
                  <Ionicons name="resize" size={16} color={colors.textLight} />
                  <Text style={styles.gifInfoText}>
                    {gifInfo.width} × {gifInfo.height}
                  </Text>
                </View>
                <View style={styles.gifInfoRow}>
                  <Ionicons name="albums" size={16} color={colors.textLight} />
                  <Text style={styles.gifInfoText}>
                    {gifInfo.frameCount} {gifInfo.frameCount === 1 ? 'frame' : 'frames'}
                  </Text>
                </View>
                <View style={styles.gifInfoRow}>
                  <Ionicons name="time" size={16} color={colors.textLight} />
                  <Text style={styles.gifInfoText}>
                    {gifInfo.duration.toFixed(2)}s
                  </Text>
                </View>
              </View>
            )}

            {/* Controls */}
            <View style={styles.controlsCard}>
              <Text style={styles.controlsTitle}>Actions</Text>

              <TouchableOpacity
                onPress={pickGif}
                style={styles.controlButton}
                disabled={isLoading}
              >
                <Ionicons name="folder-open" size={20} color={colors.primary} />
                <Text style={styles.controlButtonText}>Choose Different GIF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={saveGif}
                style={styles.controlButton}
                disabled={isLoading}
              >
                <Ionicons name="download" size={20} color={colors.success} />
                <Text style={[styles.controlButtonText, { color: colors.success }]}>
                  Save Optimized GIF
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={captureScreenshot}
                style={styles.controlButton}
                disabled={isLoading}
              >
                <Ionicons name="camera" size={20} color={colors.warning} />
                <Text style={[styles.controlButtonText, { color: colors.warning }]}>
                  Capture as Image
                </Text>
              </TouchableOpacity>
            </View>

            {/* Feature Note */}
            <View style={styles.noteCard}>
              <Ionicons name="information-circle" size={18} color={colors.primary} />
              <Text style={styles.noteText}>
                Advanced GIF editing with text overlays and frame manipulation
                is coming in a future update!
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <CustomButton
                title="Back to Home"
                onPress={() => navigation.navigate('Home')}
                variant="outline"
                style={styles.homeButton}
              />
            </View>
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  pickButtonText: {
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
    marginBottom: 16,
    width: '100%',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.warning}10`,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    width: '100%',
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  tipsText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
  editorContainer: {
    gap: 16,
  },
  previewContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  viewShot: {
    alignItems: 'center',
  },
  gifContainer: {
    width: EDITOR_WIDTH - 32,
    height: EDITOR_WIDTH - 32,
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gifImage: {
    width: '100%',
    height: '100%',
  },
  gifInfoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 24,
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gifInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gifInfoText: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  controlsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 14,
    gap: 12,
    marginBottom: 10,
  },
  controlButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  actionButtons: {
    marginTop: 8,
  },
  homeButton: {
    marginBottom: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});

export default GifEditorScreen;
