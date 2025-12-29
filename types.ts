
export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
  GOLDEN = 'golden',
  ROBOTIC = 'robotic',
  CUSTOM = 'custom'
}

export interface UserState {
  isSubscribed: boolean;
  subscriptionExpiry?: string; // ISO Date
  photosGeneratedToday: number;
  videosGeneratedThisWeek: number;
  musicGeneratedThisWeek: number;
  lastPhotoReset: string; // ISO Date
  lastVideoReset: string; // ISO Date
  theme: ThemeType;
  behavior: string; // Sharon's personality
  customThemeUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
  video?: string;
  audio?: string;
  groundingLinks?: GroundingLink[];
}

export interface GroundingLink {
  uri: string;
  title: string;
}
