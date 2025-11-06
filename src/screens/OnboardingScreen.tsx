import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { RootStackParamList, OnboardingSlide } from '../types';
import { setOnboardingCompleted } from '../utils/storage';
import { CustomButton } from '../components/CustomButton';

const { width, height } = Dimensions.get('window');

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Choose a Template',
    description: 'Pick from 20+ popular meme templates or upload your own image',
    icon: 'images-outline',
  },
  {
    id: '2',
    title: 'Add Your Text',
    description: 'Customize your meme with text, colors, and fonts',
    icon: 'text-outline',
  },
  {
    id: '3',
    title: 'Share & Go Viral',
    description: 'Save your memes and share them with the world!',
    icon: 'share-social-outline',
  },
];

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    await setOnboardingCompleted();
    navigation.replace('MainTabs');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon as any} size={120} color={colors.white} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.header}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      {renderDots()}

      <View style={styles.footer}>
        <CustomButton
          title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginHorizontal: 4,
    opacity: 0.3,
  },
  activeDot: {
    width: 24,
    opacity: 1,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  button: {
    backgroundColor: colors.white,
  },
});

export default OnboardingScreen;
