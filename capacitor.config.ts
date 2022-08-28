import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.iseplive.iseplife',
  appName: 'iseplife',
  webDir: 'build',
  bundledWebRuntime: false,
  CapacitorUpdater: {
    "autoUpdate": true,
    "autoUpdateUrl": process.env.REACT_APP_URL ?? "https://dev.iseplife.fr",
  }
};

export default config;
