import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iseplive.iseplife',
  appName: 'IsepLife',
  webDir: 'build',
  bundledWebRuntime: false,
  "plugins": {
    "CapacitorUpdater": {
      "autoUpdate": true,
      "updateUrl": "https://api.iseplife.fr/health/update",
      "autoUpdateUrl": "https://api.iseplife.fr/health/update",
      "statsUrl": ""
    },
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
  }
};

export default config;
