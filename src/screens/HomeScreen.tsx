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

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState(''); }
  const [selectedCategory, setSelectedCategory] = useState('All'); }

  const categories = getCategories(); }
  const filteredTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : selectedCategory === 'All'
    ? memeTemplates
    : memeTemplates.filter((t) => t.category === selectedCategory); }

  const handleTemplatePress = (template: MemeTemplateType) => {
    navigation.navigate('Editor', {
      templateUri: template.url,
      templateId: template.id,
      templateName: template.name,
    }); }
  };

  const handleUploadCustomImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); }

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photos to upload custom images.',
          [{ text: 'OK' }]
        ); }
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      }); }

      if (!result.canceled && result.assets[0]) {
        navigation.navigate('Editor', {
          templateUri: result.assets[0].uri,
        }); }
      }
    } catch (error) {
      if (__DEV__) { console.error('Error picking image:', error); }
      Alert.alert('Error', 'Failed to pick image. Please try again.'); }
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync(); }

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your camera to take photos.',
          [{ text: 'OK' }]
        ); }
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      }); }

      if (!result.canceled && result.assets[0]) {
        navigation.navigate('Editor', {
          templateUri: result.assets[0].uri,
        }); }
      }
    } catch (error) {
      if (__DEV__) { console.error('Error taking photo:', error); }
      Alert.alert('Error', 'Failed to take photo. Please try again.'); }
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
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

      <Text style={styles.sectionTitle}>
        {filteredTemplates.length} Templates
      </Text>
    </View>
  ); }

  return (
    <View style={styles.container}>
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
    </View>
  ); }
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
}); }

export default HomeScreen;
