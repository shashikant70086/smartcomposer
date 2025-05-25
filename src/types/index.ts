export type NotificationChannel = "push" | "email" | "sms";

export const notificationTones = ["formal", "informal", "urgent", "friendly", "playful", "professional"] as const;
export type NotificationTone = typeof notificationTones[number];

export interface ComposerFormData {
  baseMessage: string;
  tone: NotificationTone;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface Preset extends ComposerFormData {
  id: string;
  name: string;
}

export interface GeneratedVariant {
  id: string;
  content: string;
  channel: NotificationChannel; // Or could be more generic if variants are not channel-specific at generation time
}
