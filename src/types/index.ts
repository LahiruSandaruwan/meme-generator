import { AdvancedEffect } from '../utils/advancedTextEffects';

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
  effect?: AdvancedEffect;
  shadowOpacity?: number;
  gradientColors?: string[];
}

export interface MemeSticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
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
  MultiPanelEditor: undefined;
  StoryEditor: {
    templateId?: string;
    backgroundImage?: string;
  };
  CollageEditor: undefined;
  GifEditor: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  Premium: undefined;
  Trending: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Gallery: undefined;
  Settings: undefined;
};
