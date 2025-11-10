import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../constants/colors';
import { MainTabParamList, RootStackParamList, MemeTemplate as MemeTemplateType } from '../types';
import { memeTemplates, searchTemplates, getCategories } from '../utils/memeTemplates';
import { MemeTemplate } from '../components/MemeTemplate';
import { CustomButton } from '../components/CustomButton';
import { DailyChallengeModal } from '../components/DailyChallengeModal';
import { WhatsAppStickerModal } from '../components/WhatsAppStickerModal';
import { MemeStatsModal } from '../components/MemeStatsModal';
import { OfflineIndicator } from '../components/OfflineIndicator';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const categories = getCategories();
  const filteredTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : selectedCategory === 'All'
    ? memeTemplates
    : memeTemplates.filter((t) => t.category === selectedCategory);

  const handleTemplatePress = (template: MemeTemplateType) => {
    navigation.navigate('Editor', {
      templateUri: template.url,
      templateId: template.id,
      templateName: template.name,
    });
  };

  const handleUploadCustomImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photos to upload custom images.',
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
        navigation.navigate('Editor', {
          templateUri: result.assets[0].uri,
        });
      }
    } catch (error) {
      if (__DEV__) { console.error('Error picking image:', error); }
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your camera to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        navigation.navigate('Editor', {
          templateUri: result.assets[0].uri,
        });
      }
    } catch (error) {
      if (__DEV__) { console.error('Error taking photo:', error); }
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleStartChallenge = () => {
    // Navigate to editor with blank canvas for challenge
    // User can use any template or upload photo
    Alert.alert(
      'Ready to Create!',
      'Choose a template, upload a photo, or take a picture to start your challenge meme!',
      [{ text: 'Got it!' }]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* 1. SEARCH - Quick access at top */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search templates..."
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

      {/* 2. QUICK ACTIONS - Primary user actions */}
      <View style={styles.uploadButtonsContainer}>
        <CustomButton
          title="Upload Photo"
          onPress={handleUploadCustomImage}
          icon={<Ionicons name="images" size={20} color={colors.white} style={{ marginRight: 8 }} />}
          style={styles.uploadButton}
        />
        <CustomButton
          title="Take Photo"
          onPress={handleTakePhoto}
          variant="secondary"
          icon={<Ionicons name="camera" size={20} color={colors.white} style={{ marginRight: 8 }} />}
          style={styles.uploadButton}
        />
      </View>

      {/* 3. TRENDING - Discovery/Inspiration */}
      <TouchableOpacity
        style={styles.trendingButton}
        onPress={() => navigation.navigate('Trending')}
        activeOpacity={0.8}
      >
        <View style={styles.trendingContent}>
          <Ionicons name="trending-up" size={24} color="#FF4500" />
          <View style={styles.trendingTextContainer}>
            <Text style={styles.trendingTitle}>Trending from Reddit</Text>
            <Text style={styles.trendingSubtitle}>Get inspired by popular memes 🔥</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      {/* 4. CATEGORY FILTER - After primary actions */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      {/* SECTION: CREATIVE TOOLS */}
      <View style={styles.sectionHeader}>
        <Ionicons name="color-wand" size={18} color={colors.primary} />
        <Text style={styles.sectionHeaderText}>Creative Tools</Text>
      </View>

      {/* Multi-Panel Creator */}
      <TouchableOpacity
        style={styles.multiPanelButton}
        onPress={() => navigation.navigate('MultiPanelEditor')}
        activeOpacity={0.8}
      >
        <View style={styles.multiPanelContent}>
          <Ionicons name="grid" size={24} color="#9C27B0" />
          <View style={styles.multiPanelTextContainer}>
            <Text style={styles.multiPanelTitle}>Multi-Panel Memes</Text>
            <Text style={styles.multiPanelSubtitle}>Create 2x2, 3x1 grids & more! ✨</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      {/* Collage Maker */}
      <TouchableOpacity
        style={styles.collageButton}
        onPress={() => navigation.navigate('CollageEditor')}
        activeOpacity={0.8}
      >
        <View style={styles.collageContent}>
          <Ionicons name="albums" size={24} color="#FF6F00" />
          <View style={styles.collageTextContainer}>
            <Text style={styles.collageTitle}>Collage Maker</Text>
            <Text style={styles.collageSubtitle}>Combine multiple memes in one! 🖼️</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      {/* Instagram Story */}
      <TouchableOpacity
        style={styles.storyButton}
        onPress={() => navigation.navigate('StoryEditor', {})}
        activeOpacity={0.8}
      >
        <View style={styles.storyContent}>
          <Ionicons name="logo-instagram" size={24} color="#E1306C" />
          <View style={styles.storyTextContainer}>
            <Text style={styles.storyTitle}>Instagram Stories</Text>
            <Text style={styles.storySubtitle}>Perfect 9:16 format! 📱</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      {/* WhatsApp Stickers */}
      <TouchableOpacity
        style={styles.whatsappButton}
        onPress={() => setShowWhatsAppModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.whatsappContent}>
          <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          <View style={styles.whatsappTextContainer}>
            <Text style={styles.whatsappTitle}>WhatsApp Stickers</Text>
            <Text style={styles.whatsappSubtitle}>Convert to viral sticker packs! 💬</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      {/* SECTION: YOUR PROGRESS */}
      <View style={styles.sectionHeader}>
        <Ionicons name="trophy" size={18} color={colors.warning} />
        <Text style={styles.sectionHeaderText}>Your Progress</Text>
      </View>

      {/* Daily Challenge */}
      <TouchableOpacity
        style={styles.challengeButton}
        onPress={() => setShowChallengeModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.challengeContent}>
          <Ionicons name="calendar" size={24} color="#FFD700" />
          <View style={styles.challengeTextContainer}>
            <Text style={styles.challengeTitle}>Daily Meme Challenge</Text>
            <Text style={styles.challengeSubtitle}>New creative prompt every day! ⭐</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      {/* My Stats */}
      <TouchableOpacity
        style={styles.statsButton}
        onPress={() => setShowStatsModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.statsContent}>
          <Ionicons name="stats-chart" size={24} color="#2196F3" />
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsTitle}>My Stats</Text>
            <Text style={styles.statsSubtitle}>Track your meme creation journey 📊</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      {/* Template Count */}
      <Text style={styles.sectionTitle}>
        {filteredTemplates.length} Templates
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <OfflineIndicator />

      <FlatList
        ListHeaderComponent={renderHeader}
        data={filteredTemplates}
        renderItem={({ item }) => (
          <MemeTemplate template={item} onPress={handleTemplatePress} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <DailyChallengeModal
        visible={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        onStartChallenge={handleStartChallenge}
      />

      <WhatsAppStickerModal
        visible={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />

      <MemeStatsModal
        visible={showStatsModal}
        onClose={() => setShowStatsModal(false)}
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
  categoryContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.white,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  uploadButton: {
    flex: 1,
  },
  challengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  challengeTextContainer: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  challengeSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  multiPanelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#9C27B0',
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  multiPanelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  multiPanelTextContainer: {
    flex: 1,
  },
  multiPanelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  multiPanelSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  collageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF6F00',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  collageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  collageTextContainer: {
    flex: 1,
  },
  collageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  collageSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  storyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FCE4EC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E1306C',
    shadowColor: '#E1306C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  storyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  storyTextContainer: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  storySubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#25D366',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsappContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  whatsappTextContainer: {
    flex: 1,
  },
  whatsappTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  whatsappSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  trendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF4500',
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  trendingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  trendingTextContainer: {
    flex: 1,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  trendingSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statsTextContainer: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
