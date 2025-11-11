/**
 * Text Recognition Modal
 * Extract text from images using OCR
 * Provides structure for OCR integration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  OCRResult,
  OCRLanguage,
  OCROptions,
  DEFAULT_OCR_OPTIONS,
  recognizeText,
  formatForMeme,
  OCR_LANGUAGES,
  OCR_USE_CASES,
  OCR_TIPS,
  FEATURE_NOTICE,
  SAMPLE_OCR_RESULTS,
  estimateProcessingTime,
} from '../utils/textRecognition';

interface TextRecognitionModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onTextExtracted: (text: string) => void;
}

export const TextRecognitionModal: React.FC<TextRecognitionModalProps> = ({
  visible,
  imageUri,
  onClose,
  onTextExtracted,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<OCRLanguage>('en');
  const [options, setOptions] = useState<OCROptions>(DEFAULT_OCR_OPTIONS);
  const [editedText, setEditedText] = useState('');

  const handleRecognize = async () => {
    if (!imageUri) return;

    try {
      setIsProcessing(true);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo, use sample result
      const ocrResult = SAMPLE_OCR_RESULTS.meme;
      setResult(ocrResult);
      setEditedText(ocrResult.fullText);

      setIsProcessing(false);
    } catch (error) {
      console.error('Error recognizing text:', error);
      setIsProcessing(false);
      Alert.alert(
        'Recognition Error',
        'Failed to extract text from image. This feature requires OCR library integration. See info for details.'
      );
    }
  };

  const handleApply = () => {
    if (!editedText) {
      Alert.alert('No Text', 'No text to apply. Please recognize text first.');
      return;
    }

    const formatted = formatForMeme(editedText);
    onTextExtracted(formatted);
    onClose();
  };

  const handleUseSample = () => {
    const sampleResult = SAMPLE_OCR_RESULTS.meme;
    setResult(sampleResult);
    setEditedText(sampleResult.fullText);
  };

  const showFeatureInfo = () => {
    Alert.alert(FEATURE_NOTICE.title, FEATURE_NOTICE.message, [
      { text: 'Got it' },
    ]);
  };

  const handleClearText = () => {
    setEditedText('');
    setResult(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="scan" size={24} color={colors.primary} />
              <Text style={styles.title}>Text Recognition</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={showFeatureInfo}
                style={styles.infoButton}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={colors.textLight}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Image Preview */}
            {imageUri && (
              <View style={styles.previewContainer}>
                <Text style={styles.sectionTitle}>Image</Text>
                <Image source={{ uri: imageUri }} style={styles.preview} />
              </View>
            )}

            {/* Language Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Language</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.languageScroll}
              >
                {OCR_LANGUAGES.map(lang => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.languageOption,
                        isSelected && styles.languageOptionSelected,
                      ]}
                      onPress={() => setSelectedLanguage(lang.code as OCRLanguage)}
                    >
                      <Text style={styles.languageFlag}>{lang.flag}</Text>
                      <Text
                        style={[
                          styles.languageName,
                          isSelected && styles.languageNameSelected,
                        ]}
                      >
                        {lang.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Recognition Button */}
            <TouchableOpacity
              style={[
                styles.recognizeButton,
                isProcessing && styles.recognizeButtonDisabled,
              ]}
              onPress={handleRecognize}
              disabled={isProcessing || !imageUri}
            >
              {isProcessing ? (
                <>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.recognizeButtonText}>Recognizing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="scan" size={24} color={colors.white} />
                  <Text style={styles.recognizeButtonText}>Recognize Text</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Demo Button */}
            <TouchableOpacity
              style={styles.sampleButton}
              onPress={handleUseSample}
            >
              <Ionicons name="play-circle" size={20} color={colors.primary} />
              <Text style={styles.sampleButtonText}>Try Sample (Demo)</Text>
            </TouchableOpacity>

            {/* Result Display */}
            {result && (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.sectionTitle}>Recognized Text</Text>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>
                      {Math.round(result.confidence * 100)}% confident
                    </Text>
                  </View>
                </View>

                <TextInput
                  style={styles.textInput}
                  multiline
                  value={editedText}
                  onChangeText={setEditedText}
                  placeholder="Recognized text will appear here..."
                  placeholderTextColor={colors.textLight}
                />

                <View style={styles.resultActions}>
                  <TouchableOpacity
                    style={styles.resultActionButton}
                    onPress={handleClearText}
                  >
                    <Ionicons name="trash" size={18} color={colors.error} />
                    <Text style={[styles.resultActionText, { color: colors.error }]}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.resultActionButton}
                    onPress={() => setEditedText(formatForMeme(editedText))}
                  >
                    <Ionicons name="text" size={18} color={colors.primary} />
                    <Text style={styles.resultActionText}>Format</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Use Cases */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Common Uses</Text>
              <View style={styles.useCasesGrid}>
                {OCR_USE_CASES.map(useCase => (
                  <View key={useCase.id} style={styles.useCaseCard}>
                    <View style={styles.useCaseIcon}>
                      <Ionicons
                        name={useCase.icon as any}
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={styles.useCaseName}>{useCase.name}</Text>
                    <Text style={styles.useCaseDescription}>
                      {useCase.description}
                    </Text>
                    <Text style={styles.useCaseTip}>{useCase.tips}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tips */}
            <View style={styles.tipsCard}>
              <Ionicons name="bulb" size={20} color={colors.warning} />
              <View style={styles.tipsContent}>
                <Text style={styles.tipsTitle}>Tips for Best Results</Text>
                <Text style={styles.tipsText}>
                  {OCR_TIPS.slice(0, 4).map((tip, i) => `• ${tip}`).join('\n')}
                </Text>
              </View>
            </View>

            {/* Integration Notice */}
            <View style={styles.noticeCard}>
              <Ionicons name="code-slash" size={20} color={colors.primary} />
              <View style={styles.noticeContent}>
                <Text style={styles.noticeTitle}>Integration Required</Text>
                <Text style={styles.noticeText}>
                  Full OCR requires Tesseract.js or ML Kit integration.
                  Tap the info icon above for setup instructions.
                  For now, try the sample demo!
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Apply Button */}
          {result && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                disabled={!editedText}
              >
                <Ionicons name="checkmark-circle" size={24} color={colors.white} />
                <Text style={styles.applyButtonText}>Use This Text</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  infoButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  previewContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.background,
    resizeMode: 'contain',
  },
  section: {
    marginBottom: 24,
  },
  languageScroll: {
    gap: 10,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionSelected: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  languageFlag: {
    fontSize: 20,
  },
  languageName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  languageNameSelected: {
    color: colors.primary,
  },
  recognizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },
  recognizeButtonDisabled: {
    opacity: 0.6,
  },
  recognizeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  sampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  sampleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  resultContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  confidenceBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 8,
  },
  resultActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  resultActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  useCasesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  useCaseCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  useCaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  useCaseName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  useCaseDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 6,
    lineHeight: 16,
  },
  useCaseTip: {
    fontSize: 11,
    color: colors.primary,
    fontStyle: 'italic',
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.warning}10`,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 16,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  tipsText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  noticeText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
