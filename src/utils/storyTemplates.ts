/**
 * Instagram Story Templates
 * Pre-sized templates optimized for Instagram Stories (1080x1920)
 * 100% FREE - No external APIs
 */

export interface StoryTemplate {
  id: string;
  name: string;
  category: StoryCategory;
  backgroundColor: string;
  backgroundGradient?: {
    colors: string[];
    angle: number;
  };
  textAreas: StoryTextArea[];
  interactive?: StoryInteractive;
  preview: string;
  popular?: boolean;
}

export type StoryCategory =
  | 'Popular'
  | 'Meme'
  | 'Question'
  | 'Poll'
  | 'Quote'
  | 'Reaction'
  | 'Announcement';

export interface StoryTextArea {
  id: string;
  placeholder: string;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  textAlign: 'left' | 'center' | 'right';
  maxLines?: number;
  strokeWidth?: number;
  strokeColor?: string;
}

export interface StoryInteractive {
  type: 'poll' | 'question' | 'slider' | 'quiz';
  position: { x: number; y: number };
  options?: string[];
}

/**
 * Instagram Story dimensions
 */
export const STORY_DIMENSIONS = {
  width: 1080,
  height: 1920,
  aspectRatio: 9 / 16,
};

/**
 * Story template collection
 */
export const STORY_TEMPLATES: StoryTemplate[] = [
  // Popular Meme Templates
  {
    id: 'meme_basic',
    name: 'Classic Meme',
    category: 'Popular',
    backgroundColor: '#FFFFFF',
    popular: true,
    preview: 'Top text / Bottom text',
    textAreas: [
      {
        id: 'top',
        placeholder: 'TOP TEXT',
        x: 50,
        y: 10,
        width: 90,
        fontSize: 48,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        strokeWidth: 3,
        strokeColor: '#000000',
      },
      {
        id: 'bottom',
        placeholder: 'BOTTOM TEXT',
        x: 50,
        y: 90,
        width: 90,
        fontSize: 48,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        strokeWidth: 3,
        strokeColor: '#000000',
      },
    ],
  },
  {
    id: 'gradient_meme',
    name: 'Gradient Meme',
    category: 'Popular',
    backgroundColor: '#7B2CBF',
    backgroundGradient: {
      colors: ['#7B2CBF', '#FF006E'],
      angle: 135,
    },
    popular: true,
    preview: 'Colorful gradient background',
    textAreas: [
      {
        id: 'main',
        placeholder: 'YOUR MEME TEXT HERE',
        x: 50,
        y: 50,
        width: 85,
        fontSize: 56,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'center',
        strokeWidth: 2,
        strokeColor: '#000000',
      },
    ],
  },
  {
    id: 'reaction_meme',
    name: 'Reaction Meme',
    category: 'Reaction',
    backgroundColor: '#000000',
    popular: true,
    preview: 'Image at top, reaction text below',
    textAreas: [
      {
        id: 'setup',
        placeholder: 'When...',
        x: 50,
        y: 15,
        width: 90,
        fontSize: 40,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'center',
      },
      {
        id: 'punchline',
        placeholder: 'Me:',
        x: 50,
        y: 75,
        width: 90,
        fontSize: 44,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'center',
      },
    ],
  },

  // Question Templates
  {
    id: 'question_box',
    name: 'Question Box',
    category: 'Question',
    backgroundColor: '#7B2CBF',
    backgroundGradient: {
      colors: ['#7B2CBF', '#240046'],
      angle: 180,
    },
    preview: 'Ask me anything',
    textAreas: [
      {
        id: 'question',
        placeholder: 'Ask me anything!',
        x: 50,
        y: 30,
        width: 80,
        fontSize: 52,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'center',
      },
      {
        id: 'instruction',
        placeholder: 'Tap to respond',
        x: 50,
        y: 85,
        width: 70,
        fontSize: 28,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'center',
      },
    ],
    interactive: {
      type: 'question',
      position: { x: 50, y: 50 },
    },
  },
  {
    id: 'this_or_that',
    name: 'This or That',
    category: 'Question',
    backgroundColor: '#FF006E',
    preview: 'Choose one option',
    textAreas: [
      {
        id: 'title',
        placeholder: 'THIS OR THAT?',
        x: 50,
        y: 15,
        width: 80,
        fontSize: 48,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'center',
        strokeWidth: 2,
        strokeColor: '#000000',
      },
      {
        id: 'option1',
        placeholder: 'Option A',
        x: 50,
        y: 40,
        width: 70,
        fontSize: 36,
        fontFamily: 'System',
        color: '#000000',
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
      },
      {
        id: 'option2',
        placeholder: 'Option B',
        x: 50,
        y: 60,
        width: 70,
        fontSize: 36,
        fontFamily: 'System',
        color: '#000000',
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
      },
    ],
  },

  // Poll Templates
  {
    id: 'poll_basic',
    name: 'Simple Poll',
    category: 'Poll',
    backgroundColor: '#3A86FF',
    preview: 'Yes or No poll',
    textAreas: [
      {
        id: 'question',
        placeholder: 'Your poll question?',
        x: 50,
        y: 25,
        width: 85,
        fontSize: 44,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'center',
      },
    ],
    interactive: {
      type: 'poll',
      position: { x: 50, y: 55 },
      options: ['Yes', 'No'],
    },
  },

  // Quote Templates
  {
    id: 'quote_minimal',
    name: 'Minimal Quote',
    category: 'Quote',
    backgroundColor: '#F8F9FA',
    preview: 'Clean quote design',
    textAreas: [
      {
        id: 'quote',
        placeholder: '"Your inspirational quote here"',
        x: 50,
        y: 45,
        width: 80,
        fontSize: 40,
        fontFamily: 'System',
        color: '#000000',
        textAlign: 'center',
        maxLines: 5,
      },
      {
        id: 'author',
        placeholder: '- Author Name',
        x: 50,
        y: 70,
        width: 70,
        fontSize: 28,
        fontFamily: 'System',
        color: '#666666',
        textAlign: 'center',
      },
    ],
  },
  {
    id: 'quote_bold',
    name: 'Bold Quote',
    category: 'Quote',
    backgroundColor: '#000000',
    preview: 'High contrast quote',
    textAreas: [
      {
        id: 'quote',
        placeholder: 'POWERFUL QUOTE',
        x: 50,
        y: 50,
        width: 85,
        fontSize: 52,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'center',
        maxLines: 4,
      },
    ],
  },

  // Announcement Templates
  {
    id: 'announcement_basic',
    name: 'Announcement',
    category: 'Announcement',
    backgroundColor: '#FF006E',
    backgroundGradient: {
      colors: ['#FF006E', '#7B2CBF'],
      angle: 45,
    },
    preview: 'Important announcement',
    textAreas: [
      {
        id: 'label',
        placeholder: 'ANNOUNCEMENT',
        x: 50,
        y: 20,
        width: 80,
        fontSize: 32,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'center',
      },
      {
        id: 'message',
        placeholder: 'Your big news here!',
        x: 50,
        y: 50,
        width: 85,
        fontSize: 48,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'center',
        maxLines: 4,
      },
    ],
  },

  // More Meme Templates
  {
    id: 'nobody_meme',
    name: 'Nobody Meme',
    category: 'Meme',
    backgroundColor: '#FFFFFF',
    preview: 'Nobody: / Me:',
    textAreas: [
      {
        id: 'nobody',
        placeholder: 'Nobody:\nAbsolutely nobody:',
        x: 50,
        y: 20,
        width: 85,
        fontSize: 36,
        fontFamily: 'System',
        color: '#000000',
        textAlign: 'center',
      },
      {
        id: 'reaction',
        placeholder: 'Me: [Your reaction]',
        x: 50,
        y: 70,
        width: 85,
        fontSize: 40,
        fontFamily: 'System',
        color: '#000000',
        textAlign: 'center',
      },
    ],
  },
  {
    id: 'pov_meme',
    name: 'POV Meme',
    category: 'Meme',
    backgroundColor: '#000000',
    popular: true,
    preview: 'POV: You...',
    textAreas: [
      {
        id: 'pov',
        placeholder: 'POV:',
        x: 50,
        y: 15,
        width: 90,
        fontSize: 44,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'left',
      },
      {
        id: 'scenario',
        placeholder: 'You...',
        x: 50,
        y: 25,
        width: 90,
        fontSize: 36,
        fontFamily: 'System',
        color: '#FFFFFF',
        textAlign: 'left',
        maxLines: 3,
      },
    ],
  },
];

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: StoryCategory): StoryTemplate[] => {
  return STORY_TEMPLATES.filter(template => template.category === category);
};

