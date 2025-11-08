import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import { colors } from '../constants/colors';

interface VoiceInputProps {
  onTextReceived: (text: string) => void;
  isPremium: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTextReceived, isPremium }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    try {
      // Set up voice recognition event listeners
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechError = onSpeechError;
    } catch (error) {
      // Silently handle worklets initialization error
      if (__DEV__) {
        console.warn('Voice recognition setup failed:', error);
      }
    }

    return () => {
      // Clean up
      try {
        Voice.destroy().then(Voice.removeAllListeners);
      } catch (error) {
        // Silently handle cleanup errors
      }
    };
  }, []);

  const onSpeechResults = (event: SpeechResultsEvent) => {
    if (event.value && event.value.length > 0) {
      const text = event.value[0];
      setRecognizedText(text);
      onTextReceived(text);
    }
  };

  const onSpeechError = (event: SpeechErrorEvent) => {
    setIsListening(false);
    if (event.error?.message) {
      console.error('Speech recognition error:', event.error.message);
    }
  };

  const startListening = async () => {
    if (!isPremium) {
      Alert.alert(
        'Premium Feature',
        'Voice-to-Text is a premium feature. Upgrade to unlock it!',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setRecognizedText('');
      setIsListening(true);
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
      Alert.alert('Error', 'Failed to start voice recognition. Please try again.');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  if (Platform.OS === 'web') {
    // Voice recognition not supported on web
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.micButton,
          isListening && styles.micButtonActive,
          !isPremium && styles.micButtonDisabled,
        ]}
        onPress={isListening ? stopListening : startListening}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isListening ? 'mic' : 'mic-outline'}
          size={24}
          color={isListening ? colors.error : isPremium ? colors.primary : colors.textLight}
        />
        {!isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="diamond" size={12} color={colors.warning} />
          </View>
        )}
      </TouchableOpacity>

      {isListening && (
        <View style={styles.listeningIndicator}>
          <View style={styles.pulse} />
          <Text style={styles.listeningText}>Listening...</Text>
        </View>
      )}

      {recognizedText && !isListening && (
        <Text style={styles.recognizedText}>{recognizedText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  micButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    position: 'relative',
  },
  micButtonActive: {
    backgroundColor: '#ffebee',
    borderColor: colors.error,
  },
  micButtonDisabled: {
    borderColor: colors.border,
    opacity: 0.6,
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.warning,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  pulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
  },
  listeningText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  recognizedText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
