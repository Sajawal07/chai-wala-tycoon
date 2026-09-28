import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chaiwala.tycoon',
  appName: 'Chai Wala Tycoon',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#f6f5ef',
    allowMixedContent: true
  }
};

export default config;
