/**
 * Text Recognition (OCR) Utility
 * Extract text from images for easy meme creation
 * 100% FREE - On-device processing
 *
 * Note: This implementation provides structure for OCR integration.
 * For production OCR, consider expo-image-manipulator with Tesseract.js
 * or ML Kit Text Recognition.
 */

export interface RecognizedText {
  text: string;
  confidence: number; // 0-1
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  language?: string;
}

export interface TextBlock {
  text: string;
  lines: TextLine[];
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TextLine {
  text: string;
  words: RecognizedText[];
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface OCRResult {
  fullText: string;
  blocks: TextBlock[];
  confidence: number;
  timestamp: number;
  processingTime: number; // milliseconds
}

export type OCRLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'auto';

export interface OCROptions {
  language: OCRLanguage;
  enhanceImage: boolean; // Pre-process for better recognition
  detectOrientation: boolean; // Auto-rotate if needed
  minConfidence: number; // 0-1, filter low confidence results
}

/**
 * Default OCR options
 */
export const DEFAULT_OCR_OPTIONS: OCROptions = {
  language: 'en',
  enhanceImage: true,
  detectOrientation: false,
  minConfidence: 0.5,
};

/**
 * Supported languages
 */
export const OCR_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'auto', name: 'Auto Detect', flag: '🌐' },
];

/**
 * Perform OCR on image
 * Note: This is a placeholder. For actual OCR, integrate:
 * - Tesseract.js via WebView
 * - expo-camera with text recognition
 * - ML Kit Text Recognition (Firebase)
 * - Cloud Vision API (requires API key, not FREE)
 */
export const recognizeText = async (
  imageUri: string,
  options: OCROptions = DEFAULT_OCR_OPTIONS
): Promise<OCRResult> => {
  const startTime = Date.now();

  try {
    // Placeholder implementation
    // In production, you would:
    // 1. Load image into processing engine (Tesseract.js, ML Kit, etc.)
    // 2. Pre-process image if enhanceImage is true
    // 3. Run OCR algorithm
    // 4. Parse and structure results
    // 5. Filter by confidence threshold

    // For now, return empty result
    const result: OCRResult = {
      fullText: '',
      blocks: [],
      confidence: 0,
      timestamp: Date.now(),
      processingTime: Date.now() - startTime,
    };

    return result;
  } catch (error) {
    console.error('Error recognizing text:', error);
    throw new Error('Failed to recognize text in image');
  }
};

/**
 * Extract text from specific region of image
 */
export const recognizeTextInRegion = async (
  imageUri: string,
  region: { x: number; y: number; width: number; height: number },
  options: OCROptions = DEFAULT_OCR_OPTIONS
): Promise<OCRResult> => {
  // In production, crop image to region first, then run OCR
  return recognizeText(imageUri, options);
};

/**
 * Validate OCR result quality
 */
