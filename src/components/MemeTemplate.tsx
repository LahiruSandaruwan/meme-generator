import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MemeTemplate as MemeTemplateType } from '../types';
import { colors } from '../constants/colors';

interface MemeTemplateProps {
  template: MemeTemplateType;
  onPress: (template: MemeTemplateType) => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // 2 columns with padding

export const MemeTemplate: React.FC<MemeTemplateProps> = ({
  template,
  onPress,
}) => {
  const isTrending = template.category === 'Trending';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(template)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: template.url }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Trending Badge */}
        {isTrending && (
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trendingBadge}
          >
            <Ionicons name="trending-up" size={14} color={colors.white} />
            <Text style={styles.trendingText}>TRENDING</Text>
          </LinearGradient>
        )}
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {template.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: ITEM_WIDTH,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },
  trendingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  trendingText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  name: {
    padding: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
