import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.iseplive.iseplife',
  appName: 'IsepLife',
  webDir: 'build',
  bundledWebRuntime: false,
  "plugins": {
    "CapacitorUpdater": {
      "autoUpdate": true,
      "autoUpdateUrl": "https://api.iseplife.fr/health/updatee"
    },
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
  }
};

export default config;
