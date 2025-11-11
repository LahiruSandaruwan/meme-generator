/**
 * Tutorial Overlay Component
 * Interactive walkthrough with step-by-step guidance
 * Highlights specific UI elements and provides contextual help
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  TutorialStep,
  completeTutorial,
  dismissTutorial,
  logTutorialStart,
  logTutorialComplete,
  getStepProgress,
  isFirstStep,
  isLastStep,
} from '../utils/tutorial';

const { width, height } = Dimensions.get('window');

interface TutorialOverlayProps {
  visible: boolean;
  steps: TutorialStep[];
  screen: 'home' | 'editor';
  onComplete: () => void;
  onDismiss: () => void;
  onStepChange?: (stepId: string) => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  visible,
  steps,
  screen,
  onComplete,
  onDismiss,
  onStepChange,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (visible) {
      logTutorialStart(screen);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (currentStep) {
      onStepChange?.(currentStep.id);
    }
  }, [currentStepIndex, currentStep]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = async () => {
    await completeTutorial();
    await logTutorialComplete(screen);
    onComplete();
  };

  const handleSkip = async () => {
    await dismissTutorial();
    onDismiss();
  };

  if (!currentStep || !visible) return null;

  const progress = getStepProgress(screen, currentStep.id);
  const progressPercentage = (progress.current / progress.total) * 100;

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Darkened background */}
        <View style={styles.backdrop} />

        {/* Tutorial content */}
        <View
          style={[
            styles.contentContainer,
            currentStep.position === 'top' && styles.contentTop,
            currentStep.position === 'center' && styles.contentCenter,
            currentStep.position === 'bottom' && styles.contentBottom,
          ]}
        >
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {progress.current} of {progress.total}
            </Text>
          </View>

          {/* Content card */}
          <View style={styles.card}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Ionicons
                name={currentStep.icon as any}
                size={48}
                color={colors.primary}
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>{currentStep.title}</Text>

            {/* Description */}
            <ScrollView
              style={styles.descriptionScroll}
              contentContainerStyle={styles.descriptionContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.description}>{currentStep.description}</Text>
            </ScrollView>

            {/* Action hint */}
            {currentStep.action && currentStep.action !== 'none' && (
              <View style={styles.actionHint}>
                <Ionicons
                  name={
                    currentStep.action === 'tap'
                      ? 'hand-left-outline'
                      : 'swap-horizontal-outline'
                  }
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.actionText}>
                  {currentStep.action === 'tap' ? 'Tap to interact' : 'Swipe to move'}
                </Text>
              </View>
            )}

            {/* Navigation buttons */}
            <View style={styles.buttonContainer}>
              {!isFirstStep(screen, currentStep.id) && (
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={20} color={colors.primary} />
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}

              <View style={styles.rightButtons}>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleNext}
                  style={[
                    styles.nextButton,
                    isLastStep(screen, currentStep.id) && styles.completeButton,
                  ]}
                >
                  <Text style={styles.nextButtonText}>
                    {isLastStep(screen, currentStep.id) ? 'Done' : 'Next'}
                  </Text>
                  {!isLastStep(screen, currentStep.id) && (
                    <Ionicons name="arrow-forward" size={20} color={colors.white} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Dots indicator */}
          <View style={styles.dotsContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStepIndex && styles.dotActive,
                  index < currentStepIndex && styles.dotCompleted,
                ]}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentTop: {
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  contentCenter: {
    justifyContent: 'center',
  },
  contentBottom: {
    justifyContent: 'flex-end',
    paddingBottom: 80,
  },
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  descriptionScroll: {
    maxHeight: 120,
    marginBottom: 16,
  },
  descriptionContent: {
    paddingVertical: 4,
  },
  description: {
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textLight,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  dotCompleted: {
    backgroundColor: colors.success,
  },
});
