import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
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
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(template)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: template.url }}
        style={styles.image}
        resizeMode="cover"
      />
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
  image: {
    width: '100%',
    height: ITEM_WIDTH,
    backgroundColor: colors.border,
  },
  name: {
    padding: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
