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
import { DailyChallengeModal } from '../components/DailyChallengeModal';
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
        mediaTypes: ['images'],
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

  const [showMoreTools, setShowMoreTools] = useState(false);

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Hero Section - Primary Actions */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Create Your Meme</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={handleUploadCustomImage}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="images-outline" size={28} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Upload</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={handleTakePhoto}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="camera-outline" size={28} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Trending')}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="trending-up-outline" size={28} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Trending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => setShowMoreTools(!showMoreTools)}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="apps-outline" size={28} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>More</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expandable Tools Section */}
      {showMoreTools && (
        <View style={styles.toolsGrid}>
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => {
              setShowMoreTools(false);
              navigation.navigate('MultiPanelEditor');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="grid-outline" size={24} color="#9C27B0" />
            <Text style={styles.toolCardText}>Multi-Panel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => {
              setShowMoreTools(false);
              navigation.navigate('CollageEditor');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="albums-outline" size={24} color="#FF6F00" />
            <Text style={styles.toolCardText}>Collage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => {
              setShowMoreTools(false);
              navigation.navigate('StoryEditor', {});
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-instagram" size={24} color="#E1306C" />
            <Text style={styles.toolCardText}>Story</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => {
              setShowMoreTools(false);
              navigation.navigate('GifEditor');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="film-outline" size={24} color="#FF5722" />
            <Text style={styles.toolCardText}>GIF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => {
              setShowMoreTools(false);
              setShowChallengeModal(true);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={24} color="#FFD700" />
            <Text style={styles.toolCardText}>Challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => {
              setShowMoreTools(false);
              setShowStatsModal(true);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="stats-chart-outline" size={24} color="#2196F3" />
            <Text style={styles.toolCardText}>My Stats</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Bar */}
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

      {/* Category Filter */}
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

      {/* Template Count */}
      <Text style={styles.templateCount}>
        {filteredTemplates.length} templates
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
    paddingTop: 8,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  toolCard: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  toolCardText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
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
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.white,
    marginRight: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.white,
  },
  templateCount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 16,
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