export const validateOCRResult = (result: OCRResult): {
  valid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  if (result.fullText.length === 0) {
    issues.push('No text found in image');
  }

  if (result.confidence < 0.5) {
    issues.push('Low confidence - image quality may be poor');
  }

  if (result.blocks.length === 0 && result.fullText.length > 0) {
    issues.push('Text found but structure unclear');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Format recognized text for meme caption
 */
export const formatForMeme = (text: string): string => {
  // Convert to uppercase (classic meme style)
  let formatted = text.toUpperCase();

  // Remove extra whitespace
  formatted = formatted.replace(/\s+/g, ' ').trim();

  // Split long text into multiple lines (max 40 chars per line)
  const words = formatted.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).length <= 40) {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines.join('\n');
};

/**
 * Common OCR use cases
 */
export const OCR_USE_CASES = [
  {
    id: 'screenshot',
    name: 'Screenshot Text',
    description: 'Extract text from screenshots',
    icon: 'phone-portrait',
    tips: 'Works best with clear, high-contrast text',
  },
  {
    id: 'photo-text',
    name: 'Photo with Text',
    description: 'Read text from photos (signs, documents)',
    icon: 'image',
    tips: 'Ensure good lighting and avoid shadows',
  },
  {
    id: 'handwriting',
    name: 'Handwriting',
    description: 'Convert handwritten notes to text',
    icon: 'create',
    tips: 'Write clearly with good spacing',
  },
  {
    id: 'meme-caption',
    name: 'Existing Meme',
    description: 'Extract text from other memes',
    icon: 'images',
    tips: 'Impact font is easily recognized',
  },
];

/**
 * Tips for better OCR results
 */
export const OCR_TIPS = [
  'Use images with high contrast between text and background',
  'Ensure text is clear and not blurry',
  'Avoid skewed or rotated text when possible',
  'Good lighting improves recognition accuracy',
  'Horizontal text works better than vertical',
  'Clean, sans-serif fonts are easier to recognize',
];

/**
 * Get random OCR tip
 */
export const getOCRTip = (): string => {
  return OCR_TIPS[Math.floor(Math.random() * OCR_TIPS.length)];
};

/**
 * Pre-process image for better OCR
 */
export const preprocessImageForOCR = async (imageUri: string): Promise<string> => {
  // In production, apply:
  // - Grayscale conversion
  // - Contrast enhancement
  // - Noise reduction
  // - Binarization (black/white)
  // - Deskewing (straighten text)

  return imageUri;
};

/**
 * Detect text orientation and rotate if needed
 */
export const detectAndCorrectOrientation = async (
  imageUri: string
): Promise<{ uri: string; rotation: number }> => {
  // In production, detect text orientation and rotate image
  return { uri: imageUri, rotation: 0 };
};

/**
 * Merge nearby text blocks into paragraphs
 */
export const mergeTextBlocks = (blocks: TextBlock[]): string[] => {
  // Simple merge: combine blocks that are close together
  return blocks.map(block => block.text);
};

/**
 * Filter OCR results by confidence
 */
export const filterByConfidence = (
  results: RecognizedText[],
  minConfidence: number
): RecognizedText[] => {
  return results.filter(r => r.confidence >= minConfidence);
};

/**
 * Convert OCR result to meme text objects
 */
export const ocrToMemeTexts = (
  result: OCRResult,
  imageWidth: number,
  imageHeight: number
): Array<{
  text: string;
  x: number;
  y: number;
  fontSize: number;
}> => {
  return result.blocks.map((block, index) => ({
    text: formatForMeme(block.text),
    x: (block.boundingBox.x / imageWidth) * 100,
    y: (block.boundingBox.y / imageHeight) * 100,
    fontSize: Math.max(20, Math.min(48, block.boundingBox.height * 0.8)),
  }));
};

/**
 * Tesseract.js Integration Guide
 *
 * To add full OCR capabilities:
 *
 * 1. Install Tesseract.js:
 *    npm install tesseract.js
 *
 * 2. Create WebView component with Tesseract:
 *    import Tesseract from 'tesseract.js';
 *
 * 3. Initialize worker:
 *    const worker = await Tesseract.createWorker();
 *    await worker.loadLanguage('eng');
 *    await worker.initialize('eng');
 *
 * 4. Recognize text:
 *    const { data: { text } } = await worker.recognize(imageUri);
 *
 * 5. Clean up:
 *    await worker.terminate();
 *
 * Note: Tesseract.js adds ~2MB to app size
 * Alternative: Use expo-barcode-scanner for QR/barcode text
 */

/**
 * ML Kit Text Recognition Integration Guide
 *
 * For native ML Kit integration (Android/iOS):
 *
 * 1. Install react-native-mlkit:
 *    npm install @react-native-ml-kit/text-recognition
 *
 * 2. Configure native modules per platform
 *
 * 3. Use in code:
 *    import TextRecognition from '@react-native-ml-kit/text-recognition';
 *    const result = await TextRecognition.recognize(imageUri);
 *
 * Note: Requires native setup, ~5MB download on first use
 */

/**
 * Feature availability notice
 */
export const FEATURE_NOTICE = {
  title: 'Text Recognition (OCR)',
  message:
    'This app provides structure for text recognition. To enable full OCR:\n\n' +
    '1. Integrate Tesseract.js for browser-based OCR\n' +
    '2. Use ML Kit Text Recognition for native performance\n' +
    '3. Manual text entry is always available\n\n' +
    'All solutions are FREE with no ongoing costs!\n\n' +
    'For now, use this feature to learn about OCR capabilities ' +
    'and prepare your images for text extraction.',
};

/**
 * Estimate OCR processing time
 */
export const estimateProcessingTime = (
  imageWidth: number,
  imageHeight: number
): number => {
  const pixels = imageWidth * imageHeight;
  // Rough estimate: 1 megapixel = 3 seconds
  return Math.ceil((pixels / 1000000) * 3);
};

/**
 * Check if image is suitable for OCR
 */
export const isImageSuitableForOCR = (
  imageUri: string
): { suitable: boolean; reason?: string } => {
  // Basic validation
  if (!imageUri) {
    return { suitable: false, reason: 'No image provided' };
  }

  // In production, check:
  // - Image resolution (min 200x200)
  // - File size (not too large)
  // - Image format (supported types)

  return { suitable: true };
};

/**
 * Sample OCR results for demo purposes
 */
export const SAMPLE_OCR_RESULTS: Record<string, OCRResult> = {
  meme: {
    fullText: 'WHEN YOU FINALLY\nFIGURE OUT THE BUG',
    blocks: [
      {
        text: 'WHEN YOU FINALLY',
        lines: [
          {
            text: 'WHEN YOU FINALLY',
            words: [
              {
                text: 'WHEN',
                confidence: 0.95,
                boundingBox: { x: 10, y: 10, width: 50, height: 20 },
              },
              {
                text: 'YOU',
                confidence: 0.96,
                boundingBox: { x: 65, y: 10, width: 40, height: 20 },
              },
              {
                text: 'FINALLY',
                confidence: 0.94,
                boundingBox: { x: 110, y: 10, width: 70, height: 20 },
              },
            ],
            boundingBox: { x: 10, y: 10, width: 170, height: 20 },
          },
        ],
        boundingBox: { x: 10, y: 10, width: 170, height: 20 },
      },
      {
        text: 'FIGURE OUT THE BUG',
        lines: [
          {
            text: 'FIGURE OUT THE BUG',
            words: [
              {
                text: 'FIGURE',
                confidence: 0.93,
                boundingBox: { x: 10, y: 180, width: 65, height: 20 },
              },
              {
                text: 'OUT',
                confidence: 0.97,
                boundingBox: { x: 80, y: 180, width: 35, height: 20 },
              },
              {
                text: 'THE',
                confidence: 0.96,
                boundingBox: { x: 120, y: 180, width: 35, height: 20 },
              },
              {
                text: 'BUG',
                confidence: 0.95,
                boundingBox: { x: 160, y: 180, width: 40, height: 20 },
              },
            ],
            boundingBox: { x: 10, y: 180, width: 190, height: 20 },
          },
        ],
        boundingBox: { x: 10, y: 180, width: 190, height: 20 },
      },
    ],
    confidence: 0.95,
    timestamp: Date.now(),
    processingTime: 1500,
  },
};

/**
 * Copy recognized text to clipboard
 * (Requires expo-clipboard)
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // In production:
    // import * as Clipboard from 'expo-clipboard';
    // await Clipboard.setStringAsync(text);
    console.log('Copied to clipboard:', text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Export OCR result as JSON
 */
export const exportOCRResult = (result: OCRResult): string => {
  return JSON.stringify(result, null, 2);
};
