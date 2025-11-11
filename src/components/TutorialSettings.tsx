/**
 * Tutorial Settings Component
 * Allows users to restart or manage tutorial preferences
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { resetTutorial, QUICK_START_GUIDE } from '../utils/tutorial';

interface TutorialSettingsProps {
  onRestartTutorial: () => void;
}

export const TutorialSettings: React.FC<TutorialSettingsProps> = ({
  onRestartTutorial,
}) => {
  const handleRestartTutorial = () => {
    Alert.alert(
      'Restart Tutorial',
      'This will show you the interactive walkthrough again when you return to the home screen.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Restart',
          onPress: async () => {
            await resetTutorial();
            onRestartTutorial();
            Alert.alert(
              'Tutorial Reset',
              'The tutorial will be shown next time you open the app or navigate to the home screen.'
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="school" size={24} color={colors.primary} />
        <Text style={styles.headerTitle}>Tutorial & Help</Text>
      </View>

      {/* Restart Tutorial Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRestartTutorial}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          <View style={styles.buttonIcon}>
            <Ionicons name="refresh" size={24} color={colors.primary} />
          </View>
          <View style={styles.buttonText}>
            <Text style={styles.buttonTitle}>Restart Tutorial</Text>
            <Text style={styles.buttonSubtitle}>
              Show the interactive walkthrough again
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      {/* Quick Start Guide */}
      <View style={styles.guideCard}>
        <View style={styles.guideHeader}>
          <Ionicons name="rocket" size={20} color={colors.warning} />
          <Text style={styles.guideTitle}>Quick Start Guide</Text>
        </View>

        {QUICK_START_GUIDE.map((step, index) => (
          <View key={index} style={styles.guideStep}>
            <View style={styles.guideStepNumber}>
              <Text style={styles.guideStepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.guideStepIcon}>
              <Ionicons name={step.icon as any} size={20} color={colors.primary} />
            </View>
            <View style={styles.guideStepContent}>
              <Text style={styles.guideStepTitle}>{step.title}</Text>
              <Text style={styles.guideStepDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Help Resources */}
      <View style={styles.resourcesCard}>
        <Text style={styles.resourcesTitle}>Need More Help?</Text>
        <Text style={styles.resourcesText}>
          • Tap any "+ Text" button to add captions{'\n'}
          • Drag elements to reposition them{'\n'}
          • Long press to delete elements{'\n'}
          • Use the undo/redo buttons if you make a mistake{'\n'}
          • All features are 100% FREE, no subscriptions!
        </Text>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Ionicons name="bulb" size={20} color={colors.warning} />
          <Text style={styles.tipsTitle}>Pro Tips</Text>
        </View>
        <Text style={styles.tipsText}>
          • Use Impact font for classic meme style{'\n'}
          • White text with black stroke is most readable{'\n'}
          • Keep text short and punchy{'\n'}
          • Add hashtags when sharing for more reach{'\n'}
          • Browse trending templates for viral content
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  guideCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  guideStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideStepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  guideStepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideStepContent: {
    flex: 1,
  },
  guideStepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  guideStepDescription: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  resourcesCard: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  resourcesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  resourcesText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: `${colors.warning}10`,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  tipsText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
});
