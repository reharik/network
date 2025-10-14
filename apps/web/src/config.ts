// Web app configuration
export type WebConfig = {
  // API configuration
  apiBaseUrl: string;

  // Default values for forms
  defaultReminderTime: string;
  defaultIntervalDays: number;
  defaultPreferredMethod: string;

  // App settings
  appName: string;
  version: string;
};

// Get configuration from environment variables with sensible defaults
export const config: WebConfig = {
  // API configuration
  apiBaseUrl: (import.meta.env.VITE_API as string) || 'http://localhost:3000/api',

  // Default values for forms
  defaultReminderTime: (import.meta.env.VITE_DEFAULT_REMINDER_TIME as string) || '09:00',
  defaultIntervalDays: Number(import.meta.env.VITE_DEFAULT_INTERVAL_DAYS) || 30,
  defaultPreferredMethod: (import.meta.env.VITE_DEFAULT_PREFERRED_METHOD as string) || 'email',

  // App settings
  appName: (import.meta.env.VITE_APP_NAME as string) || 'Network',
  version: (import.meta.env.VITE_APP_VERSION as string) || '1.0.0',
};
