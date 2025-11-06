export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  category: string;
  width: number;
  height: number;
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

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  Editor: {
    templateUri?: string;
    templateId?: string;
    templateName?: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Gallery: undefined;
  Settings: undefined;
};
