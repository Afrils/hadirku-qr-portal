
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.43576e6d25f34bc999372b829e69f2ba',
  appName: 'hadirku-qr-portal',
  webDir: 'dist',
  server: {
    url: 'https://43576e6d-25f3-4bc9-9937-2b829e69f2ba.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    backgroundColor: "#ffffff"
  }
};

export default config;