/**
 * Get popular templates
 */
export const getPopularTemplates = (): StoryTemplate[] => {
  return STORY_TEMPLATES.filter(template => template.popular);
};

/**
 * Get all categories
 */
export const getStoryCategories = (): StoryCategory[] => {
  return [
    'Popular',
    'Meme',
    'Question',
    'Poll',
    'Quote',
    'Reaction',
    'Announcement',
  ];
};

/**
 * Get template by ID
 */
export const getTemplateById = (id: string): StoryTemplate | undefined => {
  return STORY_TEMPLATES.find(template => template.id === id);
};

/**
 * Create gradient CSS
 */
export const createGradientStyle = (gradient?: {
  colors: string[];
  angle: number;
}): any => {
  if (!gradient) return undefined;

  return {
    background: `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')})`,
  };
};

/**
 * Calculate text position in pixels
 */
export const calculateTextPosition = (
  percentage: number,
  dimension: number
): number => {
  return (percentage * dimension) / 100;
};

/**
 * Validate story dimensions
 */
export const isStorySize = (width: number, height: number): boolean => {
  const aspectRatio = width / height;
  const targetRatio = STORY_DIMENSIONS.aspectRatio;
  // Allow 5% tolerance
  return Math.abs(aspectRatio - targetRatio) < 0.05;
};

/**
 * Get optimized export settings for Instagram Stories
 */
export const getStoryExportSettings = () => {
  return {
    width: STORY_DIMENSIONS.width,
    height: STORY_DIMENSIONS.height,
    quality: 0.9,
    format: 'jpeg' as const,
  };
};
