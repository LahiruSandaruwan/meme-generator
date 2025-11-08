export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  category: string;
  width: number;
  height: number;
  suggestions?: string[];
}

export interface MemeText {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  fontFamily?: string;
  rotation?: number;
  effect?: 'none' | 'shadow' | '3d' | 'gradient' | 'glow';
  shadowOpacity?: number;
  gradientColors?: string[];
}

export interface SavedMeme {
  id: string;
  uri: string;
  timestamp: number;
  templateId?: string;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface EditorHistory {
  past: MemeText[][];
  present: MemeText[];
  future: MemeText[][];
}

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  Editor: {
    templateUri?: string;
    templateId?: string;
    templateName?: string;
  };
  PrivacyPolicy: undefined;
  Premium: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Gallery: undefined;
  Settings: undefined;
};
