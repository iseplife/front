import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.iseplive.iseplife',
  appName: 'iseplife',
  webDir: 'build',
  bundledWebRuntime: false,
  "plugins": {
    "CapacitorUpdater": {
      "autoUpdate": true,
      "autoUpdateUrl": process.env.REACT_APP_URL ?? "https://api.iseplife.fr/health/update"
    }
  }
};

export default config;
